import { BadgeCheck, CalendarRange, Columns3, Hammer, Handshake, Plus, Scale, Table2 } from "lucide-react";

import { DealsBoard, type BoardDealRow } from "./deals-board";
import { DealsTimeline } from "./deals-timeline";
import { PipelineBoard } from "./pipeline-board";

import { ViewSwitcher } from "@/components/admin/board/board";
import { ActionLink, AdminHeader, StatCard } from "@/components/admin/ui";
import type { DealStage } from "@/generated/prisma/enums";
import { formatMoneyShort, toDateInput } from "@/lib/crm/format";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Projets" };
export const dynamic = "force-dynamic";

const KANBAN: Record<string, DealStage[]> = {
  sales: ["LEAD", "DISCOVERY", "PROPOSAL", "NEGOTIATION", "WON"],
  production: ["WON", "IN_PROGRESS", "REVIEW", "DELIVERED", "MAINTENANCE"],
};

export default async function DealsPage({ searchParams }: { searchParams: Promise<{ view?: string; lane?: string }> }) {
  const { view = "table", lane = "sales" } = await searchParams;
  const now = new Date();

  const [deals, clients] = await Promise.all([
    prisma.deal.findMany({
      orderBy: [{ position: "asc" }, { updatedAt: "desc" }],
      include: {
        client: { select: { id: true, name: true } },
        milestones: { orderBy: { position: "asc" }, select: { title: true, doneAt: true } },
        quotes: { orderBy: { createdAt: "asc" }, select: { id: true, number: true, title: true, status: true, totalCents: true, currency: true } },
        invoices: {
          orderBy: { createdAt: "asc" },
          select: { id: true, number: true, title: true, status: true, kind: true, totalCents: true, currency: true, dueDate: true, payments: { select: { amountCents: true } } },
        },
        _count: { select: { tasks: { where: { status: { not: "DONE" } } } } },
      },
    }),
    prisma.client.findMany({ where: { status: { not: "ARCHIVED" } }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const rows: BoardDealRow[] = deals.map((deal) => {
    const done = deal.milestones.filter((milestone) => milestone.doneAt).length;
    return {
      id: deal.id,
      title: deal.title,
      stage: deal.stage,
      amountCents: deal.amountCents,
      probability: deal.probability,
      startDate: toDateInput(deal.startDate),
      dueDate: toDateInput(deal.dueDate),
      client: deal.client,
      progress: deal.milestones.length ? (done / deal.milestones.length) * 100 : 0,
      milestones: deal.milestones.map((milestone) => ({ title: milestone.title, done: Boolean(milestone.doneAt) })),
      quotes: deal.quotes,
      invoices: deal.invoices.map((invoice) => {
        const paid = invoice.payments.reduce((sum, payment) => sum + payment.amountCents, 0);
        const state =
          invoice.status === "ISSUED" && invoice.dueDate && invoice.dueDate < now ? "OVERDUE" : invoice.status === "ISSUED" && paid > 0 ? "PARTIAL" : invoice.status;
        return {
          id: invoice.id,
          number: invoice.number,
          title: invoice.title,
          state,
          totalCents: invoice.kind === "CREDIT_NOTE" ? -invoice.totalCents : invoice.totalCents,
          paidCents: paid,
          currency: invoice.currency,
        };
      }),
      openTasks: deal._count.tasks,
    };
  });

  const sales = deals.filter((deal) => ["LEAD", "DISCOVERY", "PROPOSAL", "NEGOTIATION"].includes(deal.stage));
  const pipeline = sales.reduce((sum, deal) => sum + (deal.amountCents ?? 0), 0);
  const weighted = sales.reduce((sum, deal) => sum + ((deal.amountCents ?? 0) * (deal.probability ?? 50)) / 100, 0);
  const production = deals.filter((deal) => ["WON", "IN_PROGRESS", "REVIEW"].includes(deal.stage));
  const year = now.getFullYear();
  const wonThisYear = deals.filter(
    (deal) => !["LEAD", "DISCOVERY", "PROPOSAL", "NEGOTIATION", "LOST"].includes(deal.stage) && deal.updatedAt.getFullYear() === year,
  );
  const today = toDateInput(now);

  const views = [
    { key: "table", label: "Tableau", icon: <Table2 className="size-4" />, href: "/admin/deals?view=table" },
    { key: "kanban", label: "Kanban", icon: <Columns3 className="size-4" />, href: "/admin/deals?view=kanban" },
    { key: "timeline", label: "Chronologie", icon: <CalendarRange className="size-4" />, href: "/admin/deals?view=timeline" },
  ];

  return (
    <>
      <AdminHeader
        eyebrow="Pipeline"
        title="Projets"
        subtitle="De la première piste à la mise en ligne. Modifiez une cellule d'un clic ; un projet peut porter plusieurs devis et factures."
        action={
          <ActionLink href="/admin/deals/new">
            <Plus className="size-4" />
            Nouveau projet
          </ActionLink>
        }
      >
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard color="blue" icon={<Handshake className="size-4" />} label="En négociation" value={formatMoneyShort(pipeline)} hint={`${sales.length} projet${sales.length > 1 ? "s" : ""}`} />
          <StatCard color="violet" icon={<Scale className="size-4" />} label="Pondéré" value={formatMoneyShort(weighted)} hint="Selon la probabilité de signature" />
          <StatCard color="orange" icon={<Hammer className="size-4" />} label="En production" value={String(production.length)} hint={formatMoneyShort(production.reduce((s, d) => s + (d.amountCents ?? 0), 0))} />
          <StatCard color="green" icon={<BadgeCheck className="size-4" />} label={`Signés en ${year}`} value={formatMoneyShort(wonThisYear.reduce((s, d) => s + (d.amountCents ?? 0), 0))} hint={`${wonThisYear.length} projet${wonThisYear.length > 1 ? "s" : ""}`} />
        </div>
      </AdminHeader>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <ViewSwitcher views={views} current={view} />
        {view === "kanban" ? (
          <ViewSwitcher
            current={lane}
            views={[
              { key: "sales", label: "Ventes", icon: null, href: "/admin/deals?view=kanban&lane=sales" },
              { key: "production", label: "Production", icon: null, href: "/admin/deals?view=kanban&lane=production" },
            ]}
          />
        ) : null}
      </div>

      {view === "kanban" ? (
        <PipelineBoard
          stages={KANBAN[lane] ?? KANBAN.sales}
          deals={deals.map((deal) => ({
            id: deal.id,
            title: deal.title,
            stage: deal.stage,
            position: deal.position,
            amountCents: deal.amountCents,
            probability: deal.probability,
            dueDate: deal.dueDate?.toISOString() ?? null,
            client: deal.client,
            openTasks: deal._count.tasks,
          }))}
        />
      ) : view === "timeline" ? (
        <DealsTimeline deals={rows} today={today} />
      ) : (
        <DealsBoard deals={rows} clients={clients} today={today} />
      )}
    </>
  );
}
