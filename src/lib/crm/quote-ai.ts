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
  title: z.string().describe("Titre du projet, court et concret : « Refonte du site sous WordPress et Elementor »."),
  context: z.string().describe("Contexte du devis : la situation et la demande, en 2 phrases courtes au plus (ou la longueur demandée dans le descriptif)."),
  perimeter: z.string().describe("Une phrase qui borne le périmètre, sans majuscule initiale ; chaîne vide si rien d'utile à préciser."),
  lots: z
    .array(
      z.object({
        title: z.string().describe("Intitulé du lot : « Refonte complète du site sous WordPress et Elementor »."),
        items: z
          .array(z.string().describe("Une prestation concrète, sur une ligne : « Intitulé court — précision en quelques mots », sans point final."))
          .min(1)
          .max(8)
          .describe("Une puce par prestation, sans regrouper plusieurs prestations dans la même puce."),
        price: z.number().describe("Prix HT du lot s'il est donné dans le descriptif (ex. 350), sinon 0."),
      }),
    )
    .min(1)
    .max(6),
  stack: z.array(z.string()).describe("Technologies de la solution livrée si le descriptif les nomme (ex. « WordPress », « Elementor ») ; tableau vide sinon."),
  delay: z.string().describe("Délai s'il est donné dans le descriptif ; sinon chaîne vide."),
  outOfScope: z.string().describe("Exclusions si le descriptif en mentionne ; sinon chaîne vide."),
  evolutions: z.array(z.string()).max(5).describe("Évolutions si le descriptif en mentionne ; sinon tableau vide."),
  paymentNote: z.string().describe("Chaîne vide, sauf consigne de paiement dans le descriptif."),
});

export type QuoteDraftOutput = z.infer<typeof draftSchema>;

/** Un exemple réel validé par le studio : le niveau de détail et le ton attendus. */
const EXAMPLE = [
  "EXEMPLE",
  "Descriptif : « Pierre Berger a un site sur WordPress sur-mesure, la demande est une refonte complète sur WordPress avec Elementor, détaille bien le descriptif, je veux un contexte très court, 2 lignes suffisent. Montant 350. »",
  "Contexte attendu : « Le site de Pierre Berger, développé sur mesure sous WordPress, fait l'objet d'une refonte complète sous WordPress avec Elementor. »",
  "Un seul lot, « Refonte complète du site sous WordPress et Elementor », prix 350, avec les puces :",
  "- Refonte graphique complète — nouvelle direction visuelle : couleurs, typographies, boutons et composants",
  "- Reconstruction des pages sous Elementor — pages et modèles modifiables depuis WordPress",
  "- En-tête, menus et pied de page — navigation retravaillée sur tout le site",
  "- Reprise des contenus — textes, images et références dans la nouvelle structure",
  "- Adaptation responsive — affichage soigné sur ordinateur, tablette et mobile",
  "- Mise en ligne et recette — tests, corrections et ajustements avant et après publication",
  "FIN DE L'EXEMPLE",
].join("\n");

export const QUOTE_AI_SYSTEM = [
  "Tu rédiges des devis pour un studio web : clairs, concrets, prêts à envoyer.",
  "1. Les consignes écrites dans le descriptif priment sur tout : niveau de détail, longueur du contexte, nombre de lots, technologies, prix.",
  "2. Technologies : utilise celles que demande le descriptif (WordPress, Elementor, Shopify, Next.js…), sans les remettre en cause ni en proposer d'autres. Si aucune n'est citée, n'en nomme pas.",
  "3. Contenu : développe les prestations réellement nécessaires à CE projet (pour une refonte : graphisme, pages, navigation, reprise des contenus, responsive, mise en ligne…). N'ajoute pas de prestations de gestion de projet (audit, cahier des charges, ateliers, réunions, comités) sauf si le descriptif les demande.",
  "4. Lots : un seul lot si le projet forme un tout ou si un seul prix est donné ; plusieurs lots seulement si le descriptif découpe le projet ou donne plusieurs prix.",
  "5. Puces : une prestation par puce, au format « Intitulé court — précision en quelques mots », sur une seule ligne.",
  "6. Contexte : 2 phrases courtes au plus, sauf autre consigne ; il dit la situation et la demande, sans promesse.",
  "7. Prix : uniquement les montants donnés dans le descriptif ; sinon 0. Jamais de prix inventé ni de répartition d'un budget.",
  "8. Sections facultatives (délai, hors périmètre, évolutions, note de paiement) : vides si le descriptif n'en parle pas.",
  "9. Français, ton sobre et direct, sans superlatif.",
  "",
  EXAMPLE,
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
