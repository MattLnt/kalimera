import { Check, MapPin, Plane } from "lucide-react";

import { TechStrip } from "@/components/site/tech-icons";
import { Chip } from "@/components/ui/chip";
import { Orbs } from "@/components/ui/decor";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/* --------------------------------------------------------------------- stack */

/**
 * Technologies réellement employées sur les réalisations liées à la page.
 *
 * Construite depuis les projets plutôt que saisie : la liste reste donc vraie
 * sans entretien, et une page sans projet lié n'affiche pas de bandeau.
 */
export function StackSection({
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
    <section className="pb-[clamp(3rem,8vh,5rem)]">
      <div className="page-shell">
        <div className="surface-card flex flex-col gap-6 p-6 sm:p-9 lg:flex-row lg:items-center lg:gap-12">
          <div className="lg:max-w-[30ch]">
            <h2 className="display-3">{title}</h2>
            <p className="text-body-muted mt-2">{lead}</p>
          </div>
          <TechStrip items={items} className="lg:flex-1" />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------------- géographie */

/**
 * Panneau propre aux pages de marché.
 *
 * Il distingue visuellement les deux cas que le texte énonce déjà : un
 * établissement réel, ou un marché servi à distance. Afficher une adresse là
 * où il n'y en a pas serait le plus sûr moyen de perdre la confiance d'un
 * prospect qui vérifie.
 */
export function PlacePanel({
  onSite,
  title,
  lead,
  addressLabel,
  remoteLabel,
  coverageLabel,
  coverage,
  points,
}: {
  onSite: boolean;
  title: string;
  lead: string;
  addressLabel: string;
  remoteLabel: string;
  coverageLabel: string;
  coverage: string[];
  points: string[];
}) {
  return (
    <section className="py-[clamp(3rem,8vh,5rem)]">
      <div className="page-shell">
        <div className="night-panel relative overflow-hidden rounded-panel p-7 sm:p-10 lg:p-14">
          <Orbs />
          {/* Trame régulière : évoque un plan sans prétendre en être un. */}
          <span
            aria-hidden
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "54px 54px",
            }}
          />
          <span aria-hidden className="grain-layer" />

          <div className="relative z-2 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
            <div>
              <Chip tone="dark">{onSite ? addressLabel : remoteLabel}</Chip>
              <h2 className="display-2 mt-4 text-white">{title}</h2>
              <p className="text-lead text-lead-light mt-4">{lead}</p>

              <div className="mt-7 flex items-start gap-3.5 rounded-card bg-white/8 p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]">
                <span className="grid size-10 shrink-0 place-items-center rounded-field bg-white/12 text-aegean-200">
                  {onSite ? <MapPin className="size-5" /> : <Plane className="size-5" />}
                </span>
                {/* La pastille dit déjà « à distance » : la carte donne le lieu,
                    pas une troisième fois la même phrase. */}
                <div>
                  <p className="font-display text-[0.9375rem] font-bold text-white">
                    {onSite
                      ? `${siteConfig.address.postalCode} ${siteConfig.address.city}`
                      : siteConfig.address.city}
                  </p>
                  <p className="mt-0.5 text-[0.8125rem] text-white/55">
                    {siteConfig.address.region}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-display text-[0.6875rem] font-bold tracking-[0.08em] text-white/45 uppercase">
                {coverageLabel}
              </h3>
              <ul className="mb-7 flex flex-wrap gap-1.5">
                {coverage.map((item) => (
                  <li
                    key={item}
                    className="rounded-full bg-white/10 px-3.5 py-2 font-display text-[0.8125rem] font-semibold text-white/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>

              <ul className="grid gap-2.5">
                {points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-aegean-400/25 text-aegean-200">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    <span className="text-[0.9375rem] leading-[1.5] text-white/72">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- titrage */

/** Titre de section, avec son sur-titre et son chapeau facultatif. */
export function SectionHead({
  chip,
  title,
  lead,
  tone = "light",
  className,
}: {
  chip?: string;
  title: string;
  lead?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div className={cn("mb-8 max-w-[52ch]", className)}>
      {chip ? <Chip tone={tone}>{chip}</Chip> : null}
      <h2 className={cn("display-2 mt-4", tone === "dark" && "text-white")}>{title}</h2>
      {lead ? (
        <p className={cn("text-lead mt-4", tone === "dark" && "text-lead-light")}>
          {lead}
        </p>
      ) : null}
    </div>
  );
}
