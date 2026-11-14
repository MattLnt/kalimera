import { notFound } from "next/navigation";

import { deleteClient } from "../../actions";
import { ClientForm } from "../../client-form";

import { DeleteButton } from "@/components/admin/form-controls";
import { AdminHeader, Panel } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Modifier le client" };

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await prisma.client.findUnique({ where: { id } });
  if (!client) notFound();

  return (
    <>
      <AdminHeader title={`Modifier ${client.name}`} back={{ href: `/admin/clients/${id}`, label: client.name }} />
      <ClientForm
        client={{
          id: client.id,
          name: client.name,
          legalName: client.legalName ?? "",
          siren: client.siren ?? "",
          vatNumber: client.vatNumber ?? "",
          email: client.email ?? "",
          phone: client.phone ?? "",
          website: client.website ?? "",
          addressLine1: client.addressLine1 ?? "",
          addressLine2: client.addressLine2 ?? "",
          postalCode: client.postalCode ?? "",
          city: client.city ?? "",
          country: client.country,
          source: client.source ?? "",
          status: client.status,
          summary: client.summary ?? "",
        }}
      />

      <Panel
        className="mt-4"
        title="Supprimer la fiche"
        description="Un client qui a reçu un devis ou une facture numérotés est archivé plutôt que supprimé : ces documents doivent rester consultables."
      >
        <form action={deleteClient}>
          <input type="hidden" name="id" value={client.id} />
          <DeleteButton label="Supprimer ou archiver" />
        </form>
      </Panel>
    </>
  );
}
