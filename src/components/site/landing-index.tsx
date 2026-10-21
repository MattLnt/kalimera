import { ArrowRight } from "lucide-react";
import { createElement } from "react";

import { serviceIcons, isServiceIconName } from "@/components/site/service-icons";
import { Tag } from "@/components/ui/chip";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import type { AppPathnames } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export type LandingCardData = {
  id: string;
  slug: string;
  title: string;
  lead: string;
  icon: string;
  highlights: string[];
  /** Nombre de réalisations citées : c'est le signal de crédibilité. */
  proofCount: number;
};

/**
 * Grille des pages sectorielles ou géographiques.
 *
 * La première carte occupe deux colonnes : une grille parfaitement régulière
 * se lit comme une liste administrative, et ne hiérarchise pas. Le compteur
 * de réalisations figure sur chaque carte parce que c'est l'information qui
 * fait cliquer — « trois références dans mon métier » bien plus qu'un titre.
 */
export function LandingIndex({
  items,
  pathname,
  proofLabel,
}: {
  items: LandingCardData[];
  pathname: Extract<AppPathnames, "/sectors/[slug]" | "/locations/[slug]">;
  proofLabel: string;
}) {
  return (
    <div className="page-shell grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => {
        const icon = isServiceIconName(item.icon)
          ? serviceIcons[item.icon]
          : serviceIcons.Layers;
        const featured = index === 0;

        return (
          <Reveal
            key={item.id}
            delay={(index % 3) as 0 | 1 | 2}
            className={featured ? "sm:col-span-2" : undefined}
          >
            <Link
              href={{ pathname, params: { slug: item.slug } }}
              className={cn(
                "group relative isolate flex h-full flex-col overflow-hidden rounded-card p-6 sm:p-8",
                "transition-transform duration-[320ms] ease-[var(--ease-hover)] hover:-translate-y-1.5",
                featured
                  ? "night-panel text-white shadow-lift"
                  : "bg-white shadow-lift hover:text-white",
              )}
            >
              {/* Le bleu monte du bas au survol, comme sur les cartes service. */}
              {!featured ? (
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 origin-top scale-y-0 bg-linear-[150deg,var(--color-aegean-600),var(--color-aegean-900)] transition-transform duration-[420ms] ease-[var(--ease-hover)] group-hover:scale-y-100"
                />
              ) : (
                <span aria-hidden className="grain-layer -z-10" />
              )}

              <div className="flex items-start justify-between gap-4">
                <span
                  className={cn(
                    "grid size-12 shrink-0 place-items-center rounded-field transition-colors duration-500",
                    featured
                      ? "bg-white/12 text-aegean-200"
                      : "bg-aegean-100 text-aegean-700 group-hover:bg-white/15 group-hover:text-white",
                  )}
                >
                  {createElement(icon, { className: "size-5" })}
                </span>

                <ArrowRight
                  aria-hidden
                  className={cn(
                    "size-5 shrink-0 transition-[translate,color] duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1",
                    featured ? "text-white/40" : "text-[var(--ink-45)] group-hover:text-white",
                  )}
                />
              </div>

              <h2
                className={cn(
                  "mt-6",
                  featured ? "display-2 max-w-[26ch] text-white" : "display-3",
                )}
              >
                {item.title}
              </h2>

              <p
                className={cn(
                  "mt-3 flex-1 leading-[1.55]",
                  featured
                    ? "text-lead text-lead-light max-w-[52ch]"
                    : "text-[0.9375rem] text-[var(--ink-65)] transition-colors duration-500 group-hover:text-white/75",
                )}
              >
                {item.lead}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-1.5">
                {item.proofCount > 0 ? (
                  <span
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-3 py-1.5 font-display text-[0.75rem] font-bold transition-colors duration-500",
                      featured
                        ? "bg-aegean-400/20 text-aegean-200"
                        : "bg-aegean-100 text-aegean-700 group-hover:bg-white/15 group-hover:text-white",
                    )}
                  >
                    {item.proofCount} {proofLabel}
                  </span>
                ) : null}

                {item.highlights.slice(0, featured ? 3 : 2).map((highlight) => (
                  <Tag key={highlight} tone={featured ? "dark" : "light"}>
                    {highlight}
                  </Tag>
                ))}
              </div>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
