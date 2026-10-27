import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/site/page-hero";
import { PostCard } from "@/components/site/post-card";
import { CtaPanel } from "@/components/site/sections/cta-panel";
import { Reveal } from "@/components/ui/reveal";
import type { AppLocale } from "@/i18n/routing";
import { getPosts } from "@/lib/content";
import { toDbLocale } from "@/lib/locale";
import { buildAlternates } from "@/lib/seo";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "journal" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates("/journal"),
  };
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, posts] = await Promise.all([
    getTranslations("journal"),
    getPosts(toDbLocale(locale)),
  ]);

  return (
    <>
      <PageHero chip={t("title")} title={t("title")} lead={t("intro")} />

      <section className="py-[clamp(3rem,8vh,5rem)]">
        <div className="page-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.id} delay={(index % 3) as 0 | 1 | 2}>
              <PostCard
                locale={locale}
                post={{
                  slug: post.translations[0].slug,
                  title: post.translations[0].title,
                  excerpt: post.translations[0].excerpt,
                  categoryLabel: post.translations[0].categoryLabel,
                  publishedAt: post.publishedAt,
                  accent: `g${(index % 4) + 1}`,
                  cover: post.coverImage
                    ? {
                        url: post.coverImage.url,
                        alt:
                          locale === "fr"
                            ? post.coverImage.altFr
                            : locale === "en"
                              ? post.coverImage.altEn
                              : post.coverImage.altEs,
                      }
                    : null,
                }}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <CtaPanel />
    </>
  );
}
