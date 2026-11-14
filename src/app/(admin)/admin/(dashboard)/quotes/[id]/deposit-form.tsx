"use client";

import { useState } from "react";

import { invoiceFromQuote } from "../actions";

import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const fmt = (cents: number, currency: string) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100).replace(/ /g, " ");

/**
 * Facturer un acompte : en pourcentage du devis ou en montant libre. Autant
 * d'acomptes que voulu ; le solde déduit ensuite tout ce qui a été facturé.
 */
export function DepositForm({
  quoteId,
  totalCents,
  billedCents,
  currency,
  defaultPercent,
  count,
}: {
  quoteId: string;
  totalCents: number;
  billedCents: number;
  currency: string;
  defaultPercent: number;
  count: number;
}) {
  const [mode, setMode] = useState<"percent" | "amount">("percent");
  const [percent, setPercent] = useState(String(defaultPercent || 30));
  const [amount, setAmount] = useState("");
  const remaining = totalCents - billedCents;
  const cents = mode === "percent" ? Math.round((totalCents * Number(percent)) / 100) : Math.round(Number(amount.replace(",", ".").replace(/\s/g, "")) * 100) || 0;
  const tooMuch = cents > remaining;

  return (
    <form action={invoiceFromQuote} className="grid gap-3 rounded-[16px] bg-[#F5F8FC] p-3.5">
      <input type="hidden" name="id" value={quoteId} />
      <input type="hidden" name="kind" value="DEPOSIT" />
      <input type="hidden" name="amountCents" value={cents} />
      <div className="flex items-center justify-between gap-2">
        <span className="font-display text-[0.875rem] font-extrabold">{count ? `Acompte n° ${count + 1}` : "Facturer un acompte"}</span>
        <div className="inline-flex rounded-full bg-white p-0.5 shadow-[0_0_0_1px_#DFE6EF]">
          {(["percent", "amount"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={cn("cursor-pointer rounded-full px-2.5 py-1 font-display text-[0.6875rem] font-bold", mode === value ? "bg-aegean-600 text-white" : "text-[var(--ink-65)]")}
            >
              {value === "percent" ? "%" : "Montant"}
            </button>
          ))}
        </div>
      </div>
      {mode === "percent" ? (
        <Select
          name="percent"
          defaultValue={percent}
          onValueChange={setPercent}
          options={[10, 15, 20, 25, 30, 33, 40, 50, 60, 70, 75, 80, 90].map((n) => ({ value: String(n), label: `${n} % — ${fmt(Math.round((totalCents * n) / 100), currency)}` }))}
        />
      ) : (
        <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" placeholder="Montant HT, ex. 1 500" className="field-input" aria-label="Montant de l'acompte" />
      )}
      <p className={cn("text-[0.75rem]", tooMuch ? "font-semibold text-red-600" : "text-[var(--ink-65)]")}>
        {tooMuch ? `Dépasse le reste à facturer (${fmt(remaining, currency)}).` : `Reste à facturer après : ${fmt(Math.max(0, remaining - cents), currency)}`}
      </p>
      <button
        type="submit"
        disabled={cents <= 0 || tooMuch}
        className="cursor-pointer rounded-full bg-aegean-600 px-4 py-2.5 font-display text-sm font-bold text-white hover:bg-aegean-700 disabled:cursor-default disabled:opacity-50"
      >
        Créer l&apos;acompte de {fmt(cents, currency)}
      </button>
    </form>
  );
}
