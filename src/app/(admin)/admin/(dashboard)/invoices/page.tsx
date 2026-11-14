import { AlarmClock, Plus, TrendingUp, Wallet } from "lucide-react";

import { DocumentsBoard, type DocumentRow } from "@/components/admin/board/documents-board";
import { ActionLink, AdminHeader, EmptyState, StatCard } from "@/components/admin/ui";
import { money } from "@/lib/crm/documents/render";
import { formatDate, formatMoneyShort } from "@/lib/crm/format";
import { invoiceKind } from "@/lib/crm/labels";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Factures" };
export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const now = new Date();
  const yearStart = new Date(Date.UTC(now.getUTCFullYear(), 0, 1));

  const [invoices, collected] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: [{ issueDate: { sort: "desc", nulls: "first" } }, { createdAt: "desc" }],
      include: {
        client: { select: { id: true, name: true } },
        deal: { select: { id: true, title: true } },
        issuer: { select: { label: true } },
        payments: { select: { amountCents: true } },
      },
      take: 500,
    }),
    prisma.payment.findMany({ where: { receivedAt: { gte: yearStart } }, include: { invoice: { select: { currency: true } } } }),
  ]);

  const rows: DocumentRow[] = invoices.map((invoice) => {
    const paid = invoice.payments.reduce((sum, payment) => sum + payment.amountCents, 0);
    const late = invoice.status === "ISSUED" && Boolean(invoice.dueDate && invoice.dueDate < now);
    const state = late ? "OVERDUE" : invoice.status === "ISSUED" && paid > 0 ? "PARTIAL" : invoice.status;
    return {
      id: invoice.id,
      href: `/admin/invoices/${invoice.id}`,
      number: invoice.number ?? invoiceKind[invoice.kind],
      title: invoice.kind === "CREDIT_NOTE" ? `Avoir — ${invoice.title}` : invoice.title,
      client: invoice.client,
      deal: invoice.deal,
      issuer: invoice.issuer?.label ?? "—",
      state,
      date: invoice.issueDate ? formatDate(invoice.issueDate) : "—",
      due: invoice.dueDate ? formatDate(invoice.dueDate) : "—",
      late,
      totalCents: invoice.kind === "CREDIT_NOTE" ? -invoice.totalCents : invoice.totalCents,
      paidCents: invoice.status === "DRAFT" || invoice.kind === "CREDIT_NOTE" ? null : paid,
      currency: invoice.currency,
    };
  });

  const open = invoices.filter((i) => i.status === "ISSUED" && i.kind !== "CREDIT_NOTE");
  const dueEur = open.filter((i) => i.currency === "EUR").reduce((s, i) => s + i.totalCents - i.payments.reduce((t, p) => t + p.amountCents, 0), 0);
  const late = rows.filter((row) => row.state === "OVERDUE");
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
          <StatCard icon={<TrendingUp className="size-4" />} label={`Encaissé en ${now.getFullYear()}`} value={formatMoneyShort(collectedEur)} hint={collectedUsd ? `+ ${money(collectedUsd, "USD")}` : "Virements enregistrés"} />
        </div>
      </AdminHeader>

      {rows.length === 0 ? (
        <EmptyState
          title="Aucune facture pour l'instant"
          description="Les factures se créent depuis un devis accepté (acompte, solde), ou à la main pour une prestation hors devis."
          action={<ActionLink href="/admin/invoices/new">Facture hors devis</ActionLink>}
        />
      ) : (
        <DocumentsBoard kind="invoice" rows={rows} order={["OVERDUE", "ISSUED", "PARTIAL", "DRAFT", "PAID", "CANCELLED"]} />
      )}
    </>
  );
}
