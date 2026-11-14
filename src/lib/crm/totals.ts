/**
 * Calcul des lignes et des totaux d'un devis ou d'une facture.
 *
 * Arrondi au centime ligne par ligne, puis TVA regroupée par taux : c'est la
 * présentation qu'attend un comptable, et elle évite qu'un total diffère d'un
 * centime de la somme des lignes affichées.
 */

export type LineInput = {
  kind: "ITEM" | "SECTION";
  title: string;
  description?: string | null;
  quantity: number;
  unit?: string | null;
  unitPriceCents: number;
  vatRate: number;
  discountPercent: number;
};

export function lineTotalCents(line: Pick<LineInput, "kind" | "quantity" | "unitPriceCents" | "discountPercent">) {
  if (line.kind === "SECTION") return 0;
  const gross = line.quantity * line.unitPriceCents;
  return Math.round(gross * (1 - (line.discountPercent || 0) / 100));
}

export function computeTotals(lines: LineInput[], vatExempt = false) {
  const byRate = new Map<number, number>();
  let subtotal = 0;

  for (const line of lines) {
    if (line.kind === "SECTION") continue;
    const total = lineTotalCents(line);
    subtotal += total;
    const rate = vatExempt ? 0 : line.vatRate;
    byRate.set(rate, (byRate.get(rate) ?? 0) + total);
  }

  const vatLines = [...byRate.entries()]
    .filter(([rate]) => rate > 0)
    .sort(([a], [b]) => b - a)
    .map(([rate, base]) => ({ rate, base, amount: Math.round((base * rate) / 100) }));

  const vat = vatLines.reduce((sum, line) => sum + line.amount, 0);
  return { subtotalCents: subtotal, vatCents: vat, totalCents: subtotal + vat, vatLines };
}

/** Lit les lignes envoyées par l'éditeur (JSON dans un champ caché). */
export function parseLines(raw: FormDataEntryValue | null): LineInput[] {
  if (typeof raw !== "string" || raw === "") return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, 200).flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const line = item as Record<string, unknown>;
      const title = String(line.title ?? "").trim().slice(0, 300);
      if (!title) return [];
      const num = (value: unknown, fallback: number) => {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
      };
      return [
        {
          kind: line.kind === "SECTION" ? "SECTION" : "ITEM",
          title,
          description: line.description ? String(line.description).slice(0, 4000) : null,
          quantity: Math.max(0, num(line.quantity, 1)),
          unit: line.unit ? String(line.unit).slice(0, 30) : null,
          unitPriceCents: Math.round(num(line.unitPriceCents, 0)),
          vatRate: Math.min(100, Math.max(0, num(line.vatRate, 20))),
          discountPercent: Math.min(100, Math.max(0, num(line.discountPercent, 0))),
        } satisfies LineInput,
      ];
    });
  } catch {
    return [];
  }
}
