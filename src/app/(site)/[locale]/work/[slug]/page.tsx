import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/site/json-ld";
import { PageHero } from "@/components/site/page-hero";
import { CtaPanel } from "@/components/site/sections/cta-panel";
import { BrowserMockup, PhoneMockup } from "@/components/site/screen-mockup";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/chip";
import { Reveal } from "@/components/ui/reveal";
import { getPathname, Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { optimized } from "@/lib/cloudinary";
import { getNextProject, getProjectBySlug, getProjectSlugs } from "@/lib/content";
import { toAppLocale, toDbLocale } from "@/lib/locale";
import { buildAlternates } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { breadcrumbSchema, creativeWorkSchema, graph } from "@/lib/structured-data";

export const revalidate = 86400;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
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
  const translation = await getProjectBySlug(toDbLocale(locale), slug);
  if (!translation) return {};

  const paramsByLocale = Object.fromEntries(
    translation.project.translations.map((item) => [
      toAppLocale(item.locale),
      { slug: item.slug },
    ]),
  );

  return {
    title: translation.seoTitle ?? translation.title,
    description: translation.seoDescription ?? translation.summary,
    alternates: buildAlternates("/work/[slug]", paramsByLocale, locale),
    openGraph: {
      title: translation.seoTitle ?? translation.title,
      description: translation.seoDescription ?? translation.summary,
      type: "article",
      images: translation.project.coverImage
        ? [optimized(translation.project.coverImage.url, { width: 1200, height: 630 })]
        : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const dbLocale = toDbLocale(locale);
  const translation = await getProjectBySlug(dbLocale, slug);
  if (!translation) notFound();

  const t = await getTranslations("work");
  const { project } = translation;
  const next = await getNextProject(dbLocale, project.id, project.position);

  const altFor = (media: { altFr: string; altEn: string; altEs: string }) =>
    locale === "fr" ? media.altFr : locale === "en" ? media.altEn : media.altEs;

  const cover = project.coverImage
    ? {
        url: project.coverImage.url,
        width: project.coverImage.width,
        height: project.coverImage.height,
        alt: altFor(project.coverImage),
      }
    : null;

  const sections = [
    { label: t("challenge"), body: translation.challenge },
    { label: t("solution"), body: translation.solution },
    { label: t("outcome"), body: translation.outcome },
  ].filter((section) => section.body.trim().length > 0);

  // `CreativeWork` relie la réalisation à son URL publique via `sameAs` : le
  // lien entre le projet livré et le studio devient explicite pour Google.
  const base = getSiteUrl();
  const url = `${base}${getPathname({
    locale,
    href: { pathname: "/work/[slug]", params: { slug } },
  })}`;
  const pageGraph = graph(
    creativeWorkSchema(base, {
      name: translation.title,
      description: translation.summary,
      url,
      liveUrl: project.liveUrl,
      year: project.year,
      client: project.client,
    }),
    breadcrumbSchema([
      { name: t("title"), url: `${base}/${locale}` },
      { name: translation.title, url },
    ]),
  );

  return (
    <>
      <JsonLd data={pageGraph} />
      <PageHero
        chip={translation.category}
        title={translation.title}
        lead={translation.summary}
      >
        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
          <div>
            <dt className="font-display text-xs font-semibold text-white/55">
              {t("client")}
            </dt>
            <dd className="font-display text-base font-bold text-white">
              {project.client}
            </dd>
          </div>
          <div>
            <dt className="font-display text-xs font-semibold text-white/55">
              {t("year")}
            </dt>
            <dd className="font-display text-base font-bold text-white">
              {project.year}
            </dd>
          </div>
          <div>
            <dt className="font-display text-xs font-semibold text-white/55">
              {t("stack")}
            </dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {project.stack.map((item) => (
                <Tag key={item} tone="dark">
                  {item}
                </Tag>
              ))}
            </dd>
          </div>
        </dl>

        {project.liveUrl ? (
          <Button asChild variant="white" className="mt-7">
            <a href={project.liveUrl} target="_blank" rel="noreferrer noopener">
              {t("visitSite")}
            </a>
          </Button>
        ) : null}
      </PageHero>

      {/* Aperçu de l'écran livré */}
      <section className="py-[clamp(3rem,8vh,5rem)]">
        <div className="page-shell">
          <Reveal className="group relative overflow-hidden rounded-panel bg-linear-[150deg,var(--color-aegean-700),var(--color-aegean-950)] px-6 pt-10 shadow-lift sm:px-12 sm:pt-14">
            <span aria-hidden className="grain-layer" />
            {project.kind === "MOBILE" ? (
              <PhoneMockup cover={cover} className="translate-y-[8%]" />
            ) : (
              <BrowserMockup
                url={
                  project.liveUrl?.replace(/^https?:\/\//, "").replace(/\/$/, "") ??
                  `${slug}.com`
                }
                cover={cover}
                className="mx-auto max-w-4xl translate-y-[6%]"
              />
            )}
          </Reveal>
        </div>
      </section>

      {/* Chiffres clés */}
      {project.metrics.length > 0 ? (
        <section className="pb-[clamp(3rem,8vh,5rem)]">
          <div className="page-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {project.metrics.map((metric, index) => (
              <Reveal
                key={metric.id}
                delay={(index % 3) as 0 | 1 | 2}
                className="surface-card p-6"
              >
                <div className="gradient-number font-display text-[clamp(2rem,3.2vw,2.8rem)] leading-none font-extrabold tracking-[-0.05em]">
                  {metric.value}
                </div>
                <p className="mt-2.5 text-[0.9375rem] text-[var(--ink-74)]">
                  {locale === "fr"
                    ? metric.labelFr
                    : locale === "en"
                      ? metric.labelEn
                      : metric.labelEs}
                </p>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* Besoin / solution / résultat */}
      <section className="pb-[clamp(3rem,8vh,5rem)]">
        <div className="page-shell grid gap-3 lg:grid-cols-3">
          {sections.map((section, index) => (
            <Reveal
              key={section.label}
              delay={index as 0 | 1 | 2}
              className="surface-card p-6 sm:p-8"
            >
              <h2 className="display-4 mb-3 text-aegean-700">{section.label}</h2>
              <p className="text-[1.0625rem] leading-[1.65] text-[var(--ink-74)]">
                {section.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Galerie */}
      {project.gallery.length > 0 ? (
        <section className="pb-[clamp(3rem,8vh,5rem)]">
          <div className="page-shell grid gap-3 sm:grid-cols-2">
            {project.gallery.map((media) => (
              <Reveal key={media.id} className="overflow-hidden rounded-card shadow-soft">
                <Image
                  src={optimized(media.url, { width: 1000 })}
                  alt={altFor(media)}
                  width={media.width}
                  height={media.height}
                  sizes="(max-width: 880px) 100vw, 50vw"
                  className="h-auto w-full"
                />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* Projet suivant */}
      {next && next.translations[0] ? (
        <section className="pb-[clamp(3rem,8vh,5rem)]">
          <div className="page-shell">
            <Link
              href={{
                pathname: "/work/[slug]",
                params: { slug: next.translations[0].slug },
              }}
              className="group flex flex-wrap items-center justify-between gap-4 rounded-panel bg-white p-8 shadow-soft transition-shadow duration-500 hover:shadow-lift sm:p-10"
            >
              <div>
                <span className="font-display text-xs font-semibold text-[var(--ink-45)]">
                  {t("next")}
                </span>
                <h2 className="display-3 mt-2">{next.translations[0].title}</h2>
              </div>
              <span className="grid size-12 place-items-center rounded-full bg-ink text-white transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:rotate-45">
                <ArrowUpRight className="size-5" />
              </span>
            </Link>
          </div>
        </section>
      ) : null}

      <div className="page-shell pb-[clamp(3rem,8vh,5rem)]">
        <Button asChild variant="line">
          <Link href="/work">{t("backToAll")}</Link>
        </Button>
      </div>

      <CtaPanel />
    </>
  );
}
