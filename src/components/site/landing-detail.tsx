import { getTranslations } from "next-intl/server";

import { ContentSections, variantFor } from "@/components/site/content-sections";
import { FaqList } from "@/components/site/faq-list";
import { JsonLd } from "@/components/site/json-ld";
import {
  PlacePanel,
  SectionHead,
  StackSection,
} from "@/components/site/landing-sections";
import { HeroStats, PageHero, type HeroStat } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { CtaPanel } from "@/components/site/sections/cta-panel";
import { ServiceCard } from "@/components/site/service-card";
import { Tag } from "@/components/ui/chip";
import { Reveal } from "@/components/ui/reveal";
import { getPathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import type { LandingKind } from "@/generated/prisma/enums";
import type { getLandingBySlug } from "@/lib/content";
import { getSiteUrl, siteConfig } from "@/lib/site";
import {
  breadcrumbSchema,
  faqSchema,
  graph,
  serviceSchema,
} from "@/lib/structured-data";

type Landing = NonNullable<Awaited<ReturnType<typeof getLandingBySlug>>>;

/** Choisit la traduction d'une FAQ sans multiplier les lignes en base. */
function localized(faq: Landing["landing"]["faqs"][number], locale: AppLocale) {
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

/** Les villes de Provence ont un établissement derrière, les pays non. */
const ON_SITE_KEYS = new Set(["aix-en-provence", "marseille"]);

/**
 * Page sectorielle ou géographique.
 *
 * Deux pages ne se ressemblent pas, et c'est délibéré : la variante tirée de
 * la clé de la page décide à la fois de la mise en page des sections de
 * contenu et de **l'ordre des blocs**. Une page peut donc ouvrir sur la
 * preuve et finir sur les expertises, une autre faire l'inverse, sans qu'on
 * ait à maintenir onze gabarits séparés.
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
  const isSector = kind === "SECTOR";
  const onSite = ON_SITE_KEYS.has(landing.key);
  const v = variantFor(landing.key);

  // Les technologies viennent des projets liés : la liste reste vraie sans
  // être entretenue, et les doublons entre projets sont fusionnés.
  const stack = [...new Set(landing.projects.flatMap((project) => project.stack))];

  const metricLabel = (metric: { labelFr: string; labelEn: string; labelEs: string }) =>
    locale === "fr" ? metric.labelFr : locale === "en" ? metric.labelEn : metric.labelEs;

  const toCard = (project: Landing["landing"]["projects"][number]) => ({
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
      label: metricLabel(metric),
    })),
  });

  const stats: HeroStat[] = [
    { value: String(landing.projects.length), label: t("statProjects") },
    { value: String(landing.services.length), label: t("statServices") },
    {
      value: isSector ? String(siteConfig.markets.length) : String(stack.length || 3),
      label: isSector ? t("statMarkets") : t("statStack"),
    },
    { value: String(siteConfig.stats.locales), label: t("statLocales") },
  ];

  const base = getSiteUrl();
  const pathname = isSector ? "/sectors/[slug]" : "/locations/[slug]";
  const indexPathname = isSector ? "/sectors" : "/locations";
  const url = `${base}${getPathname({
    locale,
    href: { pathname, params: { slug: translation.slug } },
  })}`;

  // Le `FAQPage` n'est déclaré que si des questions existent réellement :
  // Google signale un bloc vide comme invalide.
  const pageGraph = graph(
    serviceSchema(base, {
      name: translation.title,
      description: translation.lead,
      url,
    }),
    breadcrumbSchema([
      {
        name: isSector ? t("sectorsTitle") : t("locationsTitle"),
        url: `${base}${getPathname({ locale, href: indexPathname })}`,
      },
      { name: translation.title, url },
    ]),
    ...(faqs.length > 0 ? [faqSchema(faqs)] : []),
  );

  const content = (
    <ContentSections key="content" markdown={translation.body} seed={landing.key} />
  );

  const proof =
    landing.projects.length > 0 ? (
      <section key="proof" className="py-[clamp(2.75rem,6vh,4.5rem)]">
        <div className="page-shell">
          <SectionHead chip={t("proofChip")} title={t("proof")} lead={t("proofLead")} />
          <div
            className={
              landing.projects.length === 1 ? "grid gap-3" : "grid gap-3 lg:grid-cols-2"
            }
          >
            {landing.projects.map((project, index) => (
              <Reveal key={project.id} delay={(index % 3) as 0 | 1 | 2}>
                <ProjectCard
                  size={landing.projects.length === 1 ? "wide" : "narrow"}
                  project={toCard(project)}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    ) : null;

  const services =
    landing.services.length > 0 ? (
      <section key="services" className="py-[clamp(2.75rem,6vh,4.5rem)]">
        <div className="page-shell">
          <SectionHead
            chip={t("servicesChip")}
            title={t("relatedServices")}
            lead={t("relatedServicesLead")}
          />
          <div
            className={
              v.gridCols === 3
                ? "grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                : "grid gap-3 sm:grid-cols-2"
            }
          >
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
    ) : null;

  const stackSection = (
    <StackSection
      key="stack"
      items={stack}
      title={t("stackTitle")}
      lead={t("stackLead")}
    />
  );

  const place = !isSector ? (
    <PlacePanel
      key="place"
      onSite={onSite}
      title={t("placeTitle")}
      lead={onSite ? t("placeOnSiteLead") : t("placeRemoteLead")}
      addressLabel={t("placeAddress")}
      remoteLabel={t("placeRemote")}
      coverageLabel={t("placeCoverage")}
      coverage={siteConfig.markets.map((market) => market.label)}
      points={[t("placePoint1"), t("placePoint2"), t("placePoint3")]}
    />
  ) : null;

  // L'ordre des blocs dépend de la page : une page secteur peut ouvrir sur la
  // preuve ou sur le propos, une page de marché sur le lieu ou sur le propos.
  const body = isSector
    ? v.mirrored
      ? [proof, content, stackSection, services]
      : [content, proof, services, stackSection]
    : v.mirrored
      ? [place, content, proof, stackSection, services]
      : [content, place, services, proof, stackSection];

  return (
    <>
      <JsonLd data={pageGraph} />

      <PageHero
        chip={isSector ? t("sectorChip") : t("locationChip")}
        title={translation.title}
        lead={translation.lead}
        aside={<HeroStats stats={stats} />}
      >
        {landing.highlights.length > 0 ? (
          <ul className="mt-7 flex flex-wrap gap-1.5">
            {landing.highlights.map((highlight) => (
              <li key={highlight}>
                <Tag tone="dark">{highlight}</Tag>
              </li>
            ))}
          </ul>
        ) : null}
      </PageHero>

      {body}

      {faqs.length > 0 ? (
        <section className="py-[clamp(2.75rem,6vh,4.5rem)]">
          <div className="page-shell">
            <SectionHead chip={t("faqChip")} title={t("faq")} />
            <FaqList items={faqs} />
          </div>
        </section>
      ) : null}

      <CtaPanel />
    </>
  );
}
