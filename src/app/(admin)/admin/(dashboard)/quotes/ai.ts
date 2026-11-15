"use server";

import { generateText, Output } from "ai";

import { assertAdmin } from "@/lib/admin";
import { draftLots, draftSchema, isPlanRefusal, QUOTE_AI_MODELS, QUOTE_AI_SYSTEM, type QuoteDraftOutput } from "@/lib/crm/quote-ai";
import { prisma } from "@/lib/prisma";

export type QuoteDraftResult =
  | { ok: true; draft: Omit<QuoteDraftOutput, "lots"> & { lots: { title: string; description: string; amountCents: number }[] } }
  | { ok: false; error: string };

/**
 * Met en forme un devis à partir d'un descriptif libre, sans rien inventer :
 * les règles sont dans src/lib/crm/quote-ai.ts. Les prix restent à saisir,
 * sauf ceux écrits dans le descriptif.
 */
export async function generateQuoteDraft(input: { clientId?: string; brief: string; currency: string }): Promise<QuoteDraftResult> {
  await assertAdmin();
  if (input.brief.trim().length < 10) return { ok: false, error: "Décrivez le projet en quelques mots." };

  const client = input.clientId
    ? await prisma.client.findUnique({
        where: { id: input.clientId },
        select: {
          name: true,
          summary: true,
          notes: { orderBy: { occurredAt: "desc" }, take: 3, select: { title: true, body: true } },
        },
      })
    : null;

  const clientContext = client
    ? [
        `Client : ${client.name}`,
        client.summary ? `Mémo : ${client.summary}` : "",
        ...client.notes.map((note) => `Note d'appel « ${note.title ?? "sans titre"} » (contexte seulement, n'en tire aucun livrable) : ${note.body.slice(0, 1500)}`),
      ]
        .filter(Boolean)
        .join("\n")
    : "Client non précisé.";

  try {
    let output: QuoteDraftOutput | undefined;
    let lastError: unknown;
    for (const model of QUOTE_AI_MODELS) {
      try {
        const result = await generateText({
          model,
          output: Output.object({ schema: draftSchema }),
          system: QUOTE_AI_SYSTEM,
          prompt: [clientContext, `Descriptif du projet : ${input.brief}`].join("\n\n"),
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

    return { ok: true, draft: { ...output, lots: draftLots(output, input.brief) } };
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
