import { notFound } from "next/navigation";

import { deleteDeal } from "../../actions";
import { DealForm } from "../../deal-form";

import { DeleteButton } from "@/components/admin/form-controls";
import { AdminHeader, Panel } from "@/components/admin/ui";
import { toDateInput } from "@/lib/crm/format";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Modifier le projet" };

export default async function EditDealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [deal, clients] = await Promise.all([
    prisma.deal.findUnique({ where: { id } }),
    prisma.client.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!deal) notFound();

  return (
    <>
      <AdminHeader title="Modifier le projet" back={{ href: `/admin/deals/${id}`, label: deal.title }} />
      <DealForm
        clients={clients}
        deal={{
          id: deal.id,
          clientId: deal.clientId,
          title: deal.title,
          stage: deal.stage,
          amount: deal.amountCents !== null ? String(deal.amountCents / 100).replace(".", ",") : "",
          probability: deal.probability !== null ? String(deal.probability) : "",
          description: deal.description ?? "",
          startDate: toDateInput(deal.startDate),
          dueDate: toDateInput(deal.dueDate),
          lostReason: deal.lostReason ?? "",
        }}
      />
      <Panel className="mt-4" title="Supprimer le projet" description="Les devis et factures rattachés restent sur la fiche du client.">
        <form action={deleteDeal}>
          <input type="hidden" name="id" value={deal.id} />
          <DeleteButton />
        </form>
      </Panel>
    </>
  );
}
