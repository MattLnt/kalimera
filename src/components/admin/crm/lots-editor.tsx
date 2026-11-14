"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

import { newLotKey, type LotDraft } from "@/lib/crm/lots";

export { amountToCents, centsToAmount, newLotKey, type LotDraft } from "@/lib/crm/lots";

/**
 * Lots d'un devis ou lignes d'une facture : intitulé, contenu, montant.
 * Comme sur les documents, ni quantité ni prix unitaire — un montant par lot.
 */
export function LotsEditor({
  lots,
  onChange,
  currencySymbol,
  titlePlaceholder = "Lot 1 — Cadrage et maquettes",
}: {
  lots: LotDraft[];
  onChange: (lots: LotDraft[]) => void;
  currencySymbol: string;
  titlePlaceholder?: string;
}) {
  const update = (index: number, patch: Partial<LotDraft>) =>
    onChange(lots.map((lot, i) => (i === index ? { ...lot, ...patch } : lot)));
  const move = (index: number, delta: number) => {
    const next = [...lots];
    const [item] = next.splice(index, 1);
    next.splice(index + delta, 0, item);
    onChange(next);
  };

  return (
    <div className="grid gap-3">
      {lots.map((lot, index) => (
        <div key={lot.key} className="rounded-[18px] border border-black/[0.07] bg-white p-3.5">
          <div className="flex gap-2">
            <input
              value={lot.title}
              onChange={(event) => update(index, { title: event.target.value })}
              placeholder={titlePlaceholder}
              aria-label="Intitulé"
              className="field-input min-w-0 flex-1 py-2.5 font-display font-bold"
            />
            <div className="relative w-36 shrink-0">
              <input
                value={lot.amount}
                onChange={(event) => update(index, { amount: event.target.value })}
                inputMode="decimal"
                placeholder="0"
                aria-label="Montant"
                className="field-input py-2.5 pr-8 text-right font-display font-bold"
              />
              <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[var(--ink-45)]">{currencySymbol}</span>
            </div>
          </div>
          <textarea
            value={lot.description}
            onChange={(event) => update(index, { description: event.target.value })}
            rows={3}
            placeholder={"Contenu du lot : éléments séparés par « · », ou une liste :\n- premier élément\n- deuxième élément\n> note finale en gris"}
            aria-label="Contenu"
            className="field-input mt-2 resize-y py-2.5 text-[0.875rem]"
          />
          <div className="mt-2 flex justify-end gap-1">
            <button type="button" disabled={index === 0} onClick={() => move(index, -1)} aria-label="Monter" className="grid size-8 cursor-pointer place-items-center rounded-full text-[var(--ink-45)] hover:bg-black/5 disabled:opacity-30">
              <ArrowUp className="size-4" />
            </button>
            <button type="button" disabled={index === lots.length - 1} onClick={() => move(index, 1)} aria-label="Descendre" className="grid size-8 cursor-pointer place-items-center rounded-full text-[var(--ink-45)] hover:bg-black/5 disabled:opacity-30">
              <ArrowDown className="size-4" />
            </button>
            <button type="button" onClick={() => onChange(lots.filter((_, i) => i !== index))} aria-label="Supprimer" className="grid size-8 cursor-pointer place-items-center rounded-full text-[var(--ink-45)] hover:bg-red-50 hover:text-red-700">
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...lots, { key: newLotKey(), title: "", description: "", amount: "" }])}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-[18px] border-2 border-dashed border-black/10 py-3 font-display text-sm font-bold text-aegean-700 hover:border-aegean-300 hover:bg-aegean-50/50"
      >
        <Plus className="size-4" />
        Ajouter {lots.length ? "une ligne" : "la première ligne"}
      </button>
    </div>
  );
}
