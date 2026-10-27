import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/site/json-ld";
import { LandingIndex } from "@/components/site/landing-index";

import { HeroStats, PageHero } from "@/components/site/page-hero";
import { CtaPanel } from "@/components/site/sections/cta-panel";
import { LandingKind } from "@/generated/prisma/enums";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getLandings } from "@/lib/content";
import { toDbLocale } from "@/lib/locale";
import { buildAlternates } from "@/lib/seo";
import { getSiteUrl, siteConfig } from "@/lib/site";
import { breadcrumbSchema, graph } from "@/lib/structured-data";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landings" });
  return {
    title: t("locationsTitle"),
    description: t("locationsIntro"),
    alternates: buildAlternates("/locations"),
  };
}

export default async function LocationsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, locations] = await Promise.all([
    getTranslations("landings"),
    getLandings(toDbLocale(locale), LandingKind.LOCATION),
  ]);

  const base = getSiteUrl();
  const url = `${base}${getPathname({ locale, href: "/locations" })}`;

  return (
    <>
      <JsonLd
        data={graph(breadcrumbSchema([{ name: t("locationsTitle"), url }]))}
      />

      <PageHero
        chip={t("locationChip")}
        title={t("locationsTitle")}
        lead={t("locationsIntro")}
        aside={<HeroStats stats={[
          { value: String(locations.length), label: t("statPages") },
          {
            value: String(
              locations.reduce((total, item) => total + item._count.projects, 0),
            ),
            label: t("statProjects"),
          },
          { value: String(siteConfig.markets.length), label: t("statMarkets") },
          { value: String(siteConfig.stats.locales), label: t("statLocales") },
        ]} />}
      />

      <section className="py-[clamp(3rem,8vh,5rem)]">
        <LandingIndex
          proofLabel={t("proofCount")}
          pathname="/locations/[slug]"
          items={locations.map((location) => ({
            id: location.id,
            slug: location.translations[0].slug,
            title: location.translations[0].title,
            lead: location.translations[0].lead,
            icon: location.icon,
            highlights: location.highlights,
            proofCount: location._count.projects,
          }))}
        />
      </section>

      <CtaPanel />
    </>
  );
}
