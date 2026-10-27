import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/site/page-hero";
import { CtaPanel } from "@/components/site/sections/cta-panel";
import { Process } from "@/components/site/sections/process";
import { ServiceCard } from "@/components/site/service-card";
import { Reveal } from "@/components/ui/reveal";
import type { AppLocale } from "@/i18n/routing";
import { getServices } from "@/lib/content";
import { toDbLocale } from "@/lib/locale";
import { buildAlternates } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates("/services"),
  };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, services] = await Promise.all([
    getTranslations("services"),
    getServices(toDbLocale(locale)),
  ]);

  return (
    <>
      <PageHero chip={t("title")} title={t("title")} lead={t("intro")} />

      <section className="py-[clamp(3rem,8vh,5rem)]">
        <div className="page-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Huit services : sur trois colonnes, le dernier rang serait
              dépareillé. La carte de tête occupe donc deux colonnes et
              les neuf emplacements sont remplis — ce qui met au passage
              en avant l'offre qui porte le positionnement. */}
          {services.map((service, index) => (
            <Reveal
              key={service.id}
              delay={(index % 3) as 0 | 1 | 2}
              className={cn("h-full", index === 0 && "lg:col-span-2")}
            >
              <ServiceCard
                index={index}
                className="h-full"
                service={{
                  slug: service.translations[0].slug,
                  title: service.translations[0].title,
                  summary: service.translations[0].summary,
                  icon: service.icon,
                  stack: service.stack,
                }}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <Process />
      <CtaPanel />
    </>
  );
}
