import { requireUser } from "@/lib/auth";
import { quoteDoc } from "@/lib/crm/documents/build";
import { htmlToPdf } from "@/lib/crm/documents/pdf";
import { documentFileName, renderDocument } from "@/lib/crm/documents/render";
import { prisma } from "@/lib/prisma";

/** PDF d'un devis, pour l'administration. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireUser())) return new Response("Non autorisé", { status: 401 });
  const { id } = await params;
  const quote = await prisma.quote.findUnique({ where: { id }, include: { lines: true, client: true, issuer: true } });
  if (!quote) return new Response("Introuvable", { status: 404 });

  const doc = quoteDoc(quote);
  const pdf = await htmlToPdf(renderDocument(doc));
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${documentFileName(doc)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
