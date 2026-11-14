import "server-only";

import type { Prisma } from "@/generated/prisma/client";

type Tx = Prisma.TransactionClient;
type Kind = "INVOICE" | "QUOTE";

/** Mois du document à Paris : « 2026-11 ». */
function period(date: Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit" })
    .format(date)
    .slice(0, 7);
}

/**
 * Format de la fiche : FAC-AAAA-MM-NN et DEV-AAAA-MM-NN. Le compteur repart
 * à 01 chaque mois, et chaque identité émettrice a sa propre suite.
 */
export function formatNumber(prefix: string, date: Date, sequence: number) {
  const [year, month] = period(date).split("-");
  return `${prefix}-${year}-${month}-${String(sequence).padStart(2, "0")}`;
}

/** Réserve le numéro suivant, dans la transaction de l'émission. */
export async function reserveNumber(tx: Tx, issuerId: string, kind: Kind, date: Date) {
  const issuer = await tx.issuer.findUniqueOrThrow({ where: { id: issuerId } });
  const key = `${issuerId}:${kind}:${period(date)}`;
  const counter = await tx.documentCounter.upsert({
    where: { key },
    update: { value: { increment: 1 } },
    create: { key, value: 1 },
  });
  return formatNumber(kind === "INVOICE" ? issuer.invoicePrefix : issuer.quotePrefix, date, counter.value);
}

/** Le numéro qui serait attribué maintenant, sans le réserver (affichage). */
export async function peekNumber(tx: Tx, issuerId: string, kind: Kind, date = new Date()) {
  const issuer = await tx.issuer.findUnique({ where: { id: issuerId } });
  if (!issuer) return null;
  const counter = await tx.documentCounter.findUnique({ where: { key: `${issuerId}:${kind}:${period(date)}` } });
  return formatNumber(kind === "INVOICE" ? issuer.invoicePrefix : issuer.quotePrefix, date, (counter?.value ?? 0) + 1);
}

/**
 * Numéro saisi à la main. Refusé s'il existe déjà pour cette identité ; s'il
 * suit le format, le compteur du mois est avancé pour ne jamais le redonner.
 */
export async function claimManualNumber(tx: Tx, issuerId: string, kind: Kind, number: string, excludeId?: string) {
  const clean = number.trim();
  const taken =
    kind === "INVOICE"
      ? await tx.invoice.findFirst({ where: { issuerId, number: clean, id: excludeId ? { not: excludeId } : undefined } })
      : await tx.quote.findFirst({ where: { issuerId, number: clean, id: excludeId ? { not: excludeId } : undefined } });
  if (taken) return { ok: false as const, error: `Le numéro ${clean} est déjà utilisé pour cette identité.` };

  const match = clean.match(/^[A-Z]+-(\d{4})-(\d{2})-(\d+)$/);
  if (match) {
    const key = `${issuerId}:${kind}:${match[1]}-${match[2]}`;
    const sequence = Number(match[3]);
    const current = await tx.documentCounter.findUnique({ where: { key } });
    if (!current || current.value < sequence) {
      await tx.documentCounter.upsert({ where: { key }, update: { value: sequence }, create: { key, value: sequence } });
    }
  }
  return { ok: true as const, number: clean };
}
