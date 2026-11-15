"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const fmt = (cents: number) => euro.format(cents / 100).replace(/ /g, " ");

/**
 * Encaissements par mois : une seule série, une seule teinte (aegean-500),
 * barres fines arrondies côté valeur, grille discrète, infobulle au survol.
 * Le titre du panneau nomme la série : pas de légende. Tableau accessible
 * pour les lecteurs d'écran.
 */
export function RevenueBars({ months }: { months: { key: string; label: string; cents: number }[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...months.map((month) => month.cents), 1);
  // Graduations rondes : 3 lignes de grille.
  const step = niceStep(max / 3);
  const top = Math.max(step * 3, step);
  const ticks = [0, step, step * 2, step * 3].filter((tick) => tick <= top);
  const total = months.reduce((sum, month) => sum + month.cents, 0);
  const current = active ?? months.length - 1;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <p className="font-display text-[1.75rem] leading-none font-extrabold tracking-[-0.045em]">{fmt(months[current]?.cents ?? 0)}</p>
        <p className="text-[0.8125rem] text-[var(--ink-45)]">
          {months[current]?.label} · {fmt(total)} sur 12 mois
        </p>
      </div>

      <div className="relative mt-4 h-56">
        {/* Grille horizontale discrète, valeurs à gauche. */}
        {ticks.map((tick) => (
          <div key={tick} className="absolute inset-x-0 flex items-center gap-2" style={{ bottom: `${(tick / top) * 100}%` }}>
            <span className="w-14 shrink-0 -translate-y-1/2 text-right text-[0.6875rem] text-[var(--ink-45)] tabular-nums">{fmt(tick)}</span>
            <span className={cn("h-px flex-1 -translate-y-1/2", tick === 0 ? "bg-black/15" : "bg-black/[0.06]")} />
          </div>
        ))}

        <div className="absolute inset-y-0 right-0 left-16 flex items-end gap-[2px]" onMouseLeave={() => setActive(null)}>
          {months.map((month, index) => {
            const height = (month.cents / top) * 100;
            const isActive = index === current;
            return (
              <button
                key={month.key}
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                aria-label={`${month.label} : ${fmt(month.cents)}`}
                className="group/bar relative flex h-full flex-1 cursor-default items-end justify-center outline-none"
              >
                <span
                  className={cn(
                    "w-full max-w-7 rounded-t-[4px] transition-colors",
                    month.cents > 0 ? (isActive ? "bg-aegean-600" : "bg-aegean-500/80") : "bg-transparent",
                  )}
                  style={{ height: month.cents > 0 ? `max(${height}%, 3px)` : 0 }}
                />
                {isActive && active !== null ? (
                  <span className="pointer-events-none absolute z-10 rounded-[10px] bg-ink px-2.5 py-1.5 text-left whitespace-nowrap text-white shadow-lg" style={{ bottom: `calc(${height}% + 8px)` }}>
                    <span className="block text-[0.6875rem] text-white/60">{month.label}</span>
                    <span className="block font-display text-[0.8125rem] font-bold">{fmt(month.cents)}</span>
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 ml-16 flex gap-[2px]">
        {months.map((month, index) => (
          <span key={month.key} className={cn("flex-1 text-center text-[0.6875rem] tabular-nums", index === current ? "font-bold text-ink" : "text-[var(--ink-45)]")}>
            {month.label.slice(0, 3)}
          </span>
        ))}
      </div>

      <table className="sr-only">
        <caption>Encaissements par mois</caption>
        <tbody>
          {months.map((month) => (
            <tr key={month.key}>
              <th scope="row">{month.label}</th>
              <td>{fmt(month.cents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Graduation « ronde » : 1, 2 ou 5 × une puissance de 10 (en centimes). */
function niceStep(raw: number) {
  if (raw <= 0) return 10_000;
  const power = 10 ** Math.floor(Math.log10(raw));
  const unit = raw / power;
  return (unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 5 ? 5 : 10) * power;
}

/**
 * Prospection par étape : barres horizontales dans la teinte de l'étape,
 * longueur = montant cumulé ; nombre de projets et montant en texte.
 */
export function PipelineFunnel({ stages }: { stages: { key: string; label: string; count: number; cents: number; color?: string }[] }) {
  const max = Math.max(...stages.map((stage) => stage.cents), 1);
  return (
    <ul className="grid gap-3.5">
      {stages.map((stage) => (
        <li key={stage.key}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-[0.8125rem]">
            <span className="font-semibold text-ink">{stage.label}</span>
            <span className="text-[var(--ink-45)] tabular-nums">
              {stage.count} · <span className="font-display font-bold text-ink">{fmt(stage.cents)}</span>
            </span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-black/[0.05]">
            <div
              className="h-full rounded-full bg-aegean-500"
              style={{ width: stage.cents > 0 ? `max(${(stage.cents / max) * 100}%, 6px)` : 0, background: stage.color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
