"use client";

import { CalendarClock } from "lucide-react";
import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";

import { moveDeal } from "./actions";

import type { DealStage } from "@/generated/prisma/enums";
import { dealStages } from "@/lib/crm/labels";
import { dealStageOptions, optionOf } from "@/lib/crm/vivid";
import { cn } from "@/lib/utils";

export type BoardDeal = {
  id: string;
  title: string;
  stage: DealStage;
  position: number;
  amountCents: number | null;
  probability: number | null;
  dueDate: string | null;
  client: { id: string; name: string };
  openTasks: number;
};

const euro = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const day = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "short" });

/**
 * Tableau des projets par étape. Les cartes se glissent d'une colonne à
 * l'autre ; le déplacement s'affiche tout de suite et s'enregistre derrière.
 * Sur téléphone, le tableau défile à l'horizontal, colonne par colonne.
 */
export function PipelineBoard({ deals, stages }: { deals: BoardDeal[]; stages: DealStage[] }) {
  const [optimistic, applyMove] = useOptimistic(
    deals,
    (state, move: { id: string; stage: DealStage; position: number }) => {
      const moved = state.find((deal) => deal.id === move.id);
      if (!moved) return state;
      const rest = state.filter((deal) => deal.id !== move.id);
      const column = rest.filter((deal) => deal.stage === move.stage).sort((a, b) => a.position - b.position);
      column.splice(move.position, 0, { ...moved, stage: move.stage });
      const others = rest.filter((deal) => deal.stage !== move.stage);
      return [...others, ...column.map((deal, index) => ({ ...deal, position: index }))];
    },
  );
  const [, startTransition] = useTransition();
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<{ stage: DealStage; index: number } | null>(null);

  const drop = (stage: DealStage, index: number) => {
    const id = dragging;
    setDragging(null);
    setOver(null);
    if (!id) return;
    startTransition(async () => {
      applyMove({ id, stage, position: index });
      await moveDeal(id, stage, index);
    });
  };

  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8 [scrollbar-width:thin]">
      <div className="flex snap-x snap-mandatory gap-3 lg:snap-none">
        {stages.map((stage) => {
          const meta = dealStages.find((item) => item.value === stage)!;
          const cards = optimistic.filter((deal) => deal.stage === stage).sort((a, b) => a.position - b.position);
          const total = cards.reduce((sum, deal) => sum + (deal.amountCents ?? 0), 0);

          return (
            <section
              key={stage}
              aria-label={meta.label}
              onDragOver={(event) => {
                event.preventDefault();
                if (!over || over.stage !== stage) setOver({ stage, index: cards.length });
              }}
              onDrop={(event) => {
                event.preventDefault();
                drop(stage, over?.stage === stage ? over.index : cards.length);
              }}
              className={cn(
                "flex w-[82vw] shrink-0 snap-start flex-col rounded-[22px] bg-black/[0.035] p-2.5 transition-colors sm:w-[280px]",
                over?.stage === stage && "bg-aegean-100/60 ring-2 ring-aegean-300",
              )}
            >
              <header className="flex items-center gap-2 px-2 pt-1.5 pb-2.5">
                <span className="size-2.5 rounded-full" style={{ background: optionOf(dealStageOptions, stage).color }} />
                <h2 className="font-display text-[0.875rem] font-bold">{meta.label}</h2>
                <span className="rounded-full bg-white px-2 text-[0.6875rem] font-bold text-[var(--ink-45)]">{cards.length}</span>
                <span className="ml-auto text-[0.75rem] font-semibold text-[var(--ink-45)]">{total ? euro.format(total / 100) : ""}</span>
              </header>

              <ol className="flex min-h-24 flex-1 flex-col gap-2">
                {cards.map((deal, index) => {
                  const late = deal.dueDate && new Date(deal.dueDate) < new Date() && meta.phase !== "closed";
                  return (
                    <li
                      key={deal.id}
                      draggable
                      onDragStart={(event) => {
                        setDragging(deal.id);
                        event.dataTransfer.effectAllowed = "move";
                      }}
                      onDragEnd={() => {
                        setDragging(null);
                        setOver(null);
                      }}
                      onDragOver={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const rect = event.currentTarget.getBoundingClientRect();
                        const after = event.clientY > rect.top + rect.height / 2;
                        setOver({ stage, index: after ? index + 1 : index });
                      }}
                      onDrop={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        drop(stage, over?.stage === stage ? over.index : index);
                      }}
                      className={cn(
                        "relative",
                        dragging === deal.id && "opacity-40",
                        over?.stage === stage && over.index === index && dragging !== deal.id &&
                          "before:absolute before:-top-1.5 before:inset-x-2 before:h-0.5 before:rounded-full before:bg-aegean-500",
                      )}
                    >
                      <Link
                        href={`/admin/deals/${deal.id}`}
                        draggable={false}
                        className="block cursor-grab rounded-[16px] bg-white p-3.5 shadow-[0_1px_2px_rgba(7,33,63,0.06)] transition-shadow hover:shadow-[0_8px_24px_-12px_rgba(7,33,63,0.3)] active:cursor-grabbing"
                      >
                        <p className="font-display text-[0.9375rem] leading-snug font-bold tracking-[-0.01em]">{deal.title}</p>
                        <p className="mt-0.5 truncate text-[0.8125rem] text-[var(--ink-45)]">{deal.client.name}</p>
                        <div className="mt-3 flex items-center gap-2 text-[0.75rem]">
                          {deal.amountCents ? (
                            <span className="font-display font-bold text-ink">{euro.format(deal.amountCents / 100)}</span>
                          ) : null}
                          {deal.probability !== null && meta.phase === "sales" ? (
                            <span className="text-[var(--ink-45)]">{deal.probability} %</span>
                          ) : null}
                          {deal.dueDate ? (
                            <span className={cn("ml-auto inline-flex items-center gap-1", late ? "font-bold text-red-600" : "text-[var(--ink-45)]")}>
                              <CalendarClock className="size-3" />
                              {day.format(new Date(deal.dueDate))}
                            </span>
                          ) : null}
                        </div>
                        {deal.openTasks > 0 ? (
                          <p className="mt-2 text-[0.6875rem] font-semibold text-aegean-700">
                            {deal.openTasks} tâche{deal.openTasks > 1 ? "s" : ""} ouverte{deal.openTasks > 1 ? "s" : ""}
                          </p>
                        ) : null}
                      </Link>
                    </li>
                  );
                })}
                {cards.length === 0 ? (
                  <li className="grid flex-1 place-items-center rounded-[16px] border-2 border-dashed border-black/10 px-3 py-6 text-center text-[0.75rem] text-[var(--ink-45)]">
                    Déposez un projet ici
                  </li>
                ) : null}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
