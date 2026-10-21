import { createElement } from "react";

import { serviceIcons, isServiceIconName } from "@/components/site/service-icons";
import { Tag } from "@/components/ui/chip";
import { Reveal } from "@/components/ui/reveal";
import { Link } from "@/i18n/navigation";
import type { AppPathnames } from "@/i18n/routing";

export type LandingCardData = {
  id: string;
  slug: string;
  title: string;
  lead: string;
  icon: string;
  highlights: string[];
};

/**
 * Grille des pages sectorielles ou géographiques.
 *
 * Volontairement plus sobre que `ServiceCard` : ces pages sont des portes
 * d'entrée, pas des offres. La carte sert le maillage interne autant que le
 * visiteur — chaque lien envoie de l'autorité vers une page d'intention.
 */
export function LandingIndex({
  items,
  pathname,
}: {
  items: LandingCardData[];
  pathname: Extract<AppPathnames, "/sectors/[slug]" | "/locations/[slug]">;
}) {
  return (
    <div className="page-shell grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => {
        const icon = isServiceIconName(item.icon)
          ? serviceIcons[item.icon]
          : serviceIcons.Layers;

        return (
          <Reveal key={item.id} delay={(index % 3) as 0 | 1 | 2}>
            <Link
              href={{ pathname, params: { slug: item.slug } }}
              className="surface-card surface-card-hover flex h-full flex-col p-6 sm:p-8"
            >
              <span className="grid size-11 shrink-0 place-items-center rounded-field bg-aegean-100 text-aegean-700">
                {createElement(icon, { className: "size-5" })}
              </span>

              <h2 className="display-3 mt-5">{item.title}</h2>
              <p className="text-body-muted mt-2.5 flex-1">{item.lead}</p>

              {item.highlights.length > 0 ? (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {item.highlights.map((highlight) => (
                    <Tag key={highlight}>{highlight}</Tag>
                  ))}
                </div>
              ) : null}
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
