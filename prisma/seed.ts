import { config as loadEnv } from "dotenv";

import { PrismaPg } from "@prisma/adapter-pg";

// Même ordre de priorité que la CLI Prisma : .env.local puis .env.
loadEnv({ path: ".env.local", quiet: true });
loadEnv({ quiet: true });
import { hash } from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma/client";
import { Locale, ProjectKind } from "../src/generated/prisma/enums";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL manquant : renseignez .env.local avant de lancer le seed.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

type Tr = { fr: string; en: string; es: string };

const t = (fr: string, en: string, es: string): Tr => ({ fr, en, es });

// --------------------------------------------------------------------- data

const services = [
  {
    key: "sites-vitrines",
    icon: "Globe",
    stack: ["Next.js", "Back-office", "Multilingue"],
    slug: t("sites-vitrines", "marketing-websites", "webs-corporativas"),
    title: t("Sites vitrines", "Marketing websites", "Webs corporativas"),
    summary: t(
      "Sites de marque rapides et bien référencés, avec un back-office où vous modifiez tout vous-même, dans chaque langue.",
      "Fast, well-ranked brand sites with a back office where you edit everything yourself, in every language.",
      "Webs de marca rápidas y bien posicionadas, con un panel donde lo editas todo tú mismo, en cada idioma.",
    ),
    body: t(
      "## Un site que vous pilotez vraiment\n\nNous livrons un site complet avec son administration : pages, textes, images, articles et traductions se modifient sans nous appeler. Chaque contenu existe en français, anglais et espagnol, avec une URL propre par langue.\n\n## Ce qui est inclus\n\n- Conception des maquettes sur Figma, validées avant développement\n- Développement sur mesure en Next.js, sans thème ni page builder\n- Back-office multilingue avec gestion des images\n- SEO technique : balises, données structurées, sitemap, redirections\n- Formation d'une heure à la prise en main, et documentation écrite\n\n## Délai et budget\n\nComptez six semaines entre le lancement et la mise en ligne pour un site d'une quinzaine de pages. Le devis est détaillé poste par poste avant de commencer.",
      "## A site you actually control\n\nWe deliver a complete site with its admin: pages, copy, images, articles and translations are all editable without calling us. Every piece of content exists in French, English and Spanish, with a clean URL per language.\n\n## What's included\n\n- Figma mockups, signed off before development\n- Custom Next.js build — no theme, no page builder\n- Multilingual back office with image management\n- Technical SEO: tags, structured data, sitemap, redirects\n- A one-hour handover session, plus written documentation\n\n## Timeline and budget\n\nAllow six weeks from kick-off to launch for a fifteen-page site. The quote is itemised before we start.",
      "## Una web que controlas de verdad\n\nEntregamos una web completa con su administración: páginas, textos, imágenes, artículos y traducciones se modifican sin llamarnos. Cada contenido existe en francés, inglés y español, con una URL propia por idioma.\n\n## Qué incluye\n\n- Maquetas en Figma, validadas antes de desarrollar\n- Desarrollo a medida en Next.js, sin plantilla ni maquetador\n- Panel multilingüe con gestión de imágenes\n- SEO técnico: etiquetas, datos estructurados, sitemap, redirecciones\n- Una hora de formación y documentación escrita\n\n## Plazo y presupuesto\n\nCalcula seis semanas desde el inicio hasta la publicación para una web de unas quince páginas. El presupuesto se detalla partida por partida antes de empezar.",
    ),
  },
  {
    key: "e-commerce",
    icon: "ShoppingBag",
    stack: ["Shopify", "Stripe", "CRO"],
    slug: t("e-commerce", "e-commerce", "e-commerce"),
    title: t("E-commerce", "E-commerce", "E-commerce"),
    summary: t(
      "Boutiques Shopify ou sur-mesure : fiches produit qui convertissent, tunnel optimisé, paiements et logistique connectés.",
      "Shopify or custom stores: product pages that convert, an optimised funnel, payments and logistics connected.",
      "Tiendas Shopify o a medida: fichas de producto que convierten, embudo optimizado, pagos y logística conectados.",
    ),
    body: t(
      "## Vendre, pas seulement exposer\n\nNous construisons des boutiques pensées pour le taux de conversion : parcours court, fiches produit lisibles, paiement sans friction et pages qui se chargent vite même sur mobile en 4G.\n\n## Ce qui est inclus\n\n- Thème Shopify sur mesure, ou boutique développée de zéro\n- Paiements Stripe, Apple Pay et Google Pay\n- Connexion à votre ERP, votre stock et votre transporteur\n- Suivi des conversions côté serveur, sans dépendre des cookies tiers\n- Tests A/B sur les pages qui comptent",
      "## Selling, not just displaying\n\nWe build stores designed around conversion rate: a short journey, readable product pages, frictionless checkout and pages that load fast even on mobile 4G.\n\n## What's included\n\n- Custom Shopify theme, or a store built from scratch\n- Stripe, Apple Pay and Google Pay checkout\n- Connection to your ERP, stock and carrier\n- Server-side conversion tracking, independent of third-party cookies\n- A/B testing on the pages that matter",
      "## Vender, no solo exponer\n\nConstruimos tiendas pensadas para la tasa de conversión: recorrido corto, fichas de producto legibles, pago sin fricción y páginas que cargan rápido incluso en móvil con 4G.\n\n## Qué incluye\n\n- Tema Shopify a medida, o tienda desarrollada desde cero\n- Pagos con Stripe, Apple Pay y Google Pay\n- Conexión con tu ERP, tu stock y tu transportista\n- Seguimiento de conversiones en servidor, sin depender de cookies de terceros\n- Tests A/B en las páginas que importan",
    ),
  },
  {
    key: "applications-web",
    icon: "LayoutDashboard",
    stack: ["React", "Node.js", "PostgreSQL"],
    slug: t("applications-web", "web-applications", "aplicaciones-web"),
    title: t("Applications web", "Web applications", "Aplicaciones web"),
    summary: t(
      "Plateformes SaaS, espaces clients, outils métier et portails internes. Du cadrage fonctionnel à la mise en production.",
      "SaaS platforms, client portals, internal tools and business software. From functional scoping to production.",
      "Plataformas SaaS, áreas de cliente, herramientas internas y portales. Del encuadre funcional a producción.",
    ),
    body: t(
      "## Des outils qui remplacent vos tableurs\n\nNous développons des applications métier sur mesure : espace client, back-office de gestion, plateforme SaaS, portail partenaires. Toujours en partant de vos processus réels, pas d'un modèle générique.\n\n## Ce qui est inclus\n\n- Ateliers de cadrage et spécifications fonctionnelles écrites\n- Authentification, rôles et permissions fines\n- Base de données conçue pour durer, migrations versionnées\n- API documentée, tests automatisés sur les parcours critiques\n- Déploiement continu et supervision des erreurs en production",
      "## Tools that replace your spreadsheets\n\nWe build custom business applications: client portals, management back offices, SaaS platforms, partner portals. Always starting from your real processes, never a generic template.\n\n## What's included\n\n- Scoping workshops and written functional specifications\n- Authentication, roles and fine-grained permissions\n- A database designed to last, with versioned migrations\n- Documented API, automated tests on critical journeys\n- Continuous deployment and production error monitoring",
      "## Herramientas que sustituyen a tus hojas de cálculo\n\nDesarrollamos aplicaciones de negocio a medida: área de cliente, back office de gestión, plataforma SaaS, portal de socios. Siempre partiendo de tus procesos reales, nunca de una plantilla genérica.\n\n## Qué incluye\n\n- Talleres de encuadre y especificaciones funcionales por escrito\n- Autenticación, roles y permisos detallados\n- Base de datos diseñada para durar, con migraciones versionadas\n- API documentada y tests automatizados en los recorridos críticos\n- Despliegue continuo y supervisión de errores en producción",
    ),
  },
  {
    key: "applications-mobiles",
    icon: "Smartphone",
    stack: ["React Native", "iOS", "Android"],
    slug: t("applications-mobiles", "mobile-applications", "aplicaciones-moviles"),
    title: t("Applications mobiles", "Mobile applications", "Aplicaciones móviles"),
    summary: t(
      "Apps iOS et Android, une seule base de code. Notifications, mode hors-ligne, et publication sur les deux stores gérée par nous.",
      "iOS and Android apps from a single codebase. Notifications, offline mode, and both store submissions handled by us.",
      "Apps iOS y Android con una sola base de código. Notificaciones, modo sin conexión y publicación en ambas tiendas gestionada por nosotros.",
    ),
    body: t(
      "## Une app, deux plateformes\n\nNous développons en React Native : une seule base de code pour iOS et Android, donc un budget et un délai divisés par rapport à deux développements natifs — sans sacrifier la fluidité.\n\n## Ce qui est inclus\n\n- Design des écrans aux normes iOS et Android\n- Notifications push, mode hors-ligne et synchronisation\n- Connexion à votre API existante, ou développement de celle-ci\n- Publication sur l'App Store et Google Play, comptes inclus\n- Suivi des plantages et des mises à jour après le lancement",
      "## One app, two platforms\n\nWe build in React Native: a single codebase for iOS and Android, which halves the budget and timeline compared with two native builds — without sacrificing smoothness.\n\n## What's included\n\n- Screen design following iOS and Android conventions\n- Push notifications, offline mode and synchronisation\n- Connection to your existing API, or we build it\n- App Store and Google Play submission, accounts included\n- Crash monitoring and update management after launch",
      "## Una app, dos plataformas\n\nDesarrollamos en React Native: una sola base de código para iOS y Android, lo que reduce a la mitad el presupuesto y el plazo frente a dos desarrollos nativos — sin sacrificar la fluidez.\n\n## Qué incluye\n\n- Diseño de pantallas según las normas de iOS y Android\n- Notificaciones push, modo sin conexión y sincronización\n- Conexión con tu API existente, o desarrollo de la misma\n- Publicación en App Store y Google Play, cuentas incluidas\n- Seguimiento de fallos y actualizaciones tras el lanzamiento",
    ),
  },
  {
    key: "design-ux-ui",
    icon: "PenTool",
    stack: ["Figma", "Design system", "Prototypage"],
    slug: t("design-ux-ui", "ux-ui-design", "diseno-ux-ui"),
    title: t("Design UX / UI", "UX / UI design", "Diseño UX / UI"),
    summary: t(
      "Parcours, maquettes et design system sur Figma. Prototypes cliquables validés avant la première ligne de code.",
      "User journeys, mockups and design systems in Figma. Clickable prototypes signed off before the first line of code.",
      "Recorridos, maquetas y design system en Figma. Prototipos navegables validados antes de la primera línea de código.",
    ),
    body: t(
      "## Décider avant de développer\n\nUn écran modifié dans Figma coûte quelques minutes ; le même changement après développement coûte des jours. Nous validons donc l'intégralité des parcours en maquette, avec un prototype cliquable que vous pouvez tester et faire tester.\n\n## Ce qui est inclus\n\n- Audit de l'existant et parcours utilisateurs\n- Maquettes desktop et mobile de chaque écran\n- Prototype interactif partageable par simple lien\n- Design system réutilisable : composants, couleurs, typographies\n- Fichiers Figma livrés, vous en restez propriétaire",
      "## Decide before you build\n\nChanging a screen in Figma takes minutes; the same change after development takes days. So we validate every journey at mockup stage, with a clickable prototype you can test and share for testing.\n\n## What's included\n\n- Audit of the existing product and user journeys\n- Desktop and mobile mockups of every screen\n- Interactive prototype shareable via a single link\n- A reusable design system: components, colours, typography\n- Figma files handed over — you own them",
      "## Decidir antes de desarrollar\n\nCambiar una pantalla en Figma cuesta minutos; el mismo cambio tras el desarrollo cuesta días. Por eso validamos todos los recorridos en maqueta, con un prototipo navegable que puedes probar y hacer probar.\n\n## Qué incluye\n\n- Auditoría de lo existente y recorridos de usuario\n- Maquetas de escritorio y móvil de cada pantalla\n- Prototipo interactivo compartible con un simple enlace\n- Design system reutilizable: componentes, colores, tipografías\n- Archivos de Figma entregados, la propiedad es tuya",
    ),
  },
  {
    key: "maintenance-performance",
    icon: "Gauge",
    stack: ["Hébergement", "Monitoring", "Core Web Vitals"],
    slug: t("maintenance-performance", "maintenance-performance", "mantenimiento-rendimiento"),
    title: t(
      "Maintenance & performance",
      "Maintenance & performance",
      "Mantenimiento y rendimiento",
    ),
    summary: t(
      "Hébergement, mises à jour, sauvegardes, supervision et optimisation continue de la vitesse. Avec un délai de réponse garanti.",
      "Hosting, updates, backups, monitoring and continuous speed optimisation. With a guaranteed response time.",
      "Alojamiento, actualizaciones, copias de seguridad, supervisión y optimización continua de la velocidad. Con tiempo de respuesta garantizado.",
    ),
    body: t(
      "## Un site vivant, pas un site livré puis oublié\n\nUn site non maintenu perd en vitesse, accumule des failles et finit par casser à la première mise à jour. Notre contrat de maintenance couvre l'hébergement, la supervision et l'amélioration continue.\n\n## Ce qui est inclus\n\n- Hébergement sur infrastructure mondiale, certificat SSL inclus\n- Mises à jour de sécurité appliquées et testées chaque mois\n- Sauvegardes quotidiennes, restauration en moins d'une heure\n- Alerte immédiate en cas d'indisponibilité, 24h/24\n- Rapport mensuel : vitesse, erreurs, Core Web Vitals\n- Réponse garantie sous 4 heures ouvrées en cas d'incident bloquant",
      "## A living site, not one shipped and forgotten\n\nAn unmaintained site loses speed, accumulates vulnerabilities and eventually breaks at the first update. Our maintenance contract covers hosting, monitoring and continuous improvement.\n\n## What's included\n\n- Hosting on global infrastructure, SSL certificate included\n- Security updates applied and tested every month\n- Daily backups, restored in under an hour\n- Immediate downtime alerting, around the clock\n- Monthly report: speed, errors, Core Web Vitals\n- Guaranteed 4-working-hour response on blocking incidents",
      "## Una web viva, no una web entregada y olvidada\n\nUna web sin mantenimiento pierde velocidad, acumula vulnerabilidades y acaba rompiéndose en la primera actualización. Nuestro contrato de mantenimiento cubre alojamiento, supervisión y mejora continua.\n\n## Qué incluye\n\n- Alojamiento en infraestructura global, certificado SSL incluido\n- Actualizaciones de seguridad aplicadas y probadas cada mes\n- Copias de seguridad diarias, restauración en menos de una hora\n- Alerta inmediata en caso de caída, 24 horas al día\n- Informe mensual: velocidad, errores, Core Web Vitals\n- Respuesta garantizada en 4 horas laborables ante incidentes bloqueantes",
    ),
  },
];

const projects = [
  {
    key: "thalassa-resorts",
    kind: ProjectKind.WEBSITE,
    client: "Thalassa Resorts",
    year: 2026,
    liveUrl: "https://thalassa-resorts.com",
    stack: ["Next.js", "Sanity", "Vercel"],
    accent: "g1",
    featured: true,
    serviceKeys: ["sites-vitrines", "design-ux-ui"],
    metrics: [
      { value: "98", label: t("Score Lighthouse", "Lighthouse score", "Puntuación Lighthouse") },
      { value: "+214%", label: t("Réservations directes", "Direct bookings", "Reservas directas") },
    ],
    slug: t("thalassa-resorts", "thalassa-resorts", "thalassa-resorts"),
    title: t("Thalassa Resorts", "Thalassa Resorts", "Thalassa Resorts"),
    category: t(
      "Site vitrine · Hôtellerie",
      "Marketing site · Hospitality",
      "Web corporativa · Hotelería",
    ),
    summary: t(
      "Refonte complète du site de quatre hôtels, en trois langues, avec réservation directe.",
      "Full rebuild of a four-hotel website, in three languages, with direct booking.",
      "Rediseño completo de la web de cuatro hoteles, en tres idiomas, con reserva directa.",
    ),
    challenge: t(
      "Le groupe dépendait des plateformes de réservation, qui prélevaient jusqu'à 22 % de commission. Son site existant ne se modifiait qu'en passant par un prestataire, et les versions anglaise et espagnole n'étaient jamais à jour.",
      "The group depended on booking platforms taking up to 22% commission. Its existing site could only be edited through a supplier, and the English and Spanish versions were never up to date.",
      "El grupo dependía de las plataformas de reserva, que se llevaban hasta un 22 % de comisión. Su web solo podía modificarse a través de un proveedor, y las versiones inglesa y española nunca estaban actualizadas.",
    ),
    solution: t(
      "Nous avons reconstruit le site en Next.js avec un back-office où les équipes publient elles-mêmes chambres, offres et actualités dans les trois langues. Le moteur de réservation est intégré à la page plutôt que renvoyé vers un site tiers.",
      "We rebuilt the site in Next.js with a back office where the teams publish rooms, offers and news themselves in all three languages. The booking engine is embedded in the page rather than redirecting to a third-party site.",
      "Reconstruimos la web en Next.js con un panel donde los equipos publican ellos mismos habitaciones, ofertas y novedades en los tres idiomas. El motor de reservas está integrado en la página en lugar de redirigir a un sitio externo.",
    ),
    outcome: t(
      "Les réservations directes ont plus que triplé en huit mois, et la part des plateformes est passée de 71 % à 38 % du chiffre d'affaires.",
      "Direct bookings more than tripled in eight months, and the platforms' share fell from 71% to 38% of revenue.",
      "Las reservas directas se han más que triplicado en ocho meses, y la cuota de las plataformas ha pasado del 71 % al 38 % de la facturación.",
    ),
  },
  {
    key: "kyma-fitness",
    kind: ProjectKind.MOBILE,
    client: "Kyma Fitness",
    year: 2026,
    liveUrl: null,
    stack: ["React Native", "Expo", "Node.js"],
    accent: "g2",
    featured: true,
    serviceKeys: ["applications-mobiles", "design-ux-ui"],
    metrics: [
      { value: "4.8", label: t("Note App Store", "App Store rating", "Valoración App Store") },
      { value: "32k", label: t("Téléchargements", "Downloads", "Descargas") },
    ],
    slug: t("kyma-fitness", "kyma-fitness", "kyma-fitness"),
    title: t("Kyma Fitness", "Kyma Fitness", "Kyma Fitness"),
    category: t(
      "Application mobile · Sport",
      "Mobile app · Fitness",
      "App móvil · Fitness",
    ),
    summary: t(
      "Application iOS et Android de réservation de cours et de suivi d'entraînement.",
      "iOS and Android app for class booking and training tracking.",
      "Aplicación iOS y Android de reserva de clases y seguimiento de entrenamiento.",
    ),
    challenge: t(
      "Un réseau de douze salles gérait ses réservations par téléphone et par messages. Les créneaux se chevauchaient, et les absences non annulées représentaient un manque à gagner important.",
      "A twelve-studio network managed bookings by phone and text. Slots overlapped, and unannounced no-shows represented a significant loss of revenue.",
      "Una red de doce centros gestionaba sus reservas por teléfono y mensajes. Los horarios se solapaban y las ausencias sin avisar suponían una pérdida importante.",
    ),
    solution: t(
      "Une application unique pour les douze salles : réservation en temps réel, liste d'attente automatique, rappel la veille et suivi des séances. Le mode hors-ligne permet de consulter son planning sans réseau en salle.",
      "A single app for all twelve studios: real-time booking, automatic waiting list, day-before reminder and session tracking. Offline mode lets members check their schedule with no signal inside the gym.",
      "Una única aplicación para los doce centros: reserva en tiempo real, lista de espera automática, recordatorio el día antes y seguimiento de las sesiones. El modo sin conexión permite consultar el horario sin cobertura dentro del gimnasio.",
    ),
    outcome: t(
      "Les absences non annulées ont chuté de 61 %, et 78 % des réservations se font désormais dans l'application.",
      "No-shows dropped by 61%, and 78% of bookings now go through the app.",
      "Las ausencias sin avisar han caído un 61 %, y el 78 % de las reservas se hacen ya en la aplicación.",
    ),
  },
  {
    key: "helia-cosmetics",
    kind: ProjectKind.ECOMMERCE,
    client: "Helia Cosmetics",
    year: 2025,
    liveUrl: "https://helia-cosmetics.com",
    stack: ["Shopify", "Stripe", "Hydrogen"],
    accent: "g3",
    featured: true,
    serviceKeys: ["e-commerce"],
    metrics: [
      { value: "+64%", label: t("Taux de conversion", "Conversion rate", "Tasa de conversión") },
      { value: "1,2s", label: t("Temps de chargement", "Load time", "Tiempo de carga") },
    ],
    slug: t("helia-cosmetics", "helia-cosmetics", "helia-cosmetics"),
    title: t("Helia Cosmetics", "Helia Cosmetics", "Helia Cosmetics"),
    category: t(
      "E-commerce · Cosmétique",
      "E-commerce · Beauty",
      "E-commerce · Cosmética",
    ),
    summary: t(
      "Boutique Shopify sur mesure pour une marque de soins solaires, vendue dans huit pays.",
      "Custom Shopify store for a sun care brand selling across eight countries.",
      "Tienda Shopify a medida para una marca de protección solar que vende en ocho países.",
    ),
    challenge: t(
      "Le thème Shopify d'origine mettait près de six secondes à s'afficher sur mobile. Plus de la moitié des visiteurs partaient avant même de voir un produit.",
      "The original Shopify theme took nearly six seconds to display on mobile. More than half of visitors left before even seeing a product.",
      "El tema Shopify original tardaba casi seis segundos en mostrarse en móvil. Más de la mitad de los visitantes se iban antes incluso de ver un producto.",
    ),
    solution: t(
      "Nous avons remplacé le thème par une vitrine développée sur mesure, allégée de dix-sept scripts tiers inutiles, avec des images servies au bon format et un tunnel ramené de cinq à deux étapes.",
      "We replaced the theme with a custom-built storefront, stripped of seventeen unnecessary third-party scripts, with correctly sized images and a checkout cut from five steps to two.",
      "Sustituimos el tema por un escaparate desarrollado a medida, sin diecisiete scripts de terceros innecesarios, con imágenes servidas en el formato correcto y un embudo reducido de cinco a dos pasos.",
    ),
    outcome: t(
      "Le temps de chargement est passé de 5,8 à 1,2 seconde, et le taux de conversion a progressé de 64 % à trafic constant.",
      "Load time went from 5.8 to 1.2 seconds, and conversion rate rose 64% at constant traffic.",
      "El tiempo de carga pasó de 5,8 a 1,2 segundos, y la tasa de conversión subió un 64 % con el mismo tráfico.",
    ),
  },
  {
    key: "delphi-capital",
    kind: ProjectKind.WEBAPP,
    client: "Delphi Capital",
    year: 2025,
    liveUrl: null,
    stack: ["React", "Node.js", "PostgreSQL"],
    accent: "g4",
    featured: true,
    serviceKeys: ["applications-web", "design-ux-ui"],
    metrics: [
      { value: "2k", label: t("Utilisateurs par jour", "Daily users", "Usuarios al día") },
      { value: "-73%", label: t("Appels au support", "Support calls", "Llamadas a soporte") },
    ],
    slug: t("delphi-capital", "delphi-capital", "delphi-capital"),
    title: t(
      "Delphi Capital — Espace client",
      "Delphi Capital — Client portal",
      "Delphi Capital — Área de cliente",
    ),
    category: t(
      "Application web · Finance",
      "Web app · Finance",
      "Aplicación web · Finanzas",
    ),
    summary: t(
      "Portail sécurisé où deux mille investisseurs suivent leurs positions et signent leurs documents.",
      "Secure portal where two thousand investors track their positions and sign documents.",
      "Portal seguro donde dos mil inversores siguen sus posiciones y firman sus documentos.",
    ),
    challenge: t(
      "Les relevés partaient par email en pièce jointe, et chaque demande de document passait par le service client. Trois personnes y consacraient l'essentiel de leurs journées.",
      "Statements went out as email attachments, and every document request went through customer service. Three people spent most of their day on it.",
      "Los extractos se enviaban por email como adjunto, y cada solicitud de documento pasaba por atención al cliente. Tres personas dedicaban a ello casi toda su jornada.",
    ),
    solution: t(
      "Un portail avec authentification à deux facteurs, tableau de bord des positions mis à jour quotidiennement, historique complet des documents et signature électronique intégrée.",
      "A portal with two-factor authentication, a position dashboard updated daily, a complete document history and built-in electronic signature.",
      "Un portal con autenticación de dos factores, cuadro de mando de posiciones actualizado a diario, histórico completo de documentos y firma electrónica integrada.",
    ),
    outcome: t(
      "Les appels au support ont baissé de 73 %, et la signature des documents réglementaires est passée de onze jours à deux en moyenne.",
      "Support calls fell 73%, and signing regulatory documents went from eleven days to two on average.",
      "Las llamadas a soporte bajaron un 73 %, y la firma de los documentos regulatorios pasó de once días a dos de media.",
    ),
  },
];

const posts = [
  {
    key: "cout-site-vitrine-2026",
    category: "engineering",
    publishedAt: new Date("2026-09-12T09:00:00Z"),
    categoryLabel: t("Technique", "Engineering", "Técnica"),
    slug: t(
      "combien-coute-un-site-vitrine-en-2026",
      "what-a-marketing-website-really-costs-in-2026",
      "cuanto-cuesta-una-web-corporativa-en-2026",
    ),
    title: t(
      "Combien coûte vraiment un site vitrine en 2026",
      "What a marketing website really costs in 2026",
      "Cuánto cuesta realmente una web corporativa en 2026",
    ),
    excerpt: t(
      "Le détail poste par poste, et pourquoi un devis à 1 500 € vous coûtera plus cher à la fin.",
      "The breakdown line by line, and why a €1,500 quote ends up costing you more.",
      "El detalle partida por partida, y por qué un presupuesto de 1.500 € te saldrá más caro al final.",
    ),
    body: t(
      "## Le prix affiché n'est pas le prix payé\n\nUn devis de site vitrine varie de 1 500 € à 50 000 € pour ce qui ressemble, sur le papier, au même livrable. L'écart ne tient pas à la marge de l'agence : il tient à ce qui est réellement inclus, et surtout à ce qui ne l'est pas.\n\n## Les postes qui composent un devis honnête\n\n**Le cadrage (10 à 15 %).** Arborescence, contenus, fonctionnalités. Sauté, il se repaie en allers-retours pendant le développement.\n\n**Le design (25 à 30 %).** Maquettes de chaque écran, en desktop et en mobile. Un prestataire qui développe directement sans maquette vous fera valider en production, c'est-à-dire au moment où changer coûte le plus cher.\n\n**Le développement (35 à 45 %).** La part visible. Elle dépend surtout du nombre de gabarits de page différents, pas du nombre de pages.\n\n**Le back-office (10 à 15 %).** C'est le poste que les devis les moins chers suppriment en premier. Sans lui, chaque modification de texte repasse par le prestataire — facturée.\n\n**La mise en ligne et la reprise (5 à 10 %).** Redirections des anciennes URLs, vérifications, formation. Oubliée, elle coûte le positionnement SEO acquis en plusieurs années.\n\n## Pourquoi un devis à 1 500 € coûte plus cher\n\nÀ ce tarif, le prestataire installe un thème existant et remplace les textes. Le site ressemble à des milliers d'autres, il est lent parce que le thème embarque des fonctions inutilisées, et vous ne pouvez rien modifier seul. Au bout de dix-huit mois, il faut tout refaire. Le vrai coût n'est pas 1 500 € : c'est 1 500 € plus la refonte.\n\n## Les fourchettes réalistes\n\n- **8 000 à 15 000 €** : site de cinq à dix pages, une langue, back-office simple\n- **15 000 à 30 000 €** : quinze à trente pages, trois langues, back-office complet\n- **30 000 € et plus** : fonctionnalités spécifiques, espace client, connexions à vos outils\n\nDemandez toujours le détail poste par poste. Un prestataire qui refuse de le fournir vous dit quelque chose d'important.",
      "## The quoted price is not the price paid\n\nA website quote ranges from €1,500 to €50,000 for what looks, on paper, like the same deliverable. The gap isn't the agency's margin: it's what is actually included, and above all what isn't.\n\n## What makes up an honest quote\n\n**Scoping (10–15%).** Structure, content, features. Skip it and you pay for it in back-and-forth during development.\n\n**Design (25–30%).** Mockups of every screen, desktop and mobile. A supplier who builds straight away with no mockups will have you sign off in production — exactly when changes cost the most.\n\n**Development (35–45%).** The visible part. It depends mostly on the number of distinct page templates, not the number of pages.\n\n**The back office (10–15%).** This is the line the cheapest quotes cut first. Without it, every text change goes back through the supplier — and gets invoiced.\n\n**Launch and migration (5–10%).** Redirecting old URLs, checks, training. Forget it and it costs you the SEO position you built over years.\n\n## Why a €1,500 quote costs more\n\nAt that price, the supplier installs an existing theme and swaps the text. The site looks like thousands of others, it is slow because the theme ships unused features, and you can't change anything yourself. Eighteen months later it all has to be redone. The real cost isn't €1,500: it's €1,500 plus the rebuild.\n\n## Realistic ranges\n\n- **€8,000–15,000**: five to ten pages, one language, simple back office\n- **€15,000–30,000**: fifteen to thirty pages, three languages, full back office\n- **€30,000+**: specific features, client portal, connections to your tools\n\nAlways ask for the itemised breakdown. A supplier who refuses to provide one is telling you something important.",
      "## El precio indicado no es el precio pagado\n\nUn presupuesto de web corporativa va de 1.500 € a 50.000 € por lo que parece, sobre el papel, el mismo entregable. La diferencia no está en el margen de la agencia: está en lo que realmente se incluye y, sobre todo, en lo que no.\n\n## Las partidas de un presupuesto honesto\n\n**El encuadre (10–15 %).** Arquitectura, contenidos, funcionalidades. Si se salta, se paga después en idas y venidas durante el desarrollo.\n\n**El diseño (25–30 %).** Maquetas de cada pantalla, en escritorio y móvil. Un proveedor que desarrolla directamente sin maquetar te hará validar en producción, justo cuando cambiar cuesta más caro.\n\n**El desarrollo (35–45 %).** La parte visible. Depende sobre todo del número de plantillas distintas, no del número de páginas.\n\n**El panel de administración (10–15 %).** Es la partida que los presupuestos más baratos eliminan primero. Sin él, cada cambio de texto vuelve a pasar por el proveedor — y se factura.\n\n**La publicación y la migración (5–10 %).** Redirecciones de las URLs antiguas, comprobaciones, formación. Si se olvida, cuesta el posicionamiento SEO ganado durante años.\n\n## Por qué un presupuesto de 1.500 € sale más caro\n\nA ese precio, el proveedor instala un tema existente y cambia los textos. La web se parece a otras miles, es lenta porque el tema incluye funciones que no usas y no puedes modificar nada tú mismo. A los dieciocho meses hay que rehacerlo todo. El coste real no es 1.500 €: es 1.500 € más el rediseño.\n\n## Horquillas realistas\n\n- **8.000–15.000 €**: web de cinco a diez páginas, un idioma, panel sencillo\n- **15.000–30.000 €**: de quince a treinta páginas, tres idiomas, panel completo\n- **Más de 30.000 €**: funcionalidades específicas, área de cliente, conexiones con tus herramientas\n\nPide siempre el detalle partida por partida. Un proveedor que se niega a darlo te está diciendo algo importante.",
    ),
  },
  {
    key: "regles-lighthouse-98",
    category: "performance",
    publishedAt: new Date("2026-08-28T09:00:00Z"),
    categoryLabel: t("Performance", "Performance", "Rendimiento"),
    slug: t(
      "nos-regles-pour-tenir-98-de-lighthouse",
      "our-rules-for-holding-a-98-lighthouse-score",
      "nuestras-reglas-para-mantener-un-98-de-lighthouse",
    ),
    title: t(
      "Nos règles pour tenir 98 de Lighthouse en production",
      "Our rules for holding a 98 Lighthouse score in production",
      "Nuestras reglas para mantener un 98 de Lighthouse en producción",
    ),
    excerpt: t(
      "Images, polices, scripts tiers : les six décisions qui font tout le score.",
      "Images, fonts, third-party scripts: the six decisions that make the whole score.",
      "Imágenes, tipografías y scripts de terceros: las seis decisiones que determinan toda la puntuación.",
    ),
    body: t(
      "## Un score de laboratoire ne vaut rien seul\n\nObtenir 100 sur une page vide est facile. Tenir 98 en production, avec des images, un formulaire et un outil de mesure d'audience, demande six décisions prises au bon moment : à la conception, pas après.\n\n## 1. Une seule famille de polices, deux graisses\n\nChaque graisse supplémentaire est un fichier à télécharger avant l'affichage du texte. Nous chargeons les polices en local via le framework, jamais depuis un serveur tiers, et toujours avec un repli système immédiat.\n\n## 2. Des images au bon format et à la bonne taille\n\nUne photo de 4 000 pixels de large affichée dans un bloc de 600 pixels, c'est 90 % de données inutiles. Format AVIF, dimensions explicites pour éviter les sauts de mise en page, et chargement différé pour tout ce qui est sous la ligne de flottaison.\n\n## 3. Zéro script tiers sur le chemin critique\n\nLes outils d'analyse, les chats et les bannières se chargent après le contenu, jamais avant. Un script tiers bloquant peut à lui seul coûter trente points.\n\n## 4. Des dimensions réservées pour tout\n\nLe décalage de mise en page pénalise lourdement le score, et agace réellement les visiteurs. Chaque image, chaque encart publicitaire, chaque bloc chargé tardivement a sa place réservée dès le premier rendu.\n\n## 5. Du HTML envoyé, pas calculé côté navigateur\n\nUne page générée côté serveur s'affiche dès la première réponse. Le JavaScript ne sert qu'à ce qui est réellement interactif : un menu, un formulaire, un carrousel.\n\n## 6. Mesurer sur du vrai trafic, pas sur son portable\n\nNous suivons les Core Web Vitals des visiteurs réels, sur leurs vrais appareils et leurs vrais réseaux. C'est le seul chiffre que Google utilise pour le classement.\n\n## Le vrai test\n\nUn an après la mise en ligne, le site doit toujours être au vert. C'est pour cela que nous mesurons chaque mois, et que nous le mettons dans le contrat de maintenance.",
      "## A lab score alone is worthless\n\nGetting 100 on an empty page is easy. Holding 98 in production, with images, a form and an analytics tool, takes six decisions made at the right time: at design stage, not after.\n\n## 1. One font family, two weights\n\nEvery extra weight is a file to download before text appears. We load fonts locally through the framework, never from a third-party server, and always with an immediate system fallback.\n\n## 2. Images at the right format and the right size\n\nA 4,000-pixel-wide photo displayed in a 600-pixel block is 90% wasted data. AVIF format, explicit dimensions to prevent layout shift, and lazy loading for everything below the fold.\n\n## 3. Zero third-party scripts on the critical path\n\nAnalytics, chat widgets and banners load after the content, never before. A single blocking third-party script can cost thirty points on its own.\n\n## 4. Reserved dimensions for everything\n\nLayout shift is heavily penalised, and genuinely irritates visitors. Every image, every ad slot, every late-loading block has its space reserved from the first render.\n\n## 5. HTML sent, not computed in the browser\n\nA server-rendered page displays on the first response. JavaScript is only used for what is genuinely interactive: a menu, a form, a carousel.\n\n## 6. Measure on real traffic, not on your own phone\n\nWe track Core Web Vitals from real visitors, on their actual devices and networks. That is the only figure Google uses for ranking.\n\n## The real test\n\nA year after launch, the site should still be in the green. That is why we measure monthly, and why it's in the maintenance contract.",
      "## Una puntuación de laboratorio no vale nada por sí sola\n\nSacar un 100 en una página vacía es fácil. Mantener un 98 en producción, con imágenes, un formulario y una herramienta de analítica, exige seis decisiones tomadas en el momento adecuado: en el diseño, no después.\n\n## 1. Una sola familia tipográfica, dos pesos\n\nCada peso adicional es un archivo que descargar antes de mostrar el texto. Cargamos las tipografías en local a través del framework, nunca desde un servidor externo, y siempre con un respaldo del sistema inmediato.\n\n## 2. Imágenes en el formato y el tamaño correctos\n\nUna foto de 4.000 píxeles de ancho mostrada en un bloque de 600 píxeles son un 90 % de datos inútiles. Formato AVIF, dimensiones explícitas para evitar saltos de maquetación y carga diferida para todo lo que está bajo la línea de flotación.\n\n## 3. Cero scripts de terceros en la ruta crítica\n\nLas herramientas de analítica, los chats y los banners se cargan después del contenido, nunca antes. Un solo script de terceros bloqueante puede costar treinta puntos.\n\n## 4. Dimensiones reservadas para todo\n\nEl desplazamiento de maquetación penaliza mucho la puntuación y molesta de verdad a los visitantes. Cada imagen, cada hueco publicitario y cada bloque de carga tardía tiene su espacio reservado desde el primer renderizado.\n\n## 5. HTML enviado, no calculado en el navegador\n\nUna página generada en servidor se muestra en la primera respuesta. El JavaScript solo sirve para lo que es realmente interactivo: un menú, un formulario, un carrusel.\n\n## 6. Medir con tráfico real, no con tu propio móvil\n\nSeguimos los Core Web Vitals de visitantes reales, en sus dispositivos y redes reales. Es la única cifra que Google usa para el posicionamiento.\n\n## La prueba de verdad\n\nUn año después de la publicación, la web debe seguir en verde. Por eso medimos cada mes y por eso lo incluimos en el contrato de mantenimiento.",
    ),
  },
  {
    key: "app-ou-site-mobile",
    category: "mobile",
    publishedAt: new Date("2026-07-05T09:00:00Z"),
    categoryLabel: t("Mobile", "Mobile", "Móvil"),
    slug: t(
      "application-mobile-ou-site-mobile",
      "mobile-app-or-mobile-site",
      "app-movil-o-web-movil",
    ),
    title: t(
      "App mobile ou site mobile : comment trancher",
      "Mobile app or mobile site: how to decide",
      "App móvil o web móvil: cómo decidir",
    ),
    excerpt: t(
      "Les quatre questions à se poser avant d'engager un budget d'application.",
      "The four questions to answer before committing an app budget.",
      "Las cuatro preguntas que responder antes de comprometer un presupuesto de app.",
    ),
    body: t(
      "## La mauvaise raison de faire une app\n\n« Nos concurrents en ont une » est la raison la plus fréquente, et la plus coûteuse. Une application demande un budget initial, mais surtout un budget d'entretien permanent : deux systèmes qui évoluent deux fois par an, deux stores à satisfaire, et des utilisateurs qui doivent accepter de mettre à jour.\n\n## Question 1 : vos utilisateurs reviennent-ils chaque semaine ?\n\nUne application se justifie par la fréquence. Une banque, une salle de sport, un service de livraison : oui. Un site de présentation consulté une fois avant d'appeler : non. En dessous d'une visite hebdomadaire, l'icône finit supprimée.\n\n## Question 2 : avez-vous besoin du matériel du téléphone ?\n\nAppareil photo en continu, Bluetooth, géolocalisation en arrière-plan, lecture de capteurs, fonctionnement sans réseau. Si la réponse est non, le navigateur mobile fait aujourd'hui presque tout le reste.\n\n## Question 3 : les notifications sont-elles centrales à votre service ?\n\nLes notifications push restent l'argument le plus solide. Mais attention : une notification non souhaitée est la première cause de désinstallation.\n\n## Question 4 : pouvez-vous entretenir l'app pendant trois ans ?\n\nUne application abandonnée est pire que pas d'application : elle finit par être retirée des stores, et les avis négatifs restent. Comptez entre 15 et 20 % du coût initial par an pour la maintenir en vie.\n\n## Notre recommandation par défaut\n\nCommencez par un site mobile excellent. S'il est rapide et bien conçu, il couvre 80 % des cas. Lancez l'application quand vous pouvez prouver, avec vos chiffres, que vos utilisateurs reviennent assez souvent pour la garder.",
      "## The wrong reason to build an app\n\n“Our competitors have one” is the most common reason, and the most expensive. An app takes an upfront budget, but above all a permanent upkeep budget: two operating systems updating twice a year, two stores to satisfy, and users who have to agree to update.\n\n## Question 1: do your users come back weekly?\n\nAn app is justified by frequency. A bank, a gym, a delivery service: yes. A brochure site visited once before calling: no. Below one visit a week, the icon ends up deleted.\n\n## Question 2: do you need the phone's hardware?\n\nContinuous camera use, Bluetooth, background location, sensor readings, working with no network. If the answer is no, the mobile browser now handles almost everything else.\n\n## Question 3: are notifications central to your service?\n\nPush notifications remain the strongest argument. But beware: an unwanted notification is the number-one cause of uninstalls.\n\n## Question 4: can you maintain the app for three years?\n\nAn abandoned app is worse than no app: it eventually gets pulled from the stores, and the negative reviews stay. Budget 15–20% of the initial cost per year to keep it alive.\n\n## Our default recommendation\n\nStart with an excellent mobile site. If it's fast and well designed, it covers 80% of cases. Launch the app when you can prove, with your own numbers, that your users come back often enough to keep it.",
      "## La mala razón para hacer una app\n\n«Nuestros competidores tienen una» es la razón más frecuente y la más cara. Una aplicación exige un presupuesto inicial, pero sobre todo un presupuesto de mantenimiento permanente: dos sistemas que evolucionan dos veces al año, dos tiendas que satisfacer y usuarios que deben aceptar actualizar.\n\n## Pregunta 1: ¿tus usuarios vuelven cada semana?\n\nUna aplicación se justifica por la frecuencia. Un banco, un gimnasio, un servicio de entrega: sí. Una web de presentación que se consulta una vez antes de llamar: no. Por debajo de una visita semanal, el icono acaba borrado.\n\n## Pregunta 2: ¿necesitas el hardware del teléfono?\n\nCámara en continuo, Bluetooth, geolocalización en segundo plano, lectura de sensores, funcionamiento sin red. Si la respuesta es no, el navegador móvil hace hoy casi todo lo demás.\n\n## Pregunta 3: ¿las notificaciones son centrales en tu servicio?\n\nLas notificaciones push siguen siendo el argumento más sólido. Pero cuidado: una notificación no deseada es la primera causa de desinstalación.\n\n## Pregunta 4: ¿puedes mantener la app durante tres años?\n\nUna aplicación abandonada es peor que no tener aplicación: acaba retirada de las tiendas y las reseñas negativas se quedan. Calcula entre un 15 y un 20 % del coste inicial al año para mantenerla viva.\n\n## Nuestra recomendación por defecto\n\nEmpieza por una web móvil excelente. Si es rápida y está bien diseñada, cubre el 80 % de los casos. Lanza la aplicación cuando puedas demostrar, con tus cifras, que tus usuarios vuelven con suficiente frecuencia como para conservarla.",
    ),
  },
];

// --------------------------------------------------------------------- seed

async function main() {
  console.log("→ Seed Kalimera");

  // ----- compte administrateur
  const email = (process.env.SEED_ADMIN_EMAIL ?? "hello@kalimera.agency").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password) {
    console.warn(
      "  ! SEED_ADMIN_PASSWORD absent : le compte administrateur n'est pas créé.",
    );
  } else {
    const passwordHash = await hash(password, 12);
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash, name: process.env.SEED_ADMIN_NAME ?? "Kalimera" },
      create: {
        email,
        name: process.env.SEED_ADMIN_NAME ?? "Kalimera",
        passwordHash,
        role: "ADMIN",
      },
    });
    console.log(`  ✓ administrateur : ${email}`);
  }

  // ----- services
  for (const [index, service] of services.entries()) {
    const record = await prisma.service.upsert({
      where: { key: service.key },
      update: {
        icon: service.icon,
        stack: [...service.stack],
        position: index,
        published: true,
      },
      create: {
        key: service.key,
        icon: service.icon,
        stack: [...service.stack],
        position: index,
        published: true,
      },
    });

    for (const locale of [Locale.FR, Locale.EN, Locale.ES]) {
      const key = locale.toLowerCase() as "fr" | "en" | "es";
      await prisma.serviceTranslation.upsert({
        where: { serviceId_locale: { serviceId: record.id, locale } },
        update: {
          slug: service.slug[key],
          title: service.title[key],
          summary: service.summary[key],
          body: service.body[key],
        },
        create: {
          serviceId: record.id,
          locale,
          slug: service.slug[key],
          title: service.title[key],
          summary: service.summary[key],
          body: service.body[key],
        },
      });
    }
  }
  console.log(`  ✓ ${services.length} services`);

  // ----- projets
  for (const [index, project] of projects.entries()) {
    const serviceIds = await prisma.service.findMany({
      where: { key: { in: project.serviceKeys } },
      select: { id: true },
    });

    const record = await prisma.project.upsert({
      where: { key: project.key },
      update: {
        kind: project.kind,
        client: project.client,
        year: project.year,
        liveUrl: project.liveUrl,
        stack: [...project.stack],
        accent: project.accent,
        featured: project.featured,
        position: index,
        published: true,
        services: { set: serviceIds.map((s) => ({ id: s.id })) },
      },
      create: {
        key: project.key,
        kind: project.kind,
        client: project.client,
        year: project.year,
        liveUrl: project.liveUrl,
        stack: [...project.stack],
        accent: project.accent,
        featured: project.featured,
        position: index,
        published: true,
        services: { connect: serviceIds.map((s) => ({ id: s.id })) },
      },
    });

    for (const locale of [Locale.FR, Locale.EN, Locale.ES]) {
      const key = locale.toLowerCase() as "fr" | "en" | "es";
      await prisma.projectTranslation.upsert({
        where: { projectId_locale: { projectId: record.id, locale } },
        update: {
          slug: project.slug[key],
          title: project.title[key],
          category: project.category[key],
          summary: project.summary[key],
          challenge: project.challenge[key],
          solution: project.solution[key],
          outcome: project.outcome[key],
        },
        create: {
          projectId: record.id,
          locale,
          slug: project.slug[key],
          title: project.title[key],
          category: project.category[key],
          summary: project.summary[key],
          challenge: project.challenge[key],
          solution: project.solution[key],
          outcome: project.outcome[key],
        },
      });
    }

    await prisma.projectMetric.deleteMany({ where: { projectId: record.id } });
    await prisma.projectMetric.createMany({
      data: project.metrics.map((metric, position) => ({
        projectId: record.id,
        value: metric.value,
        labelFr: metric.label.fr,
        labelEn: metric.label.en,
        labelEs: metric.label.es,
        position,
      })),
    });
  }
  console.log(`  ✓ ${projects.length} projets`);

  // ----- journal
  for (const post of posts) {
    const record = await prisma.post.upsert({
      where: { key: post.key },
      update: {
        category: post.category,
        published: true,
        publishedAt: post.publishedAt,
      },
      create: {
        key: post.key,
        category: post.category,
        published: true,
        publishedAt: post.publishedAt,
      },
    });

    for (const locale of [Locale.FR, Locale.EN, Locale.ES]) {
      const key = locale.toLowerCase() as "fr" | "en" | "es";
      await prisma.postTranslation.upsert({
        where: { postId_locale: { postId: record.id, locale } },
        update: {
          slug: post.slug[key],
          title: post.title[key],
          excerpt: post.excerpt[key],
          body: post.body[key],
          categoryLabel: post.categoryLabel[key],
        },
        create: {
          postId: record.id,
          locale,
          slug: post.slug[key],
          title: post.title[key],
          excerpt: post.excerpt[key],
          body: post.body[key],
          categoryLabel: post.categoryLabel[key],
        },
      });
    }
  }
  console.log(`  ✓ ${posts.length} articles`);

  // ----- témoignage
  const existing = await prisma.testimonial.findFirst({
    where: { author: "Thalassa Resorts" },
  });
  const testimonial =
    existing ??
    (await prisma.testimonial.create({
      data: { author: "Thalassa Resorts", published: true, position: 0 },
    }));

  const quotes = {
    FR: {
      quote:
        "Trois prestataires avant eux nous avaient livré un site qu'on ne pouvait pas modifier. Kalimera a tout refait en sept semaines, et depuis on publie nos pages nous-mêmes, dans les trois langues.",
      role: "Directrice marketing — Thalassa Resorts",
    },
    EN: {
      quote:
        "Three suppliers before them delivered a site we couldn't edit. Kalimera rebuilt everything in seven weeks, and we've been publishing our own pages since — in all three languages.",
      role: "Marketing Director — Thalassa Resorts",
    },
    ES: {
      quote:
        "Tres proveedores antes de ellos nos entregaron una web que no podíamos modificar. Kalimera lo rehízo todo en siete semanas, y desde entonces publicamos nuestras páginas nosotros mismos, en los tres idiomas.",
      role: "Directora de marketing — Thalassa Resorts",
    },
  } as const;

  for (const locale of [Locale.FR, Locale.EN, Locale.ES]) {
    await prisma.testimonialTranslation.upsert({
      where: {
        testimonialId_locale: { testimonialId: testimonial.id, locale },
      },
      update: quotes[locale],
      create: { testimonialId: testimonial.id, locale, ...quotes[locale] },
    });
  }
  console.log("  ✓ 1 témoignage");
  console.log("→ Terminé.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
