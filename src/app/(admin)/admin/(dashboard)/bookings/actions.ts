"use server";

import { revalidatePath } from "next/cache";

import type { AppLocale } from "@/i18n/routing";
import { assertAdmin, readString } from "@/lib/admin";
import { bookingConfig } from "@/lib/booking/config";
import { sendBookingCancellation } from "@/lib/booking/emails";
import { forgetExternalCalendar, readExternalCalendar } from "@/lib/booking/external";
import { zonedTimeToUtc } from "@/lib/booking/slots";
import { bookUrl, toEmail } from "@/lib/booking/service";
import { prisma } from "@/lib/prisma";

/** Annulation côté studio : le visiteur est prévenu et l'agenda mis à jour. */
export async function cancelBookingAsAdmin(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;

  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking || booking.status !== "CONFIRMED") return;

  const cancelled = await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED", cancelledAt: new Date() },
  });

  await sendBookingCancellation(
    toEmail(cancelled),
    bookUrl(cancelled.locale.toLowerCase() as AppLocale),
  );
  revalidatePath("/admin/bookings");
}

/* ------------------------------------------------------------ disponibilités */

export type AvailabilityInput = {
  durationMinutes: number;
  stepMinutes: number;
  bufferMinutes: number;
  minNoticeHours: number;
  horizonDays: number;
  maxPerDay: number;
  /** Jour de semaine (0 = dimanche) → plages [début, fin]. */
  weekly: Record<string, [string, string][]>;
  blackoutDates: string[];
  busyCalendarUrl: string;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Math.round(Number(value) || 0)));
const time = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Enregistre les règles de réservation ; la page publique les applique aussitôt. */
export async function saveAvailability(input: AvailabilityInput): Promise<{ ok: true } | { ok: false; error: string }> {
  await assertAdmin();

  const weekly: Record<string, [string, string][]> = {};
  for (const [day, ranges] of Object.entries(input.weekly ?? {})) {
    if (!/^[0-6]$/.test(day) || !Array.isArray(ranges)) continue;
    const clean = ranges
      .filter((r) => Array.isArray(r) && time.test(r[0]) && time.test(r[1]))
      .sort((a, b) => a[0].localeCompare(b[0]));
    for (const [from, to] of clean) {
      if (from >= to) return { ok: false, error: "Une plage finit avant de commencer." };
    }
    for (let i = 1; i < clean.length; i += 1) {
      if (clean[i][0] < clean[i - 1][1]) return { ok: false, error: "Deux plages du même jour se chevauchent." };
    }
    if (clean.length) weekly[day] = clean;
  }

  const url = (input.busyCalendarUrl ?? "").trim();
  if (url && !/^(https?|webcal):\/\//i.test(url)) return { ok: false, error: "L'adresse de l'agenda doit commencer par https:// ou webcal://." };

  const data = {
    durationMinutes: clamp(input.durationMinutes, 10, 240),
    stepMinutes: clamp(input.stepMinutes, 5, 240),
    bufferMinutes: clamp(input.bufferMinutes, 0, 120),
    minNoticeHours: clamp(input.minNoticeHours, 0, 24 * 14),
    horizonDays: clamp(input.horizonDays, 1, 365),
    maxPerDay: clamp(input.maxPerDay, 1, 30),
    weekly,
    blackoutDates: [...new Set((input.blackoutDates ?? []).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)))].sort(),
    busyCalendarUrl: url || null,
  };

  await prisma.bookingSettings.upsert({ where: { id: "default" }, create: { id: "default", ...data }, update: data });
  forgetExternalCalendar();
  revalidatePath("/admin/bookings");
  revalidatePath("/[locale]/book", "page");
  return { ok: true };
}

/** Teste l'adresse iCal avant de l'enregistrer. */
export async function testCalendarUrl(url: string): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  await assertAdmin();
  const now = new Date();
  forgetExternalCalendar();
  const result = await readExternalCalendar(url.trim(), now, new Date(now.getTime() + 30 * 86_400_000));
  return result.error ? { ok: false, error: result.error } : { ok: true, count: result.events.length };
}

/* ------------------------------------------------------------ créneaux bloqués */

export async function createBlock(input: { date: string; from: string; to: string; allDay: boolean; label: string }): Promise<{ ok: true } | { ok: false; error: string }> {
  await assertAdmin();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) return { ok: false, error: "Choisissez une date." };
  const from = input.allDay ? "00:00" : input.from;
  const to = input.allDay ? "23:59" : input.to;
  if (!time.test(from) || !time.test(to) || from >= to) return { ok: false, error: "L'heure de fin doit suivre l'heure de début." };
  await prisma.bookingBlock.create({
    data: {
      startsAt: zonedTimeToUtc(input.date, from, bookingConfig.timeZone),
      endsAt: zonedTimeToUtc(input.date, to, bookingConfig.timeZone),
      label: input.label.trim().slice(0, 80) || null,
    },
  });
  revalidatePath("/admin/bookings");
  return { ok: true };
}

export async function deleteBlock(formData: FormData) {
  await assertAdmin();
  const id = readString(formData, "id");
  if (!id) return;
  await prisma.bookingBlock.delete({ where: { id } }).catch(() => null);
  revalidatePath("/admin/bookings");
}
