"use server";

import { createHash } from "node:crypto";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

import { logActivity } from "@/lib/crm/activity";
import { quoteDoc, quoteFingerprintPayload } from "@/lib/crm/documents/build";
import { sendDocumentEmail, studioEmail } from "@/lib/crm/documents/mail";
import { htmlToPdf } from "@/lib/crm/documents/pdf";
import { documentFileName, money, renderDocument } from "@/lib/crm/documents/render";
import { prisma } from "@/lib/prisma";

export type SignState = { error?: string; signed?: boolean };

const schema = z.object({
  token: z.string().min(10),
  name: z.string().trim().min(3, "Indiquez votre nom complet.").max(120),
  email: z.string().trim().email("Adresse e-mail invalide.").max(180),
  consent: z.literal("on", { message: "Cochez la case « Bon pour accord » pour signer." }),
  // PNG de la signature dessinée ; limité pour ne pas stocker n'importe quoi.
  signature: z
    .string()
    .regex(/^data:image\/png;base64,[A-Za-z0-9+/=]+$/, "Dessinez votre signature dans le cadre.")
    .max(400_000, "Signature trop lourde, recommencez."),
});

/**
 * Signature électronique simple : nom, accord explicite, tracé, horodatage,
 * adresse IP, navigateur, et empreinte SHA-256 du contenu signé. Le PDF signé
 * part aux deux parties.
 */
export async function signQuote(_prev: SignState, formData: FormData): Promise<SignState> {
  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Signature incomplète." };
  const data = parsed.data;

  const quote = await prisma.quote.findUnique({ where: { token: data.token }, include: { lines: true, client: true, issuer: true } });
  if (!quote || !quote.number) return { error: "Ce devis n'est plus disponible." };
  if (quote.status === "SIGNED") return { signed: true };
  if (!["SENT", "VIEWED"].includes(quote.status)) return { error: "Ce devis n'est plus ouvert à la signature." };
  if (quote.validUntil && quote.validUntil < new Date()) return { error: "La validité de ce devis est dépassée : contactez-nous pour le renouveler." };

  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerList.get("x-real-ip") ?? null;
  const agent = headerList.get("user-agent")?.slice(0, 400) ?? null;
  const signedAt = new Date();
  const hash = createHash("sha256").update(quoteFingerprintPayload(quoteDoc(quote))).digest("hex");

  const signed = await prisma.quote.update({
    where: { id: quote.id },
    data: {
      status: "SIGNED",
      acceptedVia: "SIGNATURE",
      signedAt,
      signerName: data.name,
      signerEmail: data.email.toLowerCase(),
      signerIp: ip,
      signerAgent: agent,
      signatureImage: data.signature,
      signedHash: hash,
    },
    include: { lines: true, client: true, issuer: true },
  });

  if (signed.dealId) {
    await prisma.deal.updateMany({
      where: { id: signed.dealId, stage: { in: ["LEAD", "DISCOVERY", "PROPOSAL", "NEGOTIATION"] } },
      data: { stage: "WON", amountCents: signed.totalCents },
    });
  }
  await prisma.client.updateMany({ where: { id: signed.clientId, status: { in: ["LEAD", "PROSPECT", "PAST"] } }, data: { status: "ACTIVE" } });
  await logActivity("quote.signed", `Devis ${signed.number} signé en ligne par ${data.name}`, {
    clientId: signed.clientId,
    dealId: signed.dealId,
    quoteId: signed.id,
  });

  // La signature est enregistrée : un e-mail qui échoue ne l'annule pas.
  try {
    const doc = quoteDoc(signed);
    const pdf = await htmlToPdf(renderDocument(doc));
    const filename = documentFileName(doc);
    await Promise.allSettled([
      sendDocumentEmail({
        to: data.email,
        replyTo: signed.issuer?.email,
        issuerName: doc.issuer.name,
        subject: `Devis ${signed.number} signé — merci`,
        paragraphs: [
          `Bonjour ${data.name},`,
          `Merci, votre signature du devis ${signed.number} « ${signed.title} » (${money(signed.totalCents, signed.currency)}) est bien enregistrée.`,
          "Vous trouverez le devis signé en pièce jointe. Nous revenons vers vous très vite pour la suite.",
        ],
        pdf,
        filename,
      }),
      sendDocumentEmail({
        to: signed.issuer?.email ?? studioEmail,
        issuerName: doc.issuer.name,
        subject: `Devis ${signed.number} signé par ${data.name}`,
        paragraphs: [
          `${data.name} (${data.email}) vient de signer le devis ${signed.number} « ${signed.title} » pour ${signed.client.name}.`,
          `Montant : ${money(signed.totalCents, signed.currency)}. Empreinte SHA-256 du contenu signé : ${hash}.`,
        ],
        pdf,
        filename,
      }),
    ]);
  } catch (error) {
    console.error("[documents] envoi du devis signé impossible", error);
  }

  revalidatePath(`/documents/${data.token}`);
  revalidatePath(`/admin/quotes/${signed.id}`);
  return { signed: true };
}
