"use client";

import { ArrowRight } from "lucide-react";
import { createElement, memo } from "react";

import type { NavEntry } from "@/components/site/nav-data";
import { serviceIcons, isServiceIconName } from "@/components/site/service-icons";
import { Link } from "@/i18n/navigation";
import type { AppPathnames } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type DetailPath = Extract<
  AppPathnames,
  "/services/[slug]" | "/sectors/[slug]" | "/locations/[slug]"
>;

export type MegaColumn = {
  /** Titre de colonne, absent quand le panneau n'en compte qu'une. */
  heading?: string;
  entries: NavEntry[];
  pathname: DetailPath;
  allLabel: string;
  allHref: Extract<AppPathnames, "/services" | "/sectors" | "/locations">;
  /** Deux colonnes internes quand la liste est longue. */
  split?: boolean;
};

/**
 * Contenu d'un menu déroulant.
 *
 * Volontairement sans résumé par entrée et sans paragraphe d'introduction : un
 * panneau trop haut couvre la page et se parcourt moins vite qu'il ne se lit.
 * Chaque ligne tient donc sur une hauteur de bouton — icône, libellé, flèche
 * au survol — et le panneau reste sous les 300 pixels.
 *
 * Mémoïsé : les deux panneaux restent montés en permanence et le survol ne
 * change qu'une classe. Sans cela, chaque changement d'entrée re-rendrait la
 * vingtaine de lignes des deux panneaux et ferait sentir sa latence.
 */
export const MegaPanel = memo(function MegaPanel({
  columns,
  onNavigate,
}: {
  columns: MegaColumn[];
  onNavigate: () => void;
}) {
  return (
    <div
      className={cn(
        "grid gap-x-10 gap-y-6 p-5",
        // Une colonne scindée en deux listes prend deux parts de largeur,
        // sinon ses libellés — longs sur les pages sectorielles — se
        // retrouvent tronqués à moitié.
        columns.length > 1 &&
          (columns[0].split ? "lg:grid-cols-[2fr_1fr]" : "lg:grid-cols-[1fr_1fr]"),
      )}
    >
      {columns.map((column) => (
        <div key={column.allHref}>
          <div className="mb-2 flex items-baseline justify-between gap-4 px-2.5">
            {column.heading ? (
              <h3 className="font-display text-[0.6875rem] font-bold tracking-[0.08em] text-[var(--ink-45)] uppercase">
                {column.heading}
              </h3>
            ) : (
              <span />
            )}

            <Link
              href={column.allHref}
              onClick={onNavigate}
              className="group/all inline-flex items-center gap-1 font-display text-[0.75rem] font-bold text-aegean-700 transition-colors hover:text-aegean-900"
            >
              {column.allLabel}
              <ArrowRight
                aria-hidden
                className="size-3 transition-transform duration-300 group-hover/all:translate-x-0.5"
              />
            </Link>
          </div>

          <ul className={cn("grid gap-0.5", column.split && "sm:grid-cols-2")}>
            {column.entries.map((entry) => {
              const icon = isServiceIconName(entry.icon)
                ? serviceIcons[entry.icon]
                : serviceIcons.Layers;

              return (
                <li key={entry.slug}>
                  <Link
                    href={{ pathname: column.pathname, params: { slug: entry.slug } }}
                    onClick={onNavigate}
                    className="group/row flex items-center gap-2.5 rounded-field px-2.5 py-2 transition-colors duration-200 hover:bg-aegean-50"
                  >
                    <span className="grid size-7 shrink-0 place-items-center rounded-[9px] bg-aegean-100 text-aegean-700 transition-colors duration-200 group-hover/row:bg-aegean-600 group-hover/row:text-white">
                      {createElement(icon, { className: "size-3.5" })}
                    </span>

                    <span className="min-w-0 flex-1 truncate font-display text-[0.875rem] font-semibold tracking-[-0.01em] text-ink">
                      {entry.title}
                    </span>

                    <ArrowRight
                      aria-hidden
                      className="size-3.5 shrink-0 text-aegean-600 opacity-0 transition-[opacity,translate] duration-300 group-hover/row:translate-x-0.5 group-hover/row:opacity-100"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
});
