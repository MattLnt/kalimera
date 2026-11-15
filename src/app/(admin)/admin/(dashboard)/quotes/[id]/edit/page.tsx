import { notFound, redirect } from "next/navigation";

import { QuoteEditor } from "../../quote-editor";

import { centsToAmount, newLotKey } from "@/lib/crm/lots";
import { AdminHeader } from "@/components/admin/ui";
import { loadEditorData } from "@/lib/crm/documents/editor-data";
import { lineTotalCents } from "@/lib/crm/totals";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Modifier le devis" };
export const dynamic = "force-dynamic";

export default async function EditQuotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [quote, data] = await Promise.all([
    prisma.quote.findUnique({ where: { id }, include: { lines: { orderBy: { position: "asc" } } } }),
    loadEditorData(),
  ]);
  if (!quote) notFound();
  // Seul un devis signé en ligne est figé (sa signature porte sur ce contenu).
  if (quote.acceptedVia === "SIGNATURE") redirect(`/admin/quotes/${id}`);

  return (
    <>
      <AdminHeader title={`Modifier « ${quote.title} »`} back={{ href: `/admin/quotes/${id}`, label: "Devis" }} />
      <QuoteEditor
        {...data}
        issuedAs={quote.status === "DRAFT" ? null : { number: quote.number, status: quote.status }}
        initialDraft={{
          id: quote.id,
          clientId: quote.clientId,
          dealId: quote.dealId ?? "",
          issuerId: quote.issuerId ?? "",
          currency: quote.currency,
          title: quote.title,
          context: quote.context ?? "",
          perimeter: quote.perimeter ?? "",
          lots: quote.lines
            .filter((line) => line.kind === "ITEM")
            .map((line) => ({ key: newLotKey(), title: line.title, description: line.description ?? "", amount: centsToAmount(lineTotalCents(line)) })),
          stack: quote.stack.join("\n"),
          depositPercent: String(quote.depositPercent),
          paymentNote: quote.paymentNote ?? "",
          delay: quote.delay ?? "",
          outOfScope: quote.outOfScope ?? "",
          evolutions: quote.evolutions.join("\n"),
          terms: quote.terms ?? "",
          validityDays: String(quote.validityDays),
          requireSignature: quote.requireSignature,
        }}
      />
    </>
  );
}
