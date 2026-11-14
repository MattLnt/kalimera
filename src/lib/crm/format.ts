/**
 * Formats d'affichage du CRM. Toujours en heure de Paris : le serveur tourne
 * en UTC, et une échéance au 31 ne doit pas s'afficher au 30.
 */

const TZ = "Europe/Paris";

const money = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
const moneyShort = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

/** 123456 → « 1 234,56 € » */
/** L'espace fine de Intl n'existe pas dans la police du site : espace insécable. */
const spaced = (text: string) => text.replace(/\u202f/g, "\u00a0");

export function formatMoney(cents: number | null | undefined) {
  return spaced(money.format((cents ?? 0) / 100));
}

/** 123456 → « 1 235 € », pour les tableaux de bord. */
export function formatMoneyShort(cents: number | null | undefined) {
  return spaced(moneyShort.format((cents ?? 0) / 100));
}

/** « 1 234,56 » ou « 1234.56 » → 123456. Renvoie null si illisible. */
export function parseMoney(input: string): number | null {
  const cleaned = input.replace(/\s|€/g, "").replace(",", ".");
  if (cleaned === "") return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? Math.round(value * 100) : null;
}

const dateFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, day: "numeric", month: "short", year: "numeric" });
const dateLong = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, day: "numeric", month: "long", year: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("fr-FR", {
  timeZone: TZ,
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});
const timeFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });

export const formatDate = (date: Date | null | undefined) => (date ? dateFmt.format(date) : "—");
export const formatDateLong = (date: Date | null | undefined) => (date ? dateLong.format(date) : "—");
export const formatDateTime = (date: Date | null | undefined) => (date ? dateTimeFmt.format(date) : "—");
export const formatTime = (date: Date | null | undefined) => (date ? timeFmt.format(date) : "—");

/** « il y a 3 j », « dans 2 h » — pour les fils d'activité. */
export function formatRelative(date: Date, now = new Date()) {
  const rtf = new Intl.RelativeTimeFormat("fr-FR", { numeric: "auto" });
  const diff = (date.getTime() - now.getTime()) / 1000;
  const abs = Math.abs(diff);
  if (abs < 60) return rtf.format(Math.round(diff), "second");
  if (abs < 3600) return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), "day");
  if (abs < 86400 * 365) return rtf.format(Math.round(diff / (86400 * 30)), "month");
  return rtf.format(Math.round(diff / (86400 * 365)), "year");
}

/** Date AAAA-MM-JJ pour un champ `<input type="date">`, en heure de Paris. */
export function toDateInput(date: Date | null | undefined) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}

/** « 2026-11-20 » saisi dans un formulaire → midi à Paris, à l'abri des décalages. */
export function fromDateInput(value: string | null | undefined) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return new Date(`${value}T11:00:00Z`);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    // Seuls les mots qui commencent par une lettre : « TEST — Dupont » → « TD ».
    .filter((part) => /^\p{L}/u.test(part))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

/** Il y a `days` jours, à l'instant près. */
export function daysAgo(days: number) {
  return new Date(Date.now() - days * 86_400_000);
}
