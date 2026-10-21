import { Code2, Gauge, Languages, ShieldCheck } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { PostCard } from "@/components/site/post-card";
import { SectionHead } from "@/components/site/landing-sections";
import { TechStrip } from "@/components/site/tech-icons";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { getPosts } from "@/lib/content";
import { toDbLocale } from "@/lib/locale";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------- pourquoi nous */

const WHY_ICONS = [Code2, ShieldCheck, Gauge, Languages];

/**
 * Les quatre arguments de différenciation, repris de la page d'accueil.
 *
 * Le texte est déjà traduit et déjà écrit : le dupliquer dans chaque page
 * d'atterrissage serait quatre contenus de plus à maintenir pour dire la
 * même chose. On le relit depuis le même espace de traduction.
 */
export async function WhyUs({ compact = false }: { compact?: boolean }) {
  const t = await getTranslations("home.studio");
  const tl = await getTranslations("landings");

  const cards = [1, 2, 3, 4].map((n) => ({
    n,
    title: t(`card${n}Title` as "card1Title"),
    body: t(`card${n}Body` as "card1Body"),
  }));

  return (
    <section className="bg-white py-[clamp(2.5rem,5.5vh,4rem)]">
      <div className="page-shell">
        <SectionHead chip={tl("whyChip")} title={tl("whyTitle")} lead={tl("whyLead")} />

        <div
          className={cn(
            "grid gap-3 sm:grid-cols-2",
            !compact && "lg:grid-cols-4",
          )}
        >
          {cards.map((card, index) => {
            const Icon = WHY_ICONS[index];
            return (
              <Reveal key={card.n} delay={(index % 3) as 0 | 1 | 2}>
                <article className="group h-full rounded-card bg-canvas p-5 shadow-[inset_0_0_0_1px_var(--ink-10)] transition-[transform,box-shadow] duration-[550ms] ease-[var(--ease-out-expo)] hover:-translate-y-1.5 hover:shadow-lift sm:p-6">
                  <span className="grid size-10 place-items-center rounded-[11px] bg-aegean-100 text-aegean-700 transition-colors duration-500 group-hover:bg-aegean-600 group-hover:text-white">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="display-4 mt-4">{card.title}</h3>
                  <p className="mt-1.5 text-[0.9375rem] leading-[1.6] text-[var(--ink-65)]">
                    {card.body}
                  </p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------- méthode */

/**
 * Les quatre étapes d'un projet, en bande horizontale reliée.
 *
 * Distincte du composant `Process` de la page d'accueil : ici les étapes
 * s'enchaînent sur une ligne continue plutôt qu'en quatre cartes séparées,
 * pour que la page d'atterrissage ne soit pas la copie de l'accueil.
 */
export async function MethodBand() {
  const t = await getTranslations("home.process");
  const tl = await getTranslations("landings");

  const steps = [1, 2, 3, 4].map((n) => ({
    n,
    title: t(`step${n}Title` as "step1Title"),
    body: t(`step${n}Body` as "step1Body"),
    duration: t(`step${n}Duration` as "step1Duration"),
  }));

  return (
    <section className="py-[clamp(2.5rem,5.5vh,4rem)]">
      <div className="page-shell">
        <SectionHead chip={t("chip")} title={tl("methodTitle")} lead={t("description")} />

        <ol className="relative grid gap-0 sm:grid-cols-2 lg:grid-cols-4">
          {/* Le fil qui relie les étapes : il dit que l'ordre compte. */}
          <span
            aria-hidden
            className="absolute top-[1.125rem] right-6 left-6 hidden h-px bg-[var(--ink-10)] lg:block"
          />

          {steps.map((step, index) => (
            <Reveal
              key={step.n}
              as="li"
              delay={Math.min(index, 3) as 0 | 1 | 2 | 3}
              className="relative pt-0 pr-6 pb-6 lg:pt-0"
            >
              <span className="relative z-1 grid size-9 place-items-center rounded-full bg-ink font-display text-[0.75rem] font-extrabold tabular-nums text-white">
                {String(step.n).padStart(2, "0")}
              </span>
              <h3 className="display-4 mt-4">{step.title}</h3>
              <p className="mt-1.5 text-[0.9375rem] leading-[1.6] text-[var(--ink-65)]">
                {step.body}
              </p>
              <span className="mt-3 inline-block rounded-full bg-aegean-50 px-2.5 py-1 font-display text-[0.6875rem] font-bold text-aegean-700">
                {step.duration}
              </span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- bande de logos */

/**
 * Bandeau de technologies pleine largeur, sur fond sombre.
 *
 * Même rôle que la bande de logos partenaires d'un site d'agence : une
 * respiration visuelle qui apporte une information au passage.
 */
export function TechBand({
  items,
  title,
  lead,
}: {
  items: string[];
  title: string;
  lead: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className="py-[clamp(2.5rem,5.5vh,4rem)]">
      <div className="page-shell">
        <div className="night-panel relative overflow-hidden rounded-panel p-7 sm:p-9">
          <span aria-hidden className="grain-layer" />
          <div className="relative z-1 flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-14">
            <div className="lg:max-w-[28ch]">
              <h2 className="font-display text-[clamp(1.25rem,1.9vw,1.6rem)] leading-[1.15] font-extrabold tracking-[-0.03em] text-white">
                {title}
              </h2>
              <p className="mt-2 text-[0.9375rem] leading-[1.5] text-white/60">{lead}</p>
            </div>
            <TechStrip items={items} tone="dark" className="lg:flex-1" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- articles */

/** Derniers articles du journal, en bas de page d'atterrissage. */
export async function RelatedPosts({ locale }: { locale: AppLocale }) {
  const t = await getTranslations("landings");
  const posts = await getPosts(toDbLocale(locale), 3);
  if (posts.length === 0) return null;

  return (
    <section className="bg-white py-[clamp(2.5rem,5.5vh,4rem)]">
      <div className="page-shell">
        <SectionHead chip={t("journalChip")} title={t("journalTitle")} />

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
                  cover: post.coverImage
                    ? { url: post.coverImage.url, alt: post.coverImage.altFr }
                    : null,
                  accent: `g${(index % 4) + 1}`,
                }}
              />
            </Reveal>
          ))}
        </div>

        <Button asChild variant="line" className="mt-7">
          <Link href="/journal">{t("journalAll")}</Link>
        </Button>
      </div>
    </section>
  );
}
