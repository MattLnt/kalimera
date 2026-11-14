import { ClientForm, emptyClient } from "../client-form";

import { AdminHeader } from "@/components/admin/ui";

export const metadata = { title: "Nouveau client" };

export default function NewClientPage() {
  return (
    <>
      <AdminHeader title="Nouveau client" back={{ href: "/admin/clients", label: "Clients" }} />
      <ClientForm client={emptyClient} />
    </>
  );
}
