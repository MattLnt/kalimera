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

type Tone = "neutral" | "blue" | "amber" | "green" | "red" | "violet";

export const toneClasses: Record<Tone, string> = {
  neutral: "bg-black/5 text-[var(--ink-65)]",
  blue: "bg-aegean-100 text-aegean-800",
  amber: "bg-amber-100 text-amber-800",
  green: "bg-green-100 text-green-800",
  red: "bg-red-100 text-red-700",
  violet: "bg-violet-100 text-violet-800",
};

export const toneDots: Record<Tone, string> = {
  neutral: "bg-black/30",
  blue: "bg-aegean-500",
  amber: "bg-amber-500",
  green: "bg-green-600",
  red: "bg-red-500",
  violet: "bg-violet-500",
};

export const clientStatus: Record<ClientStatus, { label: string; tone: Tone }> = {
  LEAD: { label: "Piste", tone: "neutral" },
  PROSPECT: { label: "Prospect", tone: "amber" },
  ACTIVE: { label: "Client actif", tone: "green" },
  PAST: { label: "Ancien client", tone: "blue" },
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
  { value: "IN_PROGRESS", label: "En production", tone: "violet", phase: "production" },
  { value: "REVIEW", label: "Recette", tone: "violet", phase: "production" },
  { value: "DELIVERED", label: "Livré", tone: "green", phase: "closed" },
  { value: "MAINTENANCE", label: "Maintenance", tone: "blue", phase: "closed" },
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
  CALL: { label: "Appel", tone: "blue" },
  MEETING: { label: "Réunion", tone: "violet" },
  EMAIL: { label: "E-mail", tone: "amber" },
  NOTE: { label: "Note", tone: "neutral" },
};

export const quoteStatus: Record<QuoteStatus, { label: string; tone: Tone }> = {
  DRAFT: { label: "Brouillon", tone: "neutral" },
  SENT: { label: "Envoyé", tone: "blue" },
  VIEWED: { label: "Consulté", tone: "violet" },
  SIGNED: { label: "Signé", tone: "green" },
  DECLINED: { label: "Refusé", tone: "red" },
  EXPIRED: { label: "Expiré", tone: "amber" },
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
  PARTIAL: { label: "Paiement partiel", tone: "blue" },
  OVERDUE: { label: "En retard", tone: "red" },
  PAID: { label: "Payée", tone: "green" },
  CANCELLED: { label: "Annulée", tone: "neutral" },
};
