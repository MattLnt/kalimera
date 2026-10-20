import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { CtaPanel } from "@/components/site/sections/cta-panel";
import { Button } from "@/components/ui/button";
import { Prose } from "@/components/ui/prose";
import { Reveal } from "@/components/ui/reveal";
import { Tag } from "@/components/ui/chip";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getServiceBySlug, getServiceSlugs } from "@/lib/content";
import { toAppLocale, toDbLocale } from "@/lib/locale";
import { buildAlternates } from "@/lib/seo";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
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
  const translation = await getServiceBySlug(toDbLocale(locale), slug);
  if (!translation) return {};

  const paramsByLocale = Object.fromEntries(
    translation.service.translations.map((item) => [
      toAppLocale(item.locale),
      { slug: item.slug },
    ]),
  );

  return {
    title: translation.seoTitle ?? translation.title,
    description: translation.seoDescription ?? translation.summary,
    alternates: buildAlternates("/services/[slug]", paramsByLocale, locale),
    openGraph: {
      title: translation.seoTitle ?? translation.title,
      description: translation.seoDescription ?? translation.summary,
      type: "article",
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const translation = await getServiceBySlug(toDbLocale(locale), slug);
  if (!translation) notFound();

  const t = await getTranslations("services");
  const { service } = translation;

  return (
    <>
      <PageHero chip={t("title")} title={translation.title} lead={translation.summary}>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {service.stack.map((item) => (
            <Tag key={item} tone="dark">
              {item}
            </Tag>
          ))}
        </div>
      </PageHero>

      <section className="py-[clamp(3rem,8vh,5rem)]">
        <div className="page-shell">
          <Reveal className="surface-card p-6 sm:p-10 lg:p-14">
            <Prose content={translation.body} />
          </Reveal>
        </div>
      </section>

      {service.projects.length > 0 ? (
        <section className="pb-[clamp(3rem,8vh,5rem)]">
          <div className="page-shell">
            <h2 className="display-2 mb-8">{t("related")}</h2>
            <div className="grid gap-3 lg:grid-cols-2">
              {service.projects.map((project, index) => (
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

      <div className="page-shell pb-[clamp(3rem,8vh,5rem)]">
        <Button asChild variant="line">
          <Link href="/services">{t("backToAll")}</Link>
        </Button>
      </div>

      <CtaPanel />
    </>
  );
}
