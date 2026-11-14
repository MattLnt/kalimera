import { invoiceDoc, quoteDoc } from "@/lib/crm/documents/build";
import { htmlToPdf } from "@/lib/crm/documents/pdf";
import { documentFileName, renderDocument } from "@/lib/crm/documents/render";
import { prisma } from "@/lib/prisma";

/** PDF d'un document envoyé, accessible par son lien secret. */
export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const include = { lines: true, client: true, issuer: true } as const;
  const quote = await prisma.quote.findUnique({ where: { token }, include });
  const invoice = quote ? null : await prisma.invoice.findUnique({ where: { token }, include });

  // Un brouillon n'est jamais exposé par son lien.
  if (quote && !quote.number) return new Response("Introuvable", { status: 404 });
  if (!quote && (!invoice || !invoice.number)) return new Response("Introuvable", { status: 404 });

  const doc = quote ? quoteDoc(quote) : invoiceDoc(invoice!);
  const pdf = await htmlToPdf(renderDocument(doc));
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${documentFileName(doc)}"`,
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
