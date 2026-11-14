"use client";

import { ArrowRight } from "lucide-react";
import { createElement, memo } from "react";

import type { NavGroup } from "@/components/site/nav-data";
import { serviceIcons, isServiceIconName } from "@/components/site/service-icons";
import { Link } from "@/i18n/navigation";
import type { AppPathnames } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export type MegaConfig = {
  groups: NavGroup[];
  allLabel: string;
  allHref: Extract<AppPathnames, "/services" | "/sectors" | "/work">;
  /** Carte de droite : une preuve ou une porte de sortie, jamais une liste de plus. */
  aside?: React.ReactNode;
};

/**
 * Contenu d'un menu déroulant.
 *
 * Chaque panneau se lit en deux temps : des groupes titrés (« Sites &
 * e-commerce », « Applications & plateformes »), puis dans chaque groupe des
 * lignes courtes avec une précision en dessous. Les libellés viennent de
 * `nav-labels.ts` et non des titres de page, écrits pour Google et trop longs
 * pour un menu : c'est ce qui rendait l'ancien panneau illisible.
 *
 * Mémoïsé : les panneaux restent montés en permanence et le survol ne change
 * qu'une classe.
 */
export const MegaPanel = memo(function MegaPanel({
  config,
  onNavigate,
}: {
  config: MegaConfig;
  onNavigate: () => void;
}) {
  const { groups, allLabel, allHref, aside } = config;

  return (
    <div
      className={cn(
        "grid gap-x-8 gap-y-6 p-6",
        aside
          ? groups.length > 1
            ? "lg:grid-cols-[1fr_1fr_17rem]"
            : "lg:grid-cols-[1fr_17rem]"
          : groups.length > 1 && "lg:grid-cols-2",
      )}
    >
      {groups.map((group, index) => (
        <div key={group.heading}>
          <div className="mb-2 flex h-5 items-center justify-between gap-4 px-2.5">
            <h3 className="font-display text-[0.6875rem] font-bold tracking-[0.08em] text-[var(--ink-45)] uppercase">
              {group.heading}
            </h3>
            {/* Le lien « tout voir » une seule fois, en tête du premier groupe. */}
            {index === 0 ? (
              <Link
                href={allHref}
                onClick={onNavigate}
                className="group/all inline-flex items-center gap-1 font-display text-[0.75rem] font-bold text-aegean-700 transition-colors hover:text-aegean-900"
              >
                {allLabel}
                <ArrowRight
                  aria-hidden
                  className="size-3 transition-transform duration-300 group-hover/all:translate-x-0.5"
                />
              </Link>
            ) : null}
          </div>

          <ul className="grid gap-0.5">
            {group.entries.map((entry) => {
              const icon = isServiceIconName(entry.icon)
                ? serviceIcons[entry.icon]
                : serviceIcons.Layers;

              return (
                <li key={entry.slug}>
                  <Link
                    href={{ pathname: entry.pathname, params: { slug: entry.slug } }}
                    onClick={onNavigate}
                    className="group/row flex items-center gap-3 rounded-field px-2.5 py-2 transition-colors duration-200 hover:bg-aegean-50"
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-aegean-100 text-aegean-700 transition-colors duration-200 group-hover/row:bg-aegean-600 group-hover/row:text-white">
                      {createElement(icon, { className: "size-4" })}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-[0.875rem] leading-tight font-semibold tracking-[-0.01em] text-ink">
                        {entry.title}
                      </span>
                      {entry.hint ? (
                        <span className="mt-0.5 block truncate text-[0.75rem] leading-tight text-[var(--ink-45)]">
                          {entry.hint}
                        </span>
                      ) : null}
                    </span>

                    {entry.badge ? (
                      <span className="shrink-0 rounded-full bg-aegean-50 px-2 py-0.5 font-display text-[0.6875rem] font-bold text-aegean-700 transition-colors group-hover/row:bg-white">
                        {entry.badge}
                      </span>
                    ) : (
                      <ArrowRight
                        aria-hidden
                        className="size-3.5 shrink-0 text-aegean-600 opacity-0 transition-[opacity,translate] duration-300 group-hover/row:translate-x-0.5 group-hover/row:opacity-100"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {aside ? <div className="hidden lg:block">{aside}</div> : null}
    </div>
  );
});

/** Carte de droite : fond doux, titre, texte court, un seul lien. */
export function MegaAside({
  eyebrow,
  title,
  body,
  children,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-[20px] bg-aegean-50 p-4">
      {eyebrow ? (
        <span className="mb-2 font-display text-[0.6875rem] font-bold tracking-[0.08em] text-aegean-700 uppercase">
          {eyebrow}
        </span>
      ) : null}
      <p className="font-display text-[1rem] leading-snug font-bold tracking-[-0.02em] text-ink">
        {title}
      </p>
      {body ? (
        <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-[var(--ink-65)]">{body}</p>
      ) : null}
      {children}
    </div>
  );
}
