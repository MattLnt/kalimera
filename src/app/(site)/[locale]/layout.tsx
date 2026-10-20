import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import "@/styles/globals.css";

import { Analytics } from "@/components/site/analytics";
import { ConsentBanner } from "@/components/site/consent-banner";
import { JsonLd } from "@/components/site/json-ld";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { routing, type AppLocale } from "@/i18n/routing";
import { inter, manrope } from "@/lib/fonts";
import { htmlLocales, toDbLocale } from "@/lib/locale";
import { getSiteUrl, siteConfig } from "@/lib/site";
import {
  graph,
  localBusinessSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/structured-data";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};

  const t = await getTranslations({ locale, namespace: "meta" });
  const url = getSiteUrl();

  return {
    metadataBase: new URL(url),
    title: {
      default: t("defaultTitle"),
      template: `%s — ${t("siteName")}`,
    },
    description: t("defaultDescription"),
    applicationName: siteConfig.name,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
        es: "/es",
        "x-default": "/fr",
      },
    },
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      title: t("defaultTitle"),
      description: t("defaultDescription"),
      url: `${url}/${locale}`,
      locale: htmlLocales[locale as AppLocale],
    },
    twitter: {
      card: "summary_large_image",
      title: t("defaultTitle"),
      description: t("defaultDescription"),
    },
    robots: { index: true, follow: true },
  };
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Permet le rendu statique des pages de ce segment.
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "nav" });
  const meta = await getTranslations({ locale, namespace: "meta" });

  // Un seul graphe pour les trois entités : les `@id` s'y résolvent entre eux.
  const base = getSiteUrl();
  const description = meta("defaultDescription");
  const siteGraph = graph(
    organizationSchema(base, description),
    localBusinessSchema(base, description),
    websiteSchema(base, htmlLocales[locale as AppLocale], meta("siteName")),
  );

  return (
    <html lang={locale} className={`${manrope.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={siteGraph} />
        <Analytics />
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-300 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-display focus:text-sm focus:font-bold focus:text-white"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider>
          <SiteHeader />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <SiteFooter dbLocale={toDbLocale(locale)} />
          <ConsentBanner />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
