/**
 * Couleurs des statuts : cinq couleurs, un seul sens, partout dans l'admin.
 *
 * - gris  : pas commencé, brouillon, classé
 * - bleu  : en cours, de notre côté
 * - ambre : en attente du client, à surveiller
 * - vert  : gagné, fait, payé
 * - rouge : problème, perdu, en retard
 *
 * Deux statuts peuvent partager une couleur : c'est le sens qui compte, le
 * libellé fait la différence.
 */

export type VividOption = { value: string; label: string; color: string };

export const statusColors = {
  neutral: "#64748B",
  active: "#1F7AE0",
  waiting: "#D97706",
  done: "#059669",
  problem: "#DC2626",
} as const;

const { neutral, active, waiting, done, problem } = statusColors;

export const dealStageOptions: VividOption[] = [
  { value: "LEAD", label: "Piste", color: neutral },
  { value: "DISCOVERY", label: "Découverte", color: active },
  { value: "PROPOSAL", label: "Devis envoyé", color: waiting },
  { value: "NEGOTIATION", label: "Négociation", color: waiting },
  { value: "WON", label: "Signé", color: done },
  { value: "IN_PROGRESS", label: "En production", color: active },
  { value: "REVIEW", label: "Recette", color: waiting },
  { value: "DELIVERED", label: "Livré", color: done },
  { value: "MAINTENANCE", label: "Maintenance", color: done },
  { value: "LOST", label: "Perdu", color: problem },
];

export const taskStatusOptions: VividOption[] = [
  { value: "TODO", label: "À faire", color: neutral },
  { value: "DOING", label: "En cours", color: active },
  { value: "DONE", label: "Fait", color: done },
];

export const taskPriorityOptions: VividOption[] = [
  { value: "LOW", label: "Basse", color: neutral },
  { value: "NORMAL", label: "Normale", color: active },
  { value: "HIGH", label: "Haute", color: problem },
];

export const clientStatusOptions: VividOption[] = [
  { value: "LEAD", label: "Piste", color: neutral },
  { value: "PROSPECT", label: "Prospect", color: active },
  { value: "ACTIVE", label: "Client actif", color: done },
  { value: "PAST", label: "Ancien client", color: neutral },
  { value: "ARCHIVED", label: "Archivé", color: neutral },
];

export const quoteStatusOptions: VividOption[] = [
  { value: "DRAFT", label: "Brouillon", color: neutral },
  { value: "SENT", label: "Envoyé", color: waiting },
  { value: "VIEWED", label: "Consulté", color: waiting },
  { value: "SIGNED", label: "Accepté", color: done },
  { value: "DECLINED", label: "Refusé", color: problem },
  { value: "EXPIRED", label: "Expiré", color: problem },
  { value: "CANCELLED", label: "Annulé", color: neutral },
];

export const invoiceStateOptions: VividOption[] = [
  { value: "DRAFT", label: "Brouillon", color: neutral },
  { value: "ISSUED", label: "À encaisser", color: waiting },
  { value: "PARTIAL", label: "Partiel", color: waiting },
  { value: "OVERDUE", label: "En retard", color: problem },
  { value: "PAID", label: "Payée", color: done },
  { value: "CANCELLED", label: "Annulée", color: neutral },
];

export const messageStatusOptions: VividOption[] = [
  { value: "NEW", label: "Nouvelle", color: active },
  { value: "READ", label: "Lue", color: neutral },
  { value: "ARCHIVED", label: "Archivée", color: neutral },
];

export function optionOf(options: VividOption[], value: string | null | undefined) {
  return options.find((option) => option.value === value) ?? { value: value ?? "", label: value ?? "—", color: neutral };
}
