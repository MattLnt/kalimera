import "server-only";

import { clientSnapshot, issuerSnapshot } from "@/lib/crm/documents/build";
import { prisma } from "@/lib/prisma";

/** Identités et clients, sous la forme qu'attendent les éditeurs de documents. */
export async function loadEditorData() {
  const [issuers, clients] = await Promise.all([
    prisma.issuer.findMany({ where: { archived: false }, orderBy: { position: "asc" } }),
    prisma.client.findMany({
      where: { status: { not: "ARCHIVED" } },
      orderBy: { name: "asc" },
      include: { deals: { where: { stage: { not: "LOST" } }, select: { id: true, title: true }, orderBy: { updatedAt: "desc" } } },
    }),
  ]);
  return {
    issuers: issuers.map((issuer) => ({
      id: issuer.id,
      label: issuer.label,
      currency: issuer.currency,
      depositPercent: issuer.depositPercent,
      validityDays: issuer.quoteValidityDays,
      doc: issuerSnapshot(issuer),
    })),
    clients: clients.map((client) => ({
      id: client.id,
      name: client.name,
      defaultIssuerId: client.defaultIssuerId,
      doc: clientSnapshot(client),
      deals: client.deals,
    })),
  };
}
