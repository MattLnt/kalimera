"use client";

import { ArrowRight } from "lucide-react";
import { createElement } from "react";

import type { NavEntry } from "@/components/site/nav-data";
import { serviceIcons, isServiceIconName } from "@/components/site/service-icons";
import { Link } from "@/i18n/navigation";
import type { AppPathnames } from "@/i18n/routing";

type DetailPath = Extract<
  AppPathnames,
  "/services/[slug]" | "/sectors/[slug]" | "/locations/[slug]"
>;

export type MegaColumn = {
  /** Titre de colonne, absent quand le panneau n'en compte qu'une. */
  heading?: string;
  entries: NavEntry[];
  pathname: DetailPath;
  /** Lien vers la page d'index de la colonne. */
  allLabel: string;
  allHref: Extract<AppPathnames, "/services" | "/sectors" | "/locations">;
};

/**
 * Contenu d'un menu déroulant.
 *
 * Chaque entrée affiche son résumé : un menu qui ne liste que des titres
 * oblige à cliquer pour comprendre, et les titres d'une offre technique ne
 * parlent pas d'eux-mêmes. Le résumé est tronqué par le CSS, pas coupé en
 * base, pour rester lisible dans les trois langues.
 */
export function MegaPanel({
  lead,
  columns,
  onNavigate,
}: {
  lead: string;
  columns: MegaColumn[];
  onNavigate: () => void;
}) {
  return (
    <div className="grid gap-6 p-6 sm:p-7">
      <p className="max-w-[46ch] text-[0.9375rem] leading-[1.5] text-[var(--ink-65)]">
        {lead}
      </p>

      <div
        className={
          columns.length > 1
            ? "grid gap-7 lg:grid-cols-[1.4fr_1fr]"
            : "grid gap-7"
        }
      >
        {columns.map((column) => (
          <div key={column.allHref}>
            {column.heading ? (
              <h3 className="mb-3 font-display text-[0.75rem] font-bold tracking-[0.04em] text-[var(--ink-45)] uppercase">
                {column.heading}
              </h3>
            ) : null}

            <ul
              className={
                column.entries.length > 4 && columns.length === 1
                  ? "grid gap-1 sm:grid-cols-2"
                  : "grid gap-1"
              }
            >
              {column.entries.map((entry) => {
                const icon = isServiceIconName(entry.icon)
                  ? serviceIcons[entry.icon]
                  : serviceIcons.Layers;

                return (
                  <li key={entry.slug}>
                    <Link
                      href={{ pathname: column.pathname, params: { slug: entry.slug } }}
                      onClick={onNavigate}
                      className="group flex items-start gap-3 rounded-field p-2.5 transition-colors duration-200 hover:bg-aegean-50"
                    >
                      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-[10px] bg-aegean-100 text-aegean-700">
                        {createElement(icon, { className: "size-4" })}
                      </span>
                      <span className="min-w-0">
                        <span className="block font-display text-[0.9375rem] font-bold tracking-[-0.02em] text-ink">
                          {entry.title}
                        </span>
                        <span className="mt-0.5 line-clamp-2 block text-[0.8125rem] leading-[1.45] text-[var(--ink-45)]">
                          {entry.summary}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link
              href={column.allHref}
              onClick={onNavigate}
              className="mt-3 inline-flex items-center gap-1.5 font-display text-[0.8125rem] font-bold text-aegean-700 transition-colors hover:text-aegean-900"
            >
              {column.allLabel}
              <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
