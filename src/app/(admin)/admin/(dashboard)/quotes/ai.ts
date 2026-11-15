"use server";

import { generateText, Output } from "ai";
import { z } from "zod";

import { assertAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

/** Modèle servi par Vercel AI Gateway : authentification OIDC sur Vercel. */
/**
 * Modèle préféré, puis repli. Sans crédits payés sur AI Gateway, Vercel
 * refuse Claude (« free tier ») mais accepte gpt-5-mini : l'assistant marche
 * donc tout de suite, et repasse sur Claude dès que des crédits sont chargés.
 */
const MODELS = ["anthropic/claude-sonnet-5.5", "openai/gpt-5-mini"] as const;
const isPlanRefusal = (error: unknown) => error instanceof Error && /free tier|credits|do not have access/i.test(error.message);

const draftSchema = z.object({
  title: z.string().describe("Titre du projet, court et concret : « Boutique en ligne avec click & collect »."),
  context: z.string().describe("2 à 4 phrases : la situation du client et ce qu'il veut obtenir. Pas de superlatifs."),
  perimeter: z.string().describe("Une phrase qui borne le périmètre, sans majuscule initiale : « site vitrine et boutique, sans application mobile »."),
  lots: z
    .array(
      z.object({
        title: z.string().describe("« Lot 1 — Cadrage et maquettes »"),
        items: z
          .array(z.string().describe("Un livrable concret, en une ligne courte (10 mots environ), sans point final : « Maquettes mobile et desktop des 5 pages »."))
          .min(2)
          .max(6)
          .describe("Contenu du lot : un élément = une puce. Jamais plusieurs idées dans un même élément."),
        note: z.string().describe("Une précision courte affichée en gris sous la liste, ou une chaîne vide s'il n'y a rien à préciser."),
        weight: z.number().describe("Part du budget, en pourcentage ; la somme des lots fait 100."),
      }),
    )
    .min(2)
    .max(8),
  stack: z.array(z.string()).describe("Technologies, une par élément : « Next.js (App Router), hébergement Vercel »."),
  delay: z.string().describe("« Délai de réalisation estimé : 4 à 6 semaines à compter de la validation du devis et de la réception des éléments nécessaires. »"),
  outOfScope: z.string().describe("Ce qui est explicitement exclu, en une ou deux phrases."),
  evolutions: z.array(z.string()).max(5).describe("Pistes d'évolution courtes, pour un devis complémentaire."),
  paymentNote: z.string().describe("Une phrase grise sous les modalités de paiement."),
});

/**
 * Une puce par élément. Un élément qui en enchaîne plusieurs (« · », « ; »)
 * est redécoupé : le devis garde des lignes courtes même si le modèle
 * n'a pas suivi la consigne.
 */
function toBullets(items: string[], note?: string) {
  const lines = items
    .flatMap((item) => item.split(/\s+[·•;]\s+|\s*;\s*/))
    .map((item) => item.replace(/^[-•·*\s]+/, "").replace(/[.;,\s]+$/, "").trim())
    .filter(Boolean)
    .map((item) => `- ${item.charAt(0).toUpperCase()}${item.slice(1)}`);
  if (note?.trim()) lines.push(`> ${note.trim()}`);
  return lines.join("\n");
}

export type QuoteDraftResult = { ok: true; draft: Omit<z.infer<typeof draftSchema>, "lots"> & { lots: { title: string; description: string; amountCents: number }[] } } | { ok: false; error: string };

/**
 * Rédige un devis complet à partir d'un descriptif libre et d'un budget.
 * Le total respecte le budget au centime : l'IA répartit, le code arrondit.
 */
export async function generateQuoteDraft(input: { clientId?: string; brief: string; budgetCents: number; currency: string }): Promise<QuoteDraftResult> {
  await assertAdmin();
  if (input.brief.trim().length < 10) return { ok: false, error: "Décrivez le projet en quelques mots." };
  if (!Number.isFinite(input.budgetCents) || input.budgetCents <= 0) return { ok: false, error: "Indiquez le tarif total." };

  const [client, services] = await Promise.all([
    input.clientId
      ? prisma.client.findUnique({
          where: { id: input.clientId },
          select: {
            name: true,
            summary: true,
            notes: { orderBy: { occurredAt: "desc" }, take: 3, select: { title: true, body: true } },
          },
        })
      : null,
    prisma.serviceTranslation.findMany({
      where: { locale: "FR", service: { published: true } },
      select: { title: true, summary: true },
    }),
  ]);

  const clientContext = client
    ? [`Client : ${client.name}`, client.summary ? `Mémo : ${client.summary}` : "", ...client.notes.map((note) => `Note « ${note.title ?? "sans titre"} » : ${note.body.slice(0, 1500)}`)]
        .filter(Boolean)
        .join("\n")
    : "Client non précisé.";

  try {
    let output: z.infer<typeof draftSchema> | undefined;
    let lastError: unknown;
    for (const model of MODELS) {
      try {
        const result = await generateText({
          model,
          output: Output.object({ schema: draftSchema }),
          system: [
            "Tu rédiges des devis pour un studio de développement web et mobile (sites sur mesure, e-commerce, applications, plateformes SaaS), qui code tout sans WordPress ni Shopify.",
            "Écris en français, ton sobre et précis, vocabulaire concret du métier. Aucune promesse chiffrée de résultat, aucun superlatif.",
            "Découpe le projet en lots qui suivent l'ordre de réalisation. Chaque lot décrit ce qui est livré, pas des intentions.",
        "Contenu d'un lot : une liste de 2 à 6 éléments, chacun une ligne simple et courte (une idée, une puce). Jamais de phrase à rallonge, jamais d'éléments enchaînés avec « · », des virgules ou des points-virgules.",
        "Si le descriptif donne des consignes de forme ou de contenu, applique-les à la lettre.",
            "N'invente ni client, ni référence, ni chiffre d'audience.",
            `Services du studio : ${services.map((service) => `${service.title} (${service.summary})`).join(" ; ")}.`,
          ].join("\n"),
          prompt: [clientContext, `Descriptif du projet : ${input.brief}`, `Budget total : ${(input.budgetCents / 100).toFixed(2)} ${input.currency}. Répartis-le entre les lots via « weight ».`].join(
            "\n\n",
          ),
        });
        output = result.output;
        break;
      } catch (error) {
        lastError = error;
        // Refus lié à l'offre gratuite : on passe au modèle suivant.
        if (!isPlanRefusal(error)) throw error;
      }
    }
    if (!output) throw lastError;

    // Répartition exacte du budget : arrondi à l'euro, le reste sur le dernier lot.
    const totalWeight = output.lots.reduce((sum, item) => sum + Math.max(0, item.weight), 0) || 1;
    let allocated = 0;
    const lots = output.lots.map((item, index) => {
      const isLast = index === output.lots.length - 1;
      const amount = isLast ? input.budgetCents - allocated : Math.round((input.budgetCents * Math.max(0, item.weight)) / totalWeight / 100) * 100;
      allocated += amount;
      return { title: item.title, description: toBullets(item.items, item.note), amountCents: amount };
    });

    return { ok: true, draft: { ...output, lots } };
  } catch (error) {
    console.error("[quotes] rédaction IA impossible", error);
    const message = error instanceof Error ? error.message : "";
    return {
      ok: false,
      error: /free tier|credits/i.test(message)
        ? "L'IA demande des crédits AI Gateway sur Vercel (onglet AI du tableau de bord, « Top up »). Une fois rechargés, réessayez."
        : /unauthenticated|api key/i.test(message)
          ? "L'IA n'est pas connectée : en local, lancez « vercel env pull » ; sur Vercel, la connexion est automatique."
          : "L'IA n'a pas répondu. Réessayez dans un instant.",
    };
  }
}
