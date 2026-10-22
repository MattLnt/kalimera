import { t } from "./locale";

/**
 * Pages sectorielles.
 *
 * Chacune répond à une intention de recherche précise et s'adosse aux
 * réalisations qui la prouvent quand il en existe une : `projectKeys` n'est
 * pas décoratif, et une page adossée à un projet livré convertit mieux.
 *
 * Certaines pages décrivent en revanche ce que le studio sait faire dans un
 * métier où il n'a pas encore livré. Elles sont écrites dans ce registre —
 * ce que nous construisons, ce que coûte le problème — et ne laissent jamais
 * entendre une référence qui n'existe pas. Le bloc « réalisations » et le
 * compteur de projets disparaissent d'eux-mêmes quand `projectKeys` est vide.
 *
 * Les FAQ alimentent le bloc visible et le `FAQPage` des données structurées,
 * éligible au résultat enrichi déroulant dans Google.
 */
export const sectors = [
  {
    key: "courtage-assurance",
    icon: "Workflow",
    highlights: ["Confidentialité", "Cession de portefeuille", "Abonnements"],
    serviceKeys: ["plateformes-metier", "saas-abonnement"],
    projectKeys: ["brokeris"],
    slug: t("courtage-assurance", "insurance-broking", "corretaje-de-seguros"),
    title: t(
      "Plateformes pour le courtage en assurance",
      "Platforms for insurance broking",
      "Plataformas para el corretaje de seguros",
    ),
    lead: t(
      "Nous développons les outils dont les courtiers ont besoin et que les logiciels généralistes ne savent pas faire : cession de portefeuille confidentielle, accès par rôle, abonnements.",
      "We build the tools brokers need and general-purpose software cannot deliver: confidential portfolio sales, role-based access, subscriptions.",
      "Desarrollamos las herramientas que los corredores necesitan y que el software generalista no sabe ofrecer: cesión de cartera confidencial, acceso por rol, suscripciones.",
    ),
    body: t(
      "## Un secteur où la confidentialité est la fonctionnalité\n\nDans le courtage, l'information a une valeur marchande et une valeur de nuisance. Un cabinet qui envisage de céder son portefeuille ne peut pas l'annoncer : ses assurés s'inquiètent, ses concurrents démarchent, ses collaborateurs cherchent ailleurs. Le même problème se pose pour un apporteur qui veut se faire connaître sans révéler ses encours.\n\nC'est pour cette raison que les outils génériques échouent sur ce marché. Un annuaire publie, un CRM stocke — aucun des deux ne sait gérer une visibilité graduée, qui est précisément le besoin.\n\n## Ce que nous avons construit\n\nAvec **Brokeris**, nous avons développé une plateforme de cession de portefeuilles entièrement off-market. Le portefeuille est décrit par branche et par volume de primes, sans que le cabinet soit nommé. L'acquéreur filtre, se déclare, et n'obtient l'identité et les pièces qu'après accord explicite du cédant. Chaque consultation de document est journalisée.\n\n## Les briques spécifiques au courtage\n\n- **Visibilité graduée** : annonce anonymisée, puis déverrouillage sur accord\n- **Vérification des comptes** avant toute publication, manuelle ou automatisée\n- **Description par branche** : IARD, vie, santé, prévoyance, avec volumes\n- **Messagerie interne**, pour que la relation reste sur la plateforme\n- **Journal des accès**, exigible en cas de litige sur une opération\n- **Abonnements récurrents**, l'accès acquéreur étant la source de revenu\n\n## Ce que nous développons aussi pour des courtiers\n\nAu-delà des marketplaces : espaces clients pour la remise de documents et le suivi de sinistre, outils internes de gestion de portefeuille et de commissionnement, comparateurs et formulaires de tarification connectés aux API des assureurs, et tableaux de bord de production par apporteur.\n\n## Hébergement et données\n\nLes données d'assurés sont des données sensibles. Nous hébergeons dans l'Union européenne par défaut, avec un contrat de sous-traitance en règle, et pouvons héberger en Suisse quand un client le demande. La localisation se décide au devis, pas après la mise en ligne.\n\n## Budget et délai\n\nUne plateforme de mise en relation démarre à 35 000 € et trois à cinq mois. Un espace client ou un outil interne démarre à 20 000 € et six à dix semaines. Le périmètre est chiffré fonctionnalité par fonctionnalité avant le début des travaux.",
      "## A sector where confidentiality is the feature\n\nIn broking, information has both a market value and a nuisance value. A firm considering selling its portfolio cannot announce it: policyholders worry, competitors come calling, staff start looking elsewhere. The same problem affects an introducer who wants to be known without revealing their book.\n\nThis is why generic tools fail in this market. A directory publishes, a CRM stores — neither handles graduated visibility, which is precisely the requirement.\n\n## What we have built\n\nWith **Brokeris** we built an entirely off-market portfolio sale platform. The portfolio is described by line of business and premium volume, without naming the firm. The buyer filters, identifies themselves, and only obtains the identity and documents after the seller explicitly agrees. Every document view is logged.\n\n## The blocks specific to broking\n\n- **Graduated visibility**: anonymised listing, then unlocking on agreement\n- **Account verification** before any publication, manual or automated\n- **Description by line of business**: P&C, life, health, protection, with volumes\n- **Internal messaging**, so the relationship stays on the platform\n- **Access log**, which may be required in a dispute over a deal\n- **Recurring subscriptions**, buyer access being the revenue source\n\n## What else we build for brokers\n\nBeyond marketplaces: client portals for document submission and claims tracking, internal portfolio and commission management tools, comparison and quotation forms connected to insurer APIs, and production dashboards by introducer.\n\n## Hosting and data\n\nPolicyholder data is sensitive data. We host in the European Union by default, with a compliant processing agreement, and can host in Switzerland where a client asks. Location is decided at quotation stage, not after launch.\n\n## Budget and timeline\n\nAn introduction platform starts at €35,000 and three to five months. A client portal or internal tool starts at €20,000 and six to ten weeks. Scope is quoted feature by feature before work begins.",
      "## Un sector donde la confidencialidad es la funcionalidad\n\nEn el corretaje, la información tiene un valor de mercado y un valor de perjuicio. Un despacho que se plantea ceder su cartera no puede anunciarlo: sus asegurados se inquietan, sus competidores captan y sus empleados buscan en otra parte. El mismo problema afecta a un mediador que quiere darse a conocer sin revelar su volumen.\n\nPor eso las herramientas genéricas fracasan en este mercado. Un directorio publica, un CRM almacena: ninguno gestiona la visibilidad graduada, que es justamente la necesidad.\n\n## Lo que hemos construido\n\nCon **Brokeris** desarrollamos una plataforma de cesión de carteras totalmente fuera de mercado. La cartera se describe por ramo y volumen de primas, sin nombrar al despacho. El comprador filtra, se identifica y solo obtiene la identidad y los documentos tras el acuerdo explícito del vendedor. Cada consulta de documento queda registrada.\n\n## Los bloques propios del corretaje\n\n- **Visibilidad graduada**: anuncio anonimizado y desbloqueo previo acuerdo\n- **Verificación de cuentas** antes de cualquier publicación, manual o automática\n- **Descripción por ramo**: diversos, vida, salud, previsión, con volúmenes\n- **Mensajería interna**, para que la relación se quede en la plataforma\n- **Registro de accesos**, exigible en caso de litigio sobre una operación\n- **Suscripciones recurrentes**, siendo el acceso del comprador la fuente de ingreso\n\n## Qué más desarrollamos para corredores\n\nMás allá de los marketplaces: áreas de cliente para la entrega de documentos y el seguimiento de siniestros, herramientas internas de gestión de cartera y comisiones, comparadores y formularios de tarificación conectados a las API de las aseguradoras, y paneles de producción por mediador.\n\n## Alojamiento y datos\n\nLos datos de asegurados son datos sensibles. Alojamos en la Unión Europea por defecto, con un contrato de encargo conforme, y podemos alojar en Suiza cuando un cliente lo pide. La ubicación se decide en el presupuesto, no después de la publicación.\n\n## Presupuesto y plazo\n\nUna plataforma de mediación arranca en 35.000 € y de tres a cinco meses. Un área de cliente o una herramienta interna arranca en 20.000 € y de seis a diez semanas. El alcance se presupuesta funcionalidad por funcionalidad antes de empezar.",
    ),
    faqs: [
      {
        question: t(
          "Une annonce de cession peut-elle rester invisible des moteurs de recherche ?",
          "Can a sale listing stay invisible to search engines?",
          "¿Puede un anuncio de cesión permanecer invisible para los motores de búsqueda?",
        ),
        answer: t(
          "Oui, et c'est la configuration par défaut sur ce type de plateforme. Les annonces sont servies derrière authentification, exclues de l'indexation et absentes du sitemap. Seules les pages de présentation publique sont indexables.",
          "Yes, and that is the default configuration for this type of platform. Listings are served behind authentication, excluded from indexing and absent from the sitemap. Only the public presentation pages are indexable.",
          "Sí, y es la configuración por defecto en este tipo de plataforma. Los anuncios se sirven tras autenticación, excluidos de la indexación y ausentes del sitemap. Solo las páginas de presentación pública son indexables.",
        ),
      },
      {
        question: t(
          "Où sont hébergées les données des assurés ?",
          "Where is policyholder data hosted?",
          "¿Dónde se alojan los datos de los asegurados?",
        ),
        answer: t(
          "Dans l'Union européenne par défaut, avec un contrat de sous-traitance précisant les localisations et les sous-traitants. Un hébergement en Suisse est possible quand la conformité du client l'exige. C'est écrit au devis.",
          "In the European Union by default, with a processing agreement specifying locations and sub-processors. Swiss hosting is available where a client's compliance requires it. It is written into the quote.",
          "En la Unión Europea por defecto, con un contrato de encargo que especifica ubicaciones y subencargados. El alojamiento en Suiza es posible cuando el cumplimiento del cliente lo exige. Consta en el presupuesto.",
        ),
      },
      {
        question: t(
          "Peut-on connecter la plateforme aux outils des assureurs ?",
          "Can the platform connect to insurers' systems?",
          "¿Se puede conectar la plataforma con los sistemas de las aseguradoras?",
        ),
        answer: t(
          "Oui, dès lors qu'une API ou un format d'échange existe. Nous intégrons régulièrement des flux de tarification et de production. Quand l'assureur n'expose rien, nous passons par import de fichier, avec contrôle de cohérence.",
          "Yes, as soon as an API or exchange format exists. We regularly integrate quotation and production feeds. Where an insurer exposes nothing, we fall back on file import, with consistency checks.",
          "Sí, siempre que exista una API o un formato de intercambio. Integramos con regularidad flujos de tarificación y producción. Cuando la aseguradora no expone nada, recurrimos a la importación de ficheros, con control de coherencia.",
        ),
      },
    ],
  },
  {
    key: "fiduciaires-comptabilite",
    icon: "Database",
    highlights: ["Cession de cabinet", "Dossiers clients", "Belgique & Luxembourg"],
    serviceKeys: ["plateformes-metier", "saas-abonnement", "applications-web"],
    projectKeys: ["fiderio", "skillio"],
    slug: t("fiduciaires-comptabilite", "accountancy-firms", "asesorias-contabilidad"),
    title: t(
      "Plateformes pour fiduciaires et cabinets comptables",
      "Platforms for accountancy and advisory firms",
      "Plataformas para asesorías y despachos contables",
    ),
    lead: t(
      "Cession de cabinet, recrutement confidentiel, espace client : nous développons les outils d'une profession où la discrétion conditionne la transaction.",
      "Firm sales, confidential recruitment, client portals: we build tools for a profession where discretion conditions the transaction.",
      "Cesión de despacho, selección confidencial, área de cliente: desarrollamos las herramientas de una profesión donde la discreción condiciona la transacción.",
    ),
    body: t(
      "## Une profession qui se transmet discrètement\n\nLa démographie du secteur pousse à la transmission : beaucoup de titulaires approchent de la retraite, et la reprise se joue souvent entre confrères. Mais annoncer une cession revient à inquiéter ses clients et ses collaborateurs. Le marché est donc structurellement opaque, lent, et limité au carnet d'adresses de chacun.\n\nLe même paradoxe touche le recrutement : un comptable en poste ne dépose pas son CV sur un site public, parce que son employeur le verra.\n\n## Ce que nous avons construit\n\n**Fiderio** est une marketplace confidentielle de cession et d'association de cabinets en Belgique. Le cédant publie un dossier anonymisé — région, taille, spécialités, structure de clientèle — et l'acquéreur ne découvre l'identité qu'après accord. Le dépôt est gratuit pour les cédants, l'accès acquéreur est à 59 € par mois.\n\n**Skillio** traite le versant recrutement : une plateforme où les candidats du secteur comptable et financier restent anonymes jusqu'à accepter une mise en relation, et où les cabinets accèdent aux profils par abonnement.\n\n## Les briques spécifiques à la profession\n\n- **Dossier anonymisé** : décrire un cabinet sans le rendre identifiable\n- **Qualification des repreneurs** avant l'ouverture des pièces\n- **Déverrouillage tracé**, document par document\n- **Structure de clientèle** : répartition par taille, secteur, récurrence\n- **Messagerie interne** et prise de rendez-vous\n- **Abonnements** et facturation automatique\n\n## Les autres outils que nous développons\n\nEspaces clients pour la collecte des pièces comptables et le suivi des échéances ; portails de signature et de validation ; tableaux de bord de charge par collaborateur ; outils de relance automatique des pièces manquantes, qui est le premier poste de temps perdu d'un cabinet.\n\n## Belgique, Luxembourg et Suisse\n\nC'est en Belgique que nous avons développé ces plateformes, et le Luxembourg présente la même structure de marché avec des volumes supérieurs. Nos interfaces sont trilingues de série, ce qui compte sur ces deux marchés comme en Suisse romande.\n\n## Budget et délai\n\nUne marketplace de cession démarre à 35 000 € et trois à cinq mois. Un espace client de collecte de pièces démarre à 20 000 € et six à dix semaines.",
      "## A profession that changes hands discreetly\n\nThe sector's demographics push towards succession: many principals are approaching retirement, and buyouts often happen between peers. But announcing a sale means unsettling clients and staff. The market is therefore structurally opaque, slow, and limited to each party's address book.\n\nThe same paradox affects recruitment: an accountant in post does not post their CV on a public site, because their employer will see it.\n\n## What we have built\n\n**Fiderio** is a confidential marketplace for selling and merging firms in Belgium. The seller publishes an anonymised file — region, size, specialities, client structure — and the buyer only discovers the identity after agreement. Listing is free for sellers; buyer access is €59 a month.\n\n**Skillio** covers the recruitment side: a platform where candidates in accountancy and finance stay anonymous until they accept an introduction, and where firms access profiles by subscription.\n\n## The blocks specific to the profession\n\n- **Anonymised file**: describing a firm without making it identifiable\n- **Buyer qualification** before documents are opened\n- **Traced unlocking**, document by document\n- **Client structure**: breakdown by size, sector, recurrence\n- **Internal messaging** and appointment booking\n- **Subscriptions** and automated invoicing\n\n## The other tools we build\n\nClient portals for collecting accounting records and tracking deadlines; signature and approval portals; workload dashboards per staff member; automated chasing of missing documents, which is the single biggest source of lost time in a firm.\n\n## Belgium, Luxembourg and Switzerland\n\nWe built these platforms in Belgium, and Luxembourg presents the same market structure at greater volume. Our interfaces are trilingual by default, which matters on both those markets and in French-speaking Switzerland.\n\n## Budget and timeline\n\nA sale marketplace starts at €35,000 and three to five months. A document-collection client portal starts at €20,000 and six to ten weeks.",
      "## Una profesión que se transmite con discreción\n\nLa demografía del sector empuja a la transmisión: muchos titulares se acercan a la jubilación y el relevo suele darse entre colegas. Pero anunciar una cesión equivale a inquietar a clientes y empleados. El mercado es por tanto estructuralmente opaco, lento y limitado a la agenda de cada uno.\n\nLa misma paradoja afecta a la selección: un contable en activo no publica su CV en una web pública, porque su empleador lo verá.\n\n## Lo que hemos construido\n\n**Fiderio** es un marketplace confidencial de cesión y asociación de despachos en Bélgica. El vendedor publica un expediente anonimizado —región, tamaño, especialidades, estructura de clientela— y el comprador solo descubre la identidad tras el acuerdo. La publicación es gratuita para los vendedores; el acceso del comprador cuesta 59 € al mes.\n\n**Skillio** cubre la vertiente de selección: una plataforma donde los candidatos del sector contable y financiero permanecen anónimos hasta aceptar una presentación, y donde los despachos acceden a los perfiles por suscripción.\n\n## Los bloques propios de la profesión\n\n- **Expediente anonimizado**: describir un despacho sin hacerlo identificable\n- **Cualificación de los compradores** antes de abrir las piezas\n- **Desbloqueo trazado**, documento por documento\n- **Estructura de clientela**: reparto por tamaño, sector, recurrencia\n- **Mensajería interna** y concertación de citas\n- **Suscripciones** y facturación automática\n\n## Las otras herramientas que desarrollamos\n\nÁreas de cliente para la recogida de documentación contable y el seguimiento de plazos; portales de firma y validación; paneles de carga por empleado; herramientas de reclamación automática de documentos pendientes, que es la primera fuente de tiempo perdido de un despacho.\n\n## Bélgica, Luxemburgo y Suiza\n\nConstruimos estas plataformas en Bélgica, y Luxemburgo presenta la misma estructura de mercado con volúmenes superiores. Nuestras interfaces son trilingües de serie, lo que cuenta en ambos mercados y en la Suiza francófona.\n\n## Presupuesto y plazo\n\nUn marketplace de cesión arranca en 35.000 € y de tres a cinco meses. Un área de cliente para recogida de documentos arranca en 20.000 € y de seis a diez semanas.",
    ),
    faqs: [
      {
        question: t(
          "Comment décrire un cabinet sans le rendre identifiable ?",
          "How do you describe a firm without making it identifiable?",
          "¿Cómo describir un despacho sin hacerlo identificable?",
        ),
        answer: t(
          "Par agrégats plutôt que par détails : une région au lieu d'une ville, une tranche de chiffre d'affaires au lieu d'un montant, une répartition de clientèle au lieu d'une liste. Le paramétrage de ces seuils fait partie du cadrage du projet.",
          "Through aggregates rather than details: a region instead of a town, a revenue band instead of a figure, a client breakdown instead of a list. Setting those thresholds is part of project scoping.",
          "Mediante agregados en lugar de detalles: una región en vez de una ciudad, un tramo de facturación en vez de un importe, un reparto de clientela en vez de una lista. Configurar esos umbrales forma parte del encuadre del proyecto.",
        ),
      },
      {
        question: t(
          "La plateforme peut-elle gérer plusieurs pays ?",
          "Can the platform handle several countries?",
          "¿Puede la plataforma gestionar varios países?",
        ),
        answer: t(
          "Oui. L'internationalisation est intégrée dès l'architecture : contenus, interface et e-mails existent dans chaque langue, et les règles métier peuvent différer par pays. C'est indispensable pour couvrir Belgique, Luxembourg et Suisse avec un seul produit.",
          "Yes. Internationalisation is built into the architecture from the start: content, interface and emails exist in every language, and business rules can differ per country. That is essential to cover Belgium, Luxembourg and Switzerland with one product.",
          "Sí. La internacionalización está integrada desde la arquitectura: contenidos, interfaz y correos existen en cada idioma, y las reglas de negocio pueden diferir por país. Es imprescindible para cubrir Bélgica, Luxemburgo y Suiza con un solo producto.",
        ),
      },
      {
        question: t(
          "Qui garde la propriété du code et des données ?",
          "Who owns the code and the data?",
          "¿Quién conserva la propiedad del código y los datos?",
        ),
        answer: t(
          "Vous. Le dépôt vous est transféré dès le premier jour, et la base de données est la vôtre. Si vous changez de prestataire, un autre développeur reprend le projet sans réécriture.",
          "You do. The repository is transferred to you from day one, and the database is yours. If you change supplier, another developer picks the project up without a rewrite.",
          "Tú. El repositorio se te transfiere desde el primer día y la base de datos es tuya. Si cambias de proveedor, otro desarrollador retoma el proyecto sin reescribirlo.",
        ),
      },
    ],
  },
  {
    key: "immobilier",
    icon: "Blocks",
    highlights: ["Partage de mandats", "Mensualisation", "Réseaux d'agences"],
    serviceKeys: ["plateformes-metier", "saas-abonnement", "applications-web"],
    projectKeys: ["onshare", "buymonth"],
    slug: t("immobilier", "real-estate", "inmobiliaria"),
    title: t(
      "Plateformes pour l'immobilier et la promotion",
      "Platforms for real estate and development",
      "Plataformas para inmobiliaria y promoción",
    ),
    lead: t(
      "Partage de mandats entre agences, outils de conversion pour promoteurs : nous développons ce que les logiciels de transaction ne couvrent pas.",
      "Mandate sharing between agencies, conversion tools for developers: we build what transaction software does not cover.",
      "Compartición de mandatos entre agencias, herramientas de conversión para promotores: desarrollamos lo que el software de transacción no cubre.",
    ),
    body: t(
      "## Deux problèmes que les logiciels du marché ignorent\n\nLe premier est la coopération. Une agence détient des mandats qu'elle ne vend pas, et des acquéreurs pour des biens qu'elle n'a pas. Partager avec un confrère suppose de régler à l'avance qui voit quoi, qui contacte le client et comment la commission se répartit. Les logiciels de transaction gèrent le stock d'une agence, pas la relation entre agences.\n\nLe second est la conversion. Un prix affiché en capital parle mal à un acquéreur particulier, qui raisonne en mensualité. Un promoteur perd des contacts simplement parce que le visiteur ne se projette pas.\n\n## Ce que nous avons construit\n\n**OnShare** est un réseau fermé d'agences vérifiées qui partagent mandats et acquéreurs. Les règles de visibilité sont définies par l'agence propriétaire du mandat, chaque agence a son tableau de bord, et l'accès au réseau coûte 150 € par mois hors TVA.\n\n**BuyMonth** s'adresse aux promoteurs : des badges, widgets et QR codes qui convertissent un prix de vente en mensualité estimée, intégrables aussi bien en ligne que sur les panneaux de chantier, avec remontée des contacts et branchement possible de partenariats de crédit.\n\n## Les briques spécifiques au secteur\n\n- **Mandats partagés** avec règles de visibilité par propriétaire du mandat\n- **Base d'acquéreurs qualifiés**, avec critères de recherche structurés\n- **Répartition de commission** définie avant la mise en relation\n- **Vérification des agences** à l'entrée dans le réseau\n- **Widgets intégrables** sur un site tiers, sans refonte\n- **Mentions légales du crédit**, conformes au cadre national\n\n## Ce que nous développons aussi\n\nSites de programme neuf avec plans interactifs et réservation de lot ; espaces acquéreurs pour le suivi d'avancement et les appels de fonds ; sites d'agence avec portefeuille synchronisé ; et outils de gestion locative sur mesure.\n\n## Budget et délai\n\nUne plateforme de réseau démarre à 35 000 € et trois à cinq mois. Un outil de conversion distribuable en widget démarre à 25 000 €. Un site de programme ou d'agence démarre à 9 000 €.",
      "## Two problems market software ignores\n\nThe first is cooperation. An agency holds mandates it is not selling, and buyers for properties it does not have. Sharing with a peer means settling in advance who sees what, who contacts the client and how the commission is split. Transaction software manages one agency's stock, not the relationship between agencies.\n\nThe second is conversion. A price shown as a capital sum speaks poorly to a private buyer, who thinks in monthly payments. A developer loses enquiries simply because visitors cannot picture themselves there.\n\n## What we have built\n\n**OnShare** is a closed network of verified agencies sharing mandates and buyers. Visibility rules are set by the agency that owns the mandate, each agency gets its own dashboard, and network access costs €150 a month excluding VAT.\n\n**BuyMonth** addresses developers: badges, widgets and QR codes that turn a sale price into an estimated monthly payment, embeddable online and on site hoardings alike, with enquiry tracking and the option to plug in lending partnerships.\n\n## The blocks specific to the sector\n\n- **Shared mandates** with visibility rules set by the mandate owner\n- **Qualified buyer database**, with structured search criteria\n- **Commission split** agreed before the introduction\n- **Agency verification** on joining the network\n- **Embeddable widgets** on a third-party site, with no rebuild\n- **Lending legal notices**, compliant with the national framework\n\n## What else we build\n\nNew-build development sites with interactive floor plans and unit reservation; buyer portals for progress tracking and payment calls; agency sites with a synchronised portfolio; and bespoke rental management tools.\n\n## Budget and timeline\n\nA network platform starts at €35,000 and three to five months. A widget-distributable conversion tool starts at €25,000. A development or agency site starts at €9,000.",
      "## Dos problemas que el software del mercado ignora\n\nEl primero es la cooperación. Una agencia tiene mandatos que no vende y compradores para inmuebles que no posee. Compartir con un colega exige acordar de antemano quién ve qué, quién contacta al cliente y cómo se reparte la comisión. El software de transacción gestiona el stock de una agencia, no la relación entre agencias.\n\nEl segundo es la conversión. Un precio expresado en capital le dice poco a un comprador particular, que razona en mensualidades. Un promotor pierde contactos simplemente porque el visitante no se proyecta.\n\n## Lo que hemos construido\n\n**OnShare** es una red cerrada de agencias verificadas que comparten mandatos y compradores. Las reglas de visibilidad las define la agencia propietaria del mandato, cada agencia tiene su panel y el acceso a la red cuesta 150 € al mes sin IVA.\n\n**BuyMonth** se dirige a los promotores: insignias, widgets y códigos QR que convierten un precio de venta en una mensualidad estimada, integrables tanto en línea como en las vallas de obra, con seguimiento de contactos y posibilidad de conectar acuerdos de crédito.\n\n## Los bloques propios del sector\n\n- **Mandatos compartidos** con reglas de visibilidad por propietario del mandato\n- **Base de compradores cualificados**, con criterios de búsqueda estructurados\n- **Reparto de comisión** acordado antes de la presentación\n- **Verificación de agencias** al entrar en la red\n- **Widgets integrables** en una web externa, sin rehacerla\n- **Avisos legales del crédito**, conformes al marco nacional\n\n## Qué más desarrollamos\n\nWebs de promoción de obra nueva con planos interactivos y reserva de unidad; áreas de comprador para el seguimiento de avance y las llamadas de fondos; webs de agencia con cartera sincronizada; y herramientas de gestión de alquiler a medida.\n\n## Presupuesto y plazo\n\nUna plataforma de red arranca en 35.000 € y de tres a cinco meses. Una herramienta de conversión distribuible como widget arranca en 25.000 €. Una web de promoción o de agencia arranca en 9.000 €.",
    ),
    faqs: [
      {
        question: t(
          "Peut-on synchroniser le portefeuille avec notre logiciel de transaction ?",
          "Can the portfolio be synchronised with our transaction software?",
          "¿Se puede sincronizar la cartera con nuestro software de transacción?",
        ),
        answer: t(
          "Oui quand le logiciel expose une API ou un flux d'export, ce qui est le cas des principaux éditeurs. À défaut, nous mettons en place un import de fichier planifié, avec contrôle des doublons et des biens retirés.",
          "Yes, where the software exposes an API or export feed, which the main vendors do. Failing that, we set up a scheduled file import, with duplicate and withdrawn-property checks.",
          "Sí, cuando el software expone una API o un flujo de exportación, como hacen los principales proveedores. Si no, implementamos una importación de ficheros programada, con control de duplicados e inmuebles retirados.",
        ),
      },
      {
        question: t(
          "Le simulateur de mensualité engage-t-il notre responsabilité ?",
          "Does the monthly-payment calculator create liability for us?",
          "¿El simulador de mensualidad genera responsabilidad para nosotros?",
        ),
        answer: t(
          "C'est précisément pourquoi les mentions légales et le caractère indicatif du calcul sont traités dès la conception, au cadre national applicable. Nous l'avons fait pour le marché belge sur BuyMonth, et la même rigueur s'applique ailleurs.",
          "That is precisely why the legal notices and the indicative nature of the calculation are handled at design stage, against the applicable national framework. We did this for the Belgian market on BuyMonth, and the same rigour applies elsewhere.",
          "Precisamente por eso los avisos legales y el carácter indicativo del cálculo se tratan desde el diseño, según el marco nacional aplicable. Lo hicimos para el mercado belga en BuyMonth, y el mismo rigor se aplica en otros lugares.",
        ),
      },
    ],
  },
  {
    key: "recrutement-rh",
    icon: "Search",
    highlights: ["Candidature anonyme", "Profils sectoriels", "Abonnement recruteur"],
    serviceKeys: ["plateformes-metier", "saas-abonnement", "applications-web"],
    projectKeys: ["skillio"],
    slug: t("recrutement-rh", "recruitment-hr", "seleccion-rrhh"),
    title: t(
      "Plateformes de recrutement spécialisé",
      "Specialist recruitment platforms",
      "Plataformas de selección especializada",
    ),
    lead: t(
      "Les candidats en poste ne postulent pas sur un site public. Nous développons des plateformes où l'anonymat du candidat est la fonctionnalité centrale.",
      "Candidates in post do not apply on a public site. We build platforms where candidate anonymity is the core feature.",
      "Los candidatos en activo no se postulan en una web pública. Desarrollamos plataformas donde el anonimato del candidato es la funcionalidad central.",
    ),
    body: t(
      "## Le problème des plateformes généralistes\n\nUn candidat qui occupe un poste ne peut pas déposer son CV sur un site public : son employeur le verra, ses collègues aussi. Les meilleurs profils d'un marché sont donc exactement ceux qui n'y sont pas visibles.\n\nÀ l'inverse, un recruteur spécialisé cherche des compétences précises que le volume d'une plateforme généraliste noie. Trier mille candidatures hors sujet coûte plus cher que de n'en recevoir que dix pertinentes.\n\n## Ce que nous avons construit\n\n**Skillio** est une plateforme de recrutement dédiée aux métiers de la comptabilité et de la finance. Le profil est visible par compétences, niveau d'expérience et région, sans nom ni employeur : le candidat reste anonyme jusqu'à accepter la mise en relation. Côté recruteur, l'accès est structuré par catégorie de poste et conditionné à un abonnement.\n\n## Les briques spécifiques au recrutement\n\n- **Profil anonymisé** avec déverrouillage à l'initiative du candidat\n- **Référentiel de compétences** propre au secteur, pas un champ libre\n- **Catégories de poste** adaptées aux intitulés réels du métier\n- **Correspondance structurée** entre besoins et profils\n- **Messagerie** qui préserve l'anonymat jusqu'à l'accord\n- **Abonnements recruteur**, avec formules par volume\n\n## Ce que nous développons aussi\n\nPortails de candidature sur mesure connectés à votre outil de suivi ; espaces d'intégration pour les nouveaux arrivants ; outils internes de gestion de viviers ; et sites carrière qui se mettent à jour sans passer par un prestataire.\n\n## Budget et délai\n\nUne plateforme de mise en relation démarre à 35 000 € et trois à cinq mois. Un portail de candidature ou un site carrière démarre à 12 000 €.",
      "## The problem with general-purpose platforms\n\nA candidate currently in post cannot put their CV on a public site: their employer will see it, and so will their colleagues. The best profiles in a market are therefore exactly the ones not visible on it.\n\nConversely, a specialist recruiter looks for precise skills that a general platform's volume drowns out. Sorting a thousand irrelevant applications costs more than receiving only ten relevant ones.\n\n## What we have built\n\n**Skillio** is a recruitment platform dedicated to accountancy and finance roles. The profile is visible by skills, experience level and region, with no name or employer: the candidate stays anonymous until they accept an introduction. On the recruiter side, access is structured by role category and gated behind a subscription.\n\n## The blocks specific to recruitment\n\n- **Anonymised profile** with unlocking at the candidate's initiative\n- **Skills taxonomy** specific to the sector, not a free-text field\n- **Role categories** matching the trade's actual job titles\n- **Structured matching** between requirements and profiles\n- **Messaging** that preserves anonymity until agreement\n- **Recruiter subscriptions**, with volume-based plans\n\n## What else we build\n\nBespoke application portals connected to your tracking system; onboarding spaces for new joiners; internal talent-pool management tools; and careers sites that update without going through a supplier.\n\n## Budget and timeline\n\nAn introduction platform starts at €35,000 and three to five months. An application portal or careers site starts at €12,000.",
      "## El problema de las plataformas generalistas\n\nUn candidato que ocupa un puesto no puede publicar su CV en una web pública: su empleador lo verá, y sus compañeros también. Los mejores perfiles de un mercado son por tanto justamente los que no son visibles en él.\n\nA la inversa, un reclutador especializado busca competencias precisas que el volumen de una plataforma generalista ahoga. Filtrar mil candidaturas irrelevantes cuesta más que recibir solo diez pertinentes.\n\n## Lo que hemos construido\n\n**Skillio** es una plataforma de selección dedicada a los perfiles de contabilidad y finanzas. El perfil es visible por competencias, nivel de experiencia y región, sin nombre ni empleador: el candidato permanece anónimo hasta aceptar la presentación. Del lado del reclutador, el acceso se estructura por categoría de puesto y está condicionado a una suscripción.\n\n## Los bloques propios de la selección\n\n- **Perfil anonimizado** con desbloqueo a iniciativa del candidato\n- **Catálogo de competencias** propio del sector, no un campo libre\n- **Categorías de puesto** ajustadas a los títulos reales de la profesión\n- **Correspondencia estructurada** entre necesidades y perfiles\n- **Mensajería** que preserva el anonimato hasta el acuerdo\n- **Suscripciones de reclutador**, con planes por volumen\n\n## Qué más desarrollamos\n\nPortales de candidatura a medida conectados con tu herramienta de seguimiento; espacios de incorporación para nuevos empleados; herramientas internas de gestión de viveros de talento; y webs de empleo que se actualizan sin pasar por un proveedor.\n\n## Presupuesto y plazo\n\nUna plataforma de mediación arranca en 35.000 € y de tres a cinco meses. Un portal de candidatura o una web de empleo arranca en 12.000 €.",
    ),
    faqs: [
      {
        question: t(
          "Comment garantir qu'un employeur ne reconnaisse pas son salarié ?",
          "How do you ensure an employer cannot recognise their employee?",
          "¿Cómo garantizar que un empleador no reconozca a su empleado?",
        ),
        answer: t(
          "En masquant par défaut tout ce qui est identifiant — nom, employeur actuel, intitulé exact, parfois la ville — et en laissant le candidat choisir ce qu'il expose. Le seuil d'anonymat se paramètre selon l'étroitesse du marché.",
          "By masking everything identifying by default — name, current employer, exact job title, sometimes the town — and letting the candidate choose what they expose. The anonymity threshold is configurable according to how narrow the market is.",
          "Ocultando por defecto todo lo identificable —nombre, empleador actual, título exacto, a veces la ciudad— y dejando que el candidato elija qué expone. El umbral de anonimato se configura según lo estrecho que sea el mercado.",
        ),
      },
      {
        question: t(
          "Peut-on connecter la plateforme à notre ATS ?",
          "Can the platform connect to our ATS?",
          "¿Se puede conectar la plataforma con nuestro ATS?",
        ),
        answer: t(
          "Oui. Nous intégrons les outils de suivi de candidature qui exposent une API, et prévoyons sinon un export structuré. Le but est d'éviter la double saisie, qui est la première cause d'abandon d'un outil de recrutement.",
          "Yes. We integrate applicant tracking systems that expose an API, and provide a structured export otherwise. The aim is to avoid double entry, which is the main reason recruitment tools get abandoned.",
          "Sí. Integramos los sistemas de seguimiento de candidaturas que exponen una API y, en su defecto, prevemos una exportación estructurada. El objetivo es evitar la doble introducción de datos, que es la primera causa de abandono de una herramienta de selección.",
        ),
      },
    ],
  },
  {
    key: "commerce-b2b",
    icon: "ShoppingBag",
    highlights: ["Devis en ligne", "Tarifs par client", "Sans Shopify"],
    serviceKeys: ["e-commerce-sur-mesure", "sites-sur-mesure", "applications-web"],
    projectKeys: ["coteburo"],
    slug: t("commerce-b2b", "b2b-commerce", "comercio-b2b"),
    title: t(
      "E-commerce et catalogues pour le commerce B2B",
      "E-commerce and catalogues for B2B trade",
      "E-commerce y catálogos para el comercio B2B",
    ),
    lead: t(
      "Tarifs négociés, demandes de devis, produits configurables : les boutiques clé en main s'arrêtent là où le commerce professionnel commence.",
      "Negotiated pricing, quote requests, configurable products: turnkey stores stop where professional trade begins.",
      "Tarifas negociadas, solicitudes de presupuesto, productos configurables: las tiendas llave en mano se detienen donde empieza el comercio profesional.",
    ),
    body: t(
      "## Le même produit, deux façons de le vendre\n\nUn négociant vend le même article à l'unité à un particulier et par trente à une entreprise, à un tarif négocié. Le particulier paie par carte, l'entreprise demande un devis puis règle sur facture. Les plateformes d'e-commerce clé en main gèrent très bien le premier cas et deviennent un obstacle dès le second.\n\nS'y ajoutent les produits configurables — dimensions, finitions, options liées — et les règles de livraison réelles, par zone, poids ou volume, qu'un module standard calcule mal.\n\n## Ce que nous avons construit\n\n**Côté BURO**, à Aix-en-Provence, vend du mobilier de bureau à des particuliers comme à des entreprises. Nous avons développé une boutique entièrement codée en Next.js : catalogue multi-marques, variantes de finition, panier et demande de devis sur la même fiche produit. Le site présente aussi les prestations d'aménagement, de plan 3D et d'installation, avec les réalisations en appui. L'enseigne affiche 5,0/5 sur Google.\n\n## Les briques du commerce professionnel\n\n- **Devis en ligne** à côté de l'achat direct, sur la même fiche\n- **Tarifs et remises** par client ou par catégorie de client\n- **Produits configurables** avec options dépendantes entre elles\n- **Règles de livraison** par zone, poids ou volume\n- **Paiement sur facture** pour les comptes professionnels validés\n- **Comptes clients** avec historique et renouvellement de commande\n\n## Ce que vous économisez\n\nAucune commission sur les ventes, aucun abonnement d'éditeur, et aucune fonctionnalité qui disparaît parce qu'une plateforme a changé d'avis. Sur un volume significatif, les commissions évitées remboursent le développement en quelques exercices.\n\n## Budget et délai\n\nÀ partir de 15 000 € et huit à douze semaines, selon la taille du catalogue et la complexité des règles de prix. Un catalogue sans vente en ligne, orienté devis, démarre à 12 000 €.",
      "## The same product, two ways of selling it\n\nA trade supplier sells the same item as a single unit to an individual and in batches of thirty to a company, at a negotiated price. The individual pays by card; the company requests a quote and settles on invoice. Turnkey e-commerce platforms handle the first case very well and become an obstacle at the second.\n\nAdd to that configurable products — dimensions, finishes, linked options — and real shipping rules by zone, weight or volume, which a standard module calculates poorly.\n\n## What we have built\n\n**Côté BURO**, in Aix-en-Provence, sells office furniture to individuals and companies alike. We built a store entirely coded in Next.js: multi-brand catalogue, finish variants, basket and quote request on the same product page. The site also presents the fit-out, 3D planning and installation services, backed by completed projects. The business shows 5.0/5 on Google.\n\n## The blocks of professional trade\n\n- **Online quotes** alongside direct purchase, on the same page\n- **Pricing and discounts** per customer or customer category\n- **Configurable products** with interdependent options\n- **Shipping rules** by zone, weight or volume\n- **Payment on invoice** for approved trade accounts\n- **Customer accounts** with history and order repeat\n\n## What you save\n\nNo commission on sales, no vendor subscription, and no feature disappearing because a platform changed its mind. At meaningful volume, the commissions avoided pay back the development within a few financial years.\n\n## Budget and timeline\n\nFrom €15,000 and eight to twelve weeks, depending on catalogue size and the complexity of pricing rules. A quote-oriented catalogue with no online sale starts at €12,000.",
      "## El mismo producto, dos formas de venderlo\n\nUn distribuidor vende el mismo artículo de uno en uno a un particular y de treinta en treinta a una empresa, a un precio negociado. El particular paga con tarjeta; la empresa pide un presupuesto y luego paga contra factura. Las plataformas de e-commerce llave en mano gestionan muy bien el primer caso y se convierten en un obstáculo en el segundo.\n\nAñade los productos configurables —dimensiones, acabados, opciones vinculadas— y las reglas de envío reales por zona, peso o volumen, que un módulo estándar calcula mal.\n\n## Lo que hemos construido\n\n**Côté BURO**, en Aix-en-Provence, vende mobiliario de oficina tanto a particulares como a empresas. Desarrollamos una tienda íntegramente programada en Next.js: catálogo multimarca, variantes de acabado, carrito y solicitud de presupuesto en la misma ficha de producto. La web presenta además los servicios de equipamiento, plano 3D e instalación, respaldados por proyectos realizados. El negocio muestra 5,0/5 en Google.\n\n## Los bloques del comercio profesional\n\n- **Presupuestos en línea** junto a la compra directa, en la misma ficha\n- **Tarifas y descuentos** por cliente o categoría de cliente\n- **Productos configurables** con opciones interdependientes\n- **Reglas de envío** por zona, peso o volumen\n- **Pago contra factura** para cuentas profesionales validadas\n- **Cuentas de cliente** con historial y repetición de pedido\n\n## Lo que ahorras\n\nNinguna comisión sobre las ventas, ninguna suscripción de proveedor y ninguna funcionalidad que desaparece porque una plataforma cambió de idea. Con un volumen significativo, las comisiones evitadas amortizan el desarrollo en pocos ejercicios.\n\n## Presupuesto y plazo\n\nDesde 15.000 € y de ocho a doce semanas, según el tamaño del catálogo y la complejidad de las reglas de precio. Un catálogo orientado a presupuesto, sin venta en línea, arranca en 12.000 €.",
    ),
    faqs: [
      {
        question: t(
          "Peut-on garder un catalogue déjà géré dans notre ERP ?",
          "Can we keep a catalogue already managed in our ERP?",
          "¿Podemos mantener un catálogo ya gestionado en nuestro ERP?",
        ),
        answer: t(
          "Oui, et c'est généralement préférable : l'ERP reste la source de vérité pour les prix et les stocks, le site se synchronise. Nous mettons en place l'échange selon ce que votre ERP expose, API ou fichier planifié.",
          "Yes, and it is usually preferable: the ERP stays the source of truth for prices and stock, and the site synchronises. We set up the exchange according to what your ERP exposes, API or scheduled file.",
          "Sí, y normalmente es preferible: el ERP sigue siendo la fuente de verdad para precios y existencias, y la web se sincroniza. Implementamos el intercambio según lo que exponga tu ERP, API o fichero programado.",
        ),
      },
      {
        question: t(
          "Pourquoi ne pas simplement utiliser Shopify ?",
          "Why not simply use Shopify?",
          "¿Por qué no usar simplemente Shopify?",
        ),
        answer: t(
          "Pour un catalogue simple vendu au même prix à tout le monde, c'est un choix rationnel et nous vous le dirons. Dès qu'il y a des tarifs par client, des devis ou des produits configurables, le contournement coûte plus cher que le développement, et vous payez une commission sur chaque vente.",
          "For a simple catalogue sold at the same price to everyone, it is a rational choice and we will tell you so. As soon as there is per-customer pricing, quotes or configurable products, working around it costs more than building, and you pay commission on every sale.",
          "Para un catálogo simple vendido al mismo precio a todo el mundo es una opción racional y te lo diremos. En cuanto hay tarifas por cliente, presupuestos o productos configurables, sortearlo cuesta más que desarrollarlo, y pagas comisión en cada venta.",
        ),
      },
    ],
  },
  {
    key: "services-locaux",
    icon: "Globe",
    highlights: ["Réservation en ligne", "Abonnements", "Référencement local"],
    serviceKeys: ["sites-sur-mesure", "design-ux-ui", "maintenance-performance"],
    projectKeys: ["mh-defense", "elite-detail-tampa"],
    slug: t("services-locaux", "local-services", "servicios-locales"),
    title: t(
      "Sites et réservation pour les services locaux",
      "Sites and booking for local services",
      "Webs y reservas para servicios locales",
    ),
    lead: t(
      "Studios, instituts, services à domicile : un site qui remplit l'agenda sans passer par le téléphone, et qui se trouve sur Google.",
      "Studios, salons, mobile services: a site that fills the diary without the phone, and that gets found on Google.",
      "Estudios, centros, servicios a domicilio: una web que llena la agenda sin pasar por el teléfono y que se encuentra en Google.",
    ),
    body: t(
      "## Un métier local se vend sur la confiance et la disponibilité\n\nUn client qui cherche un service près de lui décide en quelques minutes, souvent sur son téléphone. Deux choses le font basculer : la preuve que vous savez faire, et la possibilité de réserver tout de suite. Un formulaire « nous vous rappellerons » perd la moitié des demandes.\n\n## Ce que nous avons construit\n\n**MH Defense**, à Sarrians dans le Vaucluse, est un studio de self-défense féminine porté par une championne du monde de karaté. Le site est construit autour de ce parcours, avec trois formules d'abonnement à remise progressive, un cours d'essai gratuit, la réservation en ligne et un espace personnel.\n\n**Elite Detail Tampa**, en Floride, est un service de detailing automobile à domicile. La clientèle locale étant anglophone, hispanophone et francophone, le site existe dans les trois langues avec une URL par langue, une grille tarifaire explicite, une galerie avant-après et la réservation de créneau. La zone d'intervention est annoncée dès l'accueil, ce qui évite les demandes hors périmètre.\n\n## Ce que nous mettons en place\n\n- **Réservation en ligne** avec créneaux réels et confirmation automatique\n- **Formules et abonnements**, avec prélèvement récurrent\n- **Grille tarifaire affichée** : elle filtre et rassure à la fois\n- **Galerie avant-après**, la preuve la plus efficace sur ces métiers\n- **Zone d'intervention** explicite pour un service à domicile\n- **Référencement local** : données structurées et cohérence avec la fiche Google\n\n## Le référencement local, concrètement\n\nNous déclarons les données structurées d'établissement, les horaires et la zone servie, et nous suivons les clics sur le numéro de téléphone comme une conversion — sur ces métiers, beaucoup de clients appellent au lieu de remplir un formulaire, et sans cette mesure vos campagnes paraissent ne rien rapporter.\n\n## Budget et délai\n\nÀ partir de 9 000 € et six semaines pour un site avec réservation. Un multilingue avec abonnements démarre à 14 000 €.",
      "## A local trade sells on trust and availability\n\nA customer looking for a service nearby decides within minutes, usually on their phone. Two things tip them over: proof that you can do the job, and the ability to book right away. A \"we'll call you back\" form loses half the enquiries.\n\n## What we have built\n\n**MH Defense**, in Sarrians in the Vaucluse, is a women's self-defence studio led by a karate world champion. The site is built around that record, with three membership plans offering progressive discounts, a free trial class, online booking and a personal area.\n\n**Elite Detail Tampa**, in Florida, is a mobile car-detailing service. With a local customer base speaking English, Spanish and French, the site exists in all three languages with one URL per language, an explicit price grid, a before-and-after gallery and slot booking. The service area is stated on the homepage, which avoids out-of-range enquiries.\n\n## What we put in place\n\n- **Online booking** with real slots and automatic confirmation\n- **Plans and subscriptions**, with recurring collection\n- **Published price grid**: it filters and reassures at the same time\n- **Before-and-after gallery**, the most effective proof in these trades\n- **Explicit service area** for a mobile service\n- **Local SEO**: structured data and consistency with the Google listing\n\n## Local SEO, concretely\n\nWe declare business structured data, opening hours and area served, and we track phone-number clicks as a conversion — in these trades many customers call instead of filling in a form, and without that measurement your campaigns look like they return nothing.\n\n## Budget and timeline\n\nFrom €9,000 and six weeks for a site with booking. A multilingual site with subscriptions starts at €14,000.",
      "## Un oficio local se vende por confianza y disponibilidad\n\nUn cliente que busca un servicio cerca decide en pocos minutos, normalmente desde el móvil. Dos cosas le hacen decidirse: la prueba de que sabes hacerlo y la posibilidad de reservar al instante. Un formulario de «le llamaremos» pierde la mitad de las solicitudes.\n\n## Lo que hemos construido\n\n**MH Defense**, en Sarrians (Vaucluse), es un estudio de defensa personal femenina dirigido por una campeona del mundo de kárate. La web está construida en torno a esa trayectoria, con tres planes de suscripción de descuento progresivo, una clase de prueba gratuita, reserva en línea y un área personal.\n\n**Elite Detail Tampa**, en Florida, es un servicio de detailing de automóviles a domicilio. Con una clientela local que habla inglés, español y francés, la web existe en los tres idiomas con una URL por idioma, tarifas explícitas, galería de antes y después y reserva de franja. La zona de actuación se anuncia desde la portada, lo que evita solicitudes fuera de alcance.\n\n## Qué implementamos\n\n- **Reserva en línea** con franjas reales y confirmación automática\n- **Planes y suscripciones**, con cobro recurrente\n- **Tarifas publicadas**: filtran y tranquilizan a la vez\n- **Galería de antes y después**, la prueba más eficaz en estos oficios\n- **Zona de actuación** explícita para un servicio a domicilio\n- **SEO local**: datos estructurados y coherencia con la ficha de Google\n\n## El SEO local, en concreto\n\nDeclaramos los datos estructurados del establecimiento, los horarios y la zona servida, y medimos los clics en el número de teléfono como una conversión: en estos oficios muchos clientes llaman en lugar de rellenar un formulario y, sin esa medición, tus campañas parecen no aportar nada.\n\n## Presupuesto y plazo\n\nDesde 9.000 € y seis semanas para una web con reservas. Una web multilingüe con suscripciones arranca en 14.000 €.",
    ),
    faqs: [
      {
        question: t(
          "Faut-il un site si j'ai déjà une fiche Google et Instagram ?",
          "Do I need a site if I already have a Google listing and Instagram?",
          "¿Necesito una web si ya tengo una ficha de Google e Instagram?",
        ),
        answer: t(
          "La fiche Google amène les clics, mais c'est le site qui les transforme en rendez-vous payés, parce qu'il porte la réservation, les tarifs et la preuve. Les deux se renforcent : des données structurées cohérentes avec la fiche améliorent votre position locale.",
          "The Google listing brings the clicks, but the site is what turns them into paid appointments, because it carries booking, pricing and proof. The two reinforce each other: structured data consistent with the listing improves your local position.",
          "La ficha de Google trae los clics, pero es la web la que los convierte en citas pagadas, porque contiene la reserva, las tarifas y la prueba. Ambas se refuerzan: unos datos estructurados coherentes con la ficha mejoran tu posición local.",
        ),
      },
      {
        question: t(
          "Peut-on connecter la réservation à mon agenda existant ?",
          "Can booking be connected to my existing calendar?",
          "¿Se puede conectar la reserva con mi agenda actual?",
        ),
        answer: t(
          "Oui, aux agendas courants, pour que les créneaux affichés correspondent à votre disponibilité réelle et qu'une réservation bloque le créneau immédiatement. C'est la condition pour éviter les doubles réservations.",
          "Yes, to the common calendars, so the slots shown match your real availability and a booking blocks the slot immediately. That is the condition for avoiding double bookings.",
          "Sí, con las agendas habituales, para que las franjas mostradas correspondan a tu disponibilidad real y una reserva bloquee la franja de inmediato. Es la condición para evitar reservas duplicadas.",
        ),
      },
    ],
  },
  {
    key: "hotellerie-restauration",
    icon: "Sparkles",
    highlights: ["Réservation directe", "Sans commission", "Multilingue"],
    serviceKeys: ["sites-sur-mesure", "design-ux-ui", "maintenance-performance"],
    projectKeys: [],
    slug: t("hotellerie-restauration", "hospitality-restaurants", "hosteleria-restauracion"),
    title: t(
      "Sites et réservation pour l'hôtellerie et la restauration",
      "Sites and booking for hotels and restaurants",
      "Webs y reservas para hostelería y restauración",
    ),
    lead: t(
      "Reprendre les réservations en direct aux plateformes, et leurs 15 à 25 % de commission, avec un site qui se trouve et qui se réserve.",
      "Take bookings back from the platforms, and their 15 to 25 % commission, with a site that gets found and gets booked.",
      "Recuperar las reservas directas frente a las plataformas, y su 15-25 % de comisión, con una web que se encuentra y se reserva.",
    ),
    body: t(
      "## La commission des plateformes est votre premier poste de coût\n\nUne nuitée vendue par une plateforme de réservation vous coûte entre 15 et 25 % de commission. Sur un établissement qui fait 400 000 € de chiffre d'affaires, c'est 60 000 à 100 000 € qui partent chaque année. Un site qui capte ne serait-ce qu'un quart des réservations en direct se rembourse en quelques mois.\n\n## Ce que nous construisons pour un hôtel ou un restaurant\n\n- **Réservation en direct**, avec disponibilités réelles et confirmation immédiate\n- **Connexion au channel manager** et au PMS, pour que les calendriers ne divergent jamais\n- **Paiement d'acompte ou empreinte bancaire**, qui fait chuter les absences\n- **Offres directes** que les plateformes n'ont pas le droit d'afficher : surclassement, petit-déjeuner inclus, départ tardif\n- **Carte et menus** modifiables sans nous appeler, y compris le menu du jour\n- **Multilingue réel**, une URL par langue — déterminant sur une clientèle internationale\n\n## Le référencement local décide d'une grande partie du chiffre\n\nUn voyageur qui cherche un hôtel sur la Côte d'Azur passe par Google avant de passer par vous. Nous déclarons les données structurées d'établissement, les horaires, la zone, les tarifs à partir de, et nous rendons la fiche Google cohérente avec le site. Nous suivons aussi les clics sur le numéro de téléphone comme une conversion : en restauration, l'essentiel des réservations arrive encore par appel, et sans cette mesure une campagne paraît ne rien rapporter.\n\n## Budget et délai\n\nÀ partir de 9 000 € et six semaines pour un site avec réservation en direct. Un établissement multilingue connecté à un channel manager démarre à 16 000 €.",
      "## Platform commission is your largest cost line\n\nA room night sold through a booking platform costs you 15 to 25 % in commission. On a property turning over €400,000, that is €60,000 to €100,000 leaving every year. A site that captures even a quarter of bookings directly pays for itself within months.\n\n## What we build for a hotel or a restaurant\n\n- **Direct booking**, with real availability and immediate confirmation\n- **Channel manager and PMS connection**, so calendars never drift apart\n- **Deposit or card imprint**, which cuts no-shows sharply\n- **Direct-only offers** platforms are not allowed to display: upgrade, breakfast included, late checkout\n- **Menus you edit yourself**, including the daily menu\n- **Genuine multilingual**, one URL per language — decisive with international guests\n\n## Local search decides a large share of revenue\n\nA traveller looking for a hotel on the French Riviera goes through Google before coming to you. We declare business structured data, opening hours, area and from-prices, and we make the Google listing consistent with the site. We also track phone-number clicks as a conversion: in hospitality most bookings still arrive by call, and without that measurement a campaign looks like it returns nothing.\n\n## Budget and timeline\n\nFrom €9,000 and six weeks for a site with direct booking. A multilingual property connected to a channel manager starts at €16,000.",
      "## La comisión de las plataformas es tu mayor partida de coste\n\nUna noche vendida por una plataforma de reservas te cuesta entre el 15 y el 25 % de comisión. En un establecimiento que factura 400.000 €, son entre 60.000 y 100.000 € que se van cada año. Una web que capte aunque sea un cuarto de las reservas en directo se amortiza en pocos meses.\n\n## Lo que construimos para un hotel o un restaurante\n\n- **Reserva directa**, con disponibilidad real y confirmación inmediata\n- **Conexión al channel manager** y al PMS, para que los calendarios nunca se separen\n- **Pago de señal o preautorización**, que reduce mucho las ausencias\n- **Ofertas exclusivas del canal directo**, que las plataformas no pueden mostrar\n- **Carta y menús** editables sin llamarnos, incluido el menú del día\n- **Multilingüe real**, una URL por idioma — decisivo con clientela internacional\n\n## El posicionamiento local decide buena parte de la facturación\n\nUn viajero que busca hotel en la Costa Azul pasa por Google antes de pasar por ti. Declaramos los datos estructurados del establecimiento, horarios, zona y precios desde, y hacemos coherente la ficha de Google con la web. También medimos los clics en el teléfono como conversión: en restauración la mayoría de reservas sigue llegando por llamada.\n\n## Presupuesto y plazo\n\nDesde 9.000 € y seis semanas para una web con reserva directa. Un establecimiento multilingüe conectado a un channel manager empieza en 16.000 €.",
    ),
    faqs: [
      {
        question: t(
          "Le site peut-il se connecter à notre channel manager ?",
          "Can the site connect to our channel manager?",
          "¿La web puede conectarse a nuestro channel manager?",
        ),
        answer: t(
          "Oui, dès lors qu'il expose une API ou un format d'échange — c'est le cas des principaux. Les disponibilités et les tarifs restent pilotés depuis l'outil que vos équipes connaissent déjà, et le site s'y synchronise. Sans cette connexion, deux calendriers finissent toujours par diverger, et une surréservation coûte plus cher qu'une intégration.",
          "Yes, as soon as it exposes an API or exchange format — the main ones do. Availability and rates stay driven from the tool your teams already know, and the site synchronises with it. Without that connection two calendars always drift apart, and one overbooking costs more than the integration.",
          "Sí, siempre que exponga una API o un formato de intercambio — los principales lo hacen. La disponibilidad y las tarifas se siguen gestionando desde la herramienta que tu equipo ya conoce. Sin esa conexión, dos calendarios acaban siempre separándose.",
        ),
      },
      {
        question: t(
          "Peut-on afficher des offres réservées au site ?",
          "Can we show offers reserved for the direct channel?",
          "¿Podemos mostrar ofertas exclusivas del canal directo?",
        ),
        answer: t(
          "Oui, et c'est tout l'intérêt. Les contrats de parité tarifaire des plateformes portent sur le prix de la chambre, pas sur ce que vous y ajoutez : petit-déjeuner inclus, surclassement, départ tardif, avantage fidélité. Ces offres ne peuvent exister que sur votre canal direct, et ce sont elles qui font basculer un client qui compare.",
          "Yes, and that is the whole point. Platform rate-parity clauses cover the room price, not what you add to it: breakfast included, upgrade, late checkout, loyalty benefit. Those offers can only exist on your direct channel, and they are what tips a comparing customer.",
          "Sí, y ahí está el interés. Las cláusulas de paridad cubren el precio de la habitación, no lo que añades: desayuno incluido, mejora de categoría, salida tardía. Esas ofertas solo pueden existir en tu canal directo.",
        ),
      },
    ],
  },
  {
    key: "gestion-locative",
    icon: "LayoutDashboard",
    highlights: ["Espace propriétaire", "Planning prestataires", "Calendrier unifié"],
    serviceKeys: ["plateformes-metier", "saas-abonnement", "applications-web"],
    projectKeys: [],
    slug: t("gestion-locative", "rental-management", "gestion-de-alquileres"),
    title: t(
      "Outils pour la gestion locative et la conciergerie",
      "Tools for rental management and short-let concierges",
      "Herramientas para gestión de alquileres y conciergería",
    ),
    lead: t(
      "Calendriers, prestataires, propriétaires et revenus dans un seul outil, quand gestion longue durée et courte durée cohabitent.",
      "Calendars, suppliers, owners and revenue in one tool, when long lets and short lets live side by side.",
      "Calendarios, proveedores, propietarios e ingresos en una sola herramienta.",
    ),
    body: t(
      "## Trois métiers, trois logiciels, et des tableurs entre les deux\n\nUne société de gestion locative suit des baux, des quittances et des travaux. Une conciergerie courte durée suit des calendriers, des ménages et des voyageurs. Dès qu'une même structure fait les deux, les outils du marché ne se parlent plus et la coordination retombe sur des tableurs partagés — qui tiennent jusqu'au jour où un ménage est oublié entre deux départs.\n\n## Ce que nous développons\n\n- **Calendrier unifié** des biens, quelle que soit la plateforme d'origine des réservations\n- **Planning des prestataires** — ménage, blanchisserie, maintenance — avec confirmation depuis le téléphone\n- **Espace propriétaire** : relevés, revenus, taux d'occupation, interventions, sans appeler l'agence\n- **Quittances et appels de loyer** générés et envoyés automatiquement\n- **États des lieux photo**, horodatés, opposables\n- **Répartition des revenus** entre propriétaire et gestionnaire, calculée et traçable\n\n## L'espace propriétaire est l'argument commercial\n\nC'est ce qui vous distingue d'un concurrent qui envoie un relevé PDF par trimestre. Un propriétaire qui voit son taux d'occupation et ses revenus à jour appelle moins, renouvelle plus, et vous recommande. C'est la fonctionnalité qui se vend le plus facilement, et celle qu'aucun logiciel générique ne personnalise à votre marque.\n\n## Budget et délai\n\nÀ partir de 22 000 € et dix semaines pour une première version avec espace propriétaire et planning prestataires.",
      "## Three jobs, three pieces of software, and spreadsheets in between\n\nA rental management company tracks leases, receipts and works. A short-let concierge tracks calendars, cleaning and guests. As soon as one business does both, off-the-shelf tools stop talking to each other and coordination falls back on shared spreadsheets — which hold up until the day a clean is missed between two departures.\n\n## What we build\n\n- **Unified calendar** across properties, whatever platform the booking came from\n- **Supplier scheduling** — cleaning, laundry, maintenance — confirmed from a phone\n- **Owner portal**: statements, revenue, occupancy, interventions, without calling the agency\n- **Rent receipts and calls** generated and sent automatically\n- **Photo condition reports**, time-stamped and enforceable\n- **Revenue splits** between owner and manager, calculated and traceable\n\n## The owner portal is the commercial argument\n\nIt is what sets you apart from a competitor sending a quarterly PDF. An owner who can see occupancy and revenue up to date calls less, renews more and refers you. It is the easiest feature to sell, and the one no generic software will put your brand on.\n\n## Budget and timeline\n\nFrom €22,000 and ten weeks for a first version with owner portal and supplier scheduling.",
      "## Tres oficios, tres programas y hojas de cálculo en medio\n\nUna gestora de alquileres sigue contratos, recibos y obras. Una conciergería de corta estancia sigue calendarios, limpiezas y viajeros. En cuanto una misma empresa hace ambas cosas, las herramientas del mercado dejan de entenderse y la coordinación acaba en hojas compartidas — que aguantan hasta el día en que se olvida una limpieza entre dos salidas.\n\n## Lo que desarrollamos\n\n- **Calendario unificado** de los inmuebles, venga la reserva de donde venga\n- **Planificación de proveedores** — limpieza, lavandería, mantenimiento — confirmada desde el móvil\n- **Área de propietario**: liquidaciones, ingresos, ocupación, intervenciones\n- **Recibos y cobros de alquiler** generados y enviados automáticamente\n- **Estados de entrada y salida con fotos**, con sello de tiempo\n- **Reparto de ingresos** entre propietario y gestor, calculado y trazable\n\n## El área de propietario es el argumento comercial\n\nEs lo que te distingue de un competidor que envía un PDF trimestral. Un propietario que ve su ocupación y sus ingresos al día llama menos, renueva más y te recomienda.\n\n## Presupuesto y plazo\n\nDesde 22.000 € y diez semanas para una primera versión con área de propietario y planificación de proveedores.",
    ),
    faqs: [
      {
        question: t(
          "Peut-on récupérer les réservations des plateformes de location ?",
          "Can we pull in bookings from the letting platforms?",
          "¿Se pueden recuperar las reservas de las plataformas de alquiler?",
        ),
        answer: t(
          "Oui, par synchronisation de calendrier, et par API quand la plateforme en expose une. Le calendrier unifié devient la référence : c'est lui qui déclenche le ménage, la blanchisserie et l'accueil, quelle que soit l'origine de la réservation. C'est précisément ce qu'aucun outil de plateforme ne fait, puisque chacun ne connaît que ses propres séjours.",
          "Yes, through calendar synchronisation, and through APIs where a platform exposes one. The unified calendar becomes the reference: it triggers cleaning, laundry and check-in, whatever the booking's origin. That is exactly what no platform tool does, since each one only knows its own stays.",
          "Sí, mediante sincronización de calendario y por API cuando la plataforma la expone. El calendario unificado pasa a ser la referencia: es el que dispara la limpieza, la lavandería y la recepción.",
        ),
      },
      {
        question: t(
          "Le propriétaire voit-il les mêmes chiffres que nous ?",
          "Does the owner see the same figures we do?",
          "¿El propietario ve las mismas cifras que nosotros?",
        ),
        answer: t(
          "Il voit ce que vous décidez de lui montrer, et la règle se définit à la conception : revenus bruts, commission, charges, net versé. L'expérience montre qu'un espace propriétaire transparent réduit les appels et les litiges — un propriétaire qui comprend le calcul le conteste beaucoup moins.",
          "They see what you decide to show, and the rule is set at design time: gross revenue, commission, charges, net paid. Experience shows a transparent owner portal reduces calls and disputes — an owner who understands the calculation contests it far less.",
          "Ve lo que decidas mostrarle, y la regla se define en el diseño: ingresos brutos, comisión, gastos, neto abonado. Un propietario que entiende el cálculo lo discute mucho menos.",
        ),
      },
    ],
  },
  {
    key: "coaching-sportif",
    icon: "Zap",
    highlights: ["Abonnements", "Application mobile", "Suivi de progression"],
    serviceKeys: ["applications-web", "applications-mobiles", "saas-abonnement"],
    projectKeys: ["mh-defense"],
    slug: t("coaching-sportif", "fitness-coaching", "coaching-deportivo"),
    title: t(
      "Applications pour le coaching sportif et les studios",
      "Apps for fitness coaching and studios",
      "Aplicaciones para coaching deportivo y estudios",
    ),
    lead: t(
      "Passer de la séance vendue à l'unité à l'abonnement, avec une application web pour s'inscrire et une application mobile pour s'entraîner.",
      "Move from one-off sessions to subscriptions, with a web app to sign up and a mobile app to train.",
      "Pasar de la sesión suelta a la suscripción, con una aplicación web para inscribirse y una móvil para entrenar.",
    ),
    body: t(
      "## Le revenu d'un coach tient à la régularité, pas au nombre de séances\n\nVendre des séances à l'unité plafonne vite : chaque mois recommence à zéro. L'abonnement change l'économie du métier — revenu prévisible, valeur de l'entreprise, et un client qui s'engage dure plus longtemps. Encore faut-il que s'abonner, réserver et suivre sa progression tienne dans une application que l'on ouvre sans y penser.\n\n## Ce que nous avons construit\n\n**MH Defense**, à Sarrians, est un studio de self-défense féminine porté par une championne du monde de karaté. Le site propose trois formules d'abonnement à remise progressive, un cours d'essai gratuit, la réservation en ligne et un espace personnel. C'est le même socle que celui d'une activité de coaching.\n\n## Le web et le mobile ne servent pas à la même chose\n\nL'application web porte ce qui se fait assis : s'abonner, payer, construire un programme, consulter son historique. L'application mobile porte ce qui se fait debout : pointer une séance, enregistrer des charges, recevoir un rappel, consulter le programme du jour hors connexion dans une salle sans réseau. Les deux partagent les mêmes comptes et les mêmes données ; nous écrivons le mobile en React Native, publié sur les deux magasins.\n\n## Ce que nous mettons en place\n\n- **Abonnements** mensuels ou par cycle, prélèvement automatique, relance des échecs\n- **Réservation de créneaux**, individuels ou cours collectifs avec places limitées\n- **Programmes personnalisés**, avec séries, charges et progression\n- **Notifications** de rappel de séance et de relance d'inactivité\n- **Suivi de progression**, mesures et photos, visible par le coach et par le client\n- **Espace coach** : agenda, clients, paiements, taux de présence\n\n## Budget et délai\n\nÀ partir de 18 000 € et huit semaines pour l'application web avec abonnements. Comptez 25 000 € de plus et dix à quatorze semaines pour l'application mobile publiée sur iOS et Android.",
      "## A coach's income rests on regularity, not on session count\n\nSelling sessions one at a time plateaus fast: every month starts from zero. Subscriptions change the economics — predictable revenue, business value, and a client who commits stays longer. Provided that subscribing, booking and tracking progress fit in an app people open without thinking.\n\n## What we have built\n\n**MH Defense**, in Sarrians, is a women's self-defence studio led by a karate world champion. The site offers three membership plans with progressive discounts, a free trial class, online booking and a personal area. It is the same foundation a coaching business needs.\n\n## Web and mobile do not serve the same purpose\n\nThe web app carries what you do sitting down: subscribe, pay, build a programme, review history. The mobile app carries what you do standing up: check into a session, log weights, get a reminder, read the day's programme offline in a gym with no signal. Both share the same accounts and data; we write the mobile side in React Native, published to both stores.\n\n## What we put in place\n\n- **Subscriptions**, monthly or per cycle, with automatic collection and dunning\n- **Slot booking**, one-to-one or group classes with limited places\n- **Personalised programmes**, with sets, loads and progression\n- **Notifications** for session reminders and inactivity follow-up\n- **Progress tracking**, measurements and photos, visible to coach and client\n- **Coach area**: diary, clients, payments, attendance rate\n\n## Budget and timeline\n\nFrom €18,000 and eight weeks for the web app with subscriptions. Allow a further €25,000 and ten to fourteen weeks for the mobile app published on iOS and Android.",
      "## Los ingresos de un entrenador dependen de la regularidad, no del número de sesiones\n\nVender sesiones sueltas se estanca rápido: cada mes empieza de cero. La suscripción cambia la economía del oficio — ingresos previsibles, valor de empresa y un cliente que se compromete y dura más.\n\n## Lo que hemos construido\n\n**MH Defense**, en Sarrians, es un estudio de defensa personal femenina dirigido por una campeona del mundo de kárate. La web ofrece tres planes de suscripción con descuento progresivo, una clase de prueba gratuita, reserva en línea y área personal. Es la misma base que necesita una actividad de coaching.\n\n## La web y el móvil no sirven para lo mismo\n\nLa aplicación web sostiene lo que se hace sentado: suscribirse, pagar, construir un programa, consultar el historial. La aplicación móvil sostiene lo que se hace de pie: fichar una sesión, registrar cargas, recibir un recordatorio, consultar el programa del día sin conexión en una sala sin cobertura. Ambas comparten cuentas y datos; el móvil se escribe en React Native y se publica en las dos tiendas.\n\n## Lo que ponemos en marcha\n\n- **Suscripciones** mensuales o por ciclo, con cobro automático y recuperación de impagos\n- **Reserva de franjas**, individuales o clases colectivas con plazas limitadas\n- **Programas personalizados**, con series, cargas y progresión\n- **Notificaciones** de recordatorio y de reactivación\n- **Seguimiento de progreso**, medidas y fotos\n- **Área del entrenador**: agenda, clientes, pagos, asistencia\n\n## Presupuesto y plazo\n\nDesde 18.000 € y ocho semanas para la aplicación web con suscripciones. Suma 25.000 € y de diez a catorce semanas para la aplicación móvil publicada en iOS y Android.",
    ),
    faqs: [
      {
        question: t(
          "Faut-il vraiment une application mobile, ou un site suffit-il ?",
          "Do we really need a mobile app, or is a site enough?",
          "¿Hace falta una aplicación móvil o basta con una web?",
        ),
        answer: t(
          "Un site suffit pour vendre et pour réserver. L'application mobile se justifie quand le client s'en sert pendant la séance : pointer sa présence, enregistrer des charges, consulter le programme du jour dans une salle sans réseau, recevoir un rappel. Si votre usage s'arrête à l'inscription et au paiement, nous vous le dirons plutôt que de vous vendre une application à maintenir à chaque version d'iOS.",
          "A site is enough to sell and to book. A mobile app earns its place when the client uses it during the session: checking in, logging loads, reading the day's programme in a gym with no signal, getting a reminder. If your use stops at sign-up and payment, we will say so rather than sell you an app to maintain against every iOS release.",
          "Una web basta para vender y reservar. La aplicación móvil se justifica cuando el cliente la usa durante la sesión: fichar, registrar cargas, consultar el programa sin conexión. Si tu uso termina en la inscripción y el pago, te lo diremos.",
        ),
      },
      {
        question: t(
          "Comment sont gérés les abonnements et les impayés ?",
          "How are subscriptions and failed payments handled?",
          "¿Cómo se gestionan las suscripciones y los impagos?",
        ),
        answer: t(
          "Par prélèvement récurrent via Stripe, avec relance automatique en cas d'échec et suspension d'accès au terme d'un délai que vous fixez. Les formules à remise progressive, les engagements et les périodes d'essai se paramètrent depuis l'espace coach, sans développement supplémentaire.",
          "Through recurring collection via Stripe, with automatic dunning on failure and access suspension after a delay you set. Tiered discounts, commitments and trial periods are configured from the coach area, with no further development.",
          "Mediante cobro recurrente con Stripe, con recuperación automática en caso de fallo y suspensión de acceso tras el plazo que fijes. Los planes con descuento, los compromisos y las pruebas se configuran desde el área del entrenador.",
        ),
      },
    ],
  },
  {
    key: "automobile",
    icon: "Gauge",
    highlights: ["Tarification par gabarit", "Prise de rendez-vous", "Galerie avant-après"],
    serviceKeys: ["sites-sur-mesure", "e-commerce-sur-mesure", "design-ux-ui"],
    projectKeys: ["elite-detail-tampa"],
    slug: t("automobile", "automotive", "automocion"),
    title: t(
      "Sites et rendez-vous pour le secteur automobile",
      "Sites and booking for the automotive trade",
      "Webs y citas para el sector de la automoción",
    ),
    lead: t(
      "Preparation esthetique, carrosserie, mecanique, vente : afficher ses prix et ses creneaux plutot que d'attendre un appel.",
      "Detailing, bodywork, mechanics, sales: show your prices and your slots instead of waiting for a call.",
      "Detailing, chapa, mecánica, venta: mostrar precios y citas en lugar de esperar una llamada.",
    ),
    body: t(
      "## Un devis automobile se gagne ou se perd avant l'appel\n\nPreparation esthetique, carrosserie, mecanique, vente de vehicules : le client compare en ligne, sur son telephone, et retient celui qui annonce ses prix et ses delais. Un site qui dit « contactez-nous pour un devis » se fait depasser par celui qui affiche une grille et propose un creneau.\n\n## Ce que nous avons construit\n\n**Elite Detail Tampa**, en Floride, est un service de detailing automobile a domicile. La clientele etant anglophone, hispanophone et francophone, le site existe dans les trois langues avec une URL par langue, une grille tarifaire par gabarit de vehicule, une galerie avant-apres et la reservation de creneau. La zone d'intervention est annoncee des l'accueil, ce qui evite les demandes hors perimetre.\n\n## Ce que nous mettons en place\n\n- **Tarification par gabarit** : citadine, berline, SUV, utilitaire — le prix juste sans aller-retour\n- **Prise de rendez-vous** avec creneaux reels et rappel automatique\n- **Galerie avant-apres**, la preuve la plus efficace sur ces metiers\n- **Catalogue de vehicules** avec photos, historique et financement, pour la vente\n- **Zone d'intervention** explicite pour un service a domicile\n- **Suivi d'intervention** envoye au client, photos a l'appui\n\n## Budget et delai\n\nA partir de 9 000 € et six semaines pour un site avec grille tarifaire et prise de rendez-vous. Un catalogue de vehicules avec recherche et financement demarre a 18 000 €.",
      "## A car-trade quote is won or lost before the phone call\n\nDetailing, bodywork, mechanics, vehicle sales: the customer compares online, on a phone, and picks whoever states prices and lead times. A site that says \"contact us for a quote\" loses to one that shows a grid and offers a slot.\n\n## What we have built\n\n**Elite Detail Tampa**, in Florida, is a mobile car-detailing service. With customers speaking English, Spanish and French, the site exists in all three languages with one URL per language, a price grid by vehicle size, a before-and-after gallery and slot booking. The service area is stated on the homepage, which avoids out-of-range enquiries.\n\n## What we put in place\n\n- **Pricing by vehicle size**: hatchback, saloon, SUV, van — the right price with no back and forth\n- **Appointment booking** with real slots and automatic reminders\n- **Before-and-after gallery**, the most effective proof in these trades\n- **Vehicle catalogue** with photos, history and finance, for sales\n- **Explicit service area** for a mobile service\n- **Job updates** sent to the customer, with photos\n\n## Budget and timeline\n\nFrom €9,000 and six weeks for a site with a price grid and booking. A vehicle catalogue with search and finance starts at €18,000.",
      "## Un presupuesto de automoción se gana o se pierde antes de la llamada\n\nDetailing, chapa, mecánica, venta de vehículos: el cliente compara en línea, desde el móvil, y elige a quien anuncia precios y plazos. Una web que dice «contáctanos para un presupuesto» pierde frente a la que muestra una tarifa y ofrece una cita.\n\n## Lo que hemos construido\n\n**Elite Detail Tampa**, en Florida, es un servicio de detailing a domicilio. Con clientela anglófona, hispanohablante y francófona, la web existe en tres idiomas con una URL por idioma, una tarifa por tamaño de vehículo, una galería antes y después y reserva de cita.\n\n## Lo que ponemos en marcha\n\n- **Tarifa por tamaño de vehículo**: urbano, berlina, SUV, furgoneta\n- **Reserva de cita** con franjas reales y recordatorio automático\n- **Galería antes y después**, la prueba más eficaz en estos oficios\n- **Catálogo de vehículos** con fotos, historial y financiación\n- **Zona de intervención** explícita para un servicio a domicilio\n- **Seguimiento de la intervención** enviado al cliente, con fotos\n\n## Presupuesto y plazo\n\nDesde 9.000 € y seis semanas para una web con tarifa y reserva de cita. Un catálogo de vehículos con buscador y financiación empieza en 18.000 €.",
    ),
    faqs: [
      {
        question: t(
          "Afficher nos prix ne va-t-il pas nous faire perdre des clients ?",
          "Will showing our prices lose us customers?",
          "¿Mostrar los precios no nos hará perder clientes?",
        ),
        answer: t(
          "Cela vous fait perdre les demandes que vous auriez refusées, et gagner celles que vous auriez ratées. Un client qui connaît le prix avant d'appeler appelle pour prendre rendez-vous, pas pour négocier. Une tarification par gabarit de véhicule donne un prix juste sans engager le devis au centime, ce qui laisse la marge de manœuvre sur les cas particuliers.",
          "It loses you the enquiries you would have declined, and wins you the ones you would have missed. A customer who knows the price before calling calls to book, not to negotiate. Pricing by vehicle size gives a fair figure without committing you to the cent, which keeps room to manoeuvre on edge cases.",
          "Te hace perder las solicitudes que habrías rechazado y ganar las que se te habrían escapado. Un cliente que conoce el precio antes de llamar llama para reservar, no para negociar.",
        ),
      },
    ],
  },
  {
    key: "sante",
    icon: "Layers",
    highlights: ["Prise de rendez-vous", "Hébergement conforme", "Équipe et spécialités"],
    serviceKeys: ["sites-sur-mesure", "applications-web", "maintenance-performance"],
    projectKeys: [],
    slug: t("sante", "healthcare", "salud"),
    title: t(
      "Sites pour maisons médicales et professions de santé",
      "Sites for health centres and healthcare professionals",
      "Webs para centros médicos y profesionales sanitarios",
    ),
    lead: t(
      "Maisons médicales, kinésithérapeutes, ostéopathes : présenter l'équipe, ouvrir le rendez-vous, et traiter la donnée de santé correctement.",
      "Health centres, physiotherapists, osteopaths: present the team, open up booking, and handle health data properly.",
      "Centros médicos, fisioterapeutas, osteópatas: presentar al equipo, abrir la cita y tratar el dato de salud correctamente.",
    ),
    body: t(
      "## Un site de santé a une contrainte que les autres n'ont pas\n\nDès qu'une donnée permet d'identifier un patient et de le rattacher à un soin, elle devient une donnée de santé. En France, son hébergement exige une certification HDS. C'est la première question à régler, et la plupart des sites de praticiens y répondent mal : un formulaire de contact qui demande le motif de consultation collecte déjà une donnée de santé.\n\n## Comment nous traitons ce point\n\nPar défaut, nous ne stockons aucune donnée de santé. Le site présente la structure, l'équipe et les spécialités, et la prise de rendez-vous est déléguée à une plateforme déjà certifiée. Quand un besoin métier impose de conserver des données — messagerie patient, suivi de protocole — nous hébergeons chez un prestataire certifié HDS et nous l'écrivons dans le contrat. Nous ne contournons pas la règle, et nous ne la découvrons pas en cours de projet.\n\n## Ce que nous construisons\n\n- **Présentation de l'équipe** par praticien, spécialité, langues parlées et conventionnement\n- **Prise de rendez-vous**, intégrée ou déléguée à la plateforme que vous utilisez déjà\n- **Horaires, accès, parking, accessibilité** — les trois informations qu'on vient réellement chercher\n- **Informations pratiques** modifiables par le secrétariat, sans nous appeler\n- **Référencement local** : données structurées d'établissement de santé, cohérence avec la fiche Google\n- **Multilingue**, pour les zones touristiques et frontalières\n\n## Budget et délai\n\nÀ partir de 7 000 € et cinq semaines pour un site de maison médicale ou de cabinet, prise de rendez-vous déléguée comprise.",
      "## A healthcare site has a constraint others do not\n\nAs soon as data identifies a patient and links them to care, it becomes health data. In France, hosting it requires HDS certification. That is the first question to settle, and most practitioner sites answer it badly: a contact form asking for the reason for the appointment already collects health data.\n\n## How we handle it\n\nBy default we store no health data. The site presents the practice, the team and the specialities, and appointment booking is delegated to an already-certified platform. Where a business need requires keeping data — patient messaging, protocol follow-up — we host with an HDS-certified provider and write it into the contract. We do not work around the rule, and we do not discover it mid-project.\n\n## What we build\n\n- **Team presentation** by practitioner, speciality, languages spoken and fee arrangements\n- **Appointment booking**, integrated or delegated to the platform you already use\n- **Hours, access, parking, accessibility** — the three things people actually come for\n- **Practical information** editable by reception, without calling us\n- **Local SEO**: healthcare business structured data, consistent with the Google listing\n- **Multilingual**, for tourist and border areas\n\n## Budget and timeline\n\nFrom €7,000 and five weeks for a health centre or practice site, delegated booking included.",
      "## Una web sanitaria tiene una restricción que las demás no tienen\n\nEn cuanto un dato identifica a un paciente y lo vincula a una atención, se convierte en dato de salud. En Francia su alojamiento exige una certificación HDS. Es la primera cuestión a resolver, y la mayoría de webs de profesionales la resuelve mal: un formulario que pregunta el motivo de consulta ya recoge un dato de salud.\n\n## Cómo lo tratamos\n\nPor defecto no almacenamos ningún dato de salud. La web presenta el centro, el equipo y las especialidades, y la cita se delega en una plataforma ya certificada. Cuando una necesidad obliga a conservar datos, alojamos con un proveedor certificado y lo escribimos en el contrato.\n\n## Lo que construimos\n\n- **Presentación del equipo** por profesional, especialidad e idiomas\n- **Cita previa**, integrada o delegada en la plataforma que ya usas\n- **Horarios, acceso, aparcamiento, accesibilidad**\n- **Información práctica** editable por recepción\n- **Posicionamiento local**: datos estructurados de centro sanitario\n- **Multilingüe**, para zonas turísticas y fronterizas\n\n## Presupuesto y plazo\n\nDesde 7.000 € y cinco semanas para una web de centro médico o consulta, con cita delegada incluida.",
    ),
    faqs: [
      {
        question: t(
          "Un formulaire de contact suffit-il pour prendre rendez-vous ?",
          "Is a contact form enough for booking appointments?",
          "¿Basta un formulario de contacto para pedir cita?",
        ),
        answer: t(
          "Non, et c'est le piège le plus fréquent. Dès qu'un formulaire demande un motif de consultation, il collecte une donnée de santé, dont l'hébergement est réglementé. Nous déléguons donc la prise de rendez-vous à une plateforme certifiée, ou nous hébergeons chez un prestataire certifié HDS si le besoin l'impose. Dans les deux cas, c'est écrit dans le contrat avant de commencer.",
          "No, and it is the most common trap. As soon as a form asks for a reason for the appointment, it collects health data, whose hosting is regulated. We therefore delegate booking to a certified platform, or host with an HDS-certified provider where the need requires it. Either way it is written into the contract before we start.",
          "No, y es la trampa más habitual. En cuanto un formulario pregunta el motivo de consulta, recoge un dato de salud, cuyo alojamiento está regulado. Delegamos la cita en una plataforma certificada, o alojamos con un proveedor certificado si hace falta.",
        ),
      },
    ],
  },
  {
    key: "avocats-droit",
    icon: "Database",
    highlights: ["Pages par domaine", "Contact qualifiant", "Confidentialité"],
    serviceKeys: ["sites-sur-mesure", "plateformes-metier", "maintenance-performance"],
    projectKeys: [],
    slug: t("avocats", "law-firms", "abogados"),
    title: t(
      "Sites et espaces clients pour les cabinets d'avocats",
      "Sites and client portals for law firms",
      "Webs y áreas de cliente para despachos de abogados",
    ),
    lead: t(
      "Attirer le bon dossier et écarter les autres, avec des pages par domaine et un formulaire qui qualifie avant le rendez-vous.",
      "Attract the right case and filter out the rest, with practice-area pages and a form that qualifies before the appointment.",
      "Atraer el expediente adecuado y descartar el resto, con páginas por área y un formulario que cualifica antes de la cita.",
    ),
    body: t(
      "## Un cabinet ne cherche pas du trafic, il cherche le bon dossier\n\nCent demandes hors domaine coûtent plus cher qu'elles ne rapportent : chacune occupe le secrétariat et se termine par un refus. Un site de cabinet réussi filtre autant qu'il attire. Il dit précisément les domaines traités, ceux qui ne le sont pas, et il qualifie la demande avant qu'elle n'arrive dans la boîte mail.\n\n## Ce que nous construisons\n\n- **Pages par domaine d'intervention**, écrites pour la recherche réelle du justiciable\n- **Formulaire de prise de contact qualifiant**, qui oriente ou écarte avant le rendez-vous\n- **Présentation des avocats** : barreau, spécialisations, langues de plaidoirie\n- **Espace client** quand le cabinet le souhaite : pièces, échéances, état d'avancement\n- **Publications et jurisprudence commentée**, qui font le référencement d'un cabinet mieux que tout le reste\n- **Multilingue**, décisif sur le droit des affaires transfrontalier\n\n## Confidentialité et déontologie\n\nLe secret professionnel ne tolère pas l'approximation technique. Les échanges passent en chiffrement de bout en bout du navigateur au serveur, les pièces sont servies derrière authentification et exclues de l'indexation, et le journal des accès permet de tracer qui a consulté quoi. Nous hébergeons dans l'Union européenne par défaut, et en Suisse quand le cabinet l'exige. Les contraintes déontologiques en matière de publicité sont prises en compte dans la rédaction, pas corrigées après coup.\n\n## Budget et délai\n\nÀ partir de 8 000 € et cinq semaines pour un site de cabinet avec pages par domaine. Un espace client sécurisé démarre à 20 000 €.",
      "## A law firm is not looking for traffic, it is looking for the right case\n\nA hundred out-of-scope enquiries cost more than they return: each one occupies reception and ends in a refusal. A successful firm site filters as much as it attracts. It states precisely which areas are handled, which are not, and it qualifies the enquiry before it reaches the inbox.\n\n## What we build\n\n- **A page per practice area**, written for how clients actually search\n- **A qualifying enquiry form**, which directs or declines before the appointment\n- **Lawyer profiles**: bar, specialisations, languages of pleading\n- **Client portal** where the firm wants one: documents, deadlines, case status\n- **Publications and case commentary**, which do more for a firm's search presence than anything else\n- **Multilingual**, decisive in cross-border business law\n\n## Confidentiality and professional conduct\n\nLegal privilege does not tolerate technical approximation. Exchanges are encrypted end to end from browser to server, documents are served behind authentication and excluded from indexing, and an access log traces who viewed what. We host in the European Union by default, and in Switzerland where a firm requires it. Advertising conduct rules are taken into account when drafting, not corrected afterwards.\n\n## Budget and timeline\n\nFrom €8,000 and five weeks for a firm site with practice-area pages. A secure client portal starts at €20,000.",
      "## Un despacho no busca tráfico, busca el expediente adecuado\n\nCien solicitudes fuera de ámbito cuestan más de lo que aportan: cada una ocupa a la secretaría y acaba en una negativa. Una web de despacho que funciona filtra tanto como atrae.\n\n## Lo que construimos\n\n- **Una página por área de práctica**, escrita para la búsqueda real del cliente\n- **Formulario de contacto cualificador**, que orienta o descarta antes de la cita\n- **Presentación de los abogados**: colegio, especializaciones, idiomas\n- **Área de cliente** cuando el despacho la quiere: documentos, plazos, estado del asunto\n- **Publicaciones y comentario de jurisprudencia**\n- **Multilingüe**, decisivo en derecho mercantil transfronterizo\n\n## Confidencialidad y deontología\n\nEl secreto profesional no tolera la aproximación técnica. Los intercambios se cifran de extremo a extremo, los documentos se sirven tras autenticación y se excluyen de la indexación, y un registro de accesos permite trazar quién consultó qué. Alojamos en la Unión Europea por defecto, y en Suiza cuando el despacho lo exige.\n\n## Presupuesto y plazo\n\nDesde 8.000 € y cinco semanas para una web de despacho con páginas por área. Un área de cliente segura empieza en 20.000 €.",
    ),
    faqs: [
      {
        question: t(
          "Un espace client est-il compatible avec le secret professionnel ?",
          "Is a client portal compatible with legal privilege?",
          "¿Un área de cliente es compatible con el secreto profesional?",
        ),
        answer: t(
          "Oui, à condition que l'architecture le prévoie dès le départ. Les pièces sont servies derrière authentification, exclues de l'indexation et absentes du sitemap, les échanges sont chiffrés de bout en bout, et chaque consultation est journalisée. Nous hébergeons dans l'Union européenne par défaut, et en Suisse quand le cabinet l'exige.",
          "Yes, provided the architecture plans for it from the start. Documents are served behind authentication, excluded from indexing and absent from the sitemap, exchanges are encrypted end to end, and every access is logged. We host in the European Union by default, and in Switzerland where a firm requires it.",
          "Sí, siempre que la arquitectura lo prevea desde el inicio. Los documentos se sirven tras autenticación, excluidos de la indexación, los intercambios se cifran de extremo a extremo y cada consulta queda registrada.",
        ),
      },
    ],
  },
];
