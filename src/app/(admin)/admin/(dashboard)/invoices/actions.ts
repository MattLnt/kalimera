"use server";

import { randomBytes } from "node:crypto";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { assertAdmin, readOptional, readString } from "@/lib/admin";
import { logActivity } from "@/lib/crm/activity";
import { clientSnapshot, invoiceDoc, issuerSnapshot } from "@/lib/crm/documents/build";
import { sendDocumentEmail } from "@/lib/crm/documents/mail";
import { htmlToPdf } from "@/lib/crm/documents/pdf";
import { documentFileName, money, renderDocument } from "@/lib/crm/documents/render";
import { fromDateInput, parseMoney } from "@/lib/crm/format";
import { claimManualNumber, reserveNumber } from "@/lib/crm/numbering";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

export type InvoiceActionState = { error?: string; ok?: string };

const payload = z.object({
  id: z.string().optional(),
  clientId: z.string().min(1, "Choisissez un client."),
  dealId: z.string().optional().nullable(),
  issuerId: z.string().min(1, "Choisissez l'identité émettrice."),
  currency: z.enum(["EUR", "USD"]),
  title: z.string().trim().min(2, "Donnez un titre à la facture.").max(300),
  contextLine: z.string().max(1000).optional().default(""),
  notes: z.string().max(4000).optional().default(""),
  lots: z
    .array(
      z.object({
        title: z.string().trim().min(1).max(300),
        description: z.string().max(6000).optional().default(""),
        amountCents: z.number().int().min(-100_000_000).max(100_000_000),
      }),
    )
    .min(1, "Ajoutez au moins une ligne.")
    .max(60),
});

const include = { lines: true, client: true, issuer: true } as const;

function refresh(invoice: { id: string; clientId: string; dealId: string | null; quoteId?: string | null }) {
  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${invoice.id}`);
  revalidatePath(`/admin/clients/${invoice.clientId}`);
  if (invoice.dealId) revalidatePath(`/admin/deals/${invoice.dealId}`);
  if (invoice.quoteId) revalidatePath(`/admin/quotes/${invoice.quoteId}`);
  revalidatePath("/admin");
}

export async function saveInvoice(_prev: InvoiceActionState, formData: FormData): Promise<InvoiceActionState> {
  await assertAdmin();
  let data;
  try {
    data = payload.parse(JSON.parse(readString(formData, "payload")));
  } catch (error) {
    return { error: error instanceof z.ZodError ? error.issues[0]?.message : "La facture est incomplète." };
  }
  if (data.id) {
    const existing = await prisma.invoice.findUnique({ where: { id: data.id } });
    if (!existing) return { error: "Facture introuvable." };
    if (existing.status !== "DRAFT") return { error: "Une facture émise ne se modifie plus : faites un avoir." };
  }

  const total = data.lots.reduce((sum, item) => sum + item.amountCents, 0);
  const fields = {
    clientId: data.clientId,
    dealId: data.dealId || null,
    issuerId: data.issuerId,
    currency: data.currency,
    title: data.title,
    contextLine: data.contextLine || null,
    notes: data.notes || null,
    subtotalCents: total,
    vatCents: 0,
    totalCents: total,
  };
  const lines = data.lots.map((item, position) => ({
    position,
    title: item.title,
    description: item.description || null,
    quantity: 1,
    unitPriceCents: item.amountCents,
    vatRate: 0,
  }));

  let id = data.id;
  if (id) {
    await prisma.$transaction([
      prisma.invoiceLine.deleteMany({ where: { invoiceId: id } }),
      prisma.invoice.update({ where: { id }, data: { ...fields, lines: { create: lines } } }),
    ]);
  } else {
    const invoice = await prisma.invoice.create({ data: { ...fields, token: randomBytes(18).toString("base64url"), lines: { create: lines } } });
    id = invoice.id;
    await logActivity("invoice.created", `Facture créée : ${data.title}`, { clientId: data.clientId, dealId: fields.dealId, invoiceId: id });
  }
  refresh({ id, clientId: data.clientId, dealId: fields.dealId });
  redirect(`/admin/invoices/${id}`);
}

/**
 * Émission : numéro définitif (automatique ou saisi), dates, coordonnées
 * figées. Une facture émise ne change plus ; un avoir émis annule la facture
 * qu'il corrige.
 */
export async function issueInvoice(_prev: InvoiceActionState, formData: FormData): Promise<InvoiceActionState> {
  await assertAdmin();
  const id = readString(formData, "id");
  const manual = readOptional(formData, "number");
  const issueDate = fromDateInput(readOptional(formData, "issueDate")) ?? new Date();
  const dueDate = fromDateInput(readOptional(formData, "dueDate"));

  try {
    const invoice = await prisma.$transaction(async (tx) => {
      const current = await tx.invoice.findUniqueOrThrow({ where: { id }, include });
      if (current.status !== "DRAFT") throw new Error("Cette facture est déjà émise.");
      if (!current.issuer) throw new Error("Choisissez l'identité émettrice.");
      let number: string;
      if (manual) {
        const claim = await claimManualNumber(tx, current.issuer.id, "INVOICE", manual, current.id);
        if (!claim.ok) throw new Error(claim.error);
        number = claim.number;
      } else {
        number = await reserveNumber(tx, current.issuer.id, "INVOICE", issueDate);
      }
      const issued = await tx.invoice.update({
        where: { id },
        data: {
          number,
          status: "ISSUED",
          issueDate,
          dueDate: dueDate ?? issueDate,
          issuerSnapshot: issuerSnapshot(current.issuer),
          clientSnapshot: clientSnapshot(current.client),
        },
      });
      if (current.kind === "CREDIT_NOTE" && current.creditedInvoiceId) {
        await tx.invoice.update({ where: { id: current.creditedInvoiceId }, data: { status: "CANCELLED", cancelledAt: new Date() } });
      }
      return issued;
    });
    await logActivity("invoice.issued", `${invoice.kind === "CREDIT_NOTE" ? "Avoir" : "Facture"} ${invoice.number} émis${invoice.kind === "CREDIT_NOTE" ? "" : "e"} — ${money(invoice.totalCents, invoice.currency)}`, {
      clientId: invoice.clientId,
      dealId: invoice.dealId,
      invoiceId: invoice.id,
    });
    refresh(invoice);
    return { ok: `Numéro ${invoice.number} attribué.` };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Émission impossible." };
  }
}

export async function sendInvoice(_prev: InvoiceActionState, formData: FormData): Promise<InvoiceActionState> {
  await assertAdmin();
  const id = readString(formData, "id");
  const to = readString(formData, "to").toLowerCase();
  const message = readOptional(formData, "message");
  if (!z.string().email().safeParse(to).success) return { error: "Adresse e-mail invalide." };

  const invoice = await prisma.invoice.findUnique({ where: { id }, include });
  if (!invoice || !invoice.number) return { error: "Émettez d'abord la facture." };

  const doc = invoiceDoc(invoice);
  const pdf = await htmlToPdf(renderDocument(doc));
  const label = invoice.kind === "CREDIT_NOTE" ? "avoir" : "facture";
  const result = await sendDocumentEmail({
    to,
    replyTo: invoice.issuer?.email,
    issuerName: doc.issuer.name,
    subject: `${invoice.kind === "CREDIT_NOTE" ? "Avoir" : "Facture"} ${invoice.number} — ${invoice.title}`,
    paragraphs: [
      "Bonjour,",
      ...(message ? [message] : []),
      `Vous trouverez ci-joint notre ${label} ${invoice.number} d'un montant de ${money(invoice.totalCents, invoice.currency)}.`,
      invoice.kind === "CREDIT_NOTE" ? "" : "Les coordonnées bancaires pour le virement figurent sur le document.",
    ].filter(Boolean),
    button: { href: `${getSiteUrl()}/documents/${invoice.token}`, label: `Consulter la ${label}` },
    pdf,
    filename: documentFileName(doc),
  });
  if (!result.sent) return { error: result.error };

  await prisma.invoice.update({ where: { id }, data: { sentAt: new Date() } });
  await logActivity("invoice.sent", `Facture ${invoice.number} envoyée à ${to}`, { clientId: invoice.clientId, dealId: invoice.dealId, invoiceId: id });
  refresh(invoice);
  return { ok: `Envoyée à ${to}.` };
}

/** Recalcule l'état payé à partir des virements enregistrés. */
async function settle(invoiceId: string) {
  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId }, include: { payments: true } });
  if (!invoice || invoice.status === "DRAFT" || invoice.status === "CANCELLED") return invoice;
  const paid = invoice.payments.reduce((sum, payment) => sum + payment.amountCents, 0);
  const isPaid = paid >= invoice.totalCents;
  return prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      status: isPaid ? "PAID" : "ISSUED",
      paidAt: isPaid ? (invoice.paidAt ?? invoice.payments.at(-1)?.receivedAt ?? new Date()) : null,
    },
  });
}

export async function addPayment(_prev: InvoiceActionState, formData: FormData): Promise<InvoiceActionState> {
  await assertAdmin();
  const id = readString(formData, "id");
  const amount = parseMoney(readString(formData, "amount"));
  if (!amount || amount <= 0) return { error: "Indiquez le montant reçu." };
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice || invoice.status === "DRAFT") return { error: "Émettez d'abord la facture." };

  await prisma.payment.create({
    data: {
      invoiceId: id,
      amountCents: amount,
      receivedAt: fromDateInput(readOptional(formData, "receivedAt")) ?? new Date(),
      reference: readOptional(formData, "reference"),
    },
  });
  const settled = await settle(id);
  await logActivity("payment.received", `Virement reçu : ${money(amount, invoice.currency)} sur ${invoice.number}`, {
    clientId: invoice.clientId,
    dealId: invoice.dealId,
    invoiceId: id,
  });
  refresh(invoice);
  return { ok: settled?.status === "PAID" ? "Facture soldée." : "Virement enregistré." };
}

export async function deletePayment(formData: FormData) {
  await assertAdmin();
  const paymentId = readString(formData, "paymentId");
  const payment = await prisma.payment.delete({ where: { id: paymentId }, include: { invoice: true } }).catch(() => null);
  if (!payment) return;
  await settle(payment.invoiceId);
  refresh(payment.invoice);
}

export async function deleteInvoice(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const invoice = await prisma.invoice.findUnique({ where: { id } });
  if (!invoice || invoice.status !== "DRAFT") return;
  await prisma.invoice.delete({ where: { id } });
  refresh(invoice);
  redirect("/admin/invoices");
}

/** Avoir : reprend la facture à l'identique, en brouillon, pour l'annuler. */
export async function createCreditNote(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  const invoice = await prisma.invoice.findUnique({ where: { id }, include: { lines: true } });
  if (!invoice || !invoice.number || invoice.kind === "CREDIT_NOTE") return;
  const note = await prisma.invoice.create({
    data: {
      kind: "CREDIT_NOTE",
      clientId: invoice.clientId,
      dealId: invoice.dealId,
      quoteId: invoice.quoteId,
      issuerId: invoice.issuerId,
      creditedInvoiceId: invoice.id,
      currency: invoice.currency,
      title: invoice.title,
      contextLine: `Avoir annulant la facture ${invoice.number}.`,
      subtotalCents: invoice.totalCents,
      totalCents: invoice.totalCents,
      token: randomBytes(18).toString("base64url"),
      lines: {
        create: invoice.lines.map((line) => ({
          position: line.position,
          kind: line.kind,
          title: line.title,
          description: line.description,
          quantity: line.quantity,
          unitPriceCents: line.unitPriceCents,
          vatRate: line.vatRate,
        })),
      },
    },
  });
  refresh(invoice);
  redirect(`/admin/invoices/${note.id}`);
}
