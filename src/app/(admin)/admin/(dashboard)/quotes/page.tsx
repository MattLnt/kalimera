import { AdminHeader, EmptyState } from "@/components/admin/ui";

export const metadata = { title: "Devis" };

// Écran d'attente : l'éditeur de devis et la signature en ligne arrivent
// dans la prochaine livraison du CRM.
export default function QuotesPage() {
  return (
    <>
      <AdminHeader title="Devis" subtitle="Créés ici, envoyés par e-mail, signés en ligne par le client." />
      <EmptyState
        title="Le module Devis arrive"
        description="Éditeur de devis, PDF à la charte, envoi par e-mail et signature en ligne : c'est la prochaine étape du CRM."
      />
    </>
  );
}
