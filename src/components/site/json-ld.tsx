/**
 * Rend un graphe schema.org dans une balise `<script>` native.
 *
 * `next/script` est optimisé pour du JavaScript exécutable ; le JSON-LD est de
 * la donnée, donc la balise natale est le bon choix (recommandation Next.js).
 *
 * Le `<` est échappé en `<` : `JSON.stringify` ne neutralise pas les
 * chaînes malveillantes, et nos contenus viennent du back-office.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
