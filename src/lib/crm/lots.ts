/**
 * Lignes d'un devis ou d'une facture, côté formulaire. Fonctions pures,
 * utilisables par les pages serveur comme par les éditeurs.
 */

export type LotDraft = { key: string; title: string; description: string; amount: string };

let counter = 0;
export const newLotKey = () => `lot-${Date.now()}-${counter++}`;

/** « 1 500,50 » → 150050 ; vide ou illisible → 0. */
export function amountToCents(value: string) {
  const cleaned = value.replace(/\s| |€|\$/g, "").replace(",", ".");
  const number = Number(cleaned);
  return Number.isFinite(number) ? Math.round(number * 100) : 0;
}

export function centsToAmount(cents: number) {
  return (cents / 100)
    .toLocaleString("fr-FR", { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })
    .replace(/[  ]/g, " ");
}
