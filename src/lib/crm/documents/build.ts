import "server-only";

import type { Client, Invoice, InvoiceLine, Issuer, Quote, QuoteLine } from "@/generated/prisma/client";
import type { DocClient, DocIssuer, InvoiceDoc, QuoteDoc } from "@/lib/crm/documents/render";
import { lineTotalCents } from "@/lib/crm/totals";

/** Ce qui s'imprime de l'identité : figé dans le document à l'émission. */
export function issuerSnapshot(issuer: Issuer): DocIssuer {
  return {
    name: issuer.name,
    headerLines: issuer.headerLines,
    footer: issuer.footer,
    vatMention: issuer.vatMention,
    paymentTerms: issuer.paymentTerms,
    latePenalty: issuer.latePenalty,
    recoveryFee: issuer.recoveryFee,
    bankHolder: issuer.bankHolder,
    bankName: issuer.bankName,
    iban: issuer.iban,
    bic: issuer.bic,
  };
}

/** Le client tel qu'il s'imprime : nom seul si `printAddress` est faux. */
export function clientSnapshot(client: Client): DocClient {
  const name = client.legalName || client.name;
  if (!client.printAddress) return { name, addressLines: [] };
  const cityLine = [client.postalCode, client.city].filter(Boolean).join(" ");
  return {
    name,
    addressLines: [client.addressLine1, client.addressLine2, cityLine, client.country !== "FR" ? client.country : null].filter(
      (line): line is string => Boolean(line && line.trim()),
    ),
  };
}

const emptyIssuer: DocIssuer = { name: "Identité à choisir", headerLines: "", footer: "" };

type QuoteWith = Quote & { lines: QuoteLine[]; client: Client; issuer: Issuer | null };
type InvoiceWith = Invoice & { lines: InvoiceLine[]; client: Client; issuer: Issuer | null };

/**
 * Une fois émis, un document se rend depuis ses instantanés : changer
 * l'adresse d'un client ou d'une identité ne modifie pas une facture passée.
 */
export function quoteDoc(quote: QuoteWith): QuoteDoc {
  const issuer = (quote.issuerSnapshot as DocIssuer | null) ?? (quote.issuer ? issuerSnapshot(quote.issuer) : emptyIssuer);
  const client = (quote.clientSnapshot as DocClient | null) ?? clientSnapshot(quote.client);
  return {
    kind: "QUOTE",
    number: quote.number,
    date: quote.issueDate ?? new Date(),
    currency: quote.currency,
    title: quote.title,
    issuer,
    client,
    lines: quote.lines
      .filter((line) => line.kind === "ITEM")
      .sort((a, b) => a.position - b.position)
      .map((line) => ({ title: line.title, description: line.description, amountCents: lineTotalCents(line) })),
    totalCents: quote.totalCents,
    draft: quote.status === "DRAFT",
    validityDays: quote.validityDays,
    context: quote.context,
    perimeter: quote.perimeter,
    stack: quote.stack,
    depositPercent: quote.depositPercent,
    paymentNote: quote.paymentNote,
    delay: quote.delay,
    outOfScope: quote.outOfScope,
    evolutions: quote.evolutions,
    terms: quote.terms,
    signature:
      quote.status === "SIGNED" && quote.acceptedVia === "SIGNATURE" && quote.signedAt
        ? {
            mode: "SIGNATURE",
            name: quote.signerName ?? quote.client.name,
            signedAt: quote.signedAt,
            image: quote.signatureImage,
            ip: quote.signerIp,
            hash: quote.signedHash,
          }
        : quote.status === "SIGNED" && quote.acceptedVia && quote.signedAt
          ? { mode: quote.acceptedVia as "VERBAL" | "EMAIL" | "PURCHASE_ORDER" | "OTHER", acceptedAt: quote.signedAt, note: quote.acceptanceNote }
          : null,
  };
}

export function invoiceDoc(invoice: InvoiceWith): InvoiceDoc {
  const issuer = (invoice.issuerSnapshot as DocIssuer | null) ?? (invoice.issuer ? issuerSnapshot(invoice.issuer) : emptyIssuer);
  const client = (invoice.clientSnapshot as DocClient | null) ?? clientSnapshot(invoice.client);
  return {
    kind: "INVOICE",
    docType: invoice.kind === "CREDIT_NOTE" ? "AVOIR" : "FACTURE",
    number: invoice.number,
    date: invoice.issueDate ?? new Date(),
    currency: invoice.currency,
    title: invoice.title,
    issuer,
    client,
    lines: invoice.lines
      .filter((line) => line.kind === "ITEM")
      .sort((a, b) => a.position - b.position)
      .map((line) => ({ title: line.title, description: line.description, amountCents: lineTotalCents(line) })),
    totalCents: invoice.totalCents,
    draft: invoice.status === "DRAFT",
    contextLine: invoice.contextLine,
    notes: invoice.notes,
  };
}

/**
 * Empreinte du contenu engageant d'un devis : ce que le client signe. Toute
 * modification ultérieure change l'empreinte et se voit.
 */
export function quoteFingerprintPayload(doc: QuoteDoc) {
  return JSON.stringify({
    number: doc.number,
    date: doc.date.toISOString().slice(0, 10),
    currency: doc.currency,
    title: doc.title,
    issuer: doc.issuer.name,
    client: doc.client,
    lines: doc.lines,
    total: doc.totalCents,
    deposit: doc.depositPercent,
    context: doc.context,
    perimeter: doc.perimeter,
    delay: doc.delay,
    outOfScope: doc.outOfScope,
    terms: doc.terms,
  });
}
