/**
 * Contenus de démonstration livrés avec le site, à supprimer de la base.
 *
 * Le seed procède par `upsert` : sans suppression explicite, ces entrées
 * resteraient publiées à côté des vraies réalisations. Un portfolio qui mêle
 * clients réels et clients inventés est pire qu'un portfolio court — le
 * prospect qui vérifie une référence et ne la trouve pas doute de toutes.
 *
 * La purge se fait par clé nommée, et jamais par « tout ce qui n'est pas dans
 * le seed » : les contenus créés depuis l'administration doivent survivre.
 */
export const obsolete = {
  /** Services remplacés par l'offre plateformes et le sur-mesure. */
  serviceKeys: ["sites-vitrines", "e-commerce", "applications-mobiles"],
  /** Quatre clients fictifs du jeu de démonstration. */
  projectKeys: ["thalassa-resorts", "kyma-fitness", "helia-cosmetics", "delphi-capital"],
  /** Articles réécrits ou retirés — celui sur le score Lighthouse annonçait un chiffre non mesuré. */
  postKeys: ["cout-site-vitrine-2026", "regles-lighthouse-98"],
  /** Témoignage inventé, attribué à un client qui n'existe pas. */
  testimonialAuthors: ["Thalassa Resorts"],
};
