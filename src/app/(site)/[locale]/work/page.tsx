import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PageHero } from "@/components/site/page-hero";
import { ProjectCard } from "@/components/site/project-card";
import { CtaPanel } from "@/components/site/sections/cta-panel";
import { Reveal } from "@/components/ui/reveal";
import type { AppLocale } from "@/i18n/routing";
import { getProjects } from "@/lib/content";
import { toDbLocale } from "@/lib/locale";
import { buildAlternates } from "@/lib/seo";

export const revalidate = 86400;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "work" });
  return {
    title: t("title"),
    description: t("intro"),
    alternates: buildAlternates("/work"),
  };
}

export default async function WorkPage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, projects] = await Promise.all([
    getTranslations("work"),
    getProjects(toDbLocale(locale)),
  ]);

  return (
    <>
      <PageHero chip={t("title")} title={t("title")} lead={t("intro")} />

      <section className="py-[clamp(3rem,8vh,5rem)]">
        <div className="page-shell grid gap-3 lg:grid-cols-12">
          {projects.map((project, index) => {
            const wide = index % 4 === 0 || index % 4 === 3;
            return (
              <Reveal
                key={project.id}
                delay={(index % 3) as 0 | 1 | 2}
                className={wide ? "lg:col-span-7" : "lg:col-span-5"}
              >
                <ProjectCard
                  size={wide ? "wide" : "narrow"}
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
                          alt:
                            locale === "fr"
                              ? project.coverImage.altFr
                              : locale === "en"
                                ? project.coverImage.altEn
                                : project.coverImage.altEs,
                        }
                      : null,
                  }}
                />
              </Reveal>
            );
          })}
        </div>
      </section>

      <CtaPanel />
    </>
  );
}
