import { getTranslations } from "next-intl/server";

import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { CtaPanel } from "@/components/site/sections/cta-panel";
import { ServiceCard } from "@/components/site/service-card";
import { Tag } from "@/components/ui/chip";
import { Prose } from "@/components/ui/prose";
import { Reveal } from "@/components/ui/reveal";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { LandingKind } from "@/generated/prisma/enums";
import type { getLandingBySlug } from "@/lib/content";
import { getSiteUrl } from "@/lib/site";
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  serviceSchema,
} from "@/lib/structured-data";

type Landing = NonNullable<Awaited<ReturnType<typeof getLandingBySlug>>>;

/** Choisit la traduction d'une FAQ sans multiplier les lignes en base. */
function localized(
  faq: Landing["landing"]["faqs"][number],
  locale: AppLocale,
) {
  if (locale === "en") {
    return {
      question: faq.questionEn || faq.questionFr,
      answer: faq.answerEn || faq.answerFr,
    };
  }
  if (locale === "es") {
    return {
      question: faq.questionEs || faq.questionFr,
      answer: faq.answerEs || faq.answerFr,
    };
  }
  return { question: faq.questionFr, answer: faq.answerFr };
}

/**
 * Page sectorielle ou géographique.
 *
 * Les deux familles partagent exactement la même mise en page : une promesse,
 * un corps rédigé, les services concernés, les réalisations qui les prouvent,
 * et les questions fréquentes. Seules la route et l'étiquette changent, d'où
 * un composant unique plutôt que deux copies à maintenir.
 */
export async function LandingDetail({
  translation,
  locale,
  kind,
}: {
  translation: Landing;
  locale: AppLocale;
  kind: LandingKind;
}) {
  const t = await getTranslations("landings");
  const { landing } = translation;
  const faqs = landing.faqs.map((faq) => localized(faq, locale));

  const base = getSiteUrl();
  const pathname = kind === "SECTOR" ? "/sectors/[slug]" : "/locations/[slug]";
  const indexPathname = kind === "SECTOR" ? "/sectors" : "/locations";
  const url = `${base}${getPathname({
    locale,
    href: { pathname, params: { slug: translation.slug } },
  })}`;

  // Le `FAQPage` n'est déclaré que si des questions existent réellement :
  // un bloc vide est signalé comme invalide par Google.
  const pageGraph = graph(
    serviceSchema(base, {
      name: translation.title,
      description: translation.lead,
      url,
    }),
    breadcrumbSchema([
      {
        name: kind === "SECTOR" ? t("sectorsTitle") : t("locationsTitle"),
        url: `${base}${getPathname({ locale, href: indexPathname })}`,
      },
      { name: translation.title, url },
    ]),
    ...(faqs.length > 0 ? [faqSchema(faqs)] : []),
  );

  return (
    <>
      <JsonLd data={pageGraph} />

      <PageHero
        chip={kind === "SECTOR" ? t("sectorChip") : t("locationChip")}
        title={translation.title}
        lead={translation.lead}
      >
        {landing.highlights.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-1.5">
            {landing.highlights.map((item) => (
              <Tag key={item} tone="dark">
                {item}
              </Tag>
            ))}
          </div>
        ) : null}
      </PageHero>

      <section className="py-[clamp(3rem,8vh,5rem)]">
        <div className="page-shell">
          <Reveal className="surface-card p-6 sm:p-10 lg:p-14">
            <Prose content={translation.body} />
          </Reveal>
        </div>
      </section>

      {landing.projects.length > 0 ? (
        <section className="pb-[clamp(3rem,8vh,5rem)]">
          <div className="page-shell">
            <h2 className="display-2 mb-8">{t("proof")}</h2>
            <div className="grid gap-3 lg:grid-cols-2">
              {landing.projects.map((project, index) => (
                <Reveal key={project.id} delay={(index % 3) as 0 | 1 | 2}>
                  <ProjectCard
                    size="narrow"
                    project={{
                      slug: project.translations[0].slug,
                      title: project.translations[0].title,
                      category: project.translations[0].category,
                      kind: project.kind,
                      accent: project.accent,
                      stack: project.stack,
                      liveUrl: project.liveUrl,
                      cover: project.coverImage
                        ? {
                            url: project.coverImage.url,
                            width: project.coverImage.width,
                            height: project.coverImage.height,
                            alt: project.coverImage.altFr,
                          }
                        : null,
                      metrics: project.metrics.map((metric) => ({
                        value: metric.value,
                        label:
                          locale === "fr"
                            ? metric.labelFr
                            : locale === "en"
                              ? metric.labelEn
                              : metric.labelEs,
                      })),
                    }}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {landing.services.length > 0 ? (
        <section className="pb-[clamp(3rem,8vh,5rem)]">
          <div className="page-shell">
            <h2 className="display-2 mb-8">{t("relatedServices")}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {landing.services.map((service, index) => (
                <Reveal key={service.id} delay={(index % 3) as 0 | 1 | 2}>
                  <ServiceCard
                    index={index}
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
          </div>
        </section>
      ) : null}

      {faqs.length > 0 ? (
        <section className="pb-[clamp(3rem,8vh,5rem)]">
          <div className="page-shell max-w-[70ch]">
            <h2 className="display-2 mb-8">{t("faq")}</h2>
            <div className="grid gap-2">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="surface-card group p-5 sm:p-6"
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-display text-[1.0625rem] font-bold tracking-[-0.02em]">
                    {faq.question}
                    <span
                      aria-hidden
                      className="mt-1 shrink-0 text-[var(--ink-45)] transition-transform duration-300 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-[0.9375rem] leading-[1.6] text-[var(--ink-65)]">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaPanel />
    </>
  );
}
