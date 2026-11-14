import "server-only";

import { logActivity } from "@/lib/crm/activity";
import { prisma } from "@/lib/prisma";

type Inbound = {
  name: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  source: "Formulaire de contact" | "Rendez-vous en ligne";
  activity: string;
};

/**
 * Retrouve la fiche du visiteur par son e-mail, ou la crée en piste.
 *
 * Appelé après l'enregistrement d'une demande ou d'un rendez-vous : une
 * erreur ici ne doit jamais faire échouer ce qui a déjà été reçu, d'où le
 * `null` en cas de problème.
 */
export async function linkInboundClient(inbound: Inbound): Promise<string | null> {
  try {
    const email = inbound.email.trim().toLowerCase();
    const existing = await prisma.client.findFirst({
      where: { OR: [{ email }, { contacts: { some: { email } } }] },
      orderBy: { updatedAt: "desc" },
      select: { id: true },
    });

    if (existing) {
      await prisma.client.update({ where: { id: existing.id }, data: { updatedAt: new Date() } });
      await logActivity("inbound", inbound.activity, { clientId: existing.id });
      return existing.id;
    }

    const [firstName, ...rest] = inbound.name.trim().split(/\s+/);
    const client = await prisma.client.create({
      data: {
        name: inbound.company?.trim() || inbound.name.trim(),
        email,
        phone: inbound.phone || null,
        source: inbound.source,
        status: "LEAD",
        contacts: {
          create: {
            firstName: firstName || inbound.name,
            lastName: rest.join(" ") || null,
            email,
            phone: inbound.phone || null,
            isPrimary: true,
          },
        },
      },
    });
    await logActivity("client.created", `Fiche créée automatiquement — ${inbound.activity}`, { clientId: client.id });
    return client.id;
  } catch (error) {
    console.error("[crm] rattachement client impossible", error);
    return null;
  }
}
