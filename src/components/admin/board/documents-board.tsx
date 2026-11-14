"use client";

import Link from "next/link";

import { Board, type BoardColumn } from "@/components/admin/board/board";
import { invoiceStateOptions, optionOf, quoteStatusOptions, type VividOption } from "@/lib/crm/vivid";

export type DocumentRow = {
  id: string;
  href: string;
  number: string;
  title: string;
  client: { id: string; name: string };
  deal: { id: string; title: string } | null;
  issuer: string;
  state: string;
  date: string;
  /** Échéance (factures) ou validité (devis). */
  due: string;
  late: boolean;
  totalCents: number;
  paidCents: number | null;
  currency: string;
};

const money = (cents: number, currency: string) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency, minimumFractionDigits: 2 }).format(cents / 100).replace(/ /g, " ");

function StateBlock({ value, options }: { value: string; options: VividOption[] }) {
  const option = optionOf(options, value);
  return (
    <span className="flex h-full min-h-11 w-full items-center justify-center px-2 font-display text-[0.8125rem] font-bold text-white" style={{ background: option.color }}>
      {option.label}
    </span>
  );
}

/** Devis ou factures groupés par statut, avec totaux par groupe. */
export function DocumentsBoard({ kind, rows, order }: { kind: "quote" | "invoice"; rows: DocumentRow[]; order: string[] }) {
  const options = kind === "quote" ? quoteStatusOptions : invoiceStateOptions;
  const groups = order
    .map((value) => {
      const option = optionOf(options, value);
      return { key: value, label: option.label, color: option.color, items: rows.filter((row) => row.state === value) };
    })
    .filter((group) => group.items.length > 0);

  const sumEur = (items: DocumentRow[]) => money(items.filter((i) => i.currency === "EUR").reduce((s, i) => s + i.totalCents, 0), "EUR");

  const columns: BoardColumn<DocumentRow>[] = [
    {
      key: "doc",
      label: kind === "quote" ? "Devis" : "Facture",
      width: "minmax(280px,1.6fr)",
      render: (row) => (
        <Link href={row.href} className="block min-w-0 flex-1 px-3 py-1.5 leading-tight">
          <span className="block truncate font-mono text-[0.8125rem] font-bold text-ink hover:text-aegean-700">{row.number}</span>
          <span className="block truncate text-[0.75rem] text-[var(--ink-65)]">{row.title}</span>
        </Link>
      ),
    },
    {
      key: "client",
      label: "Client · projet",
      width: "minmax(200px,1.2fr)",
      render: (row) => (
        <div className="min-w-0 px-3 leading-tight">
          <Link href={`/admin/clients/${row.client.id}`} className="block truncate text-[0.875rem] font-semibold hover:text-aegean-700">
            {row.client.name}
          </Link>
          {row.deal ? (
            <Link href={`/admin/deals/${row.deal.id}`} className="block truncate text-[0.75rem] text-[var(--ink-45)] hover:underline">
              {row.deal.title}
            </Link>
          ) : null}
        </div>
      ),
    },
    { key: "state", label: "Statut", width: "140px", align: "center", render: (row) => <StateBlock value={row.state} options={options} /> },
    { key: "issuer", label: "Émis par", width: "minmax(140px,0.9fr)", render: (row) => <span className="truncate px-3 text-[0.8125rem] text-[var(--ink-65)]">{row.issuer}</span> },
    { key: "date", label: "Date", width: "110px", align: "center", render: (row) => <span className="text-[0.8125rem] text-[var(--ink-65)] tabular-nums">{row.date}</span> },
    {
      key: "due",
      label: kind === "quote" ? "Validité" : "Échéance",
      width: "110px",
      align: "center",
      render: (row) => <span className={row.late ? "text-[0.8125rem] font-bold text-red-600 tabular-nums" : "text-[0.8125rem] text-[var(--ink-65)] tabular-nums"}>{row.due}</span>,
    },
    ...(kind === "invoice"
      ? [
          {
            key: "paid",
            label: "Encaissé",
            width: "120px",
            align: "center" as const,
            render: (row: DocumentRow) => {
              if (row.paidCents === null) return <span className="text-[var(--ink-45)]">—</span>;
              const ratio = row.totalCents > 0 ? Math.min(100, (row.paidCents / row.totalCents) * 100) : 0;
              return (
                <div className="w-full px-3">
                  <div className="h-2 overflow-hidden rounded-full bg-black/[0.06]">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${ratio}%` }} />
                  </div>
                  <span className="mt-0.5 block text-center text-[0.6875rem] text-[var(--ink-45)]">{Math.round(ratio)} %</span>
                </div>
              );
            },
          },
        ]
      : []),
    {
      key: "total",
      label: "Montant",
      width: "130px",
      align: "right",
      render: (row) => <span className="px-3 font-display text-[0.9375rem] font-extrabold tabular-nums">{money(row.totalCents, row.currency)}</span>,
      summary: sumEur,
    },
  ];

  return <Board groups={groups} columns={columns} />;
}
