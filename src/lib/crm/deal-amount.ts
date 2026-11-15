import "server-only";

import { prisma } from "@/lib/prisma";

/**
 * Montant d'un projet, tenu à jour à partir de ses devis :
 * - des devis acceptés : leur total (ce qui est signé) ;
 * - sinon, des devis en cours (brouillon, envoyé, consulté) : leur total
 *   (ce qui est en jeu) ;
 * - aucun devis vivant : le montant saisi à la main reste tel quel.
 *
 * Appelé après chaque création, modification, envoi, acceptation, refus,
 * annulation, duplication ou suppression de devis.
 */
export async function syncDealAmount(dealId: string | null | undefined) {
  if (!dealId) return;
  const quotes = await prisma.quote.findMany({ where: { dealId }, select: { status: true, totalCents: true, currency: true } });
  const eur = quotes.filter((quote) => quote.currency === "EUR" || quotes.every((q) => q.currency === quote.currency));
  const signed = eur.filter((quote) => quote.status === "SIGNED");
  const open = eur.filter((quote) => ["DRAFT", "SENT", "VIEWED"].includes(quote.status));
  const basis = signed.length ? signed : open;
  if (basis.length === 0) return;
  const amountCents = basis.reduce((sum, quote) => sum + quote.totalCents, 0);
  await prisma.deal.update({ where: { id: dealId }, data: { amountCents } }).catch(() => null);
}

/** Plusieurs projets d'un coup (devis expirés en lot, par exemple). */
export async function syncDealAmounts(dealIds: (string | null | undefined)[]) {
  for (const id of new Set(dealIds.filter(Boolean))) await syncDealAmount(id);
}
