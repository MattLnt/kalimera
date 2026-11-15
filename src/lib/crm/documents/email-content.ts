/**
 * Objet, texte et récapitulatif par défaut des e-mails de devis et de
 * facture. Le texte est pré-rempli dans l'admin et entièrement modifiable ;
 * la signature est ajoutée à part, sous le texte.
 */

import type { EmailSummary } from "@/lib/crm/documents/email-template";

const money = (cents: number, currency: string) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(cents / 100).replace(/ | /g, " ");
const day = (date: Date) => new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(date);

const hello = (firstName?: string | null) => (firstName ? `Bonjour ${firstName},` : "Bonjour,");

type QuoteLike = { number: string | null; title: string; totalCents: number; currency: string; validityDays: number; requireSignature: boolean; validUntil?: Date | null };

export function quoteEmailDefaults(quote: QuoteLike, options: { firstName?: string | null; number?: string | null } = {}) {
  const number = quote.number ?? options.number ?? null;
  return {
    subject: `Devis${number ? ` ${number}` : ""} — ${quote.title}`,
    body: [
      hello(options.firstName),
      `Vous trouverez ci-joint notre devis pour « ${quote.title} », d'un montant de ${money(quote.totalCents, quote.currency)}.`,
      quote.requireSignature
        ? `Vous pouvez le consulter et le signer en ligne en quelques secondes depuis le bouton ci-dessous. Il est valable ${quote.validityDays} jours.`
        : `Vous pouvez le consulter en ligne depuis le bouton ci-dessous. Il est valable ${quote.validityDays} jours.`,
      "Je reste à votre disposition pour toute question ou ajustement.",
      "Bien cordialement,",
    ].join("\n\n"),
  };
}

export function quoteEmailSummary(quote: QuoteLike, number?: string | null): EmailSummary {
  const validUntil = quote.validUntil ?? new Date(Date.now() + quote.validityDays * 86_400_000);
  return [
    { label: "Devis", value: quote.number ?? number ?? "—" },
    { label: "Valable jusqu'au", value: day(validUntil) },
    { label: "Montant", value: money(quote.totalCents, quote.currency), strong: true },
  ];
}

type InvoiceLike = { number: string | null; title: string; kind: string; totalCents: number; currency: string; dueDate?: Date | null };

export function invoiceEmailDefaults(invoice: InvoiceLike, options: { firstName?: string | null } = {}) {
  const credit = invoice.kind === "CREDIT_NOTE";
  const label = credit ? "Avoir" : "Facture";
  return {
    subject: `${label}${invoice.number ? ` ${invoice.number}` : ""} — ${invoice.title}`,
    body: [
      hello(options.firstName),
      credit
        ? `Vous trouverez ci-joint notre avoir pour « ${invoice.title} », d'un montant de ${money(invoice.totalCents, invoice.currency)}.`
        : `Vous trouverez ci-joint la facture pour « ${invoice.title} », d'un montant de ${money(invoice.totalCents, invoice.currency)}${invoice.dueDate ? `, à régler par virement avant le ${day(invoice.dueDate)}` : ""}.`,
      credit ? "" : "Les coordonnées bancaires figurent sur la facture.",
      "Merci pour votre confiance.",
      "Bien cordialement,",
    ]
      .filter(Boolean)
      .join("\n\n"),
  };
}

export function invoiceEmailSummary(invoice: InvoiceLike): EmailSummary {
  const credit = invoice.kind === "CREDIT_NOTE";
  return [
    { label: credit ? "Avoir" : "Facture", value: invoice.number ?? "Brouillon" },
    ...(invoice.dueDate && !credit ? [{ label: "Échéance", value: day(invoice.dueDate) }] : []),
    { label: credit ? "Montant" : "Montant à régler", value: money(invoice.totalCents, invoice.currency), strong: true },
  ];
}
