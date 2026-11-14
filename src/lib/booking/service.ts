import "server-only";

import { randomBytes } from "node:crypto";

import type { Booking } from "@/generated/prisma/client";
import { bookingConfig } from "@/lib/booking/config";
import type { BookingEmail } from "@/lib/booking/emails";
import { computeAvailability } from "@/lib/booking/slots";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

type Db = Pick<typeof prisma, "booking">;

/** Rendez-vous confirmés qui occupent l'horizon de réservation. */
export async function getBusy(db: Db = prisma, now = new Date()) {
  return db.booking.findMany({
    where: {
      status: "CONFIRMED",
      endsAt: { gte: now },
      startsAt: { lte: new Date(now.getTime() + (bookingConfig.horizonDays + 1) * 86_400_000) },
    },
    select: { startsAt: true, endsAt: true },
  });
}

export async function getAvailability() {
  return computeAvailability(await getBusy());
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
