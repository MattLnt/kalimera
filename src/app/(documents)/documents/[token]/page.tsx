import { CheckCircle2, Download } from "lucide-react";
import { notFound } from "next/navigation";

import { SignForm } from "./sign-form";

import { requireUser } from "@/lib/auth";
import { logActivity } from "@/lib/crm/activity";
import { invoiceDoc, quoteDoc } from "@/lib/crm/documents/build";
import { money, renderDocument } from "@/lib/crm/documents/render";
import { formatDateTime } from "@/lib/crm/format";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const quote = await prisma.quote.findUnique({ where: { token }, select: { number: true } });
  if (quote) return { title: `Devis ${quote.number ?? ""}` };
  const invoice = await prisma.invoice.findUnique({ where: { token }, select: { number: true, kind: true } });
  return { title: invoice ? `${invoice.kind === "CREDIT_NOTE" ? "Avoir" : "Facture"} ${invoice.number ?? ""}` : "Document" };
}

/**
 * Page reçue par le client : le document à la charte, son PDF, et pour un
 * devis ouvert, la signature en ligne. Sobre, comme les documents eux-mêmes.
 */
export default async function DocumentPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const include = { lines: true, client: { include: { contacts: { where: { isPrimary: true }, take: 1 } } }, issuer: true } as const;

  const quote = await prisma.quote.findUnique({ where: { token }, include });
  const invoice = quote ? null : await prisma.invoice.findUnique({ where: { token }, include });
  if ((!quote || !quote.number) && (!invoice || !invoice.number)) notFound();

  // Première consultation par le client : le studio la voit dans le CRM.
  const viewer = await requireUser();
  if (quote && !viewer && (quote.status === "SENT" || !quote.viewedAt)) {
    if (quote.status === "SENT") {
      await prisma.quote.update({ where: { id: quote.id }, data: { status: "VIEWED", viewedAt: new Date() } });
      await logActivity("quote.viewed", `Devis ${quote.number} consulté par le client`, { clientId: quote.clientId, dealId: quote.dealId, quoteId: quote.id });
    }
  }

  const doc = quote ? quoteDoc(quote) : invoiceDoc(invoice!);
  const html = renderDocument(doc);
  const contact = (quote ?? invoice)!.client.contacts[0];
  const expired = quote?.validUntil ? quote.validUntil < new Date() : false;
  const canSign = quote && quote.requireSignature && ["SENT", "VIEWED"].includes(quote.status) && !expired;

  return (
    <main className="mx-auto max-w-[1180px] px-4 py-6 sm:py-10">
      <header className="mb-5 flex flex-wrap items-center gap-3 border-b-2 border-[#1D2B3A] pb-4">
        <div className="flex-1">
          <p className="text-[1rem] font-bold text-[#0D0D12]">{doc.issuer.name}</p>
          <p className="text-sm text-[#555]">
            {doc.kind === "QUOTE" ? "Devis" : doc.docType === "AVOIR" ? "Avoir" : "Facture"} {doc.number} · {money(doc.totalCents, doc.currency)}
          </p>
        </div>
        <a
          href={`/documents/${token}/pdf`}
          className="inline-flex items-center gap-2 border border-[#D9D9D9] bg-white px-4 py-2.5 text-sm font-semibold text-[#0D0D12] hover:border-[#1D2B3A]"
        >
          <Download className="size-4" />
          Télécharger le PDF
        </a>
      </header>

      <div className={canSign ? "grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]" : ""}>
        <div className="bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <iframe title="Document" srcDoc={html} className="h-[80dvh] min-h-[640px] w-full" />
        </div>

        {canSign && quote ? (
          <div className="lg:sticky lg:top-6">
            <SignForm
              token={token}
              number={quote.number ?? ""}
              total={money(quote.totalCents, quote.currency)}
              defaultName={contact ? `${contact.firstName} ${contact.lastName ?? ""}`.trim() : ""}
              defaultEmail={contact?.email ?? quote.client.email ?? ""}
            />
          </div>
        ) : null}
      </div>

      {quote?.status === "SIGNED" ? (
        <p className="mt-5 flex items-center gap-2 border border-[#D9D9D9] bg-white px-4 py-3 text-sm">
          <CheckCircle2 className="size-4 text-green-600" />
          {quote.acceptedVia === "SIGNATURE"
            ? `Devis signé électroniquement par ${quote.signerName} le ${formatDateTime(quote.signedAt)}.`
            : `Devis accepté le ${formatDateTime(quote.signedAt)}.`}
        </p>
      ) : null}
      {quote && expired && quote.status !== "SIGNED" ? (
        <p className="mt-5 border border-[#D9D9D9] bg-white px-4 py-3 text-sm text-[#555]">
          La validité de ce devis est dépassée. Répondez simplement à l&apos;e-mail reçu pour qu&apos;il soit renouvelé.
        </p>
      ) : null}
    </main>
  );
}
