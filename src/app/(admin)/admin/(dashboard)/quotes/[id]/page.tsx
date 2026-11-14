import { Copy, Download, ExternalLink, Pencil, Receipt, Trash2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteQuote, duplicateQuote, invoiceFromQuote, setQuoteStatus } from "../actions";
import { AcceptQuoteForm, ActionTabs, SendQuoteForm } from "./quote-actions";

import { AdminHeader, Panel, Pill } from "@/components/admin/ui";
import { quoteDoc } from "@/lib/crm/documents/build";
import { money, renderDocument } from "@/lib/crm/documents/render";
import { formatDate, formatDateTime, formatRelative, toDateInput } from "@/lib/crm/format";
import { invoiceKind, quoteStatus, toneClasses } from "@/lib/crm/labels";
import { peekNumber } from "@/lib/crm/numbering";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await prisma.quote.findUnique({ where: { id }, select: { number: true, title: true } });
  return { title: quote?.number ?? quote?.title ?? "Devis" };
}

const acceptance: Record<string, string> = {
  SIGNATURE: "Signé en ligne",
  VERBAL: "Accepté à l'oral",
  EMAIL: "Accepté par e-mail",
  PURCHASE_ORDER: "Accepté sur bon de commande",
  OTHER: "Accepté",
};

export default async function QuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quote = await prisma.quote.findUnique({
    where: { id },
    include: {
      lines: true,
      client: { include: { contacts: { where: { isPrimary: true }, take: 1 } } },
      issuer: true,
      deal: { select: { id: true, title: true } },
      invoices: { orderBy: { createdAt: "asc" } },
      activities: { orderBy: { createdAt: "desc" }, take: 12 },
    },
  });
  if (!quote) notFound();

  const html = renderDocument(quoteDoc(quote));
  const status = quoteStatus[quote.status];
  const suggested = !quote.number && quote.issuerId ? await peekNumber(prisma, quote.issuerId, "QUOTE") : null;
  const defaultTo = quote.client.contacts[0]?.email ?? quote.client.email ?? "";
  const open = ["DRAFT", "SENT", "VIEWED", "EXPIRED"].includes(quote.status);
  const link = `${getSiteUrl()}/documents/${quote.token}`;

  const deposit = quote.invoices.filter((invoice) => invoice.kind === "DEPOSIT" && invoice.status !== "CANCELLED");
  const balance = quote.invoices.filter((invoice) => invoice.kind !== "DEPOSIT" && invoice.status !== "CANCELLED");

  const small =
    "inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3.5 py-2 font-display text-[0.8125rem] font-bold shadow-soft transition-colors hover:bg-aegean-50";

  return (
    <>
      <AdminHeader
        title={quote.number ?? "Devis en brouillon"}
        subtitle={quote.title}
        back={{ href: "/admin/quotes", label: "Devis" }}
        action={
          <div className="flex flex-wrap gap-2">
            {quote.status === "DRAFT" ? (
              <Link href={`/admin/quotes/${quote.id}/edit`} className={small}>
                <Pencil className="size-4" />
                Modifier
              </Link>
            ) : null}
            <a href={`/admin/quotes/${quote.id}/pdf`} target="_blank" rel="noreferrer" className={small}>
              <Download className="size-4" />
              PDF
            </a>
            <form action={duplicateQuote}>
              <input type="hidden" name="id" value={quote.id} />
              <button type="submit" className={small}>
                <Copy className="size-4" />
                Dupliquer
              </button>
            </form>
          </div>
        }
      />

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="overflow-hidden rounded-[18px] bg-white shadow-lift ring-1 ring-black/5">
          <iframe title="Devis" srcDoc={html} className="h-[calc(100dvh-9rem)] min-h-[640px] w-full" />
        </div>

        <div className="flex flex-col gap-4">
          <Panel>
            <div className="flex flex-wrap items-center gap-2">
              <Pill className={toneClasses[status.tone]}>{quote.acceptedVia && quote.status === "SIGNED" ? acceptance[quote.acceptedVia] : status.label}</Pill>
              <span className="font-display text-xl font-extrabold tracking-[-0.03em]">{money(quote.totalCents, quote.currency)}</span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-[0.8125rem]">
              <div>
                <dt className="text-[var(--ink-45)]">Client</dt>
                <dd>
                  <Link href={`/admin/clients/${quote.clientId}`} className="font-display font-bold text-aegean-700 hover:underline">
                    {quote.client.name}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-[var(--ink-45)]">Émis au nom de</dt>
                <dd className="font-display font-bold">{quote.issuer?.label ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-[var(--ink-45)]">Émis le</dt>
                <dd className="font-display font-bold">{formatDate(quote.issueDate)}</dd>
              </div>
              <div>
                <dt className="text-[var(--ink-45)]">Valable jusqu&apos;au</dt>
                <dd className="font-display font-bold">{formatDate(quote.validUntil)}</dd>
              </div>
              {quote.deal ? (
                <div className="col-span-2">
                  <dt className="text-[var(--ink-45)]">Projet</dt>
                  <dd>
                    <Link href={`/admin/deals/${quote.deal.id}`} className="font-display font-bold text-aegean-700 hover:underline">
                      {quote.deal.title}
                    </Link>
                  </dd>
                </div>
              ) : null}
            </dl>
            {quote.signedAt ? (
              <p className="mt-4 rounded-field bg-green-50 px-3 py-2 text-[0.8125rem] text-green-800">
                {acceptance[quote.acceptedVia ?? "OTHER"]} le {formatDateTime(quote.signedAt)}
                {quote.signerName ? ` par ${quote.signerName}` : ""}
                {quote.acceptanceNote ? ` — ${quote.acceptanceNote}` : ""}
              </p>
            ) : null}
            {quote.sentAt ? (
              <p className="mt-3 text-xs text-[var(--ink-45)]">
                Envoyé {formatRelative(quote.sentAt)}
                {quote.viewedAt ? ` · consulté ${formatRelative(quote.viewedAt)}` : " · pas encore consulté"}
              </p>
            ) : null}
            {quote.number && quote.status !== "DRAFT" ? (
              <a href={link} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1.5 font-display text-xs font-bold text-aegean-700 hover:underline">
                <ExternalLink className="size-3.5" />
                Page vue par le client
              </a>
            ) : null}
          </Panel>

          {open ? (
            <ActionTabs
              canSend={quote.status !== "EXPIRED"}
              canAccept
              send={
                <SendQuoteForm
                  id={quote.id}
                  defaultTo={defaultTo}
                  suggestedNumber={suggested}
                  hasNumber={Boolean(quote.number)}
                  resend={quote.status !== "DRAFT"}
                />
              }
              accept={
                <AcceptQuoteForm
                  id={quote.id}
                  defaultTo={defaultTo}
                  suggestedNumber={suggested}
                  hasNumber={Boolean(quote.number)}
                  today={toDateInput(new Date())}
                />
              }
            />
          ) : null}

          {quote.status === "SIGNED" ? (
            <Panel title="Facturation" description="Les factures sont créées en brouillon, à relire avant émission.">
              <div className="grid gap-2">
                {quote.invoices.map((invoice) => (
                  <Link key={invoice.id} href={`/admin/invoices/${invoice.id}`} className="flex items-center gap-2 rounded-field px-3 py-2 hover:bg-aegean-50">
                    <Receipt className="size-4 text-[var(--ink-45)]" />
                    <span className="flex-1 text-[0.875rem]">
                      <span className="font-display font-bold">{invoice.number ?? invoiceKind[invoice.kind]}</span> · {money(invoice.totalCents, invoice.currency)}
                    </span>
                  </Link>
                ))}
                {deposit.length === 0 && balance.length === 0 && quote.depositPercent > 0 && quote.depositPercent < 100 ? (
                  <form action={invoiceFromQuote}>
                    <input type="hidden" name="id" value={quote.id} />
                    <input type="hidden" name="kind" value="DEPOSIT" />
                    <button type="submit" className="w-full cursor-pointer rounded-full bg-aegean-600 px-4 py-2.5 font-display text-sm font-bold text-white hover:bg-aegean-700">
                      Facturer l&apos;acompte ({quote.depositPercent} %)
                    </button>
                  </form>
                ) : null}
                {balance.length === 0 ? (
                  <form action={invoiceFromQuote}>
                    <input type="hidden" name="id" value={quote.id} />
                    <input type="hidden" name="kind" value={deposit.length ? "BALANCE" : "STANDARD"} />
                    <button type="submit" className="w-full cursor-pointer rounded-full bg-white px-4 py-2.5 font-display text-sm font-bold text-aegean-700 shadow-soft hover:bg-aegean-50">
                      {deposit.length ? "Facturer le solde" : "Facturer la totalité"}
                    </button>
                  </form>
                ) : null}
              </div>
            </Panel>
          ) : null}

          {open && quote.status !== "DRAFT" ? (
            <Panel>
              <div className="flex flex-wrap gap-2">
                <form action={setQuoteStatus}>
                  <input type="hidden" name="id" value={quote.id} />
                  <input type="hidden" name="status" value="DECLINED" />
                  <button type="submit" className="cursor-pointer rounded-full px-3 py-2 font-display text-xs font-bold text-red-700 hover:bg-red-50">
                    Marquer refusé
                  </button>
                </form>
                <form action={setQuoteStatus}>
                  <input type="hidden" name="id" value={quote.id} />
                  <input type="hidden" name="status" value="CANCELLED" />
                  <button type="submit" className="cursor-pointer rounded-full px-3 py-2 font-display text-xs font-bold text-[var(--ink-65)] hover:bg-black/5">
                    Annuler le devis
                  </button>
                </form>
              </div>
            </Panel>
          ) : null}

          {quote.status === "DECLINED" || quote.status === "CANCELLED" ? (
            <Panel>
              <form action={setQuoteStatus}>
                <input type="hidden" name="id" value={quote.id} />
                <input type="hidden" name="status" value="SENT" />
                <button type="submit" className="cursor-pointer rounded-full bg-black/5 px-4 py-2 font-display text-sm font-bold hover:bg-aegean-100">
                  Rouvrir le devis
                </button>
              </form>
            </Panel>
          ) : null}

          {quote.status === "DRAFT" ? (
            <form action={deleteQuote}>
              <input type="hidden" name="id" value={quote.id} />
              <button type="submit" className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 font-display text-sm font-bold text-red-700 hover:bg-red-50">
                <Trash2 className="size-4" />
                Supprimer le brouillon
              </button>
            </form>
          ) : null}

          {quote.activities.length ? (
            <Panel title="Historique" className="flex-1">
              <ul className="grid gap-2 text-[0.8125rem]">
                {quote.activities.map((activity) => (
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
