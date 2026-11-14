import "server-only";

import { randomBytes } from "node:crypto";

import { cache } from "react";

import type { Booking } from "@/generated/prisma/client";
import { bookingConfig, type BookingConfig } from "@/lib/booking/config";
import type { BookingEmail } from "@/lib/booking/emails";
import { readExternalCalendar } from "@/lib/booking/external";
import { computeAvailability, type Busy } from "@/lib/booking/slots";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

type Db = Pick<typeof prisma, "booking" | "bookingBlock">;

/** Les plages d'un jour, nettoyées : heures valides, début avant la fin, triées. */
function cleanWeekly(raw: unknown): BookingConfig["weekly"] | null {
  if (!raw || typeof raw !== "object") return null;
  const weekly: BookingConfig["weekly"] = {};
  for (const [day, ranges] of Object.entries(raw as Record<string, unknown>)) {
    if (!Array.isArray(ranges)) continue;
    const ok = ranges
      .filter((r): r is [string, string] => Array.isArray(r) && /^\d\d:\d\d$/.test(r[0]) && /^\d\d:\d\d$/.test(r[1]) && r[0] < r[1])
      .sort((a, b) => a[0].localeCompare(b[0]));
    if (ok.length) weekly[Number(day)] = ok;
  }
  return weekly;
}

/**
 * Règles en vigueur : celles enregistrées dans l'admin (Agenda ›
 * Disponibilités), sinon les valeurs par défaut de `config.ts`.
 */
export const getBookingConfig = cache(async (): Promise<BookingConfig> => {
  const row = await prisma.bookingSettings.findUnique({ where: { id: "default" } }).catch(() => null);
  if (!row) return bookingConfig;
  return {
    ...bookingConfig,
    durationMinutes: row.durationMinutes,
    stepMinutes: row.stepMinutes,
    bufferMinutes: row.bufferMinutes,
    minNoticeHours: row.minNoticeHours,
    horizonDays: row.horizonDays,
    maxPerDay: row.maxPerDay,
    weekly: cleanWeekly(row.weekly) ?? bookingConfig.weekly,
    blackoutDates: row.blackoutDates,
    busyCalendarUrl: row.busyCalendarUrl,
  };
});

/**
 * Tout ce qui occupe l'horizon : rendez-vous confirmés, créneaux bloqués à
 * la main, et évènements de l'agenda externe s'il est branché.
 */
export async function getBusy(db: Db = prisma, now = new Date(), config?: BookingConfig): Promise<Busy[]> {
  const rules = config ?? (await getBookingConfig());
  const until = new Date(now.getTime() + (rules.horizonDays + 1) * 86_400_000);
  const [bookings, blocks, external] = await Promise.all([
    db.booking.findMany({
      where: { status: "CONFIRMED", endsAt: { gte: now }, startsAt: { lte: until } },
      select: { startsAt: true, endsAt: true },
    }),
    db.bookingBlock.findMany({ where: { endsAt: { gte: now }, startsAt: { lte: until } }, select: { startsAt: true, endsAt: true } }),
    rules.busyCalendarUrl ? readExternalCalendar(rules.busyCalendarUrl, now, until) : Promise.resolve({ events: [], error: null }),
  ]);
  return [
    ...bookings,
    ...blocks.map((block) => ({ ...block, counts: false })),
    ...external.events.map(({ startsAt, endsAt }) => ({ startsAt, endsAt, counts: false })),
  ];
}

export async function getAvailability() {
  const config = await getBookingConfig();
  return computeAvailability(await getBusy(prisma, new Date(), config), new Date(), config);
}

/** Jeton du lien de gestion : impossible à deviner, propre dans une URL. */
export function newToken() {
  return randomBytes(18).toString("base64url");
}

/**
 * Lien de visio. Une salle fixe (Google Meet, Zoom…) se règle dans
 * `BOOKING_MEETING_URL` ; à défaut, une salle Jitsi unique par rendez-vous,
 * qui ne demande aucun compte au visiteur.
 */
export function meetingUrlFor(token: string) {
  const fixed = process.env.BOOKING_MEETING_URL;
  if (fixed) return fixed;
  return `https://meet.jit.si/Kalimera-${token.slice(0, 12)}`;
}

export function manageUrl(token: string, locale: AppLocale) {
  return `${getSiteUrl()}${getPathname({ href: { pathname: "/book/[token]", params: { token } }, locale })}`;
}

export function bookUrl(locale: AppLocale) {
  return `${getSiteUrl()}${getPathname({ href: "/book", locale })}`;
}

export function toEmail(booking: Booking): BookingEmail {
  const locale = booking.locale.toLowerCase() as AppLocale;
  return {
    id: booking.id,
    startsAt: booking.startsAt,
    endsAt: booking.endsAt,
    mode: booking.mode,
    name: booking.name,
    email: booking.email,
    company: booking.company,
    phone: booking.phone,
    topic: booking.topic,
    message: booking.message,
    meetingUrl: booking.meetingUrl,
    locale,
    manageUrl: manageUrl(booking.token, locale),
  };
}
