import { t } from "./locale";

/**
 * Les sept services, classés par valeur décroissante.
 *
 * L'ordre du tableau devient la position affichée : les plateformes métier
 * arrivent en premier parce que c'est l'offre que l'on veut vendre, et la
 * seule sur laquelle le portfolio apporte une preuve répétée.
 *
 * Aucun service ne mentionne WordPress ni Shopify autrement que pour dire
 * pourquoi nous ne les utilisons pas : c'est un argument de vente, pas une
 * omission.
 */
export const services = [
  {
    key: "plateformes-metier",
    icon: "Workflow",
    stack: ["Next.js", "PostgreSQL", "Accès par rôle"],
    slug: t("plateformes-metier", "business-platforms", "plataformas-de-negocio"),
    title: t(
      "Plateformes métier & marketplaces B2B",
      "Business platforms & B2B marketplaces",
      "Plataformas de negocio y marketplaces B2B",
    ),
    summary: t(
      "Des plateformes qui mettent en relation deux populations professionnelles : comptes vérifiés, accès conditionnés, messagerie interne et confidentialité par défaut.",
      "Platforms connecting two professional populations: verified accounts, gated access, internal messaging and confidentiality by default.",
      "Plataformas que conectan dos poblaciones profesionales: cuentas verificadas, accesos restringidos, mensajería interna y confidencialidad por defecto.",
    ),
    body: t(
      "## Mettre en relation sans exposer\n\nUne marketplace B2B n'est pas un annuaire. Son cœur, c'est la gestion de qui voit quoi : un vendeur veut être trouvé sans être identifié, un acheteur veut filtrer avant de se dévoiler. Nous avons construit cinq plateformes sur ce principe, dans le courtage, les fiduciaires, l'immobilier et le recrutement financier.\n\n## Ce que contient une plateforme livrée\n\n- Comptes séparés par population, avec vérification manuelle ou automatique\n- Visibilité progressive : annonce anonymisée, puis déverrouillage sur accord\n- Messagerie interne, pour que les échanges restent sur la plateforme\n- Abonnements récurrents et facturation automatique\n- Back-office de modération : validation des comptes et des annonces\n- Journal des accès, pour tracer qui a consulté quel document\n\n## Pourquoi du code et pas une solution existante\n\nLes solutions de marketplace génériques imposent leur modèle de données. Or c'est précisément le modèle métier qui fait la valeur d'une plateforme spécialisée : les règles de confidentialité d'une cession de portefeuille de courtage n'ont rien à voir avec celles d'une boutique. Tout est écrit sur mesure, en TypeScript.\n\n## Délai et budget\n\nComptez trois à cinq mois pour une première version exploitable, et un budget à partir de 35 000 €. Le périmètre est chiffré fonctionnalité par fonctionnalité avant de commencer.",
      "## Connecting people without exposing them\n\nA B2B marketplace is not a directory. Its core is managing who sees what: a seller wants to be found without being identified, a buyer wants to filter before revealing themselves. We have built five platforms on that principle, across insurance broking, accountancy firms, real estate and financial recruitment.\n\n## What a delivered platform contains\n\n- Separate accounts per population, with manual or automated verification\n- Progressive visibility: anonymised listing, then unlocking on agreement\n- Internal messaging, so conversations stay on the platform\n- Recurring subscriptions and automated invoicing\n- Moderation back office: account and listing approval\n- Access log, to trace who viewed which document\n\n## Why code rather than an off-the-shelf product\n\nGeneric marketplace products impose their data model. Yet the business model is exactly what makes a specialised platform valuable: the confidentiality rules around selling an insurance portfolio have nothing in common with those of a shop. Everything is written bespoke, in TypeScript.\n\n## Timeline and budget\n\nAllow three to five months for a first usable version, and a budget from €35,000. Scope is quoted feature by feature before we start.",
      "## Conectar sin exponer\n\nUn marketplace B2B no es un directorio. Su núcleo es gestionar quién ve qué: un vendedor quiere ser encontrado sin ser identificado, un comprador quiere filtrar antes de darse a conocer. Hemos construido cinco plataformas sobre este principio, en corretaje, asesorías, inmobiliaria y selección financiera.\n\n## Qué incluye una plataforma entregada\n\n- Cuentas separadas por población, con verificación manual o automática\n- Visibilidad progresiva: anuncio anonimizado y desbloqueo previo acuerdo\n- Mensajería interna, para que los intercambios se queden en la plataforma\n- Suscripciones recurrentes y facturación automática\n- Panel de moderación: validación de cuentas y anuncios\n- Registro de accesos, para trazar quién consultó qué documento\n\n## Por qué código y no una solución existente\n\nLas soluciones genéricas de marketplace imponen su modelo de datos. Y es precisamente el modelo de negocio lo que da valor a una plataforma especializada: las reglas de confidencialidad de una cesión de cartera de corretaje no se parecen en nada a las de una tienda. Todo se escribe a medida, en TypeScript.\n\n## Plazo y presupuesto\n\nCalcula de tres a cinco meses para una primera versión utilizable, y un presupuesto desde 35.000 €. El alcance se presupuesta funcionalidad por funcionalidad antes de empezar.",
    ),
  },
  {
    key: "saas-abonnement",
    icon: "Blocks",
    stack: ["Stripe", "Abonnements", "Multi-comptes"],
    slug: t("saas-abonnement", "subscription-saas", "saas-por-suscripcion"),
    title: t(
      "Produits SaaS par abonnement",
      "Subscription SaaS products",
      "Productos SaaS por suscripción",
    ),
    summary: t(
      "Transformer un service en produit récurrent : essais, formules, paiement automatique, relance des échecs et espace client autonome.",
      "Turning a service into a recurring product: trials, plans, automated payment, failed-payment recovery and a self-service customer area.",
      "Convertir un servicio en producto recurrente: pruebas, planes, pago automático, recuperación de impagos y área de cliente autónoma.",
    ),
    body: t(
      "## Le revenu récurrent change l'architecture\n\nFacturer une fois est simple. Facturer chaque mois demande de gérer les changements de formule en cours de période, les échecs de prélèvement, les relances, les résiliations et les accès qui doivent se fermer au bon moment. C'est là que la plupart des projets dérapent.\n\n## Ce que nous mettons en place\n\n- Formules et paliers, avec changement immédiat ou à l'échéance\n- Période d'essai, avec ou sans carte bancaire\n- Prélèvement automatique via Stripe, et facturation conforme\n- Relance automatique des paiements échoués, avant suspension d'accès\n- Espace client : facture, formule en cours, résiliation en autonomie\n- Tableau de bord interne : abonnés actifs, revenu mensuel, résiliations\n\n## Les droits d'accès suivent l'abonnement\n\nUn abonnement suspendu doit fermer les accès au bon périmètre, sans supprimer les données. Cette logique est écrite explicitement, testée, et vérifiable depuis le back-office.\n\n## Délai et budget\n\nUn produit par abonnement exploitable démarre à 25 000 € et deux à quatre mois, selon le nombre de formules et la complexité des droits.",
      "## Recurring revenue changes the architecture\n\nBilling once is simple. Billing every month means handling mid-period plan changes, failed charges, dunning, cancellations and access that must close at the right moment. That is where most projects come unstuck.\n\n## What we put in place\n\n- Plans and tiers, switching immediately or at renewal\n- Trial period, with or without a card\n- Automated collection through Stripe, and compliant invoicing\n- Automated recovery of failed payments, before access is suspended\n- Customer area: invoices, current plan, self-service cancellation\n- Internal dashboard: active subscribers, monthly revenue, churn\n\n## Access rights follow the subscription\n\nA suspended subscription must close the right scope of access without deleting data. That logic is written explicitly, tested, and auditable from the back office.\n\n## Timeline and budget\n\nA usable subscription product starts at €25,000 and two to four months, depending on the number of plans and the complexity of entitlements.",
      "## El ingreso recurrente cambia la arquitectura\n\nFacturar una vez es sencillo. Facturar cada mes exige gestionar cambios de plan a mitad de periodo, impagos, recordatorios, bajas y accesos que deben cerrarse en el momento correcto. Ahí es donde descarrilan la mayoría de los proyectos.\n\n## Qué implementamos\n\n- Planes y niveles, con cambio inmediato o al vencimiento\n- Periodo de prueba, con o sin tarjeta\n- Cobro automático vía Stripe y facturación conforme\n- Recuperación automática de pagos fallidos antes de suspender el acceso\n- Área de cliente: facturas, plan actual, baja autónoma\n- Panel interno: suscriptores activos, ingreso mensual, bajas\n\n## Los permisos siguen a la suscripción\n\nUna suscripción suspendida debe cerrar el ámbito correcto sin borrar datos. Esa lógica se escribe de forma explícita, se prueba y es auditable desde el panel.\n\n## Plazo y presupuesto\n\nUn producto por suscripción utilizable arranca en 25.000 € y de dos a cuatro meses, según el número de planes y la complejidad de los permisos.",
    ),
  },
  {
    key: "applications-web",
    icon: "LayoutDashboard",
    stack: ["Next.js", "PostgreSQL", "Rôles & permissions"],
    slug: t("applications-web", "web-applications", "aplicaciones-web"),
    title: t(
      "Applications web sur mesure",
      "Bespoke web applications",
      "Aplicaciones web a medida",
    ),
    summary: t(
      "Outils internes, espaces clients et logiciels métier qui remplacent les tableurs partagés et les logiciels que personne n'utilise.",
      "Internal tools, client portals and line-of-business software that replace shared spreadsheets and software nobody uses.",
      "Herramientas internas, áreas de cliente y software de gestión que sustituyen las hojas de cálculo compartidas y el software que nadie usa.",
    ),
    body: t(
      "## Partir de votre processus, pas d'un modèle\n\nLes logiciels du marché imposent une façon de travailler. Quand votre métier n'y rentre pas, les équipes recréent le vrai processus à côté, dans un tableur. Une application sur mesure part de ce que vous faites réellement.\n\n## Ce que nous construisons le plus souvent\n\n- Espaces clients : documents, suivi de dossier, échanges\n- Outils de gestion : dossiers, étapes, affectations, échéances\n- Tableaux de bord qui agrègent des données venues de plusieurs outils\n- Connexions à vos logiciels existants par API\n- Rôles et permissions fins, jusqu'au niveau du champ\n- Export et journal d'activité, pour l'audit\n\n## Mise en service progressive\n\nNous livrons par lots utilisables plutôt qu'en une seule fois : vos équipes se forment au fur et à mesure, et la bascule depuis l'ancien outil se fait sans arrêt d'activité.\n\n## Délai et budget\n\nÀ partir de 20 000 € et six à dix semaines pour un premier périmètre en production.",
      "## Starting from your process, not a template\n\nOff-the-shelf software imposes a way of working. When your business does not fit, teams recreate the real process alongside it, in a spreadsheet. A bespoke application starts from what you actually do.\n\n## What we build most often\n\n- Client portals: documents, case tracking, correspondence\n- Management tools: cases, stages, assignments, deadlines\n- Dashboards aggregating data from several tools\n- API connections to your existing software\n- Fine-grained roles and permissions, down to field level\n- Export and activity log, for audit\n\n## Progressive rollout\n\nWe ship in usable increments rather than all at once: your teams learn as it grows, and the switch from the old tool happens without stopping work.\n\n## Timeline and budget\n\nFrom €20,000 and six to ten weeks for a first scope in production.",
      "## Partir de tu proceso, no de una plantilla\n\nEl software del mercado impone una forma de trabajar. Cuando tu negocio no encaja, los equipos recrean el proceso real al margen, en una hoja de cálculo. Una aplicación a medida parte de lo que realmente haces.\n\n## Lo que construimos más a menudo\n\n- Áreas de cliente: documentos, seguimiento de expediente, intercambios\n- Herramientas de gestión: expedientes, etapas, asignaciones, plazos\n- Paneles que agregan datos de varias herramientas\n- Conexiones por API con tu software existente\n- Roles y permisos finos, hasta el nivel de campo\n- Exportación y registro de actividad, para auditoría\n\n## Puesta en marcha progresiva\n\nEntregamos por lotes utilizables en lugar de todo a la vez: tus equipos se forman según avanza y el cambio desde la herramienta anterior ocurre sin parar la actividad.\n\n## Plazo y presupuesto\n\nDesde 20.000 € y de seis a diez semanas para un primer alcance en producción.",
    ),
  },
  {
    key: "sites-sur-mesure",
    icon: "Globe",
    stack: ["Next.js", "Back-office", "Multilingue"],
    slug: t("sites-sur-mesure", "bespoke-websites", "webs-a-medida"),
    title: t("Sites sur mesure", "Bespoke websites", "Webs a medida"),
    summary: t(
      "Sites de marque rapides et bien référencés, avec un back-office où vous modifiez tout vous-même, dans chaque langue. Sans WordPress.",
      "Fast, well-ranked brand sites with a back office where you edit everything yourself, in every language. No WordPress.",
      "Webs de marca rápidas y bien posicionadas, con un panel donde lo editas todo tú mismo, en cada idioma. Sin WordPress.",
    ),
    body: t(
      "## Un site que vous pilotez vraiment\n\nNous livrons un site complet avec son administration : pages, textes, images, articles et traductions se modifient sans nous appeler. Chaque contenu existe en français, anglais et espagnol, avec une URL propre par langue.\n\n## Pourquoi pas WordPress\n\nUn thème WordPress embarque des centaines de fonctions que vous n'utiliserez jamais : le site est lent, et chaque extension ajoute une surface d'attaque à maintenir. Nous écrivons le site en Next.js, avec exactement les fonctionnalités dont vous avez besoin. Résultat : des pages servies en HTML déjà calculé, et aucune mise à jour d'extension à surveiller.\n\n## Ce qui est inclus\n\n- Conception des maquettes sur Figma, validées avant développement\n- Développement sur mesure, sans thème ni constructeur de pages\n- Back-office multilingue avec gestion des images\n- SEO technique : balises, données structurées, sitemap, redirections\n- Formation d'une heure à la prise en main, et documentation écrite\n\n## Délai et budget\n\nComptez six semaines entre le lancement et la mise en ligne pour un site d'une quinzaine de pages, à partir de 9 000 €. Le devis est détaillé poste par poste avant de commencer.",
      "## A site you actually control\n\nWe deliver a complete site with its admin: pages, copy, images, articles and translations are all editable without calling us. Every piece of content exists in French, English and Spanish, with a clean URL per language.\n\n## Why not WordPress\n\nA WordPress theme ships hundreds of features you will never use: the site is slow, and every plugin adds an attack surface to maintain. We write the site in Next.js, with exactly the features you need. The result: pages served as pre-rendered HTML, and no plugin updates to watch.\n\n## What's included\n\n- Figma mockups, signed off before development\n- Bespoke development, no theme, no page builder\n- Multilingual back office with image management\n- Technical SEO: tags, structured data, sitemap, redirects\n- A one-hour handover session, plus written documentation\n\n## Timeline and budget\n\nAllow six weeks from kick-off to launch for a fifteen-page site, from €9,000. The quote is itemised before we start.",
      "## Una web que controlas de verdad\n\nEntregamos una web completa con su administración: páginas, textos, imágenes, artículos y traducciones se modifican sin llamarnos. Cada contenido existe en francés, inglés y español, con una URL propia por idioma.\n\n## Por qué no WordPress\n\nUna plantilla de WordPress incorpora cientos de funciones que nunca usarás: la web es lenta y cada extensión añade una superficie de ataque que mantener. Escribimos la web en Next.js, con exactamente las funcionalidades que necesitas. El resultado: páginas servidas en HTML ya calculado y ninguna actualización de extensión que vigilar.\n\n## Qué incluye\n\n- Maquetas en Figma, validadas antes de desarrollar\n- Desarrollo a medida, sin plantilla ni maquetador\n- Panel multilingüe con gestión de imágenes\n- SEO técnico: etiquetas, datos estructurados, sitemap, redirecciones\n- Una hora de formación y documentación escrita\n\n## Plazo y presupuesto\n\nCalcula seis semanas desde el inicio hasta la publicación para una web de unas quince páginas, desde 9.000 €. El presupuesto se detalla partida por partida antes de empezar.",
    ),
  },
  {
    key: "e-commerce-sur-mesure",
    icon: "ShoppingBag",
    stack: ["Next.js", "Stripe", "Devis & tarifs pro"],
    slug: t("e-commerce-sur-mesure", "bespoke-e-commerce", "e-commerce-a-medida"),
    title: t("E-commerce sur mesure", "Bespoke e-commerce", "E-commerce a medida"),
    summary: t(
      "Boutiques codées sur mesure, pensées pour les catalogues professionnels : devis, remises par client, produits configurables. Sans Shopify.",
      "Bespoke-coded stores built for professional catalogues: quotes, per-customer pricing, configurable products. No Shopify.",
      "Tiendas programadas a medida, pensadas para catálogos profesionales: presupuestos, descuentos por cliente, productos configurables. Sin Shopify.",
    ),
    body: t(
      "## Quand la boutique clé en main ne suffit plus\n\nLes plateformes d'e-commerce clé en main conviennent très bien à un catalogue simple vendu au même prix à tout le monde. Elles deviennent un obstacle dès que vous avez des tarifs par client, des demandes de devis, des produits configurables ou une livraison à calculer selon la zone et le volume.\n\n## Ce que permet une boutique codée\n\n- Devis en ligne à côté de l'achat direct, pour les commandes professionnelles\n- Tarifs et remises par client ou par catégorie de client\n- Produits configurables : dimensions, finitions, options liées\n- Règles de livraison réelles, par zone, poids ou volume\n- Paiement par Stripe, et paiement sur facture pour les comptes pro\n- Aucune commission sur les ventes, et aucun abonnement de plateforme\n\n## Ce que vous gardez\n\nLe code, les données et le catalogue sont à vous. Pas de dépendance à l'évolution tarifaire d'une plateforme tierce, et aucune fonctionnalité qui disparaît parce qu'un éditeur a changé d'avis.\n\n## Délai et budget\n\nÀ partir de 15 000 € et huit à douze semaines, selon la taille du catalogue et la complexité des règles de prix.",
      "## When the turnkey store stops being enough\n\nTurnkey e-commerce platforms work very well for a simple catalogue sold at the same price to everyone. They become an obstacle as soon as you have per-customer pricing, quote requests, configurable products or shipping to calculate by zone and volume.\n\n## What a coded store makes possible\n\n- Online quotes alongside direct purchase, for trade orders\n- Pricing and discounts per customer or customer category\n- Configurable products: dimensions, finishes, linked options\n- Real shipping rules, by zone, weight or volume\n- Stripe payment, plus payment on invoice for trade accounts\n- No commission on sales, and no platform subscription\n\n## What you keep\n\nThe code, the data and the catalogue are yours. No exposure to a third party's pricing changes, and no feature disappearing because a vendor changed their mind.\n\n## Timeline and budget\n\nFrom €15,000 and eight to twelve weeks, depending on catalogue size and the complexity of pricing rules.",
      "## Cuando la tienda llave en mano ya no basta\n\nLas plataformas de e-commerce llave en mano funcionan muy bien para un catálogo simple vendido al mismo precio a todo el mundo. Se convierten en un obstáculo en cuanto tienes tarifas por cliente, solicitudes de presupuesto, productos configurables o envíos que calcular según zona y volumen.\n\n## Qué permite una tienda programada\n\n- Presupuestos en línea junto a la compra directa, para pedidos profesionales\n- Tarifas y descuentos por cliente o categoría de cliente\n- Productos configurables: dimensiones, acabados, opciones vinculadas\n- Reglas de envío reales, por zona, peso o volumen\n- Pago con Stripe y pago contra factura para cuentas profesionales\n- Ninguna comisión sobre las ventas ni suscripción de plataforma\n\n## Qué conservas\n\nEl código, los datos y el catálogo son tuyos. Sin dependencia de los cambios de tarifa de una plataforma externa y sin funcionalidades que desaparecen porque un proveedor cambió de idea.\n\n## Plazo y presupuesto\n\nDesde 15.000 € y de ocho a doce semanas, según el tamaño del catálogo y la complejidad de las reglas de precio.",
    ),
  },
  {
    key: "design-ux-ui",
    icon: "PenTool",
    stack: ["Figma", "Design system", "Accessibilité"],
    slug: t("design-ux-ui", "ux-ui-design", "diseno-ux-ui"),
    title: t("Design UX / UI", "UX / UI design", "Diseño UX / UI"),
    summary: t(
      "Parcours, maquettes et système de composants. Dessinés par ceux qui les intègrent, donc réalisables tels quels.",
      "Flows, mockups and a component system. Drawn by the people who build them, so they ship as drawn.",
      "Flujos, maquetas y sistema de componentes. Diseñados por quienes los integran, así que se construyen tal cual.",
    ),
    body: t(
      "## Un design qui tient au développement\n\nUn écran magnifique mais irréalisable coûte deux fois : une fois pour le dessiner, une fois pour le renégocier. Comme nous développons ce que nous dessinons, la maquette validée est celle qui part en production.\n\n## Ce que nous livrons\n\n- Parcours utilisateur : les écrans clés et les chemins entre eux\n- Maquettes desktop et mobile de chaque écran, pas seulement d'accueil\n- Système de composants réutilisables, avec leurs états\n- États vides, de chargement et d'erreur, trop souvent oubliés\n- Contrastes et tailles conformes aux critères d'accessibilité\n\n## Les écrans qui comptent vraiment\n\nSur une plateforme, la valeur ne se joue pas sur la page d'accueil mais sur le tableau de bord, le formulaire d'inscription et la page de paiement. Nous y passons l'essentiel du temps de conception.\n\n## Délai et budget\n\nÀ partir de 4 500 € pour un site, deux à quatre semaines. Inclus sans supplément quand le design accompagne un développement que nous réalisons.",
      "## Design that survives development\n\nA beautiful but unbuildable screen costs twice: once to draw it, once to renegotiate it. Because we build what we draw, the signed-off mockup is the one that ships.\n\n## What we deliver\n\n- User flows: the key screens and the paths between them\n- Desktop and mobile mockups of every screen, not just the homepage\n- A reusable component system, with its states\n- Empty, loading and error states, too often forgotten\n- Contrast and sizing meeting accessibility criteria\n\n## The screens that actually matter\n\nOn a platform, value is not won on the homepage but on the dashboard, the sign-up form and the payment page. That is where most of the design time goes.\n\n## Timeline and budget\n\nFrom €4,500 for a site, two to four weeks. Included at no extra cost when the design accompanies development we carry out.",
      "## Un diseño que aguanta el desarrollo\n\nUna pantalla magnífica pero inviable cuesta el doble: una vez por dibujarla y otra por renegociarla. Como desarrollamos lo que diseñamos, la maqueta validada es la que llega a producción.\n\n## Qué entregamos\n\n- Flujos de usuario: las pantallas clave y los caminos entre ellas\n- Maquetas de escritorio y móvil de cada pantalla, no solo de la portada\n- Sistema de componentes reutilizables, con sus estados\n- Estados vacíos, de carga y de error, demasiadas veces olvidados\n- Contrastes y tamaños conformes a los criterios de accesibilidad\n\n## Las pantallas que de verdad importan\n\nEn una plataforma, el valor no se juega en la portada sino en el panel, el formulario de registro y la página de pago. Ahí dedicamos la mayor parte del tiempo de diseño.\n\n## Plazo y presupuesto\n\nDesde 4.500 € para una web, de dos a cuatro semanas. Incluido sin coste adicional cuando el diseño acompaña a un desarrollo que realizamos nosotros.",
    ),
  },
  {
    key: "maintenance-performance",
    icon: "Gauge",
    stack: ["Supervision", "Sauvegardes", "Core Web Vitals"],
    slug: t(
      "infogerance-performance",
      "managed-hosting-performance",
      "mantenimiento-rendimiento",
    ),
    title: t(
      "Infogérance & performance",
      "Managed hosting & performance",
      "Mantenimiento y rendimiento",
    ),
    summary: t(
      "Hébergement, supervision, sauvegardes et optimisation continue. Avec un délai de réponse garanti sur les incidents bloquants.",
      "Hosting, monitoring, backups and continuous optimisation. With a guaranteed response time on blocking incidents.",
      "Alojamiento, supervisión, copias de seguridad y optimización continua. Con tiempo de respuesta garantizado en incidentes bloqueantes.",
    ),
    body: t(
      "## Une plateforme vivante, pas un projet livré puis oublié\n\nUne application qui encaisse des paiements et stocke des données professionnelles ne peut pas être laissée sans surveillance. Notre contrat couvre l'hébergement, la supervision et l'amélioration continue.\n\n## Ce qui est inclus\n\n- Hébergement sur infrastructure mondiale, certificat SSL inclus\n- Mises à jour de sécurité appliquées et testées chaque mois\n- Sauvegardes quotidiennes, restauration en moins d'une heure\n- Alerte immédiate en cas d'indisponibilité, 24 h/24\n- Rapport mensuel : vitesse, erreurs, Core Web Vitals\n- Réponse garantie sous 4 heures ouvrées en cas d'incident bloquant\n\n## Hébergement au bon endroit\n\nPour les professions réglementées, la localisation des données se négocie dans le contrat, pas après. Nous hébergeons dans l'Union européenne par défaut, et pouvons héberger en Suisse quand le client l'exige.\n\n## Budget\n\nÀ partir de 290 € par mois pour un site, davantage pour une plateforme selon le volume et le niveau d'engagement.",
      "## A living platform, not a project shipped and forgotten\n\nAn application taking payments and storing professional data cannot be left unattended. Our contract covers hosting, monitoring and continuous improvement.\n\n## What's included\n\n- Hosting on global infrastructure, SSL certificate included\n- Security updates applied and tested every month\n- Daily backups, restored in under an hour\n- Immediate downtime alerting, around the clock\n- Monthly report: speed, errors, Core Web Vitals\n- Guaranteed 4-working-hour response on blocking incidents\n\n## Hosting in the right place\n\nFor regulated professions, data location is negotiated in the contract, not afterwards. We host in the European Union by default, and can host in Switzerland where a client requires it.\n\n## Budget\n\nFrom €290 per month for a site, more for a platform depending on volume and commitment level.",
      "## Una plataforma viva, no un proyecto entregado y olvidado\n\nUna aplicación que cobra pagos y almacena datos profesionales no puede quedarse sin vigilancia. Nuestro contrato cubre alojamiento, supervisión y mejora continua.\n\n## Qué incluye\n\n- Alojamiento en infraestructura global, certificado SSL incluido\n- Actualizaciones de seguridad aplicadas y probadas cada mes\n- Copias de seguridad diarias, restauración en menos de una hora\n- Alerta inmediata en caso de caída, 24 horas al día\n- Informe mensual: velocidad, errores, Core Web Vitals\n- Respuesta garantizada en 4 horas laborables ante incidentes bloqueantes\n\n## Alojamiento en el lugar adecuado\n\nEn profesiones reguladas, la ubicación de los datos se negocia en el contrato, no después. Alojamos en la Unión Europea por defecto y podemos alojar en Suiza cuando el cliente lo exige.\n\n## Presupuesto\n\nDesde 290 € al mes para una web, más para una plataforma según el volumen y el nivel de compromiso.",
    ),
  },
];
