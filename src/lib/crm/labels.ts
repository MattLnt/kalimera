import type {
  ClientStatus,
  DealStage,
  InvoiceKind,
  InvoiceStatus,
  NoteKind,
  QuoteStatus,
  TaskPriority,
  TaskStatus,
} from "@/generated/prisma/enums";

type Tone = "neutral" | "blue" | "amber" | "green" | "red";

export const toneClasses: Record<Tone, string> = {
  neutral: "bg-[#ECEFF3] text-[#475569]",
  blue: "bg-[#E3EFFC] text-[#155399]",
  amber: "bg-[#FCEFDC] text-[#9B5505]",
  green: "bg-[#DCF1EA] text-[#046C4E]",
  red: "bg-[#FCE3E3] text-[#A01C1C]",
};

export const toneDots: Record<Tone, string> = {
  neutral: "bg-[#64748B]",
  blue: "bg-[#1F7AE0]",
  amber: "bg-[#D97706]",
  green: "bg-[#059669]",
  red: "bg-[#DC2626]",
};

export const clientStatus: Record<ClientStatus, { label: string; tone: Tone }> = {
  LEAD: { label: "Piste", tone: "neutral" },
  PROSPECT: { label: "Prospect", tone: "blue" },
  ACTIVE: { label: "Client actif", tone: "green" },
  PAST: { label: "Ancien client", tone: "neutral" },
  ARCHIVED: { label: "Archivé", tone: "neutral" },
};

/**
 * Étapes du projet, dans l'ordre du tableau. `phase` sépare la vente de la
 * production : le tableau de bord additionne l'une ou l'autre.
 */
export const dealStages: { value: DealStage; label: string; tone: Tone; phase: "sales" | "production" | "closed" }[] = [
  { value: "LEAD", label: "Piste", tone: "neutral", phase: "sales" },
  { value: "DISCOVERY", label: "Découverte", tone: "blue", phase: "sales" },
  { value: "PROPOSAL", label: "Devis envoyé", tone: "amber", phase: "sales" },
  { value: "NEGOTIATION", label: "Négociation", tone: "amber", phase: "sales" },
  { value: "WON", label: "Signé", tone: "green", phase: "production" },
  { value: "IN_PROGRESS", label: "En production", tone: "blue", phase: "production" },
  { value: "REVIEW", label: "Recette", tone: "amber", phase: "production" },
  { value: "DELIVERED", label: "Livré", tone: "green", phase: "closed" },
  { value: "MAINTENANCE", label: "Maintenance", tone: "green", phase: "closed" },
  { value: "LOST", label: "Perdu", tone: "red", phase: "closed" },
];

export const dealStage = Object.fromEntries(dealStages.map((stage) => [stage.value, stage])) as Record<
  DealStage,
  (typeof dealStages)[number]
>;

export const taskStatus: Record<TaskStatus, { label: string; tone: Tone }> = {
  TODO: { label: "À faire", tone: "neutral" },
  DOING: { label: "En cours", tone: "blue" },
  DONE: { label: "Fait", tone: "green" },
};

export const taskPriority: Record<TaskPriority, { label: string; tone: Tone }> = {
  LOW: { label: "Basse", tone: "neutral" },
  NORMAL: { label: "Normale", tone: "blue" },
  HIGH: { label: "Haute", tone: "red" },
};

export const noteKind: Record<NoteKind, { label: string; tone: Tone }> = {
  CALL: { label: "Appel", tone: "neutral" },
  MEETING: { label: "Réunion", tone: "neutral" },
  EMAIL: { label: "E-mail", tone: "neutral" },
  NOTE: { label: "Note", tone: "neutral" },
};

export const quoteStatus: Record<QuoteStatus, { label: string; tone: Tone }> = {
  DRAFT: { label: "Brouillon", tone: "neutral" },
  SENT: { label: "Envoyé", tone: "amber" },
  VIEWED: { label: "Consulté", tone: "amber" },
  SIGNED: { label: "Accepté", tone: "green" },
  DECLINED: { label: "Refusé", tone: "red" },
  EXPIRED: { label: "Expiré", tone: "red" },
  CANCELLED: { label: "Annulé", tone: "neutral" },
};

export const invoiceKind: Record<InvoiceKind, string> = {
  DEPOSIT: "Facture d'acompte",
  BALANCE: "Facture de solde",
  STANDARD: "Facture",
  CREDIT_NOTE: "Avoir",
};

export const invoiceStatus: Record<InvoiceStatus | "OVERDUE" | "PARTIAL", { label: string; tone: Tone }> = {
  DRAFT: { label: "Brouillon", tone: "neutral" },
  ISSUED: { label: "À encaisser", tone: "amber" },
  PARTIAL: { label: "Paiement partiel", tone: "amber" },
  OVERDUE: { label: "En retard", tone: "red" },
  PAID: { label: "Payée", tone: "green" },
  CANCELLED: { label: "Annulée", tone: "neutral" },
};
