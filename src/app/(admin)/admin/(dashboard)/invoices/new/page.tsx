import { InvoiceEditor } from "../invoice-editor";

import { newLotKey } from "@/lib/crm/lots";
import { ActionLink, AdminHeader, EmptyState } from "@/components/admin/ui";
import { loadEditorData } from "@/lib/crm/documents/editor-data";

export const metadata = { title: "Nouvelle facture" };
export const dynamic = "force-dynamic";

/** Facture hors devis. Celles qui suivent un devis se créent depuis le devis. */
export default async function NewInvoicePage({ searchParams }: { searchParams: Promise<{ clientId?: string; dealId?: string }> }) {
  const { clientId = "", dealId = "" } = await searchParams;
  const { issuers, clients } = await loadEditorData();

  if (clients.length === 0) {
    return (
      <>
        <AdminHeader title="Nouvelle facture" back={{ href: "/admin/invoices", label: "Factures" }} />
        <EmptyState title="Créez d'abord une fiche client" description="Une facture est toujours adressée à un client du CRM." action={<ActionLink href="/admin/clients/new">Nouveau client</ActionLink>} />
      </>
    );
  }

  const client = clients.find((item) => item.id === clientId);
  const issuer = issuers.find((item) => item.id === client?.defaultIssuerId) ?? issuers[0];

  return (
    <>
      <AdminHeader title="Nouvelle facture" back={{ href: "/admin/invoices", label: "Factures" }} />
      <InvoiceEditor
        issuers={issuers}
        clients={clients}
        initialDraft={{
          kind: "STANDARD",
          clientId,
          dealId,
          issuerId: issuer?.id ?? "",
          currency: issuer?.currency ?? "EUR",
          title: "",
          contextLine: "",
          notes: "",
          lots: [{ key: newLotKey(), title: "", description: "", amount: "" }],
        }}
      />
    </>
  );
}
