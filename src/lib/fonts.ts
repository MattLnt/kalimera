import { Inter, Manrope } from "next/font/google";

/**
 * Deux familles, quatre graisses au total : chaque graisse supplémentaire est
 * un fichier de plus à charger avant l'affichage du texte.
 */
export const manrope = Manrope({
  subsets: ["latin", "latin-ext", "greek"],
  weight: ["600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

export const inter = Inter({
  subsets: ["latin", "latin-ext", "greek"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});
