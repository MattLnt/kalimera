import { Clock, Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ContactForm } from "./contact-form";

import { PageHero } from "@/components/site/page-hero";
import { Reveal } from "@/components/ui/reveal";
import type { AppLocale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/seo";
import { ContactLink } from "@/components/site/contact-link";
import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates("/contact"),
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <PageHero chip={t("title")} title={t("title")} lead={t("intro")} />

      <section className="py-[clamp(3rem,8vh,5rem)]">
        <div className="page-shell grid items-start gap-3 lg:grid-cols-[1fr_340px]">
          <Reveal>
            <ContactForm />
          </Reveal>

          <Reveal delay={1} className="grid gap-3">
            <InfoCard
              icon={<Mail className="size-5" />}
              kind="email"
              label={t("directEmail")}
              value={siteConfig.email}
              href={`mailto:${siteConfig.email}`}
            />
            <InfoCard
              icon={<Phone className="size-5" />}
              kind="phone"
              label={t("directPhone")}
              value={siteConfig.phone}
              href={`tel:${siteConfig.phoneHref}`}
            />
            <div className="surface-card flex items-start gap-4 p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-field bg-aegean-100 text-aegean-700">
                <Clock className="size-5" />
              </span>
              <p className="font-display text-[0.9375rem] font-bold tracking-[-0.02em]">
                {t("responseTime")}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function InfoCard({
  icon,
  kind,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  /** Conditionne la conversion envoyée : appel ou e-mail. */
  kind: "phone" | "email";
  label: string;
  value: string;
  href: string;
}) {
  return (
    <ContactLink
      kind={kind}
      href={href}
      className="surface-card surface-card-hover flex items-start gap-4 p-6"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-field bg-aegean-100 text-aegean-700">
        {icon}
      </span>
      <span>
        <span className="block font-display text-xs font-semibold text-[var(--ink-45)]">
          {label}
        </span>
        <span className="mt-0.5 block font-display text-[0.9375rem] font-bold tracking-[-0.02em] break-all">
          {value}
        </span>
      </span>
    </ContactLink>
  );
}
