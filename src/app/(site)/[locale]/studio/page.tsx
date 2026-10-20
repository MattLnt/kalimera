import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/site/page-hero";
import { CtaPanel } from "@/components/site/sections/cta-panel";
import { Process } from "@/components/site/sections/process";
import { StackMarquee } from "@/components/site/sections/stack-marquee";
import { StatsPanel } from "@/components/site/sections/stats-panel";
import { StudioBento } from "@/components/site/sections/studio-bento";
import type { AppLocale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "studio" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates("/studio"),
  };
}

export default async function StudioPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("studio");

  return (
    <>
      <PageHero chip={t("title")} title={t("title")} lead={t("intro")} />
      <StackMarquee />
      <StudioBento />
      <StatsPanel />
      <Process />
      <CtaPanel />
    </>
  );
}
