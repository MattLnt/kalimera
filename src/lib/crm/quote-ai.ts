import { z } from "zod";

/**
 * Règles de l'assistant de devis : schéma de réponse, consignes et mise en
 * forme. Sans dépendance serveur, pour pouvoir les tester à part.
 */

/**
 * Modèle préféré, puis repli. Sans crédits payés sur AI Gateway, Vercel
 * refuse Claude (« free tier ») mais accepte gpt-5-mini : l'assistant marche
 * donc tout de suite, et repasse sur Claude dès que des crédits sont chargés.
 */
export const QUOTE_AI_MODELS = ["anthropic/claude-sonnet-5.5", "openai/gpt-5-mini"] as const;

export const isPlanRefusal = (error: unknown) => error instanceof Error && /free tier|credits|do not have access/i.test(error.message);

export const draftSchema = z.object({
  title: z.string().describe("Titre du projet, court et concret, tiré du descriptif."),
  context: z.string().describe("1 à 3 phrases qui reformulent la demande du descriptif, sans rien ajouter."),
  perimeter: z.string().describe("Une phrase qui borne le périmètre d'après le descriptif, sans majuscule initiale ; chaîne vide si le descriptif ne le précise pas."),
  lots: z
    .array(
      z.object({
        title: z.string().describe("« Lot 1 — Refonte des pages »"),
        items: z
          .array(z.string().describe("Une ligne courte (10 mots environ), sans point final, qui reprend un élément DU DESCRIPTIF."))
          .min(1)
          .max(6)
          .describe("Contenu du lot : un élément = une puce. Seulement ce que le descriptif demande ou implique directement."),
        price: z.number().describe("Prix HT du lot s'il est écrit tel quel dans le descriptif (ex. 800), sinon 0."),
      }),
    )
    .min(1)
    .max(6),
  stack: z.array(z.string()).describe("Technologies que le studio utilisera pour ce projet, seulement si le descriptif les nomme ; jamais les outils actuels du client (son WordPress, son Elementor…). Tableau vide sinon."),
  delay: z.string().describe("Délai s'il est donné dans le descriptif ; sinon chaîne vide."),
  outOfScope: z.string().describe("Exclusions si le descriptif en mentionne ; sinon chaîne vide."),
  evolutions: z.array(z.string()).max(5).describe("Évolutions si le descriptif en mentionne ; sinon tableau vide."),
  paymentNote: z.string().describe("Chaîne vide, sauf consigne de paiement dans le descriptif."),
});

export type QuoteDraftOutput = z.infer<typeof draftSchema>;

export const QUOTE_AI_SYSTEM = [
  "Tu mets en forme des devis pour un studio de développement web et mobile qui code sur mesure.",
  "RÈGLE ABSOLUE : tu reprends uniquement ce que dit le descriptif. Tu n'ajoutes AUCUN livrable, atelier, audit, cahier des charges, document, réunion, formation, test, technologie, outil, chiffre ou délai qui n'y figure pas.",
  "Un descriptif court donne un devis court : 1 à 3 lots, quelques puces. Mieux vaut un devis bref et fidèle qu'un devis complet et inventé.",
  "Tu peux regrouper et reformuler ce qui est demandé en lots dans l'ordre logique, en restant au plus près des mots du descriptif.",
  "Pas de nom de technologie (langage, framework, CMS précis) sauf s'il est cité dans le descriptif.",
  "Contenu d'un lot : une puce = une ligne courte, une seule idée. Jamais de phrase à rallonge ni d'éléments enchaînés avec « · », des virgules ou des points-virgules.",
  "Prix : seulement un montant écrit dans le descriptif pour ce lot ; sinon 0. Jamais de répartition d'un budget.",
  "Sections facultatives (stack, délai, hors périmètre, évolutions, note de paiement) : vides si le descriptif n'en parle pas.",
  "Si le descriptif donne des consignes de forme ou de contenu, applique-les à la lettre.",
  "Français, ton sobre et direct, sans superlatif ni promesse de résultat.",
].join("\n");

/**
 * Une puce par élément. Un élément qui en enchaîne plusieurs (« · », « ; »)
 * est redécoupé : le devis garde des lignes courtes même si le modèle
 * n'a pas suivi la consigne.
 */
export function toBullets(items: string[]) {
  return items
    .flatMap((item) => item.split(/\s+[·•;]\s+|\s*;\s*/))
    .map((item) =>
      item
        .replace(/^[-•·*\s]+/, "")
        .replace(/[.;,\s]+$/, "")
        .trim(),
    )
    .filter(Boolean)
    .map((item) => `- ${item.charAt(0).toUpperCase()}${item.slice(1)}`)
    .join("\n");
}

/**
 * Lots prêts pour l'éditeur. Un prix n'est gardé que s'il est écrit dans le
 * descriptif : l'IA ne peut pas en inventer ; sinon le lot reste à 0.
 */
export function draftLots(output: QuoteDraftOutput, brief: string) {
  const briefNumbers = new Set(
    (brief.replace(/(\d)[\s .](?=\d{3}\b)/g, "$1").match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) => Number(n.replace(",", "."))),
  );
  return output.lots.map((item) => ({
    title: item.title,
    description: toBullets(item.items),
    amountCents: item.price > 0 && briefNumbers.has(item.price) ? Math.round(item.price * 100) : 0,
  }));
}
