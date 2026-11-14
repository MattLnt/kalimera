import { ClientForm, emptyClient } from "../client-form";

import { AdminHeader } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Nouveau client" };

export default async function NewClientPage() {
  const issuers = await prisma.issuer.findMany({ where: { archived: false }, orderBy: { position: "asc" }, select: { id: true, label: true } });
  return (
    <>
      <AdminHeader title="Nouveau client" back={{ href: "/admin/clients", label: "Clients" }} />
      <ClientForm client={emptyClient} issuers={issuers} />
    </>
  );
}
