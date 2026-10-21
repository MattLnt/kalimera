import { t } from "./locale";

/**
 * Pages géographiques.
 *
 * Deux logiques différentes, volontairement :
 * - Aix et Marseille visent le référencement local et la fiche Google
 *   Business. C'est là qu'est l'établissement, donc la seule géographie où
 *   les campagnes payantes peuvent fonctionner.
 * - Belgique, Luxembourg et Suisse romande visent une intention de marché,
 *   pas une proximité. Elles existent parce que la preuve y est — cinq
 *   plateformes livrées en Belgique — et servent surtout de page
 *   d'atterrissage pour la prospection directe et la recommandation.
 *
 * Règle de rédaction : on ne revendique jamais un bureau qu'on n'a pas, et on
 * ne s'excuse pas non plus de ne pas en avoir. Ces pages parlent de ce qui est
 * livré et de la façon dont un projet se déroule — c'est ce qu'un prospect
 * cherche, et c'est vérifiable.
 */
export const locations = [
  {
    key: "aix-en-provence",
    icon: "Globe",
    highlights: ["Établissement local", "Rendez-vous sur place", "Provence"],
    serviceKeys: ["sites-sur-mesure", "e-commerce-sur-mesure", "applications-web"],
    projectKeys: ["coteburo", "mh-defense"],
    slug: t("aix-en-provence", "aix-en-provence", "aix-en-provence"),
    title: t(
      "Développement web à Aix-en-Provence",
      "Web development in Aix-en-Provence",
      "Desarrollo web en Aix-en-Provence",
    ),
    lead: t(
      "Notre établissement est à Aix. Sites, boutiques et applications développés sur mesure, avec des réunions en face à face quand c'est utile.",
      "Our office is in Aix. Bespoke sites, stores and applications, with face-to-face meetings when they help.",
      "Nuestra oficina está en Aix. Webs, tiendas y aplicaciones a medida, con reuniones presenciales cuando sirven.",
    ),
    body: t(
      "## Un prestataire que vous pouvez rencontrer\n\nNous sommes établis à Aix-en-Provence. Pour un projet qui engage plusieurs dizaines de milliers d'euros, pouvoir s'asseoir autour d'une table au cadrage puis à la recette change la qualité du résultat — et accessoirement, cela nous évite de vous facturer des allers-retours par e-mail.\n\n## Ce que nous avons livré ici\n\n**Côté BURO**, enseigne d'aménagement de bureaux située à Aix, vend en ligne à des particuliers et à des entreprises. Nous avons développé sa boutique entièrement en code : catalogue multi-marques, variantes de finition, panier et demande de devis sur la même fiche, plus la présentation des prestations d'aménagement et de plan 3D. L'enseigne affiche 5,0/5 sur Google et livre dans toute la région.\n\n**MH Defense**, à Sarrians dans le Vaucluse, à quarante minutes : site, réservation en ligne et trois formules d'abonnement pour un studio de self-défense.\n\n## Ce que nous faisons pour les entreprises d'Aix et des alentours\n\n- **Sites sur mesure** avec back-office, à partir de 9 000 €\n- **Boutiques en ligne** codées, avec devis et tarifs professionnels, à partir de 15 000 €\n- **Applications métier** et espaces clients, à partir de 20 000 €\n- **Refonte** d'un site lent ou devenu impossible à modifier\n- **Infogérance** avec supervision et rapport mensuel, à partir de 290 €/mois\n\n## Pas de WordPress, pas de Shopify\n\nC'est notre seule contrainte, et elle est assumée : nous ne travaillons qu'en code. Un thème embarque des centaines de fonctions inutilisées qui ralentissent le site, et chaque extension est une surface à maintenir. Si votre besoin se satisfait d'une solution clé en main, nous vous le dirons franchement plutôt que de vous vendre un projet surdimensionné.\n\n## Le bassin que nous servons\n\nAix-en-Provence, Marseille et la métropole, le pays d'Aix, Salon, Pertuis, le Luberon, Avignon et le Vaucluse, Toulon et l'ouest varois. Pour les projets de plateforme, nous travaillons aussi en Belgique, au Luxembourg et en Suisse romande.",
      "## A supplier you can actually meet\n\nWe are based in Aix-en-Provence. For a project committing tens of thousands of euros, being able to sit around a table at scoping and again at acceptance changes the quality of the result — and incidentally, it saves us billing you for rounds of email.\n\n## What we have delivered here\n\n**Côté BURO**, an office fit-out business based in Aix, sells online to individuals and companies. We built its store entirely in code: multi-brand catalogue, finish variants, basket and quote request on the same page, plus the presentation of the fit-out and 3D planning services. The business shows 5.0/5 on Google and delivers across the region.\n\n**MH Defense**, in Sarrians in the Vaucluse, forty minutes away: site, online booking and three membership plans for a self-defence studio.\n\n## What we do for businesses in and around Aix\n\n- **Bespoke sites** with a back office, from €9,000\n- **Coded online stores**, with quotes and trade pricing, from €15,000\n- **Line-of-business applications** and client portals, from €20,000\n- **Rebuilds** of a site that has become slow or impossible to edit\n- **Managed hosting** with monitoring and a monthly report, from €290/month\n\n## No WordPress, no Shopify\n\nThat is our only constraint, and we own it: we work in code only. A theme ships hundreds of unused features that slow the site down, and every plugin is a surface to maintain. If a turnkey solution meets your need, we will tell you plainly rather than sell you an oversized project.\n\n## The area we serve\n\nAix-en-Provence, Marseille and the metropolitan area, the pays d'Aix, Salon, Pertuis, the Luberon, Avignon and the Vaucluse, Toulon and western Var. For platform projects, we also work in Belgium, Luxembourg and French-speaking Switzerland.",
      "## Un proveedor al que puedes conocer en persona\n\nEstamos establecidos en Aix-en-Provence. Para un proyecto que compromete decenas de miles de euros, poder sentarse alrededor de una mesa en el encuadre y de nuevo en la recepción cambia la calidad del resultado; y, de paso, nos evita facturarte idas y venidas por correo.\n\n## Lo que hemos entregado aquí\n\n**Côté BURO**, empresa de equipamiento de oficinas con sede en Aix, vende en línea a particulares y a empresas. Desarrollamos su tienda íntegramente en código: catálogo multimarca, variantes de acabado, carrito y solicitud de presupuesto en la misma ficha, además de la presentación de los servicios de equipamiento y plano 3D. El negocio muestra 5,0/5 en Google y entrega en toda la región.\n\n**MH Defense**, en Sarrians (Vaucluse), a cuarenta minutos: web, reserva en línea y tres planes de suscripción para un estudio de defensa personal.\n\n## Qué hacemos para las empresas de Aix y alrededores\n\n- **Webs a medida** con panel de administración, desde 9.000 €\n- **Tiendas en línea** programadas, con presupuestos y tarifas profesionales, desde 15.000 €\n- **Aplicaciones de gestión** y áreas de cliente, desde 20.000 €\n- **Rediseño** de una web lenta o que se ha vuelto imposible de modificar\n- **Mantenimiento** con supervisión e informe mensual, desde 290 €/mes\n\n## Sin WordPress, sin Shopify\n\nEs nuestra única restricción, y la asumimos: solo trabajamos en código. Una plantilla incorpora cientos de funciones sin usar que ralentizan la web, y cada extensión es una superficie que mantener. Si una solución llave en mano cubre tu necesidad, te lo diremos con franqueza antes que venderte un proyecto sobredimensionado.\n\n## La zona que servimos\n\nAix-en-Provence, Marsella y su área metropolitana, el pays d'Aix, Salon, Pertuis, el Luberon, Aviñón y el Vaucluse, Tolón y el oeste del Var. Para proyectos de plataforma, trabajamos también en Bélgica, Luxemburgo y la Suiza francófona.",
    ),
    faqs: [
      {
        question: t(
          "Peut-on se rencontrer avant de signer ?",
          "Can we meet before signing?",
          "¿Podemos vernos antes de firmar?",
        ),
        answer: t(
          "Oui, et nous le recommandons pour tout projet au-delà de quelques milliers d'euros. Le rendez-vous de cadrage à Aix ou chez vous dans la région ne vous est pas facturé.",
          "Yes, and we recommend it for any project beyond a few thousand euros. The scoping meeting in Aix or at your premises in the region is not billed to you.",
          "Sí, y lo recomendamos para cualquier proyecto que supere unos pocos miles de euros. La reunión de encuadre en Aix o en tus instalaciones de la región no se factura.",
        ),
      },
      {
        question: t(
          "Travaillez-vous avec des TPE locales ou seulement sur de gros projets ?",
          "Do you work with small local businesses or only on large projects?",
          "¿Trabajáis con pequeñas empresas locales o solo en grandes proyectos?",
        ),
        answer: t(
          "Les deux, mais honnêtement : en dessous de 5 000 € de budget total, le sur-mesure n'a pas de sens et nous vous orienterons vers une solution clé en main. Au-delà, un site codé revient moins cher sur trois ans qu'un thème qu'il faut refaire.",
          "Both, but honestly: below a €5,000 total budget, bespoke makes no sense and we will point you to a turnkey solution. Above that, a coded site costs less over three years than a theme that has to be redone.",
          "Ambas cosas, pero con honestidad: por debajo de 5.000 € de presupuesto total, lo hecho a medida no tiene sentido y te orientaremos hacia una solución llave en mano. Por encima, una web programada cuesta menos en tres años que una plantilla que hay que rehacer.",
        ),
      },
      {
        question: t(
          "Récupérons-nous le code du site ?",
          "Do we get the site's code?",
          "¿Recibimos el código de la web?",
        ),
        answer: t(
          "Oui, dès le premier jour. Le dépôt vous appartient, la documentation est écrite, et un autre développeur peut reprendre le projet sans réécriture. Vous n'êtes captif de personne, nous compris.",
          "Yes, from day one. The repository is yours, the documentation is written, and another developer can pick the project up without a rewrite. You are locked in to nobody, including us.",
          "Sí, desde el primer día. El repositorio es tuyo, la documentación está escrita y otro desarrollador puede retomar el proyecto sin reescribirlo. No dependes de nadie, nosotros incluidos.",
        ),
      },
    ],
  },
  {
    key: "marseille",
    icon: "Globe",
    highlights: ["Métropole Aix-Marseille", "Sur place en 30 min", "Sur mesure"],
    serviceKeys: ["sites-sur-mesure", "applications-web", "e-commerce-sur-mesure"],
    projectKeys: ["coteburo"],
    slug: t("marseille", "marseille", "marsella"),
    title: t(
      "Développement web à Marseille",
      "Web development in Marseille",
      "Desarrollo web en Marsella",
    ),
    lead: t(
      "À trente minutes de nos bureaux d'Aix : sites, boutiques et applications métier codés sur mesure pour les entreprises de la métropole.",
      "Thirty minutes from our Aix office: bespoke-coded sites, stores and business applications for companies across the metropolitan area.",
      "A treinta minutos de nuestra oficina de Aix: webs, tiendas y aplicaciones de gestión a medida para las empresas del área metropolitana.",
    ),
    body: t(
      "## La deuxième aire urbaine de France, et peu de studios qui codent\n\nLa métropole Aix-Marseille compte près de deux millions d'habitants et un tissu d'entreprises dense : logistique et maritime, santé, services aux entreprises, industrie, tourisme. L'offre de prestataires y est abondante, mais très majoritairement adossée à des thèmes WordPress et des boutiques clé en main. Dès qu'un projet sort du gabarit — un espace client, un tarif négocié, une règle métier — le modèle atteint sa limite.\n\nC'est exactement l'espace que nous occupons : du code sur mesure, par l'équipe qui conçoit.\n\n## Ce que nous développons pour les entreprises marseillaises\n\n- **Applications métier et espaces clients** : dossiers, étapes, documents, rôles et permissions fins. À partir de 20 000 €.\n- **Boutiques professionnelles** avec devis, tarifs par client et produits configurables. À partir de 15 000 €.\n- **Sites sur mesure** multilingues avec back-office autonome. À partir de 9 000 €.\n- **Reprise de projet** quand un prestataire est parti en laissant un site que personne ne sait faire évoluer.\n\n## Le multilingue, utile ici\n\nMarseille commerce avec le Maghreb, l'Italie, l'Espagne et l'ensemble du bassin méditerranéen. Nos architectures intègrent le multilingue dès la conception — français, anglais, espagnol de série — plutôt que par une extension ajoutée après coup, qui dégrade les performances et les URLs.\n\n## Proximité réelle\n\nNous sommes à Aix, soit trente minutes. Le rendez-vous de cadrage se fait sur place, et la recette aussi. Pour un projet qui engage un budget sérieux, c'est un avantage concret sur un prestataire qui ne répond que par e-mail.\n\n## Et au-delà\n\nPour les projets de plateforme et de marketplace B2B, nous travaillons également en Belgique, au Luxembourg et en Suisse romande, où nous avons livré cinq plateformes dans des professions réglementées.",
      "## France's second-largest urban area, and few studios that actually code\n\nThe Aix-Marseille metropolitan area has nearly two million inhabitants and a dense business base: logistics and maritime, healthcare, business services, industry, tourism. Suppliers are plentiful, but overwhelmingly built on WordPress themes and turnkey stores. As soon as a project steps outside the template — a client portal, a negotiated price, a business rule — that model hits its limit.\n\nThat is exactly the space we occupy: bespoke code, by the team that designs it.\n\n## What we build for Marseille businesses\n\n- **Business applications and client portals**: cases, stages, documents, fine-grained roles and permissions. From €20,000.\n- **Trade stores** with quotes, per-customer pricing and configurable products. From €15,000.\n- **Bespoke multilingual sites** with a self-service back office. From €9,000.\n- **Project takeover** when a supplier has left behind a site nobody can evolve.\n\n## Multilingual, genuinely useful here\n\nMarseille trades with North Africa, Italy, Spain and the whole Mediterranean basin. Our architectures build multilingual support in from the design stage — French, English, Spanish by default — rather than through a plugin added afterwards, which degrades performance and URLs.\n\n## Real proximity\n\nWe are in Aix, thirty minutes away. The scoping meeting happens in person, and so does acceptance. For a project committing a serious budget, that is a concrete advantage over a supplier who only answers by email.\n\n## And beyond\n\nFor platform and B2B marketplace projects, we also work in Belgium, Luxembourg and French-speaking Switzerland, where we have delivered five platforms in regulated professions.",
      "## La segunda área urbana de Francia, y pocos estudios que programen\n\nEl área metropolitana de Aix-Marsella tiene cerca de dos millones de habitantes y un tejido empresarial denso: logística y marítimo, salud, servicios a empresas, industria, turismo. La oferta de proveedores es abundante, pero mayoritariamente basada en plantillas de WordPress y tiendas llave en mano. En cuanto un proyecto sale de la plantilla —un área de cliente, una tarifa negociada, una regla de negocio— ese modelo alcanza su límite.\n\nEse es exactamente el espacio que ocupamos: código a medida, por el equipo que lo diseña.\n\n## Qué desarrollamos para las empresas marsellesas\n\n- **Aplicaciones de gestión y áreas de cliente**: expedientes, etapas, documentos, roles y permisos finos. Desde 20.000 €.\n- **Tiendas profesionales** con presupuestos, tarifas por cliente y productos configurables. Desde 15.000 €.\n- **Webs a medida** multilingües con panel autónomo. Desde 9.000 €.\n- **Retomar un proyecto** cuando un proveedor se ha ido dejando una web que nadie sabe evolucionar.\n\n## El multilingüe, útil aquí\n\nMarsella comercia con el Magreb, Italia, España y todo el arco mediterráneo. Nuestras arquitecturas integran el multilingüe desde el diseño —francés, inglés, español de serie— en lugar de mediante una extensión añadida después, que degrada el rendimiento y las URLs.\n\n## Proximidad real\n\nEstamos en Aix, a treinta minutos. La reunión de encuadre se hace presencialmente, y la recepción también. Para un proyecto que compromete un presupuesto serio, es una ventaja concreta frente a un proveedor que solo responde por correo.\n\n## Y más allá\n\nPara proyectos de plataforma y marketplace B2B, trabajamos también en Bélgica, Luxemburgo y la Suiza francófona, donde hemos entregado cinco plataformas en profesiones reguladas.",
    ),
    faqs: [
      {
        question: t(
          "Intervenez-vous sur place à Marseille ?",
          "Do you work on site in Marseille?",
          "¿Trabajáis presencialmente en Marsella?",
        ),
        answer: t(
          "Oui. Notre établissement est à Aix, soit trente minutes : nous venons chez vous pour le cadrage et pour la recette, et ces déplacements ne vous sont pas facturés.",
          "Yes. Our office is in Aix, thirty minutes away: we come to you for scoping and for acceptance, and that travel is not billed to you.",
          "Sí. Nuestra oficina está en Aix, a treinta minutos: vamos a tus instalaciones para el encuadre y la recepción, y esos desplazamientos no se te facturan.",
        ),
      },
      {
        question: t(
          "Pouvez-vous reprendre un site développé par quelqu'un d'autre ?",
          "Can you take over a site built by someone else?",
          "¿Podéis retomar una web desarrollada por otra persona?",
        ),
        answer: t(
          "Oui si le code est accessible et dans une technologie que nous maîtrisons. Nous commençons par un audit payant de quelques jours : il dit honnêtement s'il vaut mieux reprendre ou reconstruire, et vous repartez avec le document même si vous ne poursuivez pas avec nous.",
          "Yes, if the code is accessible and in a technology we know. We start with a paid audit of a few days: it says honestly whether taking over or rebuilding is better, and you keep the document even if you do not continue with us.",
          "Sí, si el código es accesible y está en una tecnología que dominamos. Empezamos con una auditoría de pago de unos días: dice con honestidad si conviene retomar o reconstruir, y te quedas con el documento incluso si no sigues con nosotros.",
        ),
      },
    ],
  },
  {
    key: "belgique",
    icon: "Workflow",
    highlights: ["5 plateformes livrées", "Professions réglementées", "FR · NL · EN"],
    serviceKeys: ["plateformes-metier", "saas-abonnement", "applications-web"],
    projectKeys: ["fiderio", "brokeris", "onshare", "skillio", "buymonth"],
    slug: t("belgique", "belgium", "belgica"),
    title: t(
      "Développement de plateformes B2B en Belgique",
      "B2B platform development in Belgium",
      "Desarrollo de plataformas B2B en Bélgica",
    ),
    lead: t(
      "C'est en Belgique que nous avons livré le plus : cinq plateformes métier en production, dans le courtage, les fiduciaires, l'immobilier et le recrutement financier.",
      "Belgium is where we have delivered most: five business platforms in production, across insurance broking, accountancy firms, real estate and financial recruitment.",
      "Bélgica es donde más hemos entregado: cinco plataformas de negocio en producción, en corretaje, asesorías, inmobiliaria y selección financiera.",
    ),
    body: t(
      "## Le marché où nous avons le plus de références\n\nCinq des plateformes que nous avons développées tournent en Belgique, toutes dans des professions réglementées :\n\n- **Fiderio** — cession et association de cabinets comptables, abonnement acheteur à 59 €/mois\n- **Brokeris** — cession de portefeuilles de courtage en assurance, entièrement off-market\n- **OnShare** — réseau d'agences immobilières partageant mandats et acquéreurs, 150 €/mois HTVA\n- **Skillio** — recrutement confidentiel en comptabilité et finance\n- **BuyMonth** — outil de conversion pour promoteurs immobiliers, conforme au cadre belge du crédit\n\nCe n'est pas une coïncidence de secteurs. Ces cinq produits résolvent le même problème sous des formes différentes : mettre deux populations professionnelles en relation sans exposer prématurément l'une à l'autre.\n\n## Ce que nous avons appris de ce marché\n\n**La confidentialité est une fonctionnalité, pas une option.** Dans un pays de cette taille, tout le monde se connaît : une annonce publique de cession se retourne contre le cédant en quelques jours. La visibilité graduée n'est pas un raffinement, c'est la condition pour que le produit existe.\n\n**Le multilingue n'est pas négociable.** Francophone, néerlandophone, germanophone, plus l'anglais des institutions. Nos architectures intègrent l'internationalisation dès la conception, avec une URL propre par langue.\n\n**Les fédérations professionnelles comptent plus que la publicité.** Sur ces marchés, la crédibilité passe par les organisations de la profession et la recommandation entre confrères, pas par des annonces payantes. Personne ne tape « plateforme de cession de portefeuille de courtage » dans un moteur de recherche.\n\n## Ce que nous développons\n\nMarketplaces et plateformes de mise en relation à partir de 35 000 €, produits SaaS par abonnement à partir de 25 000 €, applications métier et espaces clients à partir de 20 000 €.\n\n## Hébergement et conformité\n\nHébergement dans l'Union européenne par défaut, avec contrat de sous-traitance précisant les localisations et les sous-traitants. Pour les données de professions réglementées, la localisation se décide au devis.\n\n## Et au Luxembourg\n\nLe marché luxembourgeois présente la même structure — fiduciaires, assurance, banque — avec des volumes supérieurs. Nos références belges y sont directement pertinentes.",
      "## The market where we have the most references\n\nFive of the platforms we have built run in Belgium, all in regulated professions:\n\n- **Fiderio** — selling and merging accountancy firms, buyer subscription at €59/month\n- **Brokeris** — selling insurance brokerage portfolios, entirely off-market\n- **OnShare** — network of estate agencies sharing mandates and buyers, €150/month ex VAT\n- **Skillio** — confidential recruitment in accountancy and finance\n- **BuyMonth** — conversion tool for property developers, compliant with the Belgian lending framework\n\nThe sector spread is not a coincidence. These five products solve the same problem in different forms: connecting two professional populations without exposing either to the other prematurely.\n\n## What we have learned from this market\n\n**Confidentiality is a feature, not an option.** In a country this size, everybody knows everybody: a public sale announcement turns against the seller within days. Graduated visibility is not a refinement, it is the condition for the product to exist at all.\n\n**Multilingual is not negotiable.** French-, Dutch- and German-speaking, plus the English of the institutions. Our architectures build internationalisation in from the design stage, with a clean URL per language.\n\n**Professional federations matter more than advertising.** In these markets, credibility runs through the trade's own organisations and peer referral, not paid ads. Nobody types \"insurance portfolio sale platform\" into a search engine.\n\n## What we build\n\nMarketplaces and introduction platforms from €35,000, subscription SaaS products from €25,000, business applications and client portals from €20,000.\n\n## Hosting and compliance\n\nHosting in the European Union by default, with a processing agreement specifying locations and sub-processors. For regulated-profession data, location is decided at quotation stage.\n\n## And in Luxembourg\n\nThe Luxembourg market has the same structure — accountancy firms, insurance, banking — at greater volume. Our Belgian references are directly relevant there.",
      "## El mercado donde tenemos más referencias\n\nCinco de las plataformas que hemos desarrollado funcionan en Bélgica, todas en profesiones reguladas:\n\n- **Fiderio** — cesión y asociación de asesorías contables, suscripción de comprador a 59 €/mes\n- **Brokeris** — cesión de carteras de corretaje de seguros, totalmente fuera de mercado\n- **OnShare** — red de agencias inmobiliarias que comparten mandatos y compradores, 150 €/mes sin IVA\n- **Skillio** — selección confidencial en contabilidad y finanzas\n- **BuyMonth** — herramienta de conversión para promotores, conforme al marco belga del crédito\n\nEl reparto sectorial no es casualidad. Estos cinco productos resuelven el mismo problema en formas distintas: poner en relación a dos poblaciones profesionales sin exponer prematuramente una a la otra.\n\n## Lo que hemos aprendido de este mercado\n\n**La confidencialidad es una funcionalidad, no una opción.** En un país de este tamaño todo el mundo se conoce: un anuncio público de cesión se vuelve contra el vendedor en pocos días. La visibilidad graduada no es un refinamiento, es la condición para que el producto exista.\n\n**El multilingüe no es negociable.** Francófono, neerlandófono, germanófono, más el inglés de las instituciones. Nuestras arquitecturas integran la internacionalización desde el diseño, con una URL propia por idioma.\n\n**Las federaciones profesionales cuentan más que la publicidad.** En estos mercados, la credibilidad pasa por las organizaciones de la profesión y la recomendación entre colegas, no por anuncios pagados. Nadie escribe «plataforma de cesión de cartera de corretaje» en un buscador.\n\n## Qué desarrollamos\n\nMarketplaces y plataformas de mediación desde 35.000 €, productos SaaS por suscripción desde 25.000 €, aplicaciones de gestión y áreas de cliente desde 20.000 €.\n\n## Alojamiento y cumplimiento\n\nAlojamiento en la Unión Europea por defecto, con contrato de encargo que especifica ubicaciones y subencargados. Para datos de profesiones reguladas, la ubicación se decide en el presupuesto.\n\n## Y en Luxemburgo\n\nEl mercado luxemburgués tiene la misma estructura —asesorías, seguros, banca— con volúmenes superiores. Nuestras referencias belgas son directamente pertinentes allí.",
    ),
    faqs: [
      {
        question: t(
          "Comment travaillez-vous avec vos clients belges ?",
          "How do you work with your Belgian clients?",
          "¿Cómo trabajáis con vuestros clientes belgas?",
        ),
        answer: t(
          "Comme avec les cinq plateformes belges déjà en production : des points réguliers en visioconférence, un lien de préproduction ouvert dès la première semaine, et des déplacements sur place aux étapes clés. Nos clients voient le produit avancer en continu, pas en réunion de jalon.",
          "The same way as with the five Belgian platforms already in production: regular video calls, a preview link open from the first week, and travel on site at key milestones. Our clients watch the product progress continuously, not at milestone meetings.",
          "Igual que con las cinco plataformas belgas ya en producción: reuniones periódicas por videoconferencia, un enlace de preproducción abierto desde la primera semana y desplazamientos a sus instalaciones en las etapas clave. Nuestros clientes ven el producto avanzar de forma continua, no en reuniones de hito.",
        ),
      },
      {
        question: t(
          "Gérez-vous le néerlandais ?",
          "Do you handle Dutch?",
          "¿Gestionáis el neerlandés?",
        ),
        answer: t(
          "L'architecture le gère sans difficulté : ajouter une langue consiste à ajouter un jeu de traductions, pas à refaire le site. Nous travaillons avec vos traducteurs ou les vôtres en interne pour le contenu néerlandophone.",
          "The architecture handles it without difficulty: adding a language means adding a set of translations, not rebuilding the site. We work with your translators or your in-house team for Dutch-language content.",
          "La arquitectura lo gestiona sin dificultad: añadir un idioma consiste en añadir un juego de traducciones, no en rehacer la web. Trabajamos con tus traductores o con tu equipo interno para el contenido en neerlandés.",
        ),
      },
      {
        question: t(
          "Facturez-vous en euros, avec TVA belge ?",
          "Do you invoice in euros, with Belgian VAT?",
          "¿Facturáis en euros, con IVA belga?",
        ),
        answer: t(
          "En euros, oui. Pour une entreprise belge assujettie, la prestation relève de l'autoliquidation intracommunautaire : nous facturons hors TVA et vous la déclarez. Votre comptable confirmera le traitement selon votre situation.",
          "In euros, yes. For a VAT-registered Belgian company, the service falls under intra-Community reverse charge: we invoice excluding VAT and you account for it. Your accountant will confirm the treatment for your situation.",
          "En euros, sí. Para una empresa belga sujeta a IVA, la prestación se acoge a la inversión del sujeto pasivo intracomunitaria: facturamos sin IVA y tú lo declaras. Tu asesor confirmará el tratamiento según tu situación.",
        ),
      },
    ],
  },
  {
    key: "luxembourg",
    icon: "Database",
    highlights: ["Fiduciaires & fonds", "FR · EN · DE", "Références sectorielles"],
    serviceKeys: ["plateformes-metier", "saas-abonnement", "applications-web"],
    projectKeys: ["fiderio", "brokeris", "skillio"],
    slug: t("luxembourg", "luxembourg", "luxemburgo"),
    title: t(
      "Développement de plateformes B2B au Luxembourg",
      "B2B platform development in Luxembourg",
      "Desarrollo de plataformas B2B en Luxemburgo",
    ),
    lead: t(
      "Fiduciaires, assurance, fonds, conseil : les mêmes métiers pour lesquels nous avons livré cinq plateformes en Belgique, avec des volumes supérieurs.",
      "Accountancy firms, insurance, funds, advisory: the same professions we have delivered five platforms for in Belgium, at greater volume.",
      "Asesorías, seguros, fondos, consultoría: las mismas profesiones para las que hemos entregado cinco plataformas en Bélgica, con volúmenes superiores.",
    ),
    body: t(
      "## Un marché dense, et peu de studios spécialisés\n\nLe Luxembourg concentre une densité d'activités financières et de services professionnels sans équivalent à cette échelle : fiduciaires, domiciliation, gestion de fonds, assurance, banque privée, cabinets d'avocats, institutions européennes. Ce sont exactement les métiers pour lesquels nous développons des plateformes depuis trois ans en Belgique.\n\nL'offre locale de développement sur mesure est en revanche étroite : une grande partie des projets part chez les grands cabinets de conseil, à des tarifs qui n'ont rien à voir, ou chez des agences généralistes qui travaillent sur thème.\n\n## Pourquoi nos références belges sont pertinentes ici\n\nUne plateforme de cession de cabinets comptables conçue pour le marché belge répond au même problème métier qu'au Luxembourg : un titulaire qui veut transmettre sans l'annoncer, un repreneur qui veut évaluer sans se dévoiler. Les règles diffèrent, la mécanique de confidentialité est identique.\n\n- **Fiderio** — cession et association de cabinets comptables\n- **Brokeris** — cession de portefeuilles de courtage en assurance\n- **Skillio** — recrutement confidentiel en comptabilité et finance\n\n## Le multilingue, structurellement indispensable\n\nFrançais, anglais, allemand, souvent luxembourgeois pour l'interface publique. Un produit destiné à ce marché ne peut pas être monolingue, et ajouter les langues après coup dégrade les performances et les URLs. Notre architecture les intègre dès la conception, avec une URL propre par langue.\n\n## Ce que nous développons\n\nPlateformes de mise en relation et marketplaces B2B à partir de 35 000 €. Produits SaaS par abonnement, avec formules, essais et facturation automatique, à partir de 25 000 €. Applications métier, espaces clients et portails documentaires à partir de 20 000 €.\n\n## Données et hébergement\n\nHébergement dans l'Union européenne par défaut, contrat de sous-traitance détaillant localisations et sous-traitants, journalisation des accès aux documents. Pour les activités réglementées, ces points se traitent au devis et non après la mise en ligne.\n\n## Comment se déroule un projet\n\nLe cadrage se fait en visioconférence, et nous nous déplaçons aux étapes qui le méritent : la présentation des maquettes, la recette, la formation de vos équipes. Entre les deux, un lien de préproduction reste ouvert en continu dès la première semaine — vous suivez l'avancement quand vous voulez, sans attendre une réunion de jalon. C'est ainsi que nous avons livré cinq plateformes en Belgique.",
      "## A dense market, and few specialist studios\n\nLuxembourg concentrates a density of financial activity and professional services with no equivalent at this scale: accountancy and domiciliation firms, fund administration, insurance, private banking, law firms, European institutions. These are exactly the professions we have been building platforms for in Belgium for three years.\n\nLocal bespoke development capacity, by contrast, is thin: much of the work goes to the large consultancies, at entirely different rates, or to generalist agencies working on themes.\n\n## Why our Belgian references are relevant here\n\nA platform for selling accountancy firms designed for the Belgian market answers the same business problem in Luxembourg: a principal who wants to hand over without announcing it, a buyer who wants to evaluate without revealing themselves. The rules differ; the confidentiality mechanics are identical.\n\n- **Fiderio** — selling and merging accountancy firms\n- **Brokeris** — selling insurance brokerage portfolios\n- **Skillio** — confidential recruitment in accountancy and finance\n\n## Multilingual, structurally essential\n\nFrench, English, German, often Luxembourgish for the public interface. A product aimed at this market cannot be monolingual, and adding languages afterwards degrades performance and URLs. Our architecture builds them in from the design stage, with a clean URL per language.\n\n## What we build\n\nIntroduction platforms and B2B marketplaces from €35,000. Subscription SaaS products, with plans, trials and automated invoicing, from €25,000. Business applications, client portals and document portals from €20,000.\n\n## Data and hosting\n\nHosting in the European Union by default, a processing agreement detailing locations and sub-processors, logging of document access. For regulated activities, these points are handled at quotation stage, not after launch.\n\n## How a project runs\n\nScoping happens over video, and we travel for the stages that deserve it: the design presentation, acceptance, training your teams. In between, a preview link stays open continuously from the first week — you follow progress whenever you want, without waiting for a milestone meeting. That is how we delivered five platforms in Belgium.",
      "## Un mercado denso y pocos estudios especializados\n\nLuxemburgo concentra una densidad de actividad financiera y de servicios profesionales sin equivalente a esta escala: asesorías y domiciliación, administración de fondos, seguros, banca privada, despachos de abogados, instituciones europeas. Son exactamente las profesiones para las que desarrollamos plataformas desde hace tres años en Bélgica.\n\nLa capacidad local de desarrollo a medida es, en cambio, estrecha: buena parte de los proyectos va a las grandes consultoras, a tarifas que no tienen nada que ver, o a agencias generalistas que trabajan con plantillas.\n\n## Por qué nuestras referencias belgas son pertinentes aquí\n\nUna plataforma de cesión de asesorías diseñada para el mercado belga responde al mismo problema de negocio en Luxemburgo: un titular que quiere transmitir sin anunciarlo, un comprador que quiere evaluar sin darse a conocer. Las reglas difieren; la mecánica de confidencialidad es idéntica.\n\n- **Fiderio** — cesión y asociación de asesorías contables\n- **Brokeris** — cesión de carteras de corretaje de seguros\n- **Skillio** — selección confidencial en contabilidad y finanzas\n\n## El multilingüe, estructuralmente imprescindible\n\nFrancés, inglés, alemán, a menudo luxemburgués para la interfaz pública. Un producto dirigido a este mercado no puede ser monolingüe, y añadir idiomas después degrada el rendimiento y las URLs. Nuestra arquitectura los integra desde el diseño, con una URL propia por idioma.\n\n## Qué desarrollamos\n\nPlataformas de mediación y marketplaces B2B desde 35.000 €. Productos SaaS por suscripción, con planes, pruebas y facturación automática, desde 25.000 €. Aplicaciones de gestión, áreas de cliente y portales documentales desde 20.000 €.\n\n## Datos y alojamiento\n\nAlojamiento en la Unión Europea por defecto, contrato de encargo que detalla ubicaciones y subencargados, registro de accesos a documentos. Para actividades reguladas, estos puntos se tratan en el presupuesto y no después de la publicación.\n\n## Cómo se desarrolla un proyecto\n\nEl encuadre se hace por videoconferencia y nos desplazamos en las etapas que lo merecen: la presentación de las maquetas, la recepción, la formación de tus equipos. Entre medias, un enlace de preproducción permanece abierto de forma continua desde la primera semana: sigues el avance cuando quieras, sin esperar a una reunión de hito. Así entregamos cinco plataformas en Bélgica.",
    ),
    faqs: [
      {
        question: t(
          "Quelles références pouvez-vous montrer sur ces métiers ?",
          "What references can you show in these professions?",
          "¿Qué referencias podéis mostrar en estas profesiones?",
        ),
        answer: t(
          "Trois plateformes dans exactement ces métiers : Fiderio pour la cession de cabinets comptables, Brokeris pour les portefeuilles de courtage, Skillio pour le recrutement financier. Elles tournent en production et sont consultables en ligne — vous jugerez sur des produits qui fonctionnent, pas sur une présentation.",
          "Three platforms in exactly these professions: Fiderio for selling accountancy firms, Brokeris for brokerage portfolios, Skillio for financial recruitment. They run in production and can be viewed online — you will judge us on products that work, not on a pitch.",
          "Tres plataformas en exactamente estas profesiones: Fiderio para la cesión de asesorías, Brokeris para las carteras de corretaje, Skillio para la selección financiera. Funcionan en producción y pueden consultarse en línea: nos juzgarás por productos que funcionan, no por una presentación.",
        ),
      },
      {
        question: t(
          "Pouvez-vous héberger les données au Luxembourg ?",
          "Can you host the data in Luxembourg?",
          "¿Podéis alojar los datos en Luxemburgo?",
        ),
        answer: t(
          "Oui, et c'est une demande fréquente dans les activités réglementées. Nous travaillons avec des hébergeurs européens permettant de fixer la région de stockage, et la localisation retenue figure au contrat de sous-traitance.",
          "Yes, and it is a frequent requirement in regulated activities. We work with European providers that allow the storage region to be fixed, and the chosen location is stated in the processing agreement.",
          "Sí, y es una exigencia frecuente en actividades reguladas. Trabajamos con proveedores europeos que permiten fijar la región de almacenamiento, y la ubicación elegida figura en el contrato de encargo.",
        ),
      },
    ],
  },
  {
    key: "suisse-romande",
    icon: "Sparkles",
    highlights: ["Genève & Lausanne", "Hébergement suisse", "FR · EN · DE"],
    serviceKeys: ["plateformes-metier", "saas-abonnement", "applications-web"],
    projectKeys: ["fiderio", "brokeris", "skillio"],
    slug: t("suisse-romande", "french-speaking-switzerland", "suiza-francofona"),
    title: t(
      "Développement de plateformes B2B en Suisse romande",
      "B2B platform development in French-speaking Switzerland",
      "Desarrollo de plataformas B2B en la Suiza francófona",
    ),
    lead: t(
      "Gestion de patrimoine, fiduciaires, cliniques privées, négoce : du développement sur mesure au standard suisse, avec hébergement en Suisse quand la conformité l'exige.",
      "Wealth management, accountancy firms, private clinics, trading: bespoke development to Swiss standards, with Swiss hosting where compliance requires it.",
      "Gestión de patrimonios, asesorías, clínicas privadas, negocio: desarrollo a medida al estándar suizo, con alojamiento en Suiza cuando el cumplimiento lo exige.",
    ),
    body: t(
      "## Des métiers que nous connaissons déjà\n\nGenève et Lausanne concentrent la banque privée et les family offices, le négoce de matières premières, les fiduciaires, les cabinets d'avocats, les cliniques privées, l'écosystème de l'EPFL et un grand nombre d'organisations internationales. Les cinq plateformes que nous avons livrées en Belgique relèvent des mêmes familles de métiers : courtage en assurance, fiduciaires, immobilier, recrutement financier.\n\nLe besoin technique y est identique — confidentialité graduée, accès par rôle, abonnements, multilingue — et c'est précisément ce que nous construisons.\n\n## La localisation des données, traitée au devis\n\nC'est le point que la plupart des prestataires étrangers esquivent, et c'est souvent décisif pour une banque, une fiduciaire, un cabinet d'avocats ou une clinique. La nLPD révisée impose un cadre strict, et vos clients vous demanderont où sont stockées les données.\n\nNous proposons l'hébergement en Suisse, chez des opérateurs suisses, avec un contrat de sous-traitance qui nomme les localisations et les sous-traitants. À défaut, l'Union européenne par défaut. Ce choix figure au devis, pas dans une discussion après la mise en ligne.\n\n## Ce que nous développons\n\n- **Plateformes de mise en relation** et marketplaces confidentielles, à partir de 35 000 €\n- **Produits SaaS par abonnement**, avec formules et facturation automatique, à partir de 25 000 €\n- **Applications métier et portails clients** avec accès par rôle et journalisation, à partir de 20 000 €\n- **Sites sur mesure** multilingues, à partir de 9 000 €\n\n## Notre positionnement tarifaire\n\nNous facturons en euros, à des niveaux de marché français. Pour un projet équivalent, l'écart avec une agence locale est substantiel, sans que la qualité de livraison change : même équipe, même exigence de performance, mêmes engagements contractuels. Nous ne cherchons pas à être les moins chers du marché, parce qu'un prix trop bas ne signale pas une bonne affaire.\n\n## Comment se déroule un projet\n\nLe cadrage se fait en visioconférence, et nous nous déplaçons pour les étapes qui comptent : la présentation des maquettes, la recette, la formation. Entre les deux, un lien de préproduction reste ouvert en continu dès la première semaine, et vous parlez directement aux personnes qui conçoivent et développent — pas à un chef de projet intermédiaire. C'est le mode de travail qui nous a permis de livrer cinq plateformes métier.",
      "## Professions we already know\n\nGeneva and Lausanne concentrate private banking and family offices, commodity trading, accountancy firms, law firms, private clinics, the EPFL ecosystem and a large number of international organisations. The five platforms we have delivered in Belgium belong to the same professional families: insurance broking, accountancy firms, real estate, financial recruitment.\n\nThe technical requirement is identical — graduated confidentiality, role-based access, subscriptions, multilingual — and that is precisely what we build.\n\n## Data location, handled at quotation stage\n\nThis is the point most foreign suppliers dodge, and it is often decisive for a bank, an accountancy firm, a law firm or a clinic. The revised FADP imposes a strict framework, and your clients will ask where data is stored.\n\nWe offer hosting in Switzerland, with Swiss operators, under a processing agreement that names locations and sub-processors. Failing that, the European Union by default. That choice is in the quote, not in a conversation after launch.\n\n## What we build\n\n- **Introduction platforms** and confidential marketplaces, from €35,000\n- **Subscription SaaS products**, with plans and automated invoicing, from €25,000\n- **Business applications and client portals** with role-based access and logging, from €20,000\n- **Bespoke multilingual sites**, from €9,000\n\n## Our pricing position\n\nWe invoice in euros, at French market levels. For an equivalent project the gap against a local agency is substantial, without any change in delivery quality: same team, same performance standards, same contractual commitments. We are not trying to be the cheapest on the market, because too low a price does not signal a good deal.\n\n## How a project runs\n\nScoping happens over video, and we travel for the stages that matter: the design presentation, acceptance, training. In between, a preview link stays open continuously from the first week, and you talk directly to the people designing and building — not to a project manager in between. That is the way of working that let us deliver five business platforms.",
      "## Profesiones que ya conocemos\n\nGinebra y Lausana concentran la banca privada y los family offices, el comercio de materias primas, las asesorías, los despachos de abogados, las clínicas privadas, el ecosistema de la EPFL y un gran número de organizaciones internacionales. Las cinco plataformas que hemos entregado en Bélgica pertenecen a las mismas familias profesionales: corretaje de seguros, asesorías, inmobiliaria, selección financiera.\n\nLa necesidad técnica es idéntica —confidencialidad graduada, acceso por rol, suscripciones, multilingüe— y es precisamente lo que construimos.\n\n## La ubicación de los datos, tratada en el presupuesto\n\nEs el punto que la mayoría de los proveedores extranjeros esquiva, y suele ser decisivo para un banco, una asesoría, un despacho de abogados o una clínica. La nLPD revisada impone un marco estricto, y tus clientes te preguntarán dónde se almacenan los datos.\n\nOfrecemos alojamiento en Suiza, con operadores suizos, bajo un contrato de encargo que nombra ubicaciones y subencargados. En su defecto, la Unión Europea por defecto. Esa elección consta en el presupuesto, no en una conversación posterior a la publicación.\n\n## Qué desarrollamos\n\n- **Plataformas de mediación** y marketplaces confidenciales, desde 35.000 €\n- **Productos SaaS por suscripción**, con planes y facturación automática, desde 25.000 €\n- **Aplicaciones de gestión y portales de cliente** con acceso por rol y registro, desde 20.000 €\n- **Webs a medida** multilingües, desde 9.000 €\n\n## Nuestro posicionamiento de precio\n\nFacturamos en euros, a niveles de mercado francés. Para un proyecto equivalente, la diferencia frente a una agencia local es sustancial, sin que cambie la calidad de entrega: mismo equipo, misma exigencia de rendimiento, mismos compromisos contractuales. No pretendemos ser los más baratos del mercado, porque un precio demasiado bajo no señala una buena oportunidad.\n\n## Cómo se desarrolla un proyecto\n\nEl encuadre se hace por videoconferencia y nos desplazamos para las etapas que cuentan: la presentación de las maquetas, la recepción, la formación. Entre medias, un enlace de preproducción permanece abierto de forma continua desde la primera semana, y hablas directamente con quienes diseñan y desarrollan, no con un jefe de proyecto intermedio. Es la forma de trabajar que nos permitió entregar cinco plataformas de negocio.",
    ),
    faqs: [
      {
        question: t(
          "Pouvez-vous héberger les données en Suisse ?",
          "Can you host the data in Switzerland?",
          "¿Podéis alojar los datos en Suiza?",
        ),
        answer: t(
          "Oui, chez des opérateurs suisses. La localisation retenue et les sous-traitants sont nommés dans le contrat de sous-traitance, de façon à ce que vous puissiez répondre à vos propres clients et à votre conformité.",
          "Yes, with Swiss operators. The chosen location and the sub-processors are named in the processing agreement, so that you can answer your own clients and your compliance function.",
          "Sí, con operadores suizos. La ubicación elegida y los subencargados se nombran en el contrato de encargo, de modo que puedas responder a tus propios clientes y a tu área de cumplimiento.",
        ),
      },
      {
        question: t(
          "Facturez-vous en francs suisses ?",
          "Do you invoice in Swiss francs?",
          "¿Facturáis en francos suizos?",
        ),
        answer: t(
          "Nous facturons en euros. Pour une entreprise suisse, la prestation est hors champ de la TVA française ; l'importation de services se déclare selon vos obligations locales, que votre fiduciaire confirmera.",
          "We invoice in euros. For a Swiss company the service is outside the scope of French VAT; the import of services is declared according to your local obligations, which your accountant will confirm.",
          "Facturamos en euros. Para una empresa suiza la prestación queda fuera del ámbito del IVA francés; la importación de servicios se declara según tus obligaciones locales, que tu asesor confirmará.",
        ),
      },
      {
        question: t(
          "Que se passe-t-il si nous changeons de prestataire ?",
          "What happens if we change supplier?",
          "¿Qué ocurre si cambiamos de proveedor?",
        ),
        answer: t(
          "Vous reprenez le projet sans rien réécrire. Le dépôt de code vous appartient dès le premier jour, la documentation de reprise est livrée avec, et nous accompagnons le transfert. C'est la garantie la plus concrète qu'on puisse vous donner : vous n'êtes captif de personne, nous compris.",
          "You pick the project up without rewriting anything. The code repository is yours from day one, the handover documentation ships with it, and we support the transfer. That is the most concrete guarantee we can give: you are locked in to nobody, including us.",
          "Retomas el proyecto sin reescribir nada. El repositorio de código es tuyo desde el primer día, la documentación de traspaso se entrega con él y acompañamos la transferencia. Es la garantía más concreta que podemos darte: no dependes de nadie, nosotros incluidos.",
        ),
      },
    ],
  },
];
