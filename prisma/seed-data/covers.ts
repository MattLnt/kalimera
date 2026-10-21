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
 */
export const covers = [
  {
    projectKey: "fiderio",
    file: "fiderio.jpg",
    altFr: "Page d'accueil de Fiderio : le marché privé de la cession de fiduciaires",
    altEn: "Fiderio homepage: the private marketplace for selling accountancy firms",
    altEs: "Portada de Fiderio: el mercado privado de cesión de asesorías",
  },
  {
    projectKey: "brokeris",
    file: "brokeris.jpg",
    altFr:
      "Page d'accueil de Brokeris : le marché privé de la cession de portefeuilles de courtage",
    altEn: "Brokeris homepage: the private marketplace for insurance brokerage portfolios",
    altEs: "Portada de Brokeris: el mercado privado de cesión de carteras de corretaje",
  },
  {
    projectKey: "onshare",
    file: "onshare.jpg",
    altFr: "Page d'accueil d'OnShare : le réseau qui connecte les agences immobilières",
    altEn: "OnShare homepage: the network connecting estate agencies",
    altEs: "Portada de OnShare: la red que conecta las agencias inmobiliarias",
  },
  {
    projectKey: "skillio",
    file: "skillio.jpg",
    altFr: "Page d'accueil de Skillio : trouver un emploi en comptabilité en restant anonyme",
    altEn: "Skillio homepage: finding an accountancy job while staying anonymous",
    altEs: "Portada de Skillio: encontrar empleo en contabilidad permaneciendo anónimo",
  },
  {
    projectKey: "buymonth",
    file: "buymonth.jpg",
    altFr: "Page d'accueil de BuyMonth : présenter des biens immobiliers en mensualités",
    altEn: "BuyMonth homepage: presenting properties as monthly payments",
    altEs: "Portada de BuyMonth: presentar inmuebles en mensualidades",
  },
  {
    projectKey: "coteburo",
    file: "coteburo.jpg",
    altFr: "Page d'accueil de Côté BURO : mobilier de bureau à Aix-en-Provence",
    altEn: "Côté BURO homepage: office furniture in Aix-en-Provence",
    altEs: "Portada de Côté BURO: mobiliario de oficina en Aix-en-Provence",
  },
  {
    projectKey: "mh-defense",
    file: "mh-defense.jpg",
    altFr: "Page d'accueil de MH Defense : cours de self-défense féminine à Sarrians",
    altEn: "MH Defense homepage: women's self-defence classes in Sarrians",
    altEs: "Portada de MH Defense: clases de defensa personal femenina en Sarrians",
  },
  {
    projectKey: "elite-detail-tampa",
    file: "elite-detail-tampa.jpg",
    altFr: "Page d'accueil d'Elite Detail : detailing automobile à domicile à Tampa",
    altEn: "Elite Detail homepage: mobile car detailing in Tampa",
    altEs: "Portada de Elite Detail: detailing de automóviles a domicilio en Tampa",
  },
];

/** Dimensions communes à toutes les captures. */
export const COVER_SIZE = { width: 1512, height: 795 };
