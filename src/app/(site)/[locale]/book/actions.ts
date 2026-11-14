"use server";

import { headers } from "next/headers";
import { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { Locale as DbLocale } from "@/generated/prisma/enums";
import {
  sendBookingCancellation,
  sendBookingConfirmation,
  sendBookingNotification,
} from "@/lib/booking/emails";
import { bookUrl, getBookingConfig, getBusy, meetingUrlFor, newToken, toEmail } from "@/lib/booking/service";
import { isSlotAvailable } from "@/lib/booking/slots";
import { linkInboundClient } from "@/lib/crm/intake";
import { redirect } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";

type Field = "slot" | "name" | "email" | "phone" | "consent" | "form";

export type BookingState =
  | { status: "idle" }
  | { status: "error"; errors: Partial<Record<Field, string>>; slotTaken?: boolean }
  | {
      status: "success";
      booking: {
        startsAt: string;
        endsAt: string;
        mode: "VIDEO" | "PHONE";
        meetingUrl: string | null;
        token: string;
        email: string;
      };
    };

const schema = z
  .object({
    slot: z.iso.datetime(),
    mode: z.enum(["VIDEO", "PHONE"]),
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().email().max(180),
    company: z.string().trim().max(160).optional().or(z.literal("")),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    topic: z.string().trim().max(120).optional().or(z.literal("")),
    message: z.string().trim().max(3000).optional().or(z.literal("")),
    consent: z.literal("on"),
    locale: z.enum(["fr", "en", "es"]),
    website: z.string().max(0).optional().or(z.literal("")),
  })
  // Un appel téléphonique sans numéro n'a pas de sens.
  .refine((data) => data.mode !== "PHONE" || (data.phone ?? "").length >= 6, {
    path: ["phone"],
  });

const messages: Record<AppLocale, Record<Exclude<Field, "form"> | "taken" | "busy", string>> = {
  fr: {
    slot: "Choisissez un créneau.",
    name: "Indiquez votre nom.",
    email: "Cette adresse e-mail ne semble pas valide.",
    phone: "Indiquez un numéro pour que nous puissions vous appeler.",
    consent: "Merci d'accepter le traitement de vos données pour ce rendez-vous.",
    taken: "Ce créneau vient d'être réservé. Choisissez-en un autre, le calendrier est à jour.",
    busy: "Trop de tentatives. Réessayez dans quelques minutes, ou écrivez-nous.",
  },
  en: {
    slot: "Pick a slot.",
    name: "Please enter your name.",
    email: "This email address doesn't look valid.",
    phone: "Please give a number so we can call you.",
    consent: "Please accept the processing of your data for this appointment.",
    taken: "This slot has just been booked. Please pick another — the calendar is up to date.",
    busy: "Too many attempts. Try again in a few minutes, or email us.",
  },
  es: {
    slot: "Elige una franja.",
    name: "Indica tu nombre.",
    email: "Este correo no parece válido.",
    phone: "Indica un número para que podamos llamarte.",
    consent: "Acepta el tratamiento de tus datos para esta cita.",
    taken: "Esta franja acaba de reservarse. Elige otra: el calendario está actualizado.",
    busy: "Demasiados intentos. Vuelve a intentarlo en unos minutos o escríbenos.",
  },
};

const attempts = new Map<string, { count: number; resetAt: number }>();
function rateLimited(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + 10 * 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 6;
}

export async function bookCall(_previous: BookingState, formData: FormData): Promise<BookingState> {
  const raw = Object.fromEntries(formData) as Record<string, string>;
  const locale = (["fr", "en", "es"].includes(raw.locale) ? raw.locale : "fr") as AppLocale;
  const m = messages[locale];

  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    if (parsed.error.issues.some((issue) => issue.path[0] === "website")) {
      // Piège à robots : on ne dit rien, on n'enregistre rien.
      return { status: "idle" };
    }
    const errors: Partial<Record<Field, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "slot" || field === "name" || field === "email" || field === "phone" || field === "consent") {
        errors[field] = m[field];
      }
    }
    return { status: "error", errors };
  }

  const headerList = await headers();
  const ip =
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? headerList.get("x-real-ip") ?? "unknown";
  if (rateLimited(ip)) return { status: "error", errors: { form: m.busy } };

  const data = parsed.data;
  const startsAt = new Date(data.slot);
  const config = await getBookingConfig();
  const endsAt = new Date(startsAt.getTime() + config.durationMinutes * 60_000);
  const token = newToken();

  let booking;
  try {
    // Vérification et écriture dans la même transaction sérialisable : deux
    // visiteurs qui valident le même créneau à la même seconde ne peuvent pas
    // l'obtenir tous les deux.
    booking = await prisma.$transaction(
      async (tx) => {
        const busy = await getBusy(tx, new Date(), config);
        if (!isSlotAvailable(startsAt.toISOString(), busy, new Date(), config)) return null;
        return tx.booking.create({
          data: {
            startsAt,
            endsAt,
            mode: data.mode,
            name: data.name,
            email: data.email.toLowerCase(),
            company: data.company || null,
            phone: data.phone || null,
            topic: data.topic || null,
            message: data.message || null,
            locale: locale.toUpperCase() as DbLocale,
            meetingUrl: data.mode === "VIDEO" ? meetingUrlFor(token) : null,
            token,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
  } catch (error) {
    // Conflit de sérialisation : l'autre réservation est passée la première.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
      booking = null;
    } else {
      console.error("[booking] enregistrement impossible", error);
      return { status: "error", errors: { form: m.busy } };
    }
  }

  if (!booking) {
    return { status: "error", errors: { slot: m.taken }, slotTaken: true };
  }

  // Le rendez-vous est enregistré : un e-mail qui échoue ne le perd pas.
  // Fiche client retrouvée ou créée, pour retrouver l'appel dans le CRM.
  const clientId = await linkInboundClient({
    name: booking.name,
    email: booking.email,
    company: booking.company,
    phone: booking.phone,
    source: "Rendez-vous en ligne",
    activity: "Appel réservé en ligne",
  });
  if (clientId) {
    await prisma.booking.update({ where: { id: booking.id }, data: { clientId } }).catch(() => null);
  }

  const email = toEmail(booking);
  await Promise.allSettled([sendBookingConfirmation(email), sendBookingNotification(email)]);

  return {
    status: "success",
    booking: {
      startsAt: booking.startsAt.toISOString(),
      endsAt: booking.endsAt.toISOString(),
      mode: booking.mode,
      meetingUrl: booking.meetingUrl,
      token: booking.token,
      email: booking.email,
    },
  };
}

/** Annulation depuis le lien reçu par e-mail. */
export async function cancelBooking(formData: FormData) {
  const token = String(formData.get("token") ?? "");
  if (!token) return;

  const booking = await prisma.booking.findUnique({ where: { token } });
  if (!booking || booking.status !== "CONFIRMED" || booking.startsAt < new Date()) return;

  const cancelled = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });

  const locale = cancelled.locale.toLowerCase() as AppLocale;
  await sendBookingCancellation(toEmail(cancelled), bookUrl(locale));

  // Recharge la page de gestion, qui affiche désormais l'état annulé.
  redirect({ href: { pathname: "/book/[token]", params: { token } }, locale });
}
