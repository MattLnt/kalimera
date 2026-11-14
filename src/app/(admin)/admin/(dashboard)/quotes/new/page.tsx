import { QuoteEditor } from "../quote-editor";

import { AdminHeader, EmptyState, ActionLink } from "@/components/admin/ui";
import { newLotKey } from "@/lib/crm/lots";
import { loadEditorData } from "@/lib/crm/documents/editor-data";

export const metadata = { title: "Nouveau devis" };
export const dynamic = "force-dynamic";

export default async function NewQuotePage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; dealId?: string }>;
}) {
  const { clientId = "", dealId = "" } = await searchParams;
  const { issuers, clients } = await loadEditorData();

  if (clients.length === 0) {
    return (
      <>
        <AdminHeader title="Nouveau devis" back={{ href: "/admin/quotes", label: "Devis" }} />
        <EmptyState
          title="Créez d'abord une fiche client"
          description="Un devis est toujours adressé à un client du CRM."
          action={<ActionLink href="/admin/clients/new">Nouveau client</ActionLink>}
        />
      </>
    );
  }

  const client = clients.find((item) => item.id === clientId);
  const issuer = issuers.find((item) => item.id === client?.defaultIssuerId) ?? issuers[0];

  return (
    <>
      <AdminHeader
        title="Nouveau devis"
        back={clientId ? { href: `/admin/clients/${clientId}`, label: client?.name ?? "Client" } : { href: "/admin/quotes", label: "Devis" }}
      />
      <QuoteEditor
        issuers={issuers}
        clients={clients}
        initialDraft={{
          clientId,
          dealId,
          issuerId: issuer?.id ?? "",
          currency: issuer?.currency ?? "EUR",
          title: "",
          context: "",
          perimeter: "",
          lots: [{ key: newLotKey(), title: "", description: "", amount: "" }],
          stack: "",
          depositPercent: String(issuer?.depositPercent ?? 50),
          paymentNote: "",
          delay: "",
          outOfScope: "",
          evolutions: "",
          terms: "",
          validityDays: String(issuer?.validityDays ?? 30),
          requireSignature: true,
        }}
      />
    </>
  );
}
