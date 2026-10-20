import "server-only";

import { Resend } from "resend";

import { siteConfig } from "@/lib/site";

const apiKey = process.env.RESEND_API_KEY;

export const emailConfigured = Boolean(apiKey);

const resend = apiKey ? new Resend(apiKey) : null;

const from = process.env.CONTACT_FROM_EMAIL ?? `Kalimera <contact@${siteConfig.domain}>`;
const to = process.env.CONTACT_TO_EMAIL ?? siteConfig.email;

type Enquiry = {
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  subject: string;
  budget?: string | null;
  message: string;
  locale: string;
};

/** Échappe le contenu saisi par le visiteur avant de l'injecter dans le HTML. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value?: string | null) {
  if (!value) return "";
  return `<tr>
    <td style="padding:8px 0;color:#6b7280;font-size:13px;width:150px;vertical-align:top">${escapeHtml(label)}</td>
    <td style="padding:8px 0;color:#08090b;font-size:14px">${escapeHtml(value)}</td>
  </tr>`;
}

/** Notification envoyée au studio à chaque nouvelle demande. */
export async function sendEnquiryNotification(enquiry: Enquiry) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY absent : notification non envoyée.");
    return { sent: false as const };
  }

  const html = `<!doctype html>
<html><body style="margin:0;background:#f3f6fb;font-family:system-ui,-apple-system,'Segoe UI',sans-serif">
  <div style="max-width:640px;margin:0 auto;padding:32px 20px">
    <div style="background:#fff;border-radius:24px;padding:32px;box-shadow:0 4px 12px -2px rgba(7,33,63,.06)">
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#1562b8">
        Nouvelle demande · ${escapeHtml(enquiry.locale.toUpperCase())}
      </p>
      <h1 style="margin:0 0 24px;font-size:24px;letter-spacing:-.03em;color:#08090b">
        ${escapeHtml(enquiry.subject)}
      </h1>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e9f0">
        ${row("Nom", enquiry.name)}
        ${row("Email", enquiry.email)}
        ${row("Société", enquiry.company)}
        ${row("Téléphone", enquiry.phone)}
        ${row("Budget", enquiry.budget)}
      </table>
      <div style="margin-top:24px;padding:20px;background:#f1f7fe;border-radius:16px">
        <p style="margin:0 0 8px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#1562b8">Message</p>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#08090b;white-space:pre-wrap">${escapeHtml(enquiry.message)}</p>
      </div>
      <a href="mailto:${escapeHtml(enquiry.email)}"
         style="display:inline-block;margin-top:24px;padding:12px 24px;background:#08090b;color:#fff;border-radius:999px;font-size:14px;font-weight:600;text-decoration:none">
        Répondre à ${escapeHtml(enquiry.name)}
      </a>
    </div>
  </div>
</body></html>`;

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: enquiry.email,
    subject: `Nouvelle demande — ${enquiry.subject} (${enquiry.name})`,
    html,
    text: [
      `Nouvelle demande — ${enquiry.subject}`,
      `Nom : ${enquiry.name}`,
      `Email : ${enquiry.email}`,
      enquiry.company ? `Société : ${enquiry.company}` : null,
      enquiry.phone ? `Téléphone : ${enquiry.phone}` : null,
      enquiry.budget ? `Budget : ${enquiry.budget}` : null,
      "",
      enquiry.message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    console.error("[email] envoi échoué", error);
    return { sent: false as const };
  }
  return { sent: true as const };
}

const confirmations = {
  fr: {
    subject: "Nous avons bien reçu votre demande",
    title: "Merci, c'est bien arrivé.",
    body: "Nous revenons vers vous sous 48 heures ouvrées avec un premier retour technique, une estimation de budget et un délai.",
    signature: "L'équipe Kalimera",
  },
  en: {
    subject: "We've received your enquiry",
    title: "Thanks — it reached us.",
    body: "We'll get back to you within two working days with initial technical feedback, a budget estimate and a timeline.",
    signature: "The Kalimera team",
  },
  es: {
    subject: "Hemos recibido tu consulta",
    title: "Gracias, nos ha llegado.",
    body: "Te respondemos en 48 horas laborables con una primera valoración técnica, una estimación de presupuesto y un plazo.",
    signature: "El equipo de Kalimera",
  },
} as const;

/** Accusé de réception envoyé au visiteur, dans sa langue. */
export async function sendEnquiryConfirmation(enquiry: Enquiry) {
  if (!resend) return { sent: false as const };

  const copy =
    confirmations[enquiry.locale as keyof typeof confirmations] ?? confirmations.fr;

  const html = `<!doctype html>
<html><body style="margin:0;background:#f3f6fb;font-family:system-ui,-apple-system,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px">
    <div style="background:#fff;border-radius:24px;padding:40px 32px;box-shadow:0 4px 12px -2px rgba(7,33,63,.06)">
      <div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(140deg,#2a86e8,#07213f);margin-bottom:24px"></div>
      <h1 style="margin:0 0 12px;font-size:26px;letter-spacing:-.03em;color:#08090b">${copy.title}</h1>
      <p style="margin:0 0 24px;font-size:15px;line-height:1.65;color:rgba(8,9,11,.7)">${copy.body}</p>
      <p style="margin:0;font-size:15px;color:#08090b">${copy.signature}</p>
      <p style="margin:24px 0 0;padding-top:20px;border-top:1px solid #e5e9f0;font-size:13px;color:rgba(8,9,11,.45)">
        Kalimera — ${siteConfig.domain}
      </p>
    </div>
  </div>
</body></html>`;

  const { error } = await resend.emails.send({
    from,
    to: enquiry.email,
    subject: copy.subject,
    html,
    text: `${copy.title}\n\n${copy.body}\n\n${copy.signature}\nKalimera — ${siteConfig.domain}`,
  });

  if (error) {
    console.error("[email] accusé de réception échoué", error);
    return { sent: false as const };
  }
  return { sent: true as const };
}
