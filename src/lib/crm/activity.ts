import "server-only";

import { prisma } from "@/lib/prisma";

type Links = { clientId?: string | null; dealId?: string | null; quoteId?: string | null; invoiceId?: string | null };

/**
 * Inscrit un évènement dans le fil d'activité. Ne fait jamais échouer
 * l'action qui l'appelle : un historique incomplet vaut mieux qu'un devis
 * non envoyé.
 */
export async function logActivity(type: string, message: string, links: Links) {
  try {
    await prisma.activity.create({
      data: {
        type,
        message,
        clientId: links.clientId ?? null,
        dealId: links.dealId ?? null,
        quoteId: links.quoteId ?? null,
        invoiceId: links.invoiceId ?? null,
      },
    });
  } catch (error) {
    console.error("[crm] activité non enregistrée", error);
  }
}
