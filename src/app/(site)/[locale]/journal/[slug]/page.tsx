import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/site/page-hero";
import { PostCard } from "@/components/site/post-card";
import { CtaPanel } from "@/components/site/sections/cta-panel";
import { Button } from "@/components/ui/button";
import { Prose } from "@/components/ui/prose";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { optimized } from "@/lib/cloudinary";
import { getPostBySlug, getPostSlugs, getRelatedPosts } from "@/lib/content";
import { toAppLocale, toDbLocale } from "@/lib/locale";
import { buildAlternates } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site";
import { readingTime } from "@/lib/utils";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPostSlugs();
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
  const translation = await getPostBySlug(toDbLocale(locale), slug);
  if (!translation) return {};

  const paramsByLocale = Object.fromEntries(
    translation.post.translations.map((item) => [
      toAppLocale(item.locale),
      { slug: item.slug },
    ]),
  );

  return {
    title: translation.seoTitle ?? translation.title,
    description: translation.seoDescription ?? translation.excerpt,
    alternates: buildAlternates("/journal/[slug]", paramsByLocale, locale),
    openGraph: {
      type: "article",
      title: translation.seoTitle ?? translation.title,
      description: translation.seoDescription ?? translation.excerpt,
      publishedTime: translation.post.publishedAt?.toISOString(),
      images: translation.post.coverImage
        ? [optimized(translation.post.coverImage.url, { width: 1200, height: 630 })]
        : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ locale: AppLocale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const dbLocale = toDbLocale(locale);
  const translation = await getPostBySlug(dbLocale, slug);
  if (!translation) notFound();

  const [t, format, related] = await Promise.all([
    getTranslations("journal"),
    getFormatter(),
    getRelatedPosts(dbLocale, translation.postId, 2),
  ]);

  const { post } = translation;
  const minutes = readingTime(translation.body);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: translation.title,
    description: translation.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    inLanguage: locale,
    author: { "@type": "Organization", name: "Kalimera" },
    publisher: { "@type": "Organization", name: "Kalimera" },
    mainEntityOfPage: `${getSiteUrl()}/${locale}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Contenu généré par nous, pas par un visiteur.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero chip={translation.categoryLabel} title={translation.title}>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-display text-sm font-semibold text-white/60">
          {post.publishedAt ? (
            <time dateTime={post.publishedAt.toISOString()}>
              {t("publishedOn", {
                date: format.dateTime(post.publishedAt, "long"),
              })}
            </time>
          ) : null}
          <span>{t("readingTime", { minutes })}</span>
        </div>
      </PageHero>

      {post.coverImage ? (
        <div className="page-shell pt-[clamp(2rem,5vh,3rem)]">
          <Reveal className="overflow-hidden rounded-panel shadow-lift">
            <Image
              src={optimized(post.coverImage.url, { width: 1400 })}
              alt={
                locale === "fr"
                  ? post.coverImage.altFr
                  : locale === "en"
                    ? post.coverImage.altEn
                    : post.coverImage.altEs
              }
              width={post.coverImage.width}
              height={post.coverImage.height}
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="h-auto w-full"
            />
          </Reveal>
        </div>
      ) : null}

      <article className="py-[clamp(3rem,8vh,5rem)]">
        <div className="page-shell">
          <Reveal className="surface-card mx-auto max-w-4xl p-6 sm:p-10 lg:p-14">
            <Prose content={translation.body} />
          </Reveal>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="pb-[clamp(3rem,8vh,5rem)]">
          <div className="page-shell">
            <h2 className="display-2 mb-8">{t("related")}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((item, index) => (
                <Reveal key={item.id} delay={index as 0 | 1}>
                  <PostCard
                    locale={locale}
                    post={{
                      slug: item.translations[0].slug,
                      title: item.translations[0].title,
                      excerpt: item.translations[0].excerpt,
                      categoryLabel: item.translations[0].categoryLabel,
                      publishedAt: item.publishedAt,
                      accent: `g${(index % 4) + 2}`,
                      cover: item.coverImage
                        ? {
                            url: item.coverImage.url,
                            alt: item.coverImage.altFr,
                          }
                        : null,
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
          <Link href="/journal">{t("backToAll")}</Link>
        </Button>
      </div>

      <CtaPanel />
    </>
  );
}
