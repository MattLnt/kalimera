import { Download, ExternalLink, FileMinus, Pencil, Trash2, X } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createCreditNote, deleteInvoice, deletePayment, sendInvoice, sendInvoiceTest } from "../actions";
import { IssueForm, PaymentForm } from "./invoice-actions";

import { EmailComposer } from "@/components/admin/crm/email-composer";
import { invoiceEmailDefaults } from "@/lib/crm/documents/email-content";
import { senderFromIssuer } from "@/lib/crm/documents/email-template";
import { AdminHeader, Panel, Pill } from "@/components/admin/ui";
import { invoiceDoc } from "@/lib/crm/documents/build";
import { money, renderDocument } from "@/lib/crm/documents/render";
import { formatDate, formatRelative, toDateInput } from "@/lib/crm/format";
import { invoiceKind, invoiceStatus, toneClasses } from "@/lib/crm/labels";
import { peekNumber } from "@/lib/crm/numbering";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id }, select: { number: true, title: true } });
  return { title: invoice?.number ?? invoice?.title ?? "Facture" };
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      lines: true,
      client: { include: { contacts: { where: { isPrimary: true }, take: 1 } } },
      issuer: true,
      quote: { select: { id: true, number: true } },
      payments: { orderBy: { receivedAt: "asc" } },
      activities: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });
  if (!invoice) notFound();
  const emailDefaults = invoiceEmailDefaults(invoice, { firstName: invoice.client.contacts[0]?.firstName });

  const credited = invoice.creditedInvoiceId
    ? await prisma.invoice.findUnique({ where: { id: invoice.creditedInvoiceId }, select: { id: true, number: true } })
    : null;

  const html = renderDocument(invoiceDoc(invoice));
  const paid = invoice.payments.reduce((sum, payment) => sum + payment.amountCents, 0);
  const remaining = Math.max(0, invoice.totalCents - paid);
  const overdue = invoice.status === "ISSUED" && invoice.dueDate && invoice.dueDate < new Date();
  const state = overdue ? "OVERDUE" : invoice.status === "ISSUED" && paid > 0 ? "PARTIAL" : invoice.status;
  const suggested = invoice.status === "DRAFT" && invoice.issuerId ? await peekNumber(prisma, invoice.issuerId, "INVOICE") : null;
  const today = toDateInput(new Date());
  const isCredit = invoice.kind === "CREDIT_NOTE";

  const small = "inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3.5 py-2 font-display text-[0.8125rem] font-bold shadow-soft transition-colors hover:bg-aegean-50";

  return (
    <>
      <AdminHeader
        title={invoice.number ?? `${invoiceKind[invoice.kind]} en brouillon`}
        subtitle={invoice.title}
        back={{ href: "/admin/invoices", label: "Factures" }}
        action={
          <div className="flex flex-wrap gap-2">
            {invoice.status === "DRAFT" ? (
              <Link href={`/admin/invoices/${invoice.id}/edit`} className={small}>
                <Pencil className="size-4" />
                Modifier
              </Link>
            ) : null}
            <a href={`/admin/invoices/${invoice.id}/preview`} target="_blank" rel="noreferrer" className={small}>
              <ExternalLink className="size-4" />
              Aperçu
            </a>
            <a href={`/admin/invoices/${invoice.id}/pdf`} target="_blank" rel="noreferrer" className={small}>
              <Download className="size-4" />
              PDF
            </a>
          </div>
        }
      />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="overflow-hidden rounded-[18px] bg-white shadow-lift ring-1 ring-black/5">
          <iframe title="Facture" srcDoc={html} className="h-[calc(100dvh-9rem)] min-h-[640px] w-full" />
        </div>

        <div className="flex flex-col gap-4">
          <Panel>
            <div className="flex flex-wrap items-center gap-2">
              <Pill className={toneClasses[invoiceStatus[state].tone]}>{invoiceStatus[state].label}</Pill>
              <span className="font-display text-xl font-extrabold tracking-[-0.03em]">{money(invoice.totalCents, invoice.currency)}</span>
            </div>
            {!isCredit && invoice.status !== "DRAFT" ? (
              <div className="mt-4">
                <div className="mb-1.5 flex justify-between text-xs font-bold text-[var(--ink-45)]">
                  <span>Encaissé {money(paid, invoice.currency)}</span>
                  <span>Reste {money(remaining, invoice.currency)}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-black/5">
                  <div className="h-full rounded-full bg-green-500" style={{ width: `${invoice.totalCents ? Math.min(100, (paid / invoice.totalCents) * 100) : 0}%` }} />
                </div>
              </div>
            ) : null}
            <dl className="mt-4 grid grid-cols-2 gap-3 text-[0.8125rem]">
              <div>
                <dt className="text-[var(--ink-45)]">Client</dt>
                <dd>
                  <Link href={`/admin/clients/${invoice.clientId}`} className="font-display font-bold text-aegean-700 hover:underline">
                    {invoice.client.name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-[var(--ink-45)]">Émise au nom de</dt>
                <dd className="font-display font-bold">{invoice.issuer?.label ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[var(--ink-45)]">Émise le</dt>
                <dd className="font-display font-bold">{formatDate(invoice.issueDate)}</dd>
              </div>
              <div>
                <dt className="text-[var(--ink-45)]">Échéance</dt>
                <dd className={overdue ? "font-display font-bold text-[#0B3A75]" : "font-display font-bold"}>{formatDate(invoice.dueDate)}</dd>
              </div>
              {invoice.quote ? (
                <div>
                  <dt className="text-[var(--ink-45)]">Devis</dt>
                  <dd>
                    <Link href={`/admin/quotes/${invoice.quote.id}`} className="font-display font-bold text-aegean-700 hover:underline">
                      {invoice.quote.number}
                    </Link>
                  </dd>
                </div>
              ) : null}
              {credited ? (
                <div>
                  <dt className="text-[var(--ink-45)]">Annule</dt>
                  <dd>
                    <Link href={`/admin/invoices/${credited.id}`} className="font-display font-bold text-aegean-700 hover:underline">
                      {credited.number}
                    </Link>
                  </dd>
                </div>
              ) : null}
            </dl>
            {invoice.sentAt ? <p className="mt-3 text-xs text-[var(--ink-45)]">Envoyée {formatRelative(invoice.sentAt)}</p> : null}
            {invoice.number ? (
              <a href={`${getSiteUrl()}/documents/${invoice.token}`} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 font-display text-xs font-bold text-aegean-700 hover:underline">
                <ExternalLink className="size-3.5" />
                Page vue par le client
              </a>
            ) : null}
          </Panel>

          {invoice.status === "DRAFT" ? (
            <Panel title={isCredit ? "Émettre l'avoir" : "Émettre la facture"} description="Attribue le numéro définitif. Ensuite, la facture ne se modifie plus.">
              <IssueForm id={invoice.id} suggestedNumber={suggested} today={today} />
            </Panel>
          ) : null}

          {invoice.status !== "CANCELLED" ? (
            <Panel title="Envoyer au client" description={invoice.number ? undefined : "Rédigez l'e-mail et recevez un test dès maintenant ; l'envoi au client se fait une fois la facture émise."}>
              <EmailComposer
                id={invoice.id}
                defaultTo={invoice.client.contacts[0]?.email ?? invoice.client.email ?? ""}
                defaultSubject={emailDefaults.subject}
                defaultBody={emailDefaults.body}
                sender={senderFromIssuer(invoice.issuer, invoice.issuer?.name ?? "Kalimera")}
                sendAction={sendInvoice}
                testAction={sendInvoiceTest}
                sendLabel={invoice.sentAt ? "Renvoyer par e-mail" : "Envoyer par e-mail"}
                canSend={Boolean(invoice.number)}
                sendHint="Émettez la facture pour pouvoir l'envoyer au client."
              />
            </Panel>
          ) : null}

          {!isCredit && invoice.status !== "DRAFT" ? (
            <Panel title="Virements reçus">
              {invoice.payments.length ? (
                <ul className="mb-4 grid gap-1.5">
                  {invoice.payments.map((payment) => (
                    <li key={payment.id} className="group flex items-center gap-2 rounded-field bg-green-50/60 px-3 py-2 text-[0.875rem]">
                      <span className="font-display font-bold">{money(payment.amountCents, invoice.currency)}</span>
                      <span className="flex-1 truncate text-xs text-[var(--ink-45)]">
                        {formatDate(payment.receivedAt)}
                        {payment.reference ? ` · ${payment.reference}` : ""}
                      </span>
                      <form action={deletePayment} className="opacity-0 transition-opacity group-hover:opacity-100">
                        <input type="hidden" name="paymentId" value={payment.id} />
                        <button type="submit" aria-label="Supprimer ce virement" className="grid size-7 cursor-pointer place-items-center rounded-full text-[var(--ink-45)] hover:bg-[#EEF3FA] hover:text-[#0B3A75]">
                          <X className="size-3.5" />
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              ) : null}
              {remaining > 0 && invoice.status !== "CANCELLED" ? (
                <PaymentForm id={invoice.id} remaining={(remaining / 100).toFixed(2).replace(".", ",")} today={today} />
              ) : (
                <p className="text-[0.875rem] text-green-700">Facture entièrement réglée{invoice.paidAt ? ` le ${formatDate(invoice.paidAt)}` : ""}.</p>
              )}
            </Panel>
          ) : null}

          {!isCredit && invoice.number && invoice.status !== "CANCELLED" ? (
            <form action={createCreditNote}>
              <input type="hidden" name="id" value={invoice.id} />
              <button type="submit" className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 font-display text-sm font-bold text-[var(--ink-65)] hover:bg-black/5">
                <FileMinus className="size-4" />
                Annuler par un avoir
              </button>
            </form>
          ) : null}

          {invoice.status === "DRAFT" ? (
            <form action={deleteInvoice}>
              <input type="hidden" name="id" value={invoice.id} />
              <button type="submit" className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 font-display text-sm font-bold text-[#0B3A75] hover:bg-[#EEF3FA]">
                <Trash2 className="size-4" />
                Supprimer le brouillon
              </button>
            </form>
          ) : null}

          {invoice.activities.length ? (
            <Panel title="Historique">
              <ul className="grid gap-2 text-[0.8125rem]">
                {invoice.activities.map((activity) => (
                  <li key={activity.id} className="flex gap-2">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-aegean-400" />
                    <span className="flex-1 text-[var(--ink-65)]">{activity.message}</span>
                    <span className="shrink-0 text-[var(--ink-45)]">{formatRelative(activity.createdAt)}</span>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
        </div>
      </div>
    </>
  );
}
