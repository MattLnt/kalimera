import { getTranslations, setRequestLocale } from "next-intl/server";

import { PostCard } from "@/components/site/post-card";
import { ProjectCard } from "@/components/site/project-card";
import { ServiceCard } from "@/components/site/service-card";
import { CtaPanel } from "@/components/site/sections/cta-panel";
import { Hero } from "@/components/site/sections/hero";
import { Process } from "@/components/site/sections/process";
import { SectionHead } from "@/components/site/sections/section-head";
import { StackMarquee } from "@/components/site/sections/stack-marquee";
import { StatsPanel } from "@/components/site/sections/stats-panel";
import { StudioBento } from "@/components/site/sections/studio-bento";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getFeaturedProjects, getPosts, getServices, getTestimonial } from "@/lib/content";
import { toDbLocale } from "@/lib/locale";

export const revalidate = 300;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: AppLocale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const dbLocale = toDbLocale(locale);
  const [t, services, projects, posts, testimonial] = await Promise.all([
    getTranslations("home"),
    getServices(dbLocale),
    getFeaturedProjects(dbLocale, 4),
    getPosts(dbLocale, 3),
    getTestimonial(dbLocale),
  ]);

  return (
    <>
      <Hero />
      <StackMarquee />
      <StudioBento />

      {/* ----------------------------------------------------- services */}
      {services.length > 0 ? (
        <section id="services" className="pb-[clamp(4.5rem,10vh,8rem)]">
          <div className="page-shell">
            <SectionHead
              chip={t("services.chip")}
              titleTop={t("services.titleTop")}
              titleBottom={t("services.titleBottom")}
              action={
                <Button asChild variant="line">
                  <Link href="/services">{t("services.all")}</Link>
                </Button>
              }
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
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

      {/* ----------------------------------------------------- projets */}
      <section id="projets" className="pb-[clamp(4.5rem,10vh,8rem)]">
        <div className="page-shell">
          <SectionHead
            chip={t("work.chip")}
            titleTop={t("work.titleTop")}
            titleBottom={t("work.titleBottom")}
            action={
              <Button asChild variant="line">
                <Link href="/work">{t("work.all")}</Link>
              </Button>
            }
          />

          {projects.length > 0 ? (
            <div className="grid gap-3 lg:grid-cols-12">
              {projects.map((project, index) => {
                // Alternance 7/5 puis 5/7 : la grille respire sans être rigide.
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
                );
              })}
            </div>
          ) : (
            <EmptyState>{t("work.empty")}</EmptyState>
          )}
        </div>
      </section>

      <StatsPanel />
      <Process />

      {/* ----------------------------------------------------- témoignage */}
      {testimonial ? (
        <section className="pb-[clamp(4.5rem,10vh,8rem)]">
          <div className="page-shell">
            <Reveal className="grid items-center gap-8 rounded-panel bg-white p-8 shadow-lift sm:p-12 lg:grid-cols-[auto_1fr] lg:gap-12 lg:p-14">
              <div
                aria-hidden
                className="size-21 shrink-0 rounded-full bg-linear-[140deg,var(--color-aegean-400),var(--color-aegean-800)] shadow-soft"
              />
              <div>
                <Chip>{t("testimonial.chip")}</Chip>
                <blockquote className="mt-5 font-display text-[clamp(1.3rem,2.6vw,2.1rem)] leading-[1.18] font-bold tracking-[-0.035em]">
                  {testimonial.translations[0].quote}
                </blockquote>
                <p className="mt-5 text-[0.9375rem] text-[var(--ink-45)]">
                  {testimonial.translations[0].role}
                </p>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      {/* ----------------------------------------------------- journal */}
      <section id="journal" className="pb-[clamp(4.5rem,10vh,8rem)]">
        <div className="page-shell">
          <SectionHead
            chip={t("journal.chip")}
            titleTop={t("journal.titleTop")}
            titleBottom={t("journal.titleBottom")}
            action={
              <Button asChild variant="line">
                <Link href="/journal">{t("journal.all")}</Link>
              </Button>
            }
          />

          {posts.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
          ) : (
            <EmptyState>{t("journal.empty")}</EmptyState>
          )}
        </div>
      </section>

      <CtaPanel />
    </>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-card bg-white px-8 py-14 text-center text-[var(--ink-45)] shadow-soft">
      {children}
    </div>
  );
}
