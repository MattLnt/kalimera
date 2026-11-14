import { DealForm } from "../deal-form";

import { AdminHeader } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Nouveau projet" };

export default async function NewDealPage({ searchParams }: { searchParams: Promise<{ clientId?: string }> }) {
  const { clientId = "" } = await searchParams;
  const clients = await prisma.client.findMany({
    where: { status: { not: "ARCHIVED" } },
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <>
      <AdminHeader
        title="Nouveau projet"
        back={clientId ? { href: `/admin/clients/${clientId}`, label: "Fiche client" } : { href: "/admin/deals", label: "Projets" }}
      />
      <DealForm
        clients={clients}
        deal={{
          clientId,
          title: "",
          stage: "DISCOVERY",
          amount: "",
          probability: "",
          description: "",
          startDate: "",
          dueDate: "",
          lostReason: "",
        }}
      />
    </>
  );
}
