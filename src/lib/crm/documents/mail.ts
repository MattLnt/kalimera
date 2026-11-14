import "server-only";

import { Resend } from "resend";

import { siteConfig } from "@/lib/site";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;
const from = process.env.CONTACT_FROM_EMAIL ?? `Kalimera <contact@${siteConfig.domain}>`;
const studio = process.env.CONTACT_TO_EMAIL ?? siteConfig.email;

function esc(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/**
 * E-mail sobre, assorti à la charte des documents : pas de bandeau coloré,
 * le nom de l'émetteur en tête, un bouton, le PDF en pièce jointe.
 */
export async function sendDocumentEmail({
  to,
  replyTo,
  issuerName,
  subject,
  paragraphs,
  button,
  pdf,
  filename,
}: {
  to: string;
  replyTo?: string | null;
  issuerName: string;
  subject: string;
  paragraphs: string[];
  button?: { href: string; label: string };
  pdf?: Buffer;
  filename?: string;
}) {
  if (!resend) {
    console.warn("[documents] RESEND_API_KEY absent : e-mail non envoyé.");
    return { sent: false as const, error: "L'envoi d'e-mails n'est pas configuré (RESEND_API_KEY)." };
  }
  const html = `<!doctype html><html><body style="margin:0;background:#f5f5f5;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#0D0D12">
  <div style="max-width:560px;margin:0 auto;padding:32px 16px">
    <div style="background:#fff;border:1px solid #D9D9D9;padding:32px 28px">
      <p style="margin:0 0 16px;padding-bottom:14px;border-bottom:2px solid #1D2B3A;font-size:16px;font-weight:700">${esc(issuerName)}</p>
      ${paragraphs.map((text) => `<p style="margin:0 0 14px;font-size:14px;line-height:1.65;color:#262626">${esc(text)}</p>`).join("")}
      ${
        button
          ? `<a href="${esc(button.href)}" style="display:inline-block;margin-top:6px;padding:12px 22px;background:#1D2B3A;color:#fff;font-size:14px;font-weight:600;text-decoration:none">${esc(button.label)}</a>`
          : ""
      }
    </div>
  </div></body></html>`;

  const { error } = await resend.emails.send({
    from: `${issuerName} <${from.match(/<(.+)>/)?.[1] ?? from}>`,
    to,
    replyTo: replyTo ?? studio,
    subject,
    html,
    text: [...paragraphs, button ? `${button.label} : ${button.href}` : ""].join("\n\n"),
    attachments: pdf && filename ? [{ filename, content: pdf }] : undefined,
  });
  if (error) {
    console.error("[documents] envoi échoué", error);
    return { sent: false as const, error: "L'e-mail n'a pas pu partir. Réessayez dans un instant." };
  }
  return { sent: true as const };
}

export const studioEmail = studio;
