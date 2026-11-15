/**
 * Couleurs des pastilles. Fonctions pures, utilisables côté serveur comme
 * côté navigateur (elles ne doivent pas vivre dans un fichier « use client »).
 */

/** Vrai si la teinte est claire : on écrit alors en foncé dessus. */
export function isLight(hex: string) {
  const value = hex.replace("#", "");
  if (value.length !== 6) return false;
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(value.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.3;
}

/** Texte lisible posé sur une teinte pleine. */
export function readableOn(hex: string) {
  return isLight(hex) ? "#0B1B2E" : "#FFFFFF";
}

/** Couleurs d'une pastille : pleine (étapes de projet) ou teintée (le reste). */
export function pillColors(color: string, solid = false) {
  if (solid) return { background: color, color: readableOn(color) };
  return {
    background: `color-mix(in srgb, ${color} 13%, white)`,
    color: `color-mix(in srgb, ${color} 72%, black)`,
  };
}
