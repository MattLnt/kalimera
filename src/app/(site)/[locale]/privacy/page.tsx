import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/site/page-hero";
import { Prose } from "@/components/ui/prose";
import { privacyPolicy } from "@/content/legal";
import type { AppLocale } from "@/i18n/routing";
import { buildAlternates } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: privacyPolicy[locale].title,
    alternates: buildAlternates("/privacy"),
    robots: { index: false, follow: true },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = privacyPolicy[locale];

  return (
    <>
      <PageHero title={page.title} lead={page.updated} />
      <section className="py-[clamp(3rem,8vh,5rem)]">
        <div className="page-shell">
          <div className="surface-card mx-auto max-w-4xl p-6 sm:p-10 lg:p-14">
            <Prose content={page.body} />
          </div>
        </div>
      </section>
    </>
  );
}
