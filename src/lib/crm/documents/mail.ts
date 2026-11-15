import "server-only";

import { Resend } from "resend";

import { renderDocumentEmail, renderDocumentEmailText, type EmailSender, type EmailSummary } from "@/lib/crm/documents/email-template";
import { siteConfig } from "@/lib/site";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const from = process.env.CONTACT_FROM_EMAIL ?? `Kalimera <contact@${siteConfig.domain}>`;
const studio = process.env.CONTACT_TO_EMAIL ?? siteConfig.email;

/**
 * Envoie un devis ou une facture : texte libre (ou paragraphes), récapitulatif,
 * bouton, signature de l'identité émettrice et PDF joint. Gabarit :
 * src/lib/crm/documents/email-template.ts.
 */
export async function sendDocumentEmail({
  to,
  replyTo,
  issuerName,
  sender,
  subject,
  body,
  paragraphs,
  summary,
  button,
  pdf,
  filename,
  banner,
}: {
  to: string;
  replyTo?: string | null;
  issuerName: string;
  /** Signature ; à défaut, le seul nom de l'émetteur. */
  sender?: EmailSender;
  subject: string;
  /** Texte libre ; sinon `paragraphs`. */
  body?: string;
  paragraphs?: string[];
  summary?: EmailSummary;
  button?: { href: string; label: string };
  pdf?: Buffer;
  filename?: string;
  banner?: string;
}) {
  if (!resend) {
    console.warn("[documents] RESEND_API_KEY absent : e-mail non envoyé.");
    return { sent: false as const, error: "L'envoi d'e-mails n'est pas configuré (RESEND_API_KEY)." };
  }
  const text = body ?? (paragraphs ?? []).join("\n\n");
  const signature = sender ?? { signer: issuerName };
  const attachmentName = pdf && filename ? filename : undefined;

  const { error } = await resend.emails.send({
    from: `${issuerName} <${from.match(/<(.+)>/)?.[1] ?? from}>`,
    to,
    replyTo: replyTo ?? studio,
    subject,
    html: renderDocumentEmail({ body: text, sender: signature, summary, button, attachmentName, banner }),
    text: renderDocumentEmailText({ body: text, sender: signature, summary, button }),
    attachments: pdf && filename ? [{ filename, content: pdf }] : undefined,
  });
  if (error) {
    console.error("[documents] envoi échoué", error);
    return { sent: false as const, error: "L'e-mail n'a pas pu partir. Réessayez dans un instant." };
  }
  return { sent: true as const };
}

export const studioEmail = studio;
