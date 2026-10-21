import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/site/json-ld";
import { LandingIndex } from "@/components/site/landing-index";
import { PageHero } from "@/components/site/page-hero";
import { CtaPanel } from "@/components/site/sections/cta-panel";
import { LandingKind } from "@/generated/prisma/enums";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getLandings } from "@/lib/content";
import { toDbLocale } from "@/lib/locale";
import { buildAlternates } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { breadcrumbSchema, graph } from "@/lib/structured-data";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "landings" });
  return {
    title: t("sectorsTitle"),
    description: t("sectorsIntro"),
    alternates: buildAlternates("/sectors"),
  };
}

export default async function SectorsPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, sectors] = await Promise.all([
    getTranslations("landings"),
    getLandings(toDbLocale(locale), LandingKind.SECTOR),
  ]);

  const base = getSiteUrl();
  const url = `${base}${getPathname({ locale, href: "/sectors" })}`;

  return (
    <>
      <JsonLd
        data={graph(breadcrumbSchema([{ name: t("sectorsTitle"), url }]))}
      />

      <PageHero
        chip={t("sectorChip")}
        title={t("sectorsTitle")}
        lead={t("sectorsIntro")}
      />

      <section className="py-[clamp(3rem,8vh,5rem)]">
        <LandingIndex
          pathname="/sectors/[slug]"
          items={sectors.map((sector) => ({
            id: sector.id,
            slug: sector.translations[0].slug,
            title: sector.translations[0].title,
            lead: sector.translations[0].lead,
            icon: sector.icon,
            highlights: sector.highlights,
          }))}
        />
      </section>

      <CtaPanel />
    </>
  );
}
