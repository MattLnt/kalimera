import { ProjectKind } from "../../src/generated/prisma/enums";

import { t } from "./locale";

/**
 * Les huit réalisations réelles, plateformes B2B d'abord.
 *
 * Règle de rédaction : ne rien écrire ici qui ne soit vérifiable en ouvrant
 * l'URL. Les `metrics` ne contiennent donc que des faits publics (prix
 * d'abonnement affiché, note Google, nombre de langues servies), jamais un
 * résultat commercial non mesuré. Un portfolio invérifiable coûte plus cher
 * qu'un portfolio modeste.
 *
 * À COMPLÉTER PAR LE STUDIO :
 * - `year` est à 2025 partout : corriger avec l'année réelle de mise en ligne.
 * - `stack` est à vérifier projet par projet (seul coteburo.fr a été confirmé
 *   en Next.js + Cloudinary depuis l'extérieur).
 * - `outcome` attend vos chiffres réels quand vous les aurez : c'est la partie
 *   qui convertit le mieux, et la seule qu'on ne peut pas écrire sans vous.
 */
export const projects = [
  {
    key: "fiderio",
    kind: ProjectKind.WEBAPP,
    client: "Fiderio",
    year: 2025,
    liveUrl: "https://fiderio.be",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    accent: "g1",
    featured: true,
    serviceKeys: ["plateformes-metier", "saas-abonnement"],
    metrics: [
      {
        value: "59 €/mois",
        label: t("Abonnement acheteur", "Buyer subscription", "Suscripción comprador"),
      },
      {
        value: "0 €",
        label: t("Dépôt d'annonce vendeur", "Seller listing", "Publicación del vendedor"),
      },
    ],
    slug: t("fiderio", "fiderio", "fiderio"),
    title: t("Fiderio", "Fiderio", "Fiderio"),
    category: t(
      "Marketplace B2B · Fiduciaires",
      "B2B marketplace · Accountancy firms",
      "Marketplace B2B · Asesorías",
    ),
    summary: t(
      "Marketplace confidentielle de cession et d'association de cabinets comptables en Belgique.",
      "A confidential marketplace for selling and merging accountancy firms in Belgium.",
      "Marketplace confidencial de venta y asociación de asesorías en Bélgica.",
    ),
    challenge: t(
      "La cession d'un cabinet comptable se joue hors marché : un dirigeant qui envisage de vendre ne peut pas l'annoncer publiquement sans inquiéter ses clients et ses collaborateurs. Les mises en relation se faisaient donc par bouche-à-oreille, lentement et dans un périmètre très étroit.",
      "Selling an accountancy firm happens off-market: an owner considering a sale cannot announce it publicly without unsettling clients and staff. Introductions therefore happened by word of mouth, slowly and within a very narrow circle.",
      "La venta de una asesoría ocurre fuera de mercado: un titular que se plantea vender no puede anunciarlo públicamente sin inquietar a sus clientes y empleados. Las presentaciones se hacían de boca en boca, despacio y en un círculo muy estrecho.",
    ),
    solution: t(
      "Nous avons construit une plateforme à visibilité progressive : le cédant publie un dossier anonymisé, l'acquéreur filtre par région, taille et spécialité, puis demande le déverrouillage. L'identité et les documents ne se débloquent qu'après accord explicite du vendeur. Les échanges passent par une messagerie interne, et l'accès acheteur est conditionné à un abonnement mensuel prélevé automatiquement.",
      "We built a platform with progressive visibility: the seller publishes an anonymised file, the buyer filters by region, size and speciality, then requests unlocking. Identity and documents are released only after the seller explicitly agrees. Conversations run through internal messaging, and buyer access is gated behind an automatically collected monthly subscription.",
      "Construimos una plataforma de visibilidad progresiva: el vendedor publica un expediente anonimizado, el comprador filtra por región, tamaño y especialidad y luego solicita el desbloqueo. La identidad y los documentos solo se liberan tras el acuerdo explícito del vendedor. Los intercambios pasan por una mensajería interna y el acceso del comprador está condicionado a una suscripción mensual cobrada automáticamente.",
    ),
    outcome: t(
      "La plateforme est en production : dépôt d'annonce gratuit pour les cédants, accès acheteur à 59 € par mois, et déverrouillage des dossiers tracé de bout en bout.",
      "The platform is in production: free listing for sellers, buyer access at €59 a month, and file unlocking traced end to end.",
      "La plataforma está en producción: publicación gratuita para los vendedores, acceso de comprador a 59 € al mes y desbloqueo de expedientes trazado de principio a fin.",
    ),
  },
  {
    key: "brokeris",
    kind: ProjectKind.WEBAPP,
    client: "Brokeris",
    year: 2025,
    liveUrl: "https://brokeris.be",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    accent: "g2",
    featured: true,
    serviceKeys: ["plateformes-metier", "saas-abonnement"],
    metrics: [],
    slug: t("brokeris", "brokeris", "brokeris"),
    title: t("Brokeris", "Brokeris", "Brokeris"),
    category: t(
      "Marketplace B2B · Courtage en assurance",
      "B2B marketplace · Insurance broking",
      "Marketplace B2B · Corretaje de seguros",
    ),
    summary: t(
      "Plateforme privée d'achat et de vente de portefeuilles de courtage en assurance.",
      "A private marketplace for buying and selling insurance brokerage portfolios.",
      "Plataforma privada de compra y venta de carteras de corretaje de seguros.",
    ),
    challenge: t(
      "Un portefeuille de courtage est un actif dont la valeur dépend de sa composition précise, et dont la mise en vente doit rester invisible des concurrents comme des assurés. Il n'existait aucun endroit où faire se rencontrer cédants et repreneurs sans passer par un intermédiaire qui prend commission sur l'opération.",
      "A brokerage portfolio is an asset whose value depends on its precise composition, and whose sale must stay invisible to competitors and policyholders alike. There was nowhere for sellers and buyers to meet without going through an intermediary taking commission on the deal.",
      "Una cartera de corretaje es un activo cuyo valor depende de su composición precisa y cuya venta debe permanecer invisible tanto para competidores como para los asegurados. No existía ningún lugar donde vendedores y compradores pudieran encontrarse sin pasar por un intermediario que cobra comisión por la operación.",
    ),
    solution: t(
      "Même principe de confidentialité par défaut, adapté aux spécificités du courtage : description du portefeuille par branche et par volume de primes, sans nommer le cabinet. Inscription séparée pour les cédants et les repreneurs, vérification des comptes avant publication, messagerie interne, et déverrouillage des documents sensibles soumis à l'accord du vendeur.",
      "The same confidentiality-by-default principle, adapted to broking: the portfolio is described by line of business and premium volume, without naming the firm. Separate registration for sellers and buyers, account verification before publication, internal messaging, and release of sensitive documents subject to the seller's agreement.",
      "El mismo principio de confidencialidad por defecto, adaptado al corretaje: la cartera se describe por ramo y volumen de primas, sin nombrar al despacho. Registro separado para vendedores y compradores, verificación de cuentas antes de publicar, mensajería interna y liberación de documentos sensibles sujeta al acuerdo del vendedor.",
    ),
    outcome: t(
      "Plateforme en production, entièrement off-market : aucune annonce n'est visible des moteurs de recherche, et chaque accès à un dossier est journalisé.",
      "In production and entirely off-market: no listing is visible to search engines, and every access to a file is logged.",
      "Plataforma en producción, totalmente fuera de mercado: ningún anuncio es visible para los motores de búsqueda y cada acceso a un expediente queda registrado.",
    ),
  },
  {
    key: "onshare",
    kind: ProjectKind.WEBAPP,
    client: "OnShare",
    year: 2025,
    liveUrl: "https://onshare.be",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    accent: "g3",
    featured: true,
    serviceKeys: ["plateformes-metier", "saas-abonnement"],
    metrics: [
      {
        value: "150 €/mois",
        label: t("Abonnement agence, HTVA", "Agency subscription, ex VAT", "Suscripción agencia, sin IVA"),
      },
    ],
    slug: t("onshare", "onshare", "onshare"),
    title: t("OnShare", "OnShare", "OnShare"),
    category: t(
      "Plateforme SaaS · Immobilier",
      "SaaS platform · Real estate",
      "Plataforma SaaS · Inmobiliaria",
    ),
    summary: t(
      "Réseau fermé d'agences immobilières qui partagent leurs mandats et leurs acquéreurs.",
      "A closed network of estate agencies sharing their mandates and their buyers.",
      "Red cerrada de agencias inmobiliarias que comparten sus mandatos y sus compradores.",
    ),
    challenge: t(
      "Une agence détient des mandats qu'elle ne vend pas, et des acquéreurs pour des biens qu'elle n'a pas. Partager avec une agence concurrente suppose de régler à l'avance qui voit quoi, qui contacte le client et comment la commission se répartit — ce qu'aucun outil généraliste ne savait faire.",
      "An agency holds mandates it is not selling, and buyers for properties it does not have. Sharing with a competing agency means settling in advance who sees what, who contacts the client and how the commission is split — something no general-purpose tool could handle.",
      "Una agencia tiene mandatos que no vende y compradores para inmuebles que no posee. Compartir con una agencia competidora exige acordar de antemano quién ve qué, quién contacta al cliente y cómo se reparte la comisión, algo que ninguna herramienta generalista sabía hacer.",
    ),
    solution: t(
      "Un espace réservé aux agences vérifiées, avec gestion des mandats partagés, base d'acquéreurs qualifiés, et règles de visibilité définies par l'agence propriétaire du mandat. Chaque agence dispose de son tableau de bord, et l'accès au réseau est conditionné à un abonnement mensuel.",
      "A space restricted to verified agencies, with shared-mandate management, a qualified buyer database, and visibility rules set by the agency that owns the mandate. Each agency gets its own dashboard, and network access is gated behind a monthly subscription.",
      "Un espacio reservado a agencias verificadas, con gestión de mandatos compartidos, base de compradores cualificados y reglas de visibilidad definidas por la agencia propietaria del mandato. Cada agencia tiene su propio panel y el acceso a la red está condicionado a una suscripción mensual.",
    ),
    outcome: t(
      "Plateforme en production, accessible aux agences vérifiées pour 150 € par mois hors TVA.",
      "In production, open to verified agencies at €150 a month excluding VAT.",
      "Plataforma en producción, accesible a agencias verificadas por 150 € al mes sin IVA.",
    ),
  },
  {
    key: "skillio",
    kind: ProjectKind.WEBAPP,
    client: "Skillio",
    year: 2025,
    liveUrl: "https://skillio.be",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Stripe"],
    accent: "g1",
    featured: true,
    serviceKeys: ["plateformes-metier", "saas-abonnement"],
    metrics: [],
    slug: t("skillio", "skillio", "skillio"),
    title: t("Skillio", "Skillio", "Skillio"),
    category: t(
      "Plateforme SaaS · Recrutement financier",
      "SaaS platform · Financial recruitment",
      "Plataforma SaaS · Selección financiera",
    ),
    summary: t(
      "Plateforme de recrutement confidentielle spécialisée dans les métiers de la comptabilité et de la finance.",
      "A confidential recruitment platform specialising in accountancy and finance roles.",
      "Plataforma de selección confidencial especializada en perfiles de contabilidad y finanzas.",
    ),
    challenge: t(
      "Un comptable en poste qui cherche à bouger ne peut pas déposer son CV sur un site public : son employeur actuel le verra. Les cabinets, de leur côté, cherchent des profils très précis que les plateformes généralistes noient dans le volume.",
      "An accountant in post who wants to move cannot post their CV on a public site: their current employer will see it. Firms, meanwhile, look for very specific profiles that general job boards drown in volume.",
      "Un contable en activo que quiere cambiar no puede publicar su CV en una web pública: su empleador actual lo verá. Los despachos, por su parte, buscan perfiles muy concretos que las plataformas generalistas ahogan en volumen.",
    ),
    solution: t(
      "Le candidat reste anonyme jusqu'à ce qu'il accepte une mise en relation : son profil est visible par compétences, expérience et région, sans nom ni employeur. Côté recruteur, l'accès aux profils est structuré par catégorie de poste et conditionné à une formule d'abonnement.",
      "The candidate stays anonymous until they accept an introduction: their profile is visible by skills, experience and region, with no name or employer. On the recruiter side, access to profiles is structured by role category and gated behind a subscription plan.",
      "El candidato permanece anónimo hasta que acepta una presentación: su perfil es visible por competencias, experiencia y región, sin nombre ni empleador. Del lado del reclutador, el acceso a los perfiles se estructura por categoría de puesto y está condicionado a un plan de suscripción.",
    ),
    outcome: t(
      "Plateforme en production, avec candidature anonyme, catégories de postes dédiées au secteur et accès recruteur par abonnement.",
      "In production, with anonymous applications, sector-specific role categories and subscription-based recruiter access.",
      "Plataforma en producción, con candidatura anónima, categorías de puesto propias del sector y acceso de reclutador por suscripción.",
    ),
  },
  {
    key: "buymonth",
    kind: ProjectKind.WEBAPP,
    client: "BuyMonth",
    year: 2025,
    liveUrl: "https://buymonth.be",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    accent: "g2",
    featured: false,
    serviceKeys: ["saas-abonnement", "applications-web"],
    metrics: [],
    slug: t("buymonth", "buymonth", "buymonth"),
    title: t("BuyMonth", "BuyMonth", "BuyMonth"),
    category: t(
      "SaaS B2B · Immobilier & crédit",
      "B2B SaaS · Real estate & lending",
      "SaaS B2B · Inmobiliaria y crédito",
    ),
    summary: t(
      "Outil pour promoteurs immobiliers qui convertit un prix de vente en mensualité estimée.",
      "A tool for property developers that turns a sale price into an estimated monthly payment.",
      "Herramienta para promotores inmobiliarios que convierte un precio de venta en una mensualidad estimada.",
    ),
    challenge: t(
      "Un prix de vente affiché en capital parle mal à un acheteur particulier, qui raisonne en mensualité. Les promoteurs perdaient des contacts simplement parce que le visiteur ne se projetait pas, faute de savoir ce que le bien représenterait dans son budget mensuel.",
      "A sale price shown as a capital sum speaks poorly to a private buyer, who thinks in monthly payments. Developers were losing enquiries simply because visitors could not picture themselves there, not knowing what the property would mean for their monthly budget.",
      "Un precio de venta expresado en capital le dice poco a un comprador particular, que razona en mensualidades. Los promotores perdían contactos simplemente porque el visitante no se proyectaba, al no saber qué supondría el inmueble en su presupuesto mensual.",
    ),
    solution: t(
      "Un produit distribué sous forme de badges, de widgets et de QR codes que le promoteur intègre à ses propres supports, en ligne comme sur ses panneaux de chantier. Le calcul de mensualité est paramétrable, les contacts générés remontent dans un espace de suivi, et des partenariats de crédit peuvent être branchés dessus.",
      "A product distributed as badges, widgets and QR codes that the developer embeds in their own materials, online and on site hoardings. The monthly-payment calculation is configurable, generated enquiries feed into a tracking area, and lending partnerships can be plugged in.",
      "Un producto distribuido como insignias, widgets y códigos QR que el promotor integra en sus propios soportes, en línea y en sus vallas de obra. El cálculo de la mensualidad es configurable, los contactos generados llegan a un área de seguimiento y se pueden conectar acuerdos de crédito.",
    ),
    outcome: t(
      "Produit en production, avec widgets intégrables, suivi des contacts et mentions légales conformes au cadre belge du crédit.",
      "In production, with embeddable widgets, enquiry tracking and legal notices compliant with the Belgian lending framework.",
      "Producto en producción, con widgets integrables, seguimiento de contactos y avisos legales conformes al marco belga del crédito.",
    ),
  },
  {
    key: "coteburo",
    kind: ProjectKind.ECOMMERCE,
    client: "Côté BURO",
    year: 2025,
    liveUrl: "https://coteburo.fr",
    stack: ["Next.js", "Cloudinary", "Catalogue", "Devis en ligne"],
    accent: "g3",
    featured: true,
    serviceKeys: ["e-commerce-sur-mesure", "sites-sur-mesure", "design-ux-ui"],
    metrics: [
      { value: "5,0/5", label: t("Avis Google", "Google rating", "Valoración Google") },
      { value: "PACA", label: t("Zone de livraison", "Delivery area", "Zona de entrega") },
    ],
    slug: t("cote-buro", "cote-buro", "cote-buro"),
    title: t("Côté BURO", "Côté BURO", "Côté BURO"),
    category: t(
      "E-commerce · Mobilier de bureau",
      "E-commerce · Office furniture",
      "E-commerce · Mobiliario de oficina",
    ),
    summary: t(
      "Boutique et catalogue d'aménagement de bureaux, codés sur mesure, à Aix-en-Provence.",
      "A bespoke-coded store and catalogue for office fit-out, in Aix-en-Provence.",
      "Tienda y catálogo de equipamiento de oficinas, programados a medida, en Aix-en-Provence.",
    ),
    challenge: t(
      "L'aménagement de bureaux ne se vend pas comme un produit de grande consommation : le même fauteuil part à l'unité pour un particulier et par trente pour une entreprise, à un tarif négocié. Il fallait donc faire coexister l'achat direct et la demande de devis, sur un catalogue multi-marques avec de nombreuses variantes de finition.",
      "Office fit-out does not sell like a consumer product: the same chair ships as a single unit to an individual and in batches of thirty to a company, at a negotiated price. Direct purchase and quote requests therefore had to coexist, across a multi-brand catalogue with many finish variants.",
      "El equipamiento de oficinas no se vende como un producto de consumo: la misma silla sale de una en una para un particular y de treinta en treinta para una empresa, a un precio negociado. Había que hacer coexistir la compra directa y la solicitud de presupuesto, en un catálogo multimarca con numerosas variantes de acabado.",
    ),
    solution: t(
      "Boutique écrite en Next.js, sans plateforme tierce : catalogue multi-marques, variantes de finition, panier et demande de devis sur la même fiche produit. Les images passent par un service d'optimisation à la volée, et le site présente aussi les prestations d'aménagement, de plan 3D et d'installation, avec les réalisations en appui.",
      "A store written in Next.js, with no third-party platform: multi-brand catalogue, finish variants, basket and quote request on the same product page. Images run through an on-the-fly optimisation service, and the site also presents the fit-out, 3D planning and installation services, backed by completed projects.",
      "Tienda escrita en Next.js, sin plataforma externa: catálogo multimarca, variantes de acabado, carrito y solicitud de presupuesto en la misma ficha de producto. Las imágenes pasan por un servicio de optimización al vuelo y la web también presenta los servicios de equipamiento, plano 3D e instalación, respaldados por proyectos realizados.",
    ),
    outcome: t(
      "Boutique en production, sans commission de plateforme ni abonnement d'éditeur. L'enseigne affiche 5,0/5 sur Google et livre dans toute la région PACA.",
      "In production, with no platform commission and no vendor subscription. The business shows 5.0/5 on Google and delivers across the PACA region.",
      "Tienda en producción, sin comisión de plataforma ni suscripción de proveedor. El negocio muestra 5,0/5 en Google y entrega en toda la región PACA.",
    ),
  },
  {
    key: "mh-defense",
    kind: ProjectKind.ECOMMERCE,
    client: "MH Defense",
    year: 2025,
    liveUrl: "https://mh-defense.com",
    stack: ["Next.js", "Réservation", "Abonnements"],
    accent: "g1",
    featured: false,
    serviceKeys: ["sites-sur-mesure", "e-commerce-sur-mesure", "design-ux-ui"],
    metrics: [
      {
        value: "3",
        label: t("Formules d'abonnement", "Membership plans", "Planes de suscripción"),
      },
      {
        value: "Vaucluse",
        label: t("Implantation", "Location", "Ubicación"),
      },
    ],
    slug: t("mh-defense", "mh-defense", "mh-defense"),
    title: t("MH Defense", "MH Defense", "MH Defense"),
    category: t(
      "Site & réservation · Sport",
      "Site & booking · Sport",
      "Web y reservas · Deporte",
    ),
    summary: t(
      "Site et réservation en ligne d'un studio de self-défense féminine, à Sarrians.",
      "Website and online booking for a women's self-defence studio, in Sarrians.",
      "Web y reservas en línea de un estudio de defensa personal femenina, en Sarrians.",
    ),
    challenge: t(
      "Une activité portée par une personne et son parcours — ici une championne du monde de karaté — se vend d'abord par la confiance. Il fallait établir cette crédibilité dès la première page, tout en permettant de s'inscrire à un cours sans échange téléphonique préalable.",
      "An activity carried by one person and their record — here a karate world champion — sells on trust first. That credibility had to be established from the first page, while still letting visitors book a class without a phone call first.",
      "Una actividad sostenida por una persona y su trayectoria —aquí una campeona del mundo de kárate— se vende ante todo por la confianza. Había que establecer esa credibilidad desde la primera página, permitiendo a la vez inscribirse a una clase sin llamada previa.",
    ),
    solution: t(
      "Un site construit autour du parcours de l'instructrice, avec trois formules d'abonnement à remise progressive, un cours d'essai gratuit, la réservation en ligne et un espace personnel où l'élève retrouve ses inscriptions.",
      "A site built around the instructor's record, with three membership plans offering progressive discounts, a free trial class, online booking and a personal area where students find their bookings.",
      "Una web construida en torno a la trayectoria de la instructora, con tres planes de suscripción de descuento progresivo, una clase de prueba gratuita, reserva en línea y un área personal donde la alumna encuentra sus inscripciones.",
    ),
    outcome: t(
      "Site en production : inscription et paiement en autonomie, sans prise de contact préalable.",
      "In production: self-service sign-up and payment, with no prior contact needed.",
      "Web en producción: inscripción y pago autónomos, sin contacto previo.",
    ),
  },
  {
    key: "elite-detail-tampa",
    kind: ProjectKind.WEBSITE,
    client: "Elite Detail Tampa",
    year: 2025,
    liveUrl: "https://elitedetailtampa.com",
    stack: ["Next.js", "Réservation", "Trilingue"],
    accent: "g2",
    featured: false,
    serviceKeys: ["sites-sur-mesure", "design-ux-ui"],
    metrics: [
      { value: "3", label: t("Langues servies", "Languages served", "Idiomas servidos") },
      { value: "Tampa Bay", label: t("Zone couverte", "Service area", "Zona cubierta") },
    ],
    slug: t("elite-detail-tampa", "elite-detail-tampa", "elite-detail-tampa"),
    title: t("Elite Detail Tampa", "Elite Detail Tampa", "Elite Detail Tampa"),
    category: t(
      "Site & réservation · Services automobiles",
      "Site & booking · Automotive services",
      "Web y reservas · Servicios de automoción",
    ),
    summary: t(
      "Site trilingue et réservation en ligne d'un service de detailing automobile à domicile, en Floride.",
      "A trilingual site with online booking for a mobile car-detailing service in Florida.",
      "Web trilingüe y reservas en línea de un servicio de detailing de automóviles a domicilio, en Florida.",
    ),
    challenge: t(
      "À Tampa Bay, la clientèle est anglophone, hispanophone et francophone. Un site dans une seule langue laissait de côté une part importante du marché local, et un service à domicile doit annoncer clairement sa zone d'intervention pour éviter les demandes hors périmètre.",
      "In Tampa Bay, the customer base is English-, Spanish- and French-speaking. A single-language site left out a significant share of the local market, and a mobile service must state its coverage area clearly to avoid out-of-range enquiries.",
      "En Tampa Bay, la clientela es anglófona, hispanohablante y francófona. Una web en un solo idioma dejaba fuera una parte importante del mercado local, y un servicio a domicilio debe indicar claramente su zona de actuación para evitar solicitudes fuera de alcance.",
    ),
    solution: t(
      "Site en trois langues avec une URL par langue, grille tarifaire explicite par prestation, galerie avant-après, foire aux questions, et réservation en ligne avec choix du créneau. La zone d'intervention est annoncée dès la page d'accueil.",
      "A three-language site with one URL per language, an explicit price grid per service, a before-and-after gallery, an FAQ, and online booking with slot selection. The service area is stated on the homepage.",
      "Web en tres idiomas con una URL por idioma, tarifas explícitas por servicio, galería de antes y después, preguntas frecuentes y reserva en línea con selección de franja. La zona de actuación se anuncia desde la portada.",
    ),
    outcome: t(
      "Site en production, servi en anglais, espagnol et français, avec réservation et paiement en ligne.",
      "In production, served in English, Spanish and French, with online booking and payment.",
      "Web en producción, servida en inglés, español y francés, con reserva y pago en línea.",
    ),
  },
];
