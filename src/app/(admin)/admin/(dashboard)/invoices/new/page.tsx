import { AdminHeader, EmptyState } from "@/components/admin/ui";

export const metadata = { title: "Factures" };

// Écran d'attente : factures d'acompte et de solde, numérotation continue et
// suivi des virements arrivent avec le module Devis.
export default function NewInvoicePage() {
  return (
    <>
      <AdminHeader title="Factures" subtitle="Acomptes, soldes, avoirs et virements reçus." />
      <EmptyState
        title="Le module Factures arrive"
        description="Factures générées depuis un devis signé, numérotation continue, suivi des virements et relances."
      />
    </>
  );
}
