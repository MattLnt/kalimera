import { Plus, Receipt } from "lucide-react";
import Link from "next/link";

import { ActionLink, AdminHeader, EmptyState, FilterTabs, Pill, StatCard } from "@/components/admin/ui";
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
          <StatCard label="À encaisser (EUR)" value={formatMoneyShort(dueEur)} hint={`${open.length} facture${open.length > 1 ? "s" : ""} ouverte${open.length > 1 ? "s" : ""}`} />
          <StatCard label="En retard" value={String(late.length)} hint={late.length ? "Relances à prévoir" : "Aucun retard"} />
          <StatCard label={`Encaissé en ${new Date().getFullYear()}`} value={formatMoneyShort(collectedEur)} hint={collectedUsd ? `+ ${money(collectedUsd, "USD")}` : "Virements enregistrés"} />
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
        <ul className="grid gap-2">
          {invoices.map((invoice) => {
            const paid = invoice.payments.reduce((s, p) => s + p.amountCents, 0);
            const state =
              invoice.status === "ISSUED" && invoice.dueDate && invoice.dueDate < new Date()
                ? "OVERDUE"
                : invoice.status === "ISSUED" && paid > 0
                  ? "PARTIAL"
                  : invoice.status;
            return (
              <li key={invoice.id}>
                <Link href={`/admin/invoices/${invoice.id}`} className="surface-card surface-card-hover flex flex-wrap items-center gap-4 px-5 py-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-aegean-50 text-aegean-700">
                    <Receipt className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-[0.9375rem] font-bold">
                      {invoice.number ?? invoiceKind[invoice.kind]} · {invoice.title}
                    </span>
                    <span className="block truncate text-[0.8125rem] text-[var(--ink-45)]">
                      {invoice.client.name} · {invoice.issuer?.label ?? "identité à choisir"}
                      {invoice.dueDate ? ` · échéance ${formatDate(invoice.dueDate)}` : ""}
                    </span>
                  </span>
                  <span className="font-display text-[1rem] font-extrabold tracking-[-0.02em]">
                    {invoice.kind === "CREDIT_NOTE" ? "− " : ""}
                    {money(invoice.totalCents, invoice.currency)}
                  </span>
                  <Pill className={toneClasses[invoiceStatus[state].tone]}>{invoice.kind === "CREDIT_NOTE" ? "Avoir" : invoiceStatus[state].label}</Pill>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
