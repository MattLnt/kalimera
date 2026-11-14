import { Ear, MessageSquareQuote, Route } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BookingWidget } from "./booking-widget";

import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { bookingConfig } from "@/lib/booking/config";
import { getAvailability, getBookingConfig } from "@/lib/booking/service";
import { buildAlternates } from "@/lib/seo";

/**
 * Les créneaux changent à chaque réservation : la page est rendue à la
 * demande, jamais servie depuis un cache.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: buildAlternates("/book"),
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, days, config] = await Promise.all([getTranslations("booking"), getAvailability(), getBookingConfig()]);

  const steps = [
    { icon: Ear, title: t("aside1Title"), body: t("aside1Body") },
    { icon: MessageSquareQuote, title: t("aside2Title"), body: t("aside2Body") },
    { icon: Route, title: t("aside3Title"), body: t("aside3Body") },
  ];

  return (
    <>
      <PageHero chip={t("chip")} title={t("title")} lead={t("lead")} />

      <section className="py-[clamp(3rem,8vh,5rem)]">
        <div className="page-shell grid items-stretch gap-3 lg:grid-cols-[1fr_320px]">
          <Reveal className="h-full">
            <BookingWidget
              days={days}
              timeZone={bookingConfig.timeZone}
              durationMinutes={config.durationMinutes}
            />
          </Reveal>

          <Reveal delay={1} className="flex flex-col gap-3">
            <div className="surface-card flex-1 p-6">
              <h2 className="mb-5 font-display text-[1.0625rem] font-bold tracking-[-0.02em]">
                {t("asideTitle")}
              </h2>
              <ol className="grid gap-5">
                {steps.map((step, index) => (
                  <li key={step.title} className="flex gap-3.5">
                    <span className="relative grid size-10 shrink-0 place-items-center rounded-field bg-aegean-100 text-aegean-700">
                      <step.icon className="size-5" />
                      <span className="absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full bg-aegean-600 font-display text-[0.6875rem] font-bold text-white">
                        {index + 1}
                      </span>
                    </span>
                    <span>
                      <span className="block font-display text-[0.9375rem] font-bold tracking-[-0.01em]">
                        {step.title}
                      </span>
                      <span className="mt-0.5 block text-[0.875rem] leading-relaxed text-[var(--ink-65)]">
                        {step.body}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="surface-card p-6">
              <p className="font-display text-[0.9375rem] font-bold">{t("asideAlt")}</p>
              <Link
                href="/contact"
                className="mt-1 inline-block font-display text-[0.875rem] font-bold text-aegean-700 hover:text-aegean-900"
              >
                {t("asideAltCta")} →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
