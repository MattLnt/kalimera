import { Plus } from "lucide-react";

import { PipelineBoard } from "./pipeline-board";

import { ActionLink, AdminHeader, FilterTabs, StatCard } from "@/components/admin/ui";
import type { DealStage } from "@/generated/prisma/enums";
import { formatMoneyShort } from "@/lib/crm/format";
import { dealStages } from "@/lib/crm/labels";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Projets" };
export const dynamic = "force-dynamic";

const views: Record<string, { label: string; stages: DealStage[] }> = {
  sales: { label: "Ventes", stages: ["LEAD", "DISCOVERY", "PROPOSAL", "NEGOTIATION", "WON"] },
  production: { label: "Production", stages: ["WON", "IN_PROGRESS", "REVIEW", "DELIVERED", "MAINTENANCE"] },
  all: { label: "Tout", stages: dealStages.map((stage) => stage.value) },
};

export default async function DealsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view = "sales" } = await searchParams;
  const current = views[view] ?? views.sales;

  const deals = await prisma.deal.findMany({
    orderBy: [{ position: "asc" }, { updatedAt: "desc" }],
    include: {
      client: { select: { id: true, name: true } },
      _count: { select: { tasks: { where: { status: { not: "DONE" } } } } },
    },
  });

  const sales = deals.filter((deal) => ["LEAD", "DISCOVERY", "PROPOSAL", "NEGOTIATION"].includes(deal.stage));
  const pipeline = sales.reduce((sum, deal) => sum + (deal.amountCents ?? 0), 0);
  const weighted = sales.reduce((sum, deal) => sum + ((deal.amountCents ?? 0) * (deal.probability ?? 50)) / 100, 0);
  const production = deals.filter((deal) => ["WON", "IN_PROGRESS", "REVIEW"].includes(deal.stage));
  const year = new Date().getFullYear();
  const wonThisYear = deals.filter(
    (deal) => !["LEAD", "DISCOVERY", "PROPOSAL", "NEGOTIATION", "LOST"].includes(deal.stage) && deal.updatedAt.getFullYear() === year,
  );

  return (
    <>
      <AdminHeader
        title="Projets"
        subtitle="De la première piste à la mise en ligne. Glissez une carte pour changer son étape."
        action={
          <ActionLink href="/admin/deals/new">
            <Plus className="size-4" />
            Nouveau projet
          </ActionLink>
        }
        eyebrow="Pipeline"
      >
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard tone="dark" label="En négociation" value={formatMoneyShort(pipeline)} hint={`${sales.length} projet${sales.length > 1 ? "s" : ""}`} />
          <StatCard tone="dark" label="Pondéré" value={formatMoneyShort(weighted)} hint="Selon la probabilité de signature" />
          <StatCard tone="dark" label="En production" value={String(production.length)} hint={formatMoneyShort(production.reduce((s, d) => s + (d.amountCents ?? 0), 0))} />
          <StatCard tone="dark" label={`Signés en ${year}`} value={formatMoneyShort(wonThisYear.reduce((s, d) => s + (d.amountCents ?? 0), 0))} hint={`${wonThisYear.length} projet${wonThisYear.length > 1 ? "s" : ""}`} />
        </div>
      </AdminHeader>

      <FilterTabs
        tabs={Object.entries(views).map(([key, item]) => ({
          href: `/admin/deals?view=${key}`,
          label: item.label,
          active: item === current,
        }))}
      />

      <PipelineBoard
        stages={current.stages}
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
    </>
  );
}
