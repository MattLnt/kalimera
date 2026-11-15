/**
 * Couleurs des statuts : une palette froide, un seul sens partout.
 *
 * - gris clair  : annulé, perdu, classé
 * - gris-bleu   : pas commencé, brouillon
 * - bleu        : en cours, de notre côté
 * - bleu-vert   : en attente du client
 * - vert        : gagné, fait, payé
 * - bleu nuit   : en retard, urgent (le plus foncé, donc le plus visible)
 */

export type VividOption = { value: string; label: string; color: string; /** Pastille pleine plutôt que teintée. */ solid?: boolean };

export const statusColors = {
  muted: "#94A3B8",
  neutral: "#64748B",
  active: "#1F7AE0",
  waiting: "#0E9AA7",
  done: "#059669",
  urgent: "#0B3A75",
} as const;

const { muted, neutral, active, waiting, done, urgent } = statusColors;

/**
 * Étapes d'un projet : pastilles pleines, une teinte bien distincte par
 * étape (clair / foncé, bleu / turquoise / vert / gris), dans l'ordre du
 * parcours. Le texte passe en foncé sur les teintes claires.
 */
export const dealStageOptions: VividOption[] = [
  { value: "LEAD", label: "Piste", color: "#CBD5E1", solid: true },
  { value: "DISCOVERY", label: "Découverte", color: "#7DD3FC", solid: true },
  { value: "PROPOSAL", label: "Devis envoyé", color: "#2563EB", solid: true },
  { value: "NEGOTIATION", label: "Négociation", color: "#1E3A8A", solid: true },
  { value: "WON", label: "Signé", color: "#5EEAD4", solid: true },
  { value: "IN_PROGRESS", label: "En production", color: "#0D9488", solid: true },
  { value: "REVIEW", label: "Recette", color: "#86EFAC", solid: true },
  { value: "DELIVERED", label: "Livré", color: "#15803D", solid: true },
  { value: "MAINTENANCE", label: "Maintenance", color: "#475569", solid: true },
  { value: "LOST", label: "Perdu", color: "#94A3B8", solid: true },
];

export const taskStatusOptions: VividOption[] = [
  { value: "TODO", label: "À faire", color: neutral },
  { value: "DOING", label: "En cours", color: active },
  { value: "DONE", label: "Fait", color: done },
];

export const taskPriorityOptions: VividOption[] = [
  { value: "LOW", label: "Basse", color: neutral },
  { value: "NORMAL", label: "Normale", color: active },
  { value: "HIGH", label: "Haute", color: urgent },
];

export const clientStatusOptions: VividOption[] = [
  { value: "LEAD", label: "Piste", color: neutral },
  { value: "PROSPECT", label: "Prospect", color: active },
  { value: "ACTIVE", label: "Client actif", color: done },
  { value: "PAST", label: "Ancien client", color: neutral },
  { value: "ARCHIVED", label: "Archivé", color: muted },
];

export const quoteStatusOptions: VividOption[] = [
  { value: "DRAFT", label: "Brouillon", color: neutral },
  { value: "SENT", label: "Envoyé", color: waiting },
  { value: "VIEWED", label: "Consulté", color: waiting },
  { value: "SIGNED", label: "Accepté", color: done },
  { value: "DECLINED", label: "Refusé", color: muted },
  { value: "EXPIRED", label: "Expiré", color: muted },
  { value: "CANCELLED", label: "Annulé", color: muted },
];

export const invoiceStateOptions: VividOption[] = [
  { value: "DRAFT", label: "Brouillon", color: neutral },
  { value: "ISSUED", label: "À encaisser", color: waiting },
  { value: "PARTIAL", label: "Partiel", color: waiting },
  { value: "OVERDUE", label: "En retard", color: urgent },
  { value: "PAID", label: "Payée", color: done },
  { value: "CANCELLED", label: "Annulée", color: muted },
];

export const messageStatusOptions: VividOption[] = [
  { value: "NEW", label: "Nouvelle", color: active },
  { value: "READ", label: "Lue", color: neutral },
  { value: "ARCHIVED", label: "Archivée", color: muted },
];

export function optionOf(options: VividOption[], value: string | null | undefined) {
  return options.find((option) => option.value === value) ?? { value: value ?? "", label: value ?? "—", color: neutral };
}
