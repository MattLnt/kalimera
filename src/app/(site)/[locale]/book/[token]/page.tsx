import { CalendarX2 } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { cancelBooking } from "../actions";

import { PageHero } from "@/components/site/page-hero";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { bookingConfig } from "@/lib/booking/config";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** Page personnelle, atteinte par le lien de l'e-mail : jamais indexée. */
export const metadata: Metadata = { robots: { index: false, follow: false } };

const intlLocale = { fr: "fr-FR", en: "en-GB", es: "es-ES" } as const;

export default async function ManageBookingPage({
  params,
}: {
  params: Promise<{ locale: AppLocale; token: string }>;
}) {
  const { locale, token } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("booking");

  const booking = await prisma.booking.findUnique({ where: { token } });

  if (!booking) {
    return (
      <>
        <PageHero chip={t("chip")} title={t("manageNotFound")} />
        <section className="py-12">
          <div className="page-shell">
            <Button asChild variant="blue">
              <Link href="/book">{t("manageRebook")}</Link>
            </Button>
          </div>
        </section>
      </>
    );
  }

  const loc = intlLocale[locale];
  const day = new Intl.DateTimeFormat(loc, {
    timeZone: bookingConfig.timeZone,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(booking.startsAt);
  const time = new Intl.DateTimeFormat(loc, {
    timeZone: bookingConfig.timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(booking.startsAt);

  const cancelled = booking.status === "CANCELLED";
  const past = booking.startsAt < new Date();

  return (
    <>
      <PageHero chip={t("chip")} title={t("manageTitle")} />

      <section className="py-[clamp(3rem,8vh,5rem)]">
        <div className="page-shell max-w-[720px]">
          <div className="surface-card p-6 sm:p-10">
            <p
              className={`font-display text-[1.375rem] font-bold tracking-[-0.03em] first-letter:uppercase ${cancelled ? "line-through opacity-50" : ""}`}
            >
              {day}
            </p>
            <p className="mt-1 text-[var(--ink-65)]">
              {time} · {Math.round((booking.endsAt.getTime() - booking.startsAt.getTime()) / 60_000)} min · {t("zone")}
            </p>

            {cancelled ? (
              <p className="mt-6 rounded-field bg-amber-50 px-4 py-3 text-sm text-amber-800">
                {t("manageCancelled")}
              </p>
            ) : past ? (
              <p className="mt-6 text-sm text-[var(--ink-45)]">{t("managePast")}</p>
            ) : (
              <>
                {booking.mode === "VIDEO" && booking.meetingUrl ? (
                  <Button asChild variant="blue" className="mt-6">
                    <a href={booking.meetingUrl} target="_blank" rel="noreferrer noopener">
                      {t("successJoin")}
                    </a>
                  </Button>
                ) : (
                  <p className="mt-6 text-[var(--ink-65)]">{t("successPhone")}</p>
                )}

                <form action={cancelBooking} className="mt-8 border-t border-black/5 pt-6">
                  <input type="hidden" name="token" value={booking.token} />
                  <p className="mb-3 text-sm text-[var(--ink-45)]">{t("manageCancelHint")}</p>
                  <button
                    type="submit"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-red-50 px-5 py-2.5 font-display text-sm font-bold text-red-700 transition-colors hover:bg-red-100"
                  >
                    <CalendarX2 className="size-4" />
                    {t("manageCancel")}
                  </button>
                </form>
              </>
            )}

            {cancelled || past ? (
              <Button asChild variant="line" className="mt-6">
                <Link href="/book">{t("manageRebook")}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
