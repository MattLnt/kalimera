import { t } from "./locale";

/**
 * Pages sectorielles.
 *
 * Chacune répond à une intention de recherche précise et s'adosse aux
 * réalisations qui la prouvent : `projectKeys` n'est pas décoratif, c'est ce
 * qui fait la différence entre une page qui convertit et une page de
 * remplissage. On ne crée donc pas de page sectorielle sans preuve.
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
];
