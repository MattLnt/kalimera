import { AlarmClock, Plus, Receipt, TrendingUp, Wallet } from "lucide-react";

import { ActionLink, AdminHeader, DataTable, EmptyState, FilterTabs, Pill, RowLink, StatCard } from "@/components/admin/ui";
import type { Prisma } from "@/generated/prisma/client";
import { money } from "@/lib/crm/documents/render";
import { formatDate, formatMoneyShort } from "@/lib/crm/format";
import { invoiceKind, invoiceStatus, toneClasses } from "@/lib/crm/labels";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Factures" };
export const dynamic = "force-dynamic";

const tabs: { key: string; label: string; where: () => Prisma.InvoiceWhereInput }[] = [
  { key: "due", label: "À encaisser", where: () => ({ status: "ISSUED" }) },
  { key: "late", label: "En retard", where: () => ({ status: "ISSUED", dueDate: { lt: new Date() } }) },
  { key: "paid", label: "Payées", where: () => ({ status: "PAID" }) },
  { key: "draft", label: "Brouillons", where: () => ({ status: "DRAFT" }) },
  { key: "all", label: "Toutes", where: () => ({}) },
];

export default async function InvoicesPage({ searchParams }: { searchParams: Promise<{ filter?: string }> }) {
  const { filter = "due" } = await searchParams;
  const tab = tabs.find((item) => item.key === filter) ?? tabs[0];
  const yearStart = new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1));

  const [invoices, open, collected] = await Promise.all([
    prisma.invoice.findMany({
      where: tab.where(),
      orderBy: [{ issueDate: { sort: "desc", nulls: "first" } }, { createdAt: "desc" }],
      include: { client: { select: { name: true } }, issuer: { select: { label: true } }, payments: { select: { amountCents: true } } },
      take: 300,
    }),
    prisma.invoice.findMany({ where: { status: "ISSUED", kind: { not: "CREDIT_NOTE" } }, include: { payments: { select: { amountCents: true } } } }),
    prisma.payment.findMany({ where: { receivedAt: { gte: yearStart } }, include: { invoice: { select: { currency: true } } } }),
  ]);

  const dueEur = open.filter((i) => i.currency === "EUR").reduce((s, i) => s + i.totalCents - i.payments.reduce((t, p) => t + p.amountCents, 0), 0);
  const late = open.filter((i) => i.dueDate && i.dueDate < new Date());
  const collectedEur = collected.filter((p) => p.invoice.currency === "EUR").reduce((s, p) => s + p.amountCents, 0);
  const collectedUsd = collected.filter((p) => p.invoice.currency === "USD").reduce((s, p) => s + p.amountCents, 0);

  return (
    <>
      <AdminHeader
        eyebrow="Ventes"
        title="Factures"
        subtitle="Acomptes, soldes et avoirs, numérotés par identité ; virements reçus et retards."
        action={
          <ActionLink href="/admin/invoices/new">
            <Plus className="size-4" />
            Facture hors devis
          </ActionLink>
        }
      >
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          <StatCard icon={<Wallet className="size-4" />} label="À encaisser (EUR)" value={formatMoneyShort(dueEur)} hint={`${open.length} facture${open.length > 1 ? "s" : ""} ouverte${open.length > 1 ? "s" : ""}`} />
          <StatCard icon={<AlarmClock className="size-4" />} label="En retard" value={String(late.length)} hint={late.length ? "Relances à prévoir" : "Aucun retard"} />
          <StatCard icon={<TrendingUp className="size-4" />} label={`Encaissé en ${new Date().getFullYear()}`} value={formatMoneyShort(collectedEur)} hint={collectedUsd ? `+ ${money(collectedUsd, "USD")}` : "Virements enregistrés"} />
        </div>
      </AdminHeader>

      <FilterTabs tabs={tabs.map((item) => ({ href: `/admin/invoices?filter=${item.key}`, label: item.label, active: item.key === tab.key }))} />

      {invoices.length === 0 ? (
        <EmptyState
          title="Aucune facture ici"
          description="Les factures se créent depuis un devis accepté (acompte, solde), ou à la main pour une prestation hors devis."
          action={<ActionLink href="/admin/invoices/new">Facture hors devis</ActionLink>}
        />
      ) : (
        <DataTable
          head={
            <tr>
              <th>Facture</th>
              <th>Client</th>
              <th>Émise par</th>
              <th>Statut</th>
              <th className="num">Échéance</th>
              <th className="num">Encaissé</th>
              <th className="num">Montant</th>
            </tr>
          }
        >
          {invoices.map((invoice) => {
            const paid = invoice.payments.reduce((s, p) => s + p.amountCents, 0);
            const state =
              invoice.status === "ISSUED" && invoice.dueDate && invoice.dueDate < new Date()
                ? "OVERDUE"
                : invoice.status === "ISSUED" && paid > 0
                  ? "PARTIAL"
                  : invoice.status;
            const ratio = invoice.totalCents > 0 ? Math.min(100, (paid / invoice.totalCents) * 100) : 0;
            return (
              <tr key={invoice.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-gradient-to-br from-aegean-50 to-aegean-100 text-aegean-700 ring-1 ring-aegean-200/60">
                      <Receipt className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <RowLink href={`/admin/invoices/${invoice.id}`} className="block truncate font-mono text-[0.8125rem] font-bold text-ink">
                        {invoice.number ?? invoiceKind[invoice.kind]}
                      </RowLink>
                      <span className="block max-w-[36ch] truncate text-[0.8125rem] text-[var(--ink-65)]">{invoice.title}</span>
                    </div>
                  </div>
                </td>
                <td className="font-semibold">{invoice.client.name}</td>
                <td className="text-[var(--ink-65)]">{invoice.issuer?.label ?? "—"}</td>
                <td>
                  <Pill className={toneClasses[invoiceStatus[state].tone]}>{invoice.kind === "CREDIT_NOTE" ? "Avoir" : invoiceStatus[state].label}</Pill>
                </td>
                <td className={state === "OVERDUE" ? "num font-bold text-red-600" : "num text-[var(--ink-65)]"}>{formatDate(invoice.dueDate)}</td>
                <td className="num">
                  {invoice.kind === "CREDIT_NOTE" || invoice.status === "DRAFT" ? (
                    <span className="text-[var(--ink-45)]">—</span>
                  ) : (
                    <div className="ml-auto w-24">
                      <div className="h-1.5 overflow-hidden rounded-full bg-black/5">
                        <div className="h-full rounded-full bg-green-500" style={{ width: `${ratio}%` }} />
                      </div>
                      <span className="mt-1 block text-[0.6875rem] text-[var(--ink-45)]">{Math.round(ratio)} %</span>
                    </div>
                  )}
                </td>
                <td className="num font-display text-[0.9375rem] font-extrabold tracking-[-0.02em]">
                  {invoice.kind === "CREDIT_NOTE" ? "− " : ""}
                  {money(invoice.totalCents, invoice.currency)}
                </td>
              </tr>
            );
          })}
        </DataTable>
      )}
    </>
  );
}
