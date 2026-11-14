"use server";

import { randomBytes } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { QuoteAcceptance } from "@/generated/prisma/enums";
import { assertAdmin, readOptional, readString } from "@/lib/admin";
import { logActivity } from "@/lib/crm/activity";
import { clientSnapshot, issuerSnapshot, quoteDoc } from "@/lib/crm/documents/build";
import { sendDocumentEmail } from "@/lib/crm/documents/mail";
import { htmlToPdf } from "@/lib/crm/documents/pdf";
import { documentFileName, money, renderDocument } from "@/lib/crm/documents/render";
import { fromDateInput } from "@/lib/crm/format";
import { claimManualNumber, reserveNumber } from "@/lib/crm/numbering";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

export type QuoteActionState = { error?: string; ok?: string };

const lot = z.object({
  title: z.string().trim().min(1).max(300),
  description: z.string().max(6000).optional().default(""),
  amountCents: z.number().int().min(-100_000_000).max(100_000_000),
});

const payload = z.object({
  id: z.string().optional(),
  clientId: z.string().min(1, "Choisissez un client."),
  dealId: z.string().optional().nullable(),
  issuerId: z.string().min(1, "Choisissez l'identité émettrice."),
  currency: z.enum(["EUR", "USD"]),
  title: z.string().trim().min(2, "Donnez un titre au devis.").max(300),
  context: z.string().max(8000).optional().default(""),
  perimeter: z.string().max(2000).optional().default(""),
  lots: z.array(lot).max(60),
  stack: z.array(z.string().trim().min(1).max(200)).max(30),
  depositPercent: z.number().int().min(0).max(100),
  paymentNote: z.string().max(2000).optional().default(""),
  delay: z.string().max(2000).optional().default(""),
  outOfScope: z.string().max(4000).optional().default(""),
  evolutions: z.array(z.string().trim().min(1).max(300)).max(30),
  terms: z.string().max(6000).optional().default(""),
  validityDays: z.number().int().min(1).max(365),
  requireSignature: z.boolean(),
});

export type QuotePayload = z.input<typeof payload>;

const quoteInclude = { lines: true, client: true, issuer: true } as const;

function refresh(quote: { id: string; clientId: string; dealId: string | null }) {
  revalidatePath("/admin/quotes");
  revalidatePath(`/admin/quotes/${quote.id}`);
  revalidatePath(`/admin/clients/${quote.clientId}`);
  if (quote.dealId) revalidatePath(`/admin/deals/${quote.dealId}`);
  revalidatePath("/admin");
}

/** Enregistre un brouillon. Un devis émis ne se modifie plus : on le duplique. */
export async function saveQuote(_prev: QuoteActionState, formData: FormData): Promise<QuoteActionState> {
  await assertAdmin();
  let data;
  try {
    data = payload.parse(JSON.parse(readString(formData, "payload")));
  } catch (error) {
    const message = error instanceof z.ZodError ? error.issues[0]?.message : null;
    return { error: message ?? "Le devis est incomplet." };
  }
  if (data.lots.length === 0) return { error: "Ajoutez au moins un lot." };

  if (data.id) {
    const existing = await prisma.quote.findUnique({ where: { id: data.id } });
    if (!existing) return { error: "Devis introuvable." };
    if (existing.status !== "DRAFT") return { error: "Ce devis est déjà émis : dupliquez-le pour le modifier." };
  }

  const total = data.lots.reduce((sum, item) => sum + item.amountCents, 0);
  const fields = {
    clientId: data.clientId,
    dealId: data.dealId || null,
    issuerId: data.issuerId,
    currency: data.currency,
    title: data.title,
    context: data.context || null,
    perimeter: data.perimeter || null,
    stack: data.stack,
    depositPercent: data.depositPercent,
    paymentNote: data.paymentNote || null,
    delay: data.delay || null,
    outOfScope: data.outOfScope || null,
    evolutions: data.evolutions,
    terms: data.terms || null,
    validityDays: data.validityDays,
    requireSignature: data.requireSignature,
    subtotalCents: total,
    vatCents: 0,
    totalCents: total,
  };
  const lines = data.lots.map((item, position) => ({
    position,
    kind: "ITEM" as const,
    title: item.title,
    description: item.description || null,
    quantity: 1,
    unitPriceCents: item.amountCents,
    vatRate: 0,
    discountPercent: 0,
  }));

  let id = data.id;
  if (id) {
    await prisma.$transaction([
      prisma.quoteLine.deleteMany({ where: { quoteId: id } }),
      prisma.quote.update({ where: { id }, data: { ...fields, lines: { create: lines } } }),
    ]);
  } else {
    const quote = await prisma.quote.create({
      data: { ...fields, token: randomBytes(18).toString("base64url"), lines: { create: lines } },
    });
    id = quote.id;
    await logActivity("quote.created", `Devis créé : ${data.title}`, { clientId: data.clientId, dealId: fields.dealId, quoteId: id });
  }
  refresh({ id, clientId: data.clientId, dealId: fields.dealId });
  redirect(`/admin/quotes/${id}`);
}

/**
 * Émission : numéro (automatique ou saisi), date, instantanés de l'émetteur
 * et du client. Partagé par l'envoi et par l'acceptation directe.
 */
async function emit(quoteId: string, manualNumber: string | null) {
  return prisma.$transaction(async (tx) => {
    const quote = await tx.quote.findUniqueOrThrow({ where: { id: quoteId }, include: quoteInclude });
    if (!quote.issuer) throw new Error("Choisissez l'identité émettrice avant d'émettre le devis.");
    if (quote.number) return quote;

    const issueDate = new Date();
    let number: string;
    if (manualNumber) {
      const claim = await claimManualNumber(tx, quote.issuer.id, "QUOTE", manualNumber, quote.id);
      if (!claim.ok) throw new Error(claim.error);
      number = claim.number;
    } else {
      number = await reserveNumber(tx, quote.issuer.id, "QUOTE", issueDate);
    }
    return tx.quote.update({
      where: { id: quote.id },
      data: {
        number,
        issueDate,
        validUntil: new Date(issueDate.getTime() + quote.validityDays * 86_400_000),
        issuerSnapshot: issuerSnapshot(quote.issuer),
        clientSnapshot: clientSnapshot(quote.client),
      },
      include: quoteInclude,
    });
  });
}

export async function sendQuote(_prev: QuoteActionState, formData: FormData): Promise<QuoteActionState> {
  await assertAdmin();
  const id = readString(formData, "id");
  const to = readString(formData, "to").toLowerCase();
  const message = readOptional(formData, "message");
  if (!z.string().email().safeParse(to).success) return { error: "Adresse e-mail du destinataire invalide." };

  let quote;
  try {
    quote = await emit(id, readOptional(formData, "number"));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Émission impossible." };
  }
  if (!["DRAFT", "SENT", "VIEWED"].includes(quote.status)) return { error: "Ce devis n'est plus en attente." };

  const doc = quoteDoc({ ...quote, status: "SENT" });
  const pdf = await htmlToPdf(renderDocument(doc));
  const link = `${getSiteUrl()}/documents/${quote.token}`;
  const result = await sendDocumentEmail({
    to,
    replyTo: quote.issuer?.email,
    issuerName: doc.issuer.name,
    subject: `Devis ${quote.number} — ${quote.title}`,
    paragraphs: [
      "Bonjour,",
      ...(message ? [message] : []),
      `Vous trouverez ci-joint notre devis ${quote.number} pour « ${quote.title} », d'un montant de ${money(quote.totalCents, quote.currency)}.`,
      quote.requireSignature
        ? "Vous pouvez le consulter et le signer en ligne en un instant, depuis le lien ci-dessous."
        : "Vous pouvez le consulter en ligne depuis le lien ci-dessous.",
      `Il est valable ${quote.validityDays} jours.`,
    ],
    button: { href: link, label: quote.requireSignature ? "Consulter et signer le devis" : "Consulter le devis" },
    pdf,
    filename: documentFileName(doc),
  });
  if (!result.sent) return { error: result.error };

  await prisma.quote.update({
    where: { id },
    data: { status: quote.status === "DRAFT" ? "SENT" : quote.status, sentAt: new Date() },
  });
  if (quote.dealId) {
    await prisma.deal.updateMany({ where: { id: quote.dealId, stage: { in: ["LEAD", "DISCOVERY"] } }, data: { stage: "PROPOSAL" } });
  }
  await prisma.client.updateMany({ where: { id: quote.clientId, status: "LEAD" }, data: { status: "PROSPECT" } });
  await logActivity("quote.sent", `Devis ${quote.number} envoyé à ${to}`, { clientId: quote.clientId, dealId: quote.dealId, quoteId: id });
  refresh(quote);
  return { ok: `Devis ${quote.number} envoyé à ${to}.` };
}

/** Marque l'issue d'un devis comme acquise : projet signé, client actif. */
async function markWon(quote: { id: string; clientId: string; dealId: string | null; totalCents: number }) {
  if (quote.dealId) {
    await prisma.deal.updateMany({
      where: { id: quote.dealId, stage: { in: ["LEAD", "DISCOVERY", "PROPOSAL", "NEGOTIATION"] } },
      data: { stage: "WON", amountCents: quote.totalCents },
    });
  }
  await prisma.client.updateMany({ where: { id: quote.clientId, status: { in: ["LEAD", "PROSPECT", "PAST"] } }, data: { status: "ACTIVE" } });
}

const acceptanceLabels: Record<Exclude<QuoteAcceptance, "SIGNATURE">, string> = {
  VERBAL: "à l'oral",
  EMAIL: "par e-mail",
  PURCHASE_ORDER: "sur bon de commande",
  OTHER: "",
};

/** Accord donné hors ligne : à l'oral, par e-mail… sans page de signature. */
export async function acceptQuote(_prev: QuoteActionState, formData: FormData): Promise<QuoteActionState> {
  await assertAdmin();
  const id = readString(formData, "id");
  const mode = readString(formData, "mode") as Exclude<QuoteAcceptance, "SIGNATURE">;
  if (!(mode in acceptanceLabels)) return { error: "Choisissez comment l'accord a été donné." };
  const acceptedAt = fromDateInput(readOptional(formData, "date")) ?? new Date();
  const note = readOptional(formData, "note");
  const recapTo = formData.get("sendRecap") === "on" ? readString(formData, "to").toLowerCase() : "";

  let quote;
  try {
    quote = await emit(id, readOptional(formData, "number"));
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Émission impossible." };
  }
  if (!["DRAFT", "SENT", "VIEWED", "EXPIRED"].includes(quote.status)) return { error: "Ce devis a déjà une issue." };

  const updated = await prisma.quote.update({
    where: { id },
    data: { status: "SIGNED", acceptedVia: mode, signedAt: acceptedAt, acceptanceNote: note },
    include: quoteInclude,
  });
  await markWon(updated);
  await logActivity("quote.accepted", `Devis ${updated.number} accepté ${acceptanceLabels[mode]}`.trim(), {
    clientId: updated.clientId,
    dealId: updated.dealId,
    quoteId: id,
  });

  let info = `Devis ${updated.number} marqué accepté.`;
  if (recapTo) {
    if (!z.string().email().safeParse(recapTo).success) return { error: "Adresse du récapitulatif invalide (le devis est bien marqué accepté)." };
    const doc = quoteDoc(updated);
    const pdf = await htmlToPdf(renderDocument(doc));
    const result = await sendDocumentEmail({
      to: recapTo,
      replyTo: updated.issuer?.email,
      issuerName: doc.issuer.name,
      subject: `Récapitulatif de votre accord — devis ${updated.number}`,
      paragraphs: [
        "Bonjour,",
        `Merci pour votre accord ${acceptanceLabels[mode]} sur le devis ${updated.number} « ${updated.title} », d'un montant de ${money(updated.totalCents, updated.currency)}.`,
        "Vous trouverez le devis en pièce jointe pour vos archives. N'hésitez pas à nous écrire si un point doit être précisé.",
      ],
      pdf,
      filename: documentFileName(doc),
    });
    info = result.sent ? `${info} Récapitulatif envoyé à ${recapTo}.` : `${info} ${result.error}`;
  }
  refresh(updated);
  return { ok: info };
}

export async function setQuoteStatus(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const status = readString(formData, "status");
  if (status !== "DECLINED" && status !== "CANCELLED" && status !== "SENT") return;
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote || quote.status === "SIGNED") return;
  await prisma.quote.update({
    where: { id },
    data: { status, declinedAt: status === "DECLINED" ? new Date() : null, declineReason: readOptional(formData, "reason") },
  });
  const label = status === "DECLINED" ? "refusé" : status === "CANCELLED" ? "annulé" : "rouvert";
  await logActivity("quote.status", `Devis ${quote.number ?? quote.title} ${label}`, { clientId: quote.clientId, dealId: quote.dealId, quoteId: id });
  refresh(quote);
}

export async function duplicateQuote(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const quote = await prisma.quote.findUnique({ where: { id }, include: { lines: true } });
  if (!quote) return;
  const copy = await prisma.quote.create({
    data: {
      clientId: quote.clientId,
      dealId: quote.dealId,
      issuerId: quote.issuerId,
      currency: quote.currency,
      title: quote.title,
      context: quote.context,
      perimeter: quote.perimeter,
      stack: quote.stack,
      depositPercent: quote.depositPercent,
      paymentNote: quote.paymentNote,
      delay: quote.delay,
      outOfScope: quote.outOfScope,
      evolutions: quote.evolutions,
      terms: quote.terms,
      validityDays: quote.validityDays,
      requireSignature: quote.requireSignature,
      subtotalCents: quote.subtotalCents,
      totalCents: quote.totalCents,
      token: randomBytes(18).toString("base64url"),
      lines: {
        create: quote.lines.map(({ position, kind, title, description, quantity, unit, unitPriceCents, vatRate, discountPercent }) => ({
          position,
          kind,
          title,
          description,
          quantity,
          unit,
          unitPriceCents,
          vatRate,
          discountPercent,
        })),
      },
    },
  });
  revalidatePath("/admin/quotes");
  redirect(`/admin/quotes/${copy.id}/edit`);
}

export async function deleteQuote(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const quote = await prisma.quote.findUnique({ where: { id } });
  if (!quote || quote.status !== "DRAFT") return;
  await prisma.quote.delete({ where: { id } });
  refresh(quote);
  redirect("/admin/quotes");
}

/**
 * Factures issues d'un devis accepté : acompte, solde (déduction faite des
 * acomptes déjà facturés) ou totalité. Créées en brouillon, à relire.
 */
export async function invoiceFromQuote(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const kind = readString(formData, "kind") as "DEPOSIT" | "BALANCE" | "STANDARD";
  const quote = await prisma.quote.findUnique({ where: { id }, include: { lines: true, invoices: true } });
  if (!quote || quote.status !== "SIGNED") return;

  const ref = quote.number ?? quote.title;
  const billed = quote.invoices
    .filter((invoice) => invoice.kind === "DEPOSIT" && invoice.status !== "CANCELLED")
    .reduce((sum, invoice) => sum + invoice.totalCents, 0);

  let lines: { title: string; description: string | null; amountCents: number }[];
  let title = quote.title;
  if (kind === "DEPOSIT") {
    // Plusieurs acomptes possibles : montant choisi (ou pourcentage du devis),
    // jamais au-delà du reste à facturer.
    const asked = Number(readString(formData, "amountCents"));
    const percent = Number(readString(formData, "percent")) || quote.depositPercent;
    const amount = Math.min(asked > 0 ? Math.round(asked) : Math.round((quote.totalCents * percent) / 100), quote.totalCents - billed);
    if (amount <= 0) return;
    const rank = quote.invoices.filter((invoice) => invoice.kind === "DEPOSIT" && invoice.status !== "CANCELLED").length + 1;
    const share = Math.round((amount / quote.totalCents) * 1000) / 10;
    lines = [
      {
        title: `${rank > 1 ? `Acompte n° ${rank}` : "Acompte à la commande"} — ${String(share).replace(".", ",")} % du devis`,
        description: `Devis ${ref} — ${quote.title}`,
        amountCents: amount,
      },
    ];
    title = `${quote.title} — Acompte${rank > 1 ? ` n° ${rank}` : ""}`;
  } else if (kind === "BALANCE") {
    lines = quote.lines
      .filter((line) => line.kind === "ITEM")
      .map((line) => ({ title: line.title, description: line.description, amountCents: line.unitPriceCents }));
    if (billed > 0) lines.push({ title: "Acomptes déjà facturés", description: `Devis ${ref}`, amountCents: -billed });
    title = `${quote.title} — Solde`;
  } else {
    lines = quote.lines
      .filter((line) => line.kind === "ITEM")
      .map((line) => ({ title: line.title, description: line.description, amountCents: line.unitPriceCents }));
  }
  const total = lines.reduce((sum, line) => sum + line.amountCents, 0);

  const invoice = await prisma.invoice.create({
    data: {
      kind,
      clientId: quote.clientId,
      dealId: quote.dealId,
      quoteId: quote.id,
      issuerId: quote.issuerId,
      currency: quote.currency,
      title,
      contextLine: kind === "STANDARD" ? `Selon devis ${ref}.` : `Selon devis ${ref} du ${quote.issueDate ? quote.issueDate.toLocaleDateString("fr-FR", { timeZone: "Europe/Paris" }) : ""}.`,
      subtotalCents: total,
      totalCents: total,
      token: randomBytes(18).toString("base64url"),
      lines: {
        create: lines.map((line, position) => ({
          position,
          title: line.title,
          description: line.description,
          quantity: 1,
          unitPriceCents: line.amountCents,
          vatRate: 0,
        })),
      },
    },
  });
  await logActivity("invoice.created", `Facture créée depuis le devis ${ref}`, { clientId: quote.clientId, dealId: quote.dealId, invoiceId: invoice.id });
  revalidatePath("/admin/invoices");
  redirect(`/admin/invoices/${invoice.id}`);
}
