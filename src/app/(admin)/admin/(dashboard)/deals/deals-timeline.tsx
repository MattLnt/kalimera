"use client";

import Link from "next/link";

import type { BoardDealRow } from "./deals-board";

import { dealStageOptions, optionOf } from "@/lib/crm/vivid";

const DAY = 86_400_000;
const toTime = (value: string) => new Date(`${value}T00:00:00Z`).getTime();
const weekFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", day: "numeric", month: "short" });
const monthFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", month: "long", year: "numeric" });

/**
 * Chronologie : une barre par projet, du début à la livraison, couleur de
 * son étape ; trait du jour en bleu. Les projets sans dates sont listés à
 * part pour qu'on pense à les planifier.
 */
export function DealsTimeline({ deals, today }: { deals: BoardDealRow[]; today: string }) {
  const planned = deals
    .filter((deal) => deal.startDate || deal.dueDate)
    .map((deal) => {
      const start = toTime(deal.startDate || deal.dueDate);
      const end = toTime(deal.dueDate || deal.startDate);
      return { deal, start: Math.min(start, end), end: Math.max(start, end) + DAY };
    })
    .sort((a, b) => a.start - b.start);
  const unplanned = deals.filter((deal) => !deal.startDate && !deal.dueDate);

  const now = toTime(today);
  // Fenêtre : du lundi précédant le premier début (ou 2 semaines avant aujourd'hui)
  // jusqu'à la dernière livraison (au moins 10 semaines après aujourd'hui).
  const minStart = Math.min(now - 14 * DAY, ...planned.map((item) => item.start));
  const maxEnd = Math.max(now + 70 * DAY, ...planned.map((item) => item.end));
  const firstMonday = minStart - (((new Date(minStart).getUTCDay() + 6) % 7) * DAY);
  const weeks = Math.ceil((maxEnd - firstMonday) / (7 * DAY));
  const span = weeks * 7 * DAY;
  const pct = (time: number) => ((time - firstMonday) / span) * 100;
  const weekWidth = 72;

  return (
    <div className="grid gap-5">
      <div className="overflow-x-auto rounded-[14px] bg-white ring-1 ring-black/[0.07] shadow-[0_1px_2px_rgba(7,33,63,0.04)]">
        <div className="min-w-max">
          <div className="grid" style={{ gridTemplateColumns: `260px ${weeks * weekWidth}px` }}>
            <div className="sticky left-0 z-10 border-r border-b border-black/[0.07] bg-[#fafbfd] px-4 py-2 font-display text-[0.6875rem] font-bold tracking-[0.04em] text-[var(--ink-45)] uppercase">
              Projet
            </div>
            <div className="relative flex border-b border-black/[0.07] bg-[#fafbfd]">
              {Array.from({ length: weeks }, (_, index) => {
                const time = firstMonday + index * 7 * DAY;
                const firstOfMonth = new Date(time).getUTCDate() <= 7;
                return (
                  <div key={index} className="shrink-0 border-l border-black/[0.05] px-2 py-1.5" style={{ width: weekWidth }}>
                    <span className="block text-[0.625rem] font-bold text-[var(--ink-45)] uppercase first-letter:uppercase">
                      {firstOfMonth ? monthFmt.format(new Date(time)) : " "}
                    </span>
                    <span className="block text-[0.6875rem] text-[var(--ink-65)]">{weekFmt.format(new Date(time))}</span>
                  </div>
                );
              })}
            </div>

            {planned.map(({ deal, start, end }) => {
              const stage = optionOf(dealStageOptions, deal.stage);
              return (
                <div key={deal.id} className="contents">
                  <div className="sticky left-0 z-10 flex min-h-12 items-center border-r border-b border-black/[0.05] bg-white px-4">
                    <Link href={`/admin/deals/${deal.id}`} className="min-w-0">
                      <span className="block truncate font-display text-[0.875rem] font-bold hover:text-aegean-700">{deal.title}</span>
                      <span className="block truncate text-[0.75rem] text-[var(--ink-45)]">{deal.client.name}</span>
                    </Link>
                  </div>
                  <div className="relative min-h-12 border-b border-black/[0.05]">
                    {/* Trait du jour. */}
                    <span className="absolute inset-y-0 w-0.5 bg-aegean-500/70" style={{ left: `${pct(now)}%` }} />
                    <Link
                      href={`/admin/deals/${deal.id}`}
                      title={`${deal.title} — ${stage.label}`}
                      className="absolute top-1/2 flex h-7 -translate-y-1/2 items-center overflow-hidden rounded-[8px] px-2.5 font-display text-[0.75rem] font-bold whitespace-nowrap text-white shadow-[0_4px_10px_-6px_rgba(0,0,0,0.5)] transition-[filter] hover:brightness-110"
                      style={{ left: `${pct(start)}%`, width: `max(${pct(end) - pct(start)}%, 28px)`, background: stage.color }}
                    >
                      {deal.progress > 0 ? (
                        <span className="absolute inset-y-0 left-0 bg-white/20" style={{ width: `${deal.progress}%` }} />
                      ) : null}
                      <span className="relative truncate">{stage.label}</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
          {planned.length === 0 ? (
            <p className="px-4 py-10 text-center text-[0.875rem] text-[var(--ink-45)]">
              Aucun projet daté. Renseignez un début et une livraison dans le tableau pour les voir ici.
            </p>
          ) : null}
        </div>
      </div>

      {unplanned.length ? (
        <div className="rounded-[14px] bg-white p-4 ring-1 ring-black/[0.07]">
          <p className="mb-2 font-display text-[0.8125rem] font-bold">À planifier · {unplanned.length}</p>
          <div className="flex flex-wrap gap-2">
            {unplanned.map((deal) => {
              const stage = optionOf(dealStageOptions, deal.stage);
              return (
                <Link key={deal.id} href={`/admin/deals/${deal.id}`} className="inline-flex items-center gap-2 rounded-full bg-black/[0.04] px-3 py-1.5 text-[0.8125rem] font-semibold hover:bg-aegean-50">
                  <span className="size-2 rounded-full" style={{ background: stage.color }} />
                  {deal.title}
                </Link>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
