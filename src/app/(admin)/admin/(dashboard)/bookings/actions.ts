"use server";

import { revalidatePath } from "next/cache";

import type { AppLocale } from "@/i18n/routing";
import { assertAdmin, readString } from "@/lib/admin";
import { sendBookingCancellation } from "@/lib/booking/emails";
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
