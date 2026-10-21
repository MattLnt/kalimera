/**
 * Captures d'écran des réalisations.
 *
 * Les fichiers sont servis depuis `public/work/` plutôt que depuis
 * Cloudinary : ce sont huit images figées, versionnées avec le code, qui
 * n'ont pas vocation à être remplacées depuis l'administration. Les éviter
 * de passer par un service tiers supprime une dépendance et une latence.
 *
 * `optimized()` laisse passer les URLs qui ne sont pas des URLs Cloudinary,
 * et `next/image` optimise les fichiers locaux sans configuration : la chaîne
 * d'affichage fonctionne donc telle quelle.
 *
 * Toutes ont été prises au même cadrage, 1512 × 795, pour que les fenêtres
 * de navigateur du portfolio s'alignent les unes avec les autres.
 *
 * Aucune ne montre une page d'accueil : un listing filtrable, une grille
 * tarifaire, un tableau de bord ou un calculateur disent ce que le produit
 * fait, là où huit héros alignés se ressemblent tous.
 */
export const covers = [
  {
    projectKey: "fiderio",
    file: "fiderio.jpg",
    altFr:
      "Page Opportunités de Fiderio : dossiers de cession anonymisés, filtres par province et détails verrouillés",
    altEn: "Fiderio Opportunities page: anonymised sale files, province filters and locked details",
    altEs: "Página de Oportunidades de Fiderio: expedientes de cesión anonimizados, filtros por provincia y detalles bloqueados",
  },
  {
    projectKey: "brokeris",
    file: "brokeris.jpg",
    altFr:
      "Page Tarifs de Brokeris : dépôt gratuit pour les vendeurs, accès acheteur à 59 € par mois",
    altEn: "Brokeris pricing page: free listing for sellers, buyer access at €59 a month",
    altEs: "Página de tarifas de Brokeris: publicación gratuita para vendedores, acceso de comprador a 59 € al mes",
  },
  {
    projectKey: "onshare",
    file: "onshare.jpg",
    altFr:
      "Tableau de bord d'OnShare : biens et acheteurs de l'agence, catalogue du réseau et évolution du portefeuille",
    altEn: "OnShare dashboard: the agency's properties and buyers, network catalogue and portfolio trend",
    altEs: "Panel de OnShare: inmuebles y compradores de la agencia, catálogo de la red y evolución de la cartera",
  },
  {
    projectKey: "skillio",
    file: "skillio.jpg",
    altFr:
      "Page Offres de Skillio : recherche d'emplois comptables avec filtres par localisation et temps de travail",
    altEn: "Skillio jobs page: accountancy job search with location and working-time filters",
    altEs: "Página de ofertas de Skillio: búsqueda de empleos contables con filtros por ubicación y jornada",
  },
  {
    projectKey: "buymonth",
    file: "buymonth.jpg",
    altFr:
      "Calculateur de rentabilité de BuyMonth : curseurs de paramétrage et seuil de rentabilité calculé en direct",
    altEn: "BuyMonth profitability calculator: parameter sliders and a break-even figure computed live",
    altEs: "Calculadora de rentabilidad de BuyMonth: controles de parámetros y umbral de rentabilidad calculado en directo",
  },
  {
    projectKey: "coteburo",
    file: "coteburo.jpg",
    altFr:
      "Page Réalisations de Côté BURO : aménagements de bureaux livrés clés en main en région PACA",
    altEn: "Côté BURO projects page: turnkey office fit-outs delivered across the PACA region",
    altEs: "Página de proyectos de Côté BURO: equipamientos de oficina llave en mano en la región PACA",
  },
  {
    projectKey: "mh-defense",
    file: "mh-defense.jpg",
    altFr:
      "Page Formules de MH Defense : trois abonnements et bascule entre tarif mensuel et séance à l'unité",
    altEn: "MH Defense plans page: three memberships and a toggle between monthly and per-session pricing",
    altEs: "Página de planes de MH Defense: tres suscripciones y conmutador entre tarifa mensual y sesión suelta",
  },
  {
    projectKey: "elite-detail-tampa",
    file: "elite-detail-tampa.jpg",
    altFr:
      "Page Tarifs d'Elite Detail : prix fixes par gabarit de véhicule et par type de prestation",
    altEn: "Elite Detail pricing page: flat prices by vehicle size and service type",
    altEs: "Página de tarifas de Elite Detail: precios fijos por tamaño de vehículo y tipo de servicio",
  },
];

/** Dimensions communes à toutes les captures. */
export const COVER_SIZE = { width: 1512, height: 795 };
