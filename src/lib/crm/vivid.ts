/**
 * Couleurs vives des statuts, étapes et priorités — l'élément qui se lit
 * d'un coup d'œil dans un tableau. Le reste de l'interface garde le bleu
 * Kalimera. Teintes assez soutenues pour un texte blanc en gras lisible.
 */

export type VividOption = { value: string; label: string; color: string };

const slate = "#64748B";
const gray = "#9CA3AF";
const sky = "#0284C7";
const amber = "#D97706";
const orange = "#EA580C";
const emerald = "#059669";
const violet = "#7C3AED";
const fuchsia = "#C026D3";
const green = "#16A34A";
const teal = "#0D9488";
const rose = "#E11D48";
const indigo = "#4F46E5";

export const dealStageOptions: VividOption[] = [
  { value: "LEAD", label: "Piste", color: slate },
  { value: "DISCOVERY", label: "Découverte", color: sky },
  { value: "PROPOSAL", label: "Devis envoyé", color: amber },
  { value: "NEGOTIATION", label: "Négociation", color: orange },
  { value: "WON", label: "Signé", color: emerald },
  { value: "IN_PROGRESS", label: "En production", color: violet },
  { value: "REVIEW", label: "Recette", color: fuchsia },
  { value: "DELIVERED", label: "Livré", color: green },
  { value: "MAINTENANCE", label: "Maintenance", color: teal },
  { value: "LOST", label: "Perdu", color: rose },
];

export const taskStatusOptions: VividOption[] = [
  { value: "TODO", label: "À faire", color: slate },
  { value: "DOING", label: "En cours", color: amber },
  { value: "DONE", label: "Fait", color: emerald },
];

export const taskPriorityOptions: VividOption[] = [
  { value: "LOW", label: "Basse", color: sky },
  { value: "NORMAL", label: "Normale", color: indigo },
  { value: "HIGH", label: "Haute", color: rose },
];

export const clientStatusOptions: VividOption[] = [
  { value: "LEAD", label: "Piste", color: slate },
  { value: "PROSPECT", label: "Prospect", color: amber },
  { value: "ACTIVE", label: "Client actif", color: emerald },
  { value: "PAST", label: "Ancien client", color: sky },
  { value: "ARCHIVED", label: "Archivé", color: gray },
];

export const quoteStatusOptions: VividOption[] = [
  { value: "DRAFT", label: "Brouillon", color: slate },
  { value: "SENT", label: "Envoyé", color: sky },
  { value: "VIEWED", label: "Consulté", color: violet },
  { value: "SIGNED", label: "Accepté", color: emerald },
  { value: "DECLINED", label: "Refusé", color: rose },
  { value: "EXPIRED", label: "Expiré", color: orange },
  { value: "CANCELLED", label: "Annulé", color: gray },
];

export const invoiceStateOptions: VividOption[] = [
  { value: "DRAFT", label: "Brouillon", color: slate },
  { value: "ISSUED", label: "À encaisser", color: amber },
  { value: "PARTIAL", label: "Partiel", color: sky },
  { value: "OVERDUE", label: "En retard", color: rose },
  { value: "PAID", label: "Payée", color: emerald },
  { value: "CANCELLED", label: "Annulée", color: gray },
];

export const messageStatusOptions: VividOption[] = [
  { value: "NEW", label: "Nouvelle", color: sky },
  { value: "READ", label: "Traitée", color: emerald },
  { value: "ARCHIVED", label: "Archivée", color: gray },
];

export function optionOf(options: VividOption[], value: string | null | undefined) {
  return options.find((option) => option.value === value) ?? { value: value ?? "", label: value ?? "—", color: gray };
}
