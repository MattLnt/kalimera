import { requireUser } from "@/lib/auth";
import { invoiceDoc } from "@/lib/crm/documents/build";
import { renderDocument } from "@/lib/crm/documents/render";
import { prisma } from "@/lib/prisma";

/** Aperçu de la facture en pleine page, dans un onglet. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireUser())) return new Response("Non autorisé", { status: 401 });
  const { id } = await params;
  const invoice = await prisma.invoice.findUnique({ where: { id }, include: { lines: true, client: true, issuer: true } });
  if (!invoice) return new Response("Introuvable", { status: 404 });
  return new Response(renderDocument(invoiceDoc(invoice)), {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" },
  });
}
