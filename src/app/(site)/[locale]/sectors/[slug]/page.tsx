import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { LandingDetail } from "@/components/site/landing-detail";
import { LandingKind } from "@/generated/prisma/enums";
import type { AppLocale } from "@/i18n/routing";
import { getLandingBySlug, getLandingSlugs } from "@/lib/content";
import { toAppLocale, toDbLocale } from "@/lib/locale";
import { buildAlternates } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getLandingSlugs(LandingKind.SECTOR);
  return slugs.map((item) => ({
    locale: toAppLocale(item.locale),
    slug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const translation = await getLandingBySlug(
    toDbLocale(locale),
    LandingKind.SECTOR,
    slug,
  );
  if (!translation) return {};

  const paramsByLocale = Object.fromEntries(
    translation.landing.translations.map((item) => [
      toAppLocale(item.locale),
      { slug: item.slug },
    ]),
  );

  return {
    title: translation.seoTitle ?? translation.title,
    description: translation.seoDescription ?? translation.lead,
    alternates: buildAlternates("/sectors/[slug]", paramsByLocale, locale),
    openGraph: {
      title: translation.seoTitle ?? translation.title,
      description: translation.seoDescription ?? translation.lead,
      type: "article",
    },
  };
}

export default async function SectorPage({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const translation = await getLandingBySlug(
    toDbLocale(locale),
    LandingKind.SECTOR,
    slug,
  );
  if (!translation) notFound();

  return (
    <LandingDetail
      translation={translation}
      locale={locale}
      kind={LandingKind.SECTOR}
    />
  );
}
