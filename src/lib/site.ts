/** Constantes du site qui ne changent pas assez souvent pour justifier la base. */

export const siteConfig = {
  name: "Kalimera",
  domain: "kalimera.agency",
  email: "hello@kalimera.agency",
  phone: "+33 6 51 48 43 58",
  phoneHref: "+33651484358",
  cities: "Athènes · Paris · Dubaï",
  social: {
    linkedin: "https://www.linkedin.com/company/kalimera-agency",
    github: "https://github.com/kalimera-agency",
    instagram: "https://www.instagram.com/kalimera.agency",
  },
  /** Chiffres affichés en page d'accueil. À remplacer par les vrais. */
  stats: {
    projects: 180,
    lighthouse: 98,
    leadTimeWeeks: 6,
    experienceYears: 12,
  },
  /** Bandeau défilant des technologies. */
  stack: [
    "Next.js",
    "React",
    "TypeScript",
    "React Native",
    "Swift",
    "Node.js",
    "Shopify",
    "Tailwind CSS",
    "PostgreSQL",
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
