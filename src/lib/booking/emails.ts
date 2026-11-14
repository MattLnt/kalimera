import "server-only";

import { Resend } from "resend";

import { bookingConfig } from "@/lib/booking/config";
import { buildIcs } from "@/lib/booking/ics";
import { siteConfig } from "@/lib/site";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const from = process.env.CONTACT_FROM_EMAIL ?? `Kalimera <contact@${siteConfig.domain}>`;
const studio = process.env.CONTACT_TO_EMAIL ?? siteConfig.email;

type Lang = "fr" | "en" | "es";

export type BookingEmail = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  mode: "VIDEO" | "PHONE";
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  topic?: string | null;
  message?: string | null;
  meetingUrl?: string | null;
  locale: Lang;
  manageUrl: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const intlLocale: Record<Lang, string> = { fr: "fr-FR", en: "en-GB", es: "es-ES" };

/** « lundi 16 novembre 2026 à 09:30 (heure de Paris) » */
function when(date: Date, lang: Lang) {
  const day = new Intl.DateTimeFormat(intlLocale[lang], {
    timeZone: bookingConfig.timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
  const time = new Intl.DateTimeFormat(intlLocale[lang], {
    timeZone: bookingConfig.timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
  return { day, time };
}

const copy = {
  fr: {
    subject: (d: string, t: string) => `Appel confirmé — ${d} à ${t}`,
    title: "C'est noté, à bientôt.",
    intro: (n: string) => `Bonjour ${n}, votre appel de découverte avec Kalimera est confirmé.`,
    at: "à",
    zone: "heure de Paris",
    video: "Visioconférence",
    join: "Rejoindre l'appel",
    phone: (p: string) => `Nous vous appelons au ${p}.`,
    prepare:
      "Pour en tirer le meilleur, gardez sous la main ce que vous avez déjà : un site existant, une maquette, un cahier des charges, même succinct.",
    manage: "Déplacer ou annuler",
    signature: "L'équipe Kalimera",
    cancelSubject: (d: string, t: string) => `Appel annulé — ${d} à ${t}`,
    cancelTitle: "Votre appel est annulé.",
    cancelBody: "Si vous souhaitez reprendre un créneau, le calendrier reste ouvert.",
    rebook: "Choisir un autre créneau",
    summary: "Appel de découverte — Kalimera",
  },
  en: {
    subject: (d: string, t: string) => `Call confirmed — ${d} at ${t}`,
    title: "All set — speak soon.",
    intro: (n: string) => `Hello ${n}, your discovery call with Kalimera is confirmed.`,
    at: "at",
    zone: "Paris time",
    video: "Video call",
    join: "Join the call",
    phone: (p: string) => `We'll call you on ${p}.`,
    prepare:
      "To make the most of it, keep whatever you already have to hand: an existing site, a mockup, a brief, however short.",
    manage: "Reschedule or cancel",
    signature: "The Kalimera team",
    cancelSubject: (d: string, t: string) => `Call cancelled — ${d} at ${t}`,
    cancelTitle: "Your call is cancelled.",
    cancelBody: "If you'd like another slot, the calendar is still open.",
    rebook: "Pick another slot",
    summary: "Discovery call — Kalimera",
  },
  es: {
    subject: (d: string, t: string) => `Llamada confirmada — ${d} a las ${t}`,
    title: "Hecho, hasta pronto.",
    intro: (n: string) => `Hola ${n}, tu llamada de descubrimiento con Kalimera está confirmada.`,
    at: "a las",
    zone: "hora de París",
    video: "Videollamada",
    join: "Unirse a la llamada",
    phone: (p: string) => `Te llamamos al ${p}.`,
    prepare:
      "Para aprovecharla al máximo, ten a mano lo que ya tengas: una web actual, una maqueta, un pliego de condiciones, aunque sea breve.",
    manage: "Cambiar o cancelar",
    signature: "El equipo de Kalimera",
    cancelSubject: (d: string, t: string) => `Llamada cancelada — ${d} a las ${t}`,
    cancelTitle: "Tu llamada está cancelada.",
    cancelBody: "Si quieres otra franja, el calendario sigue abierto.",
    rebook: "Elegir otra franja",
    summary: "Llamada de descubrimiento — Kalimera",
  },
} as const;

function shell(inner: string) {
  return `<!doctype html>
<html><body style="margin:0;background:#f3f6fb;font-family:system-ui,-apple-system,'Segoe UI',sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px">
    <div style="background:#fff;border-radius:24px;padding:40px 32px;box-shadow:0 4px 12px -2px rgba(7,33,63,.06)">
      <div style="width:44px;height:44px;border-radius:14px;background:linear-gradient(140deg,#2a86e8,#07213f);margin-bottom:24px"></div>
      ${inner}
      <p style="margin:24px 0 0;padding-top:20px;border-top:1px solid #e5e9f0;font-size:13px;color:rgba(8,9,11,.45)">
        Kalimera — ${siteConfig.domain}
      </p>
    </div>
  </div>
</body></html>`;
}

function button(href: string, label: string, dark = true) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:8px 8px 0 0;padding:12px 22px;background:${dark ? "#08090b" : "#f1f7fe"};color:${dark ? "#fff" : "#1562b8"};border-radius:999px;font-size:14px;font-weight:600;text-decoration:none">${escapeHtml(label)}</a>`;
}

function description(booking: BookingEmail, lang: Lang) {
  const c = copy[lang];
  return [
    booking.mode === "VIDEO" && booking.meetingUrl
      ? `${c.video} : ${booking.meetingUrl}`
      : booking.phone
        ? c.phone(booking.phone)
        : null,
    booking.topic ? `${booking.topic}` : null,
    `${c.manage} : ${booking.manageUrl}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function invitation(booking: BookingEmail, method: "REQUEST" | "CANCEL", lang: Lang) {
  return buildIcs({
    uid: `${booking.id}@${siteConfig.domain}`,
    start: booking.startsAt,
    end: booking.endsAt,
    summary: copy[lang].summary,
    description: description(booking, lang),
    location: booking.mode === "VIDEO" ? booking.meetingUrl : booking.phone,
    organizer: { name: "Kalimera", email: studio },
    attendee: { name: booking.name, email: booking.email },
    method,
    sequence: method === "CANCEL" ? 1 : 0,
  });
}

async function send(payload: Parameters<Resend["emails"]["send"]>[0]) {
  if (!resend) {
    console.warn("[booking] RESEND_API_KEY absent : e-mail non envoyé.");
    return { sent: false as const };
  }
  const { error } = await resend.emails.send(payload);
  if (error) {
    console.error("[booking] envoi échoué", error);
    return { sent: false as const };
  }
  return { sent: true as const };
}

/** Confirmation au visiteur, dans sa langue, avec l'invitation calendrier. */
export async function sendBookingConfirmation(booking: BookingEmail) {
  const lang = booking.locale;
  const c = copy[lang];
  const { day, time } = when(booking.startsAt, lang);

  const how =
    booking.mode === "VIDEO" && booking.meetingUrl
      ? button(booking.meetingUrl, c.join)
      : booking.phone
        ? `<p style="margin:0 0 8px;font-size:15px;color:#08090b">${escapeHtml(c.phone(booking.phone))}</p>`
        : "";

  const html = shell(`
      <h1 style="margin:0 0 12px;font-size:26px;letter-spacing:-.03em;color:#08090b">${c.title}</h1>
      <p style="margin:0 0 20px;font-size:15px;line-height:1.65;color:rgba(8,9,11,.7)">${escapeHtml(c.intro(booking.name))}</p>
      <div style="padding:20px;background:#f1f7fe;border-radius:16px;margin-bottom:20px">
        <p style="margin:0;font-size:18px;font-weight:700;letter-spacing:-.02em;color:#08090b">${escapeHtml(day)}</p>
        <p style="margin:4px 0 0;font-size:15px;color:#1562b8">${c.at} ${time} · ${bookingConfig.durationMinutes} min · ${c.zone}</p>
      </div>
      ${how}
      <p style="margin:20px 0;font-size:14px;line-height:1.6;color:rgba(8,9,11,.6)">${c.prepare}</p>
      ${button(booking.manageUrl, c.manage, false)}
      <p style="margin:24px 0 0;font-size:15px;color:#08090b">${c.signature}</p>`);

  return send({
    from,
    to: booking.email,
    replyTo: studio,
    subject: c.subject(day, time),
    html,
    text: [c.title, c.intro(booking.name), `${day} ${c.at} ${time} (${c.zone})`, description(booking, lang)].join("\n\n"),
    attachments: [
      { filename: "invitation.ics", content: Buffer.from(invitation(booking, "REQUEST", lang)) },
    ],
  });
}

/** Notification au studio, en français, avec la même invitation. */
export async function sendBookingNotification(booking: BookingEmail) {
  const { day, time } = when(booking.startsAt, "fr");
  const rows = [
    ["Nom", booking.name],
    ["E-mail", booking.email],
    ["Société", booking.company],
    ["Téléphone", booking.phone],
    ["Format", booking.mode === "VIDEO" ? "Visio" : "Téléphone"],
    ["Sujet", booking.topic],
    ["Langue", booking.locale.toUpperCase()],
  ]
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 0;color:#6b7280;font-size:13px;width:130px">${label}</td><td style="padding:8px 0;color:#08090b;font-size:14px">${escapeHtml(String(value))}</td></tr>`,
    )
    .join("");

  const html = shell(`
      <p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#1562b8">Nouveau rendez-vous</p>
      <h1 style="margin:0 0 20px;font-size:24px;letter-spacing:-.03em;color:#08090b">${escapeHtml(day)} à ${time}</h1>
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #e5e9f0">${rows}</table>
      ${
        booking.message
          ? `<div style="margin-top:20px;padding:20px;background:#f1f7fe;border-radius:16px"><p style="margin:0;font-size:15px;line-height:1.6;color:#08090b;white-space:pre-wrap">${escapeHtml(booking.message)}</p></div>`
          : ""
      }
      ${booking.meetingUrl && booking.mode === "VIDEO" ? button(booking.meetingUrl, "Lien de la visio") : ""}`);

  return send({
    from,
    to: studio,
    replyTo: booking.email,
    subject: `Rendez-vous — ${booking.name}, ${day} à ${time}`,
    html,
    attachments: [
      { filename: "invitation.ics", content: Buffer.from(invitation(booking, "REQUEST", "fr")) },
    ],
  });
}

/** Annulation : prévient les deux côtés et retire l'évènement des agendas. */
export async function sendBookingCancellation(booking: BookingEmail, rebookUrl: string) {
  const lang = booking.locale;
  const c = copy[lang];
  const visitor = when(booking.startsAt, lang);
  const fr = when(booking.startsAt, "fr");

  const visitorHtml = shell(`
      <h1 style="margin:0 0 12px;font-size:26px;letter-spacing:-.03em;color:#08090b">${c.cancelTitle}</h1>
      <p style="margin:0 0 8px;font-size:15px;color:#08090b"><s>${escapeHtml(visitor.day)} ${c.at} ${visitor.time}</s></p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:rgba(8,9,11,.7)">${c.cancelBody}</p>
      ${button(rebookUrl, c.rebook)}`);

  return Promise.allSettled([
    send({
      from,
      to: booking.email,
      replyTo: studio,
      subject: c.cancelSubject(visitor.day, visitor.time),
      html: visitorHtml,
      attachments: [
        { filename: "annulation.ics", content: Buffer.from(invitation(booking, "CANCEL", lang)) },
      ],
    }),
    send({
      from,
      to: studio,
      replyTo: booking.email,
      subject: `Rendez-vous annulé — ${booking.name}, ${fr.day} à ${fr.time}`,
      html: shell(
        `<h1 style="margin:0 0 12px;font-size:24px;letter-spacing:-.03em;color:#08090b">Rendez-vous annulé</h1><p style="margin:0;font-size:15px;color:#08090b">${escapeHtml(booking.name)} — ${escapeHtml(fr.day)} à ${fr.time}</p>`,
      ),
      attachments: [
        { filename: "annulation.ics", content: Buffer.from(invitation(booking, "CANCEL", "fr")) },
      ],
    }),
  ]);
}
