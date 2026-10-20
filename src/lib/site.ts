/** Constantes du site qui ne changent pas assez souvent pour justifier la base. */

export const siteConfig = {
  name: "Kalimera",
  domain: "kalimera.agency",
  email: "hello@kalimera.agency",
  phone: "+33 6 51 48 43 58",
  phoneHref: "+33651484358",
  /** Établissement réel : sert la fiche Google Business et le JSON-LD LocalBusiness. */
  address: {
    street: "",
    postalCode: "13100",
    city: "Aix-en-Provence",
    region: "Provence-Alpes-Côte d'Azur",
    country: "FR",
    /** Coordonnées du centre d'Aix, à affiner avec l'adresse exacte. */
    latitude: 43.5297,
    longitude: 5.4474,
  },
  /**
   * Zones réellement servies, par ordre de priorité commerciale.
   * La Belgique arrive en tête : c'est là que sont les références.
   */
  markets: [
    { code: "BE", label: "Belgique" },
    { code: "LU", label: "Luxembourg" },
    { code: "CH", label: "Suisse romande" },
    { code: "FR", label: "France" },
  ],
  /** Rythme d'ouverture indiqué sur la fiche Google Business. */
  openingHours: { days: ["Mo", "Tu", "We", "Th", "Fr"], opens: "09:00", closes: "18:00" },
  social: {
    linkedin: "https://www.linkedin.com/company/kalimera-agency",
    github: "https://github.com/kalimera-agency",
    instagram: "https://www.instagram.com/kalimera.agency",
  },
  /**
   * Chiffres affichés en page d'accueil. Tous vérifiables dans le portfolio :
   * ne rien mettre ici qui ne soit pas démontrable par une URL en ligne.
   */
  stats: {
    projects: 8,
    platforms: 5,
    countries: 3,
    locales: 3,
  },
  /**
   * Bandeau défilant des technologies. Uniquement du code : pas de WordPress,
   * pas de Shopify, pas de constructeur de pages.
   */
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Prisma",
    "Tailwind CSS",
    "Stripe",
    "React Native",
    "Vercel",
    "Figma",
  ],
} as const;

export function getSiteUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
