"use client";

import { FileSignature, Receipt } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { createDealQuick, updateDealField } from "../board-actions";

import {
  Board,
  BoardError,
  DateCell,
  Drawer,
  MoneyCell,
  ProgressCell,
  StatusCell,
  TextCell,
  useOptimisticItems,
  type BoardColumn,
} from "@/components/admin/board/board";
import { Select } from "@/components/ui/select";
import { dealStageOptions, invoiceStateOptions, optionOf, quoteStatusOptions } from "@/lib/crm/vivid";

export type BoardDealRow = {
  id: string;
  title: string;
  stage: string;
  amountCents: number | null;
  probability: number | null;
  startDate: string;
  dueDate: string;
  client: { id: string; name: string };
  progress: number;
  milestones: { title: string; done: boolean }[];
  /** Un projet peut avoir plusieurs devis et plusieurs factures. */
  quotes: { id: string; number: string | null; title: string; status: string; totalCents: number; currency: string }[];
  invoices: { id: string; number: string | null; title: string; state: string; totalCents: number; paidCents: number; currency: string }[];
  openTasks: number;
};

const euro = (cents: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(cents / 100).replace(/ /g, " ");

/** Suivi financier d'un projet : signé, facturé, encaissé, reste à facturer (EUR). */
function tracking(deal: BoardDealRow) {
  const signed = deal.quotes.filter((quote) => quote.status === "SIGNED").reduce((sum, quote) => sum + quote.totalCents, 0);
  const live = deal.invoices.filter((invoice) => invoice.state !== "DRAFT" && invoice.state !== "CANCELLED");
  const billed = live.reduce((sum, invoice) => sum + invoice.totalCents, 0);
  const paid = live.reduce((sum, invoice) => sum + invoice.paidCents, 0);
  return { signed, billed, paid, toBill: Math.max(0, signed - billed) };
}

/** Toujours visibles, même vides : on y ajoute des projets. Les autres seulement s'ils ont du contenu. */
const ALWAYS = ["LEAD", "DISCOVERY", "PROPOSAL", "NEGOTIATION", "WON", "IN_PROGRESS", "REVIEW"];

export function DealsBoard({ deals, clients, today }: { deals: BoardDealRow[]; clients: { id: string; name: string }[]; today: string }) {
  const { items, patch, error } = useOptimisticItems(deals);
  const [openId, setOpenId] = useState<string | null>(null);
  const [quickClient, setQuickClient] = useState(clients[0]?.id ?? "");
  const opened = items.find((item) => item.id === openId) ?? null;

  const update = (id: string, field: keyof BoardDealRow, value: unknown) =>
    patch(id, { [field]: value } as Partial<BoardDealRow>, () => updateDealField(id, field, value));

  const groups = useMemo(
    () =>
      dealStageOptions
        .map((stage) => ({ key: stage.value, label: stage.label, color: stage.color, items: items.filter((item) => item.stage === stage.value) }))
        .filter((group) => ALWAYS.includes(group.key) || group.items.length > 0),
    [items],
  );

  const columns: BoardColumn<BoardDealRow>[] = [
    {
      key: "title",
      label: "Projet",
      width: "minmax(200px,1.6fr)",
      render: (deal) => (
        <TextCell value={deal.title} onChange={(value) => update(deal.id, "title", value)} onOpen={() => setOpenId(deal.id)} className="font-display text-[0.9375rem] font-bold" />
      ),
    },
    {
      key: "client",
      label: "Client",
      width: "minmax(140px,1fr)",
      render: (deal) => (
        <Link href={`/admin/clients/${deal.client.id}`} className="truncate px-3 text-[0.875rem] font-semibold text-aegean-700 hover:underline">
          {deal.client.name}
        </Link>
      ),
    },
    {
      key: "stage",
      label: "Étape",
      width: "130px",
      align: "center",
      render: (deal) => <StatusCell value={deal.stage} options={dealStageOptions} onChange={(value) => update(deal.id, "stage", value)} />,
    },
    {
      key: "amount",
      label: "Montant",
      width: "110px",
      align: "right",
      render: (deal) => {
        const live = deal.quotes.filter((quote) => !["DECLINED", "CANCELLED", "EXPIRED"].includes(quote.status));
        if (live.length === 0) return <MoneyCell cents={deal.amountCents} onChange={(value) => update(deal.id, "amountCents", value)} />;
        const signed = live.filter((quote) => quote.status === "SIGNED").length;
        return (
          <button type="button" onClick={() => setOpenId(deal.id)} title="Calculé d'après les devis du projet" className="w-full cursor-pointer px-3 text-right leading-tight">
            <span className="block font-display text-[0.875rem] font-bold tabular-nums">{euro(deal.amountCents ?? 0)}</span>
            <span className="block text-[0.6875rem] text-[var(--ink-45)]">
              {signed ? `${signed} devis signé${signed > 1 ? "s" : ""}` : `d'après ${live.length} devis`}
            </span>
          </button>
        );
      },
      summary: (rows) => euro(rows.reduce((sum, row) => sum + (row.amountCents ?? 0), 0)),
    },
    {
      key: "quotes",
      label: "Devis",
      width: "100px",
      align: "center",
      render: (deal) => {
        const accepted = deal.quotes.filter((quote) => quote.status === "SIGNED");
        if (deal.quotes.length === 0) return <span className="text-[var(--ink-45)]">—</span>;
        return (
          <button type="button" onClick={() => setOpenId(deal.id)} className="cursor-pointer px-2 text-center text-[0.8125rem] leading-tight">
            <span className="block font-display font-bold">
              {deal.quotes.length} devis
            </span>
            <span className="block text-[0.6875rem] text-[var(--ink-45)]">{accepted.length ? `${accepted.length} accepté${accepted.length > 1 ? "s" : ""}` : "en attente"}</span>
          </button>
        );
      },
      summary: (rows) => `${rows.reduce((sum, row) => sum + row.quotes.length, 0)} devis`,
    },
    {
      key: "billing",
      label: "Facturation",
      width: "160px",
      render: (deal) => {
        const t = tracking(deal);
        if (t.billed === 0 && t.signed === 0) return <span className="px-3 text-[0.75rem] text-[var(--ink-45)]">Rien à facturer</span>;
        const base = Math.max(t.signed, t.billed, 1);
        return (
          <button type="button" onClick={() => setOpenId(deal.id)} className="w-full cursor-pointer px-3 text-left leading-tight" title="Facturé et encaissé, sur le montant signé">
            <span className="relative block h-1.5 overflow-hidden rounded-full bg-black/[0.07]">
              <span className="absolute inset-y-0 left-0 rounded-full bg-[#7DD3FC]" style={{ width: `${Math.min(100, (t.billed / base) * 100)}%` }} />
              <span className="absolute inset-y-0 left-0 rounded-full bg-[#1F6FD1]" style={{ width: `${Math.min(100, (t.paid / base) * 100)}%` }} />
            </span>
            <span className="mt-1 block text-[0.6875rem] text-[var(--ink-65)]">
              {t.toBill > 0 ? (
                <>
                  Reste <span className="font-bold text-ink">{euro(t.toBill)}</span> à facturer
                </>
              ) : t.paid >= t.billed ? (
                <span className="font-bold text-[#0D9488]">Tout est encaissé</span>
              ) : (
                <>
                  <span className="font-bold text-ink">{euro(t.billed - t.paid)}</span> à encaisser
                </>
              )}
            </span>
          </button>
        );
      },
      summary: (rows) => {
        const sum = rows.map(tracking).reduce((acc, t) => ({ toBill: acc.toBill + t.toBill, paid: acc.paid + t.paid }), { toBill: 0, paid: 0 });
        return `${euro(sum.toBill)} à facturer`;
      },
    },
    {
      key: "progress",
      label: "Avancement",
      width: "130px",
      render: (deal) => (deal.milestones.length ? <ProgressCell value={deal.progress} /> : <span className="px-3 text-[0.75rem] text-[var(--ink-45)]">Pas d&apos;étapes</span>),
    },
    {
      key: "start",
      label: "Début",
      width: "96px",
      align: "center",
      render: (deal) => <DateCell value={deal.startDate} onChange={(value) => update(deal.id, "startDate", value)} />,
    },
    {
      key: "due",
      label: "Livraison",
      width: "96px",
      align: "center",
      render: (deal) => (
        <DateCell
          value={deal.dueDate}
          late={Boolean(deal.dueDate && deal.dueDate < today && !["DELIVERED", "MAINTENANCE", "LOST"].includes(deal.stage))}
          onChange={(value) => update(deal.id, "dueDate", value)}
        />
      ),
    },
  ];

  return (
    <>
      {/* Client des projets ajoutés par la ligne « + Ajouter » des groupes. */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <span className="font-display text-[0.8125rem] font-bold text-[var(--ink-65)]">Ajout rapide pour le client</span>
        {clients.length > 0 ? (
          <div className="w-64">
            <Select name="quickClient" defaultValue={quickClient} onValueChange={setQuickClient} options={clients.map((client) => ({ value: client.id, label: client.name }))} />
          </div>
        ) : (
          <Link href="/admin/clients/new" className="text-[0.8125rem] font-bold text-aegean-700 hover:underline">
            Créez d&apos;abord un client
          </Link>
        )}
      </div>

      <Board
        groups={groups}
        columns={columns}
        quickAdd={{
          placeholder: "Ajouter un projet (tapez son nom, Entrée)",
          onAdd: async (stage, title) => {
            const result = await createDealQuick(title, stage, quickClient);
            return result.ok ? null : result.error;
          },
        }}
      />

      <Drawer
        open={Boolean(opened)}
        onClose={() => setOpenId(null)}
        title={opened?.title ?? ""}
        href={opened ? `/admin/deals/${opened.id}` : undefined}
        subtitle={
          opened ? (
            <Link href={`/admin/clients/${opened.client.id}`} className="font-semibold text-aegean-700 hover:underline">
              {opened.client.name}
            </Link>
          ) : null
        }
      >
        {opened ? <DealDrawerBody deal={opened} onStage={(value) => update(opened.id, "stage", value)} /> : null}
      </Drawer>

      <BoardError message={error} />
    </>
  );
}

function DealDrawerBody({ deal, onStage }: { deal: BoardDealRow; onStage: (value: string) => void }) {
  return (
    <div className="grid gap-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="overflow-hidden rounded-[12px]">
          <StatusCell value={deal.stage} options={dealStageOptions} onChange={onStage} />
        </div>
        <div className="rounded-[12px] bg-white px-4 py-2.5 ring-1 ring-black/[0.06]">
          <p className="text-[0.6875rem] font-bold tracking-wide text-[var(--ink-45)] uppercase">Montant</p>
          <p className="font-display text-[1.125rem] font-extrabold">{deal.amountCents !== null ? euro(deal.amountCents) : "—"}</p>
        </div>
      </div>

      {deal.milestones.length ? (
        <section>
          <h3 className="mb-2 font-display text-[0.875rem] font-bold">Étapes · {Math.round(deal.progress)} %</h3>
          <ul className="grid gap-1">
            {deal.milestones.map((milestone, index) => (
              <li key={index} className="flex items-center gap-2 text-[0.875rem]">
                <span className={milestone.done ? "size-2.5 rounded-full bg-emerald-500" : "size-2.5 rounded-full bg-black/15"} />
                <span className={milestone.done ? "text-[var(--ink-45)] line-through" : ""}>{milestone.title}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-display text-[0.875rem] font-bold">Devis · {deal.quotes.length}</h3>
          <Link href={`/admin/quotes/new?clientId=${deal.client.id}&dealId=${deal.id}`} className="font-display text-xs font-bold text-aegean-700 hover:underline">
            + Nouveau devis
          </Link>
        </div>
        {deal.quotes.length === 0 ? (
          <p className="text-[0.8125rem] text-[var(--ink-45)]">Aucun devis pour ce projet.</p>
        ) : (
          <ul className="grid gap-1.5">
            {deal.quotes.map((quote) => {
              const status = optionOf(quoteStatusOptions, quote.status);
              return (
                <li key={quote.id}>
                  <Link href={`/admin/quotes/${quote.id}`} className="flex items-center gap-3 rounded-[12px] bg-white px-3 py-2.5 ring-1 ring-black/[0.06] hover:ring-aegean-300">
                    <FileSignature className="size-4 text-[var(--ink-45)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[0.8125rem] font-bold">{quote.number ?? "Brouillon"}</span>
                      <span className="block truncate text-[0.75rem] text-[var(--ink-45)]">{quote.title}</span>
                    </span>
                    <span className="font-display text-[0.875rem] font-bold tabular-nums">{euro(quote.totalCents)}</span>
                    <span className="rounded-[6px] px-2 py-1 font-display text-[0.6875rem] font-bold text-white" style={{ background: status.color }}>
                      {status.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h3 className="mb-2 font-display text-[0.875rem] font-bold">Factures · {deal.invoices.length}</h3>
        {deal.invoices.length === 0 ? (
          <p className="text-[0.8125rem] text-[var(--ink-45)]">Les factures se créent depuis un devis accepté.</p>
        ) : (
          <ul className="grid gap-1.5">
            {deal.invoices.map((invoice) => {
              const state = optionOf(invoiceStateOptions, invoice.state);
              return (
                <li key={invoice.id}>
                  <Link href={`/admin/invoices/${invoice.id}`} className="flex items-center gap-3 rounded-[12px] bg-white px-3 py-2.5 ring-1 ring-black/[0.06] hover:ring-aegean-300">
                    <Receipt className="size-4 text-[var(--ink-45)]" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-mono text-[0.8125rem] font-bold">{invoice.number ?? "Brouillon"}</span>
                      <span className="block truncate text-[0.75rem] text-[var(--ink-45)]">{invoice.title}</span>
                    </span>
                    <span className="font-display text-[0.875rem] font-bold tabular-nums">{euro(invoice.totalCents)}</span>
                    <span className="rounded-[6px] px-2 py-1 font-display text-[0.6875rem] font-bold text-white" style={{ background: state.color }}>
                      {state.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {deal.openTasks ? (
        <p className="text-[0.8125rem] text-[var(--ink-65)]">
          {deal.openTasks} tâche{deal.openTasks > 1 ? "s" : ""} ouverte{deal.openTasks > 1 ? "s" : ""} sur ce projet.
        </p>
      ) : null}
    </div>
  );
}
