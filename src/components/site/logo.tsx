import { cn } from "@/lib/utils";

/**
 * Le logo : l'œil grec (le « mati ») épuré, une amande bleue pleine, un iris
 * blanc et une pupille bleu nuit, sans fond. Tracés partagés avec le favicon,
 * l'icône d'écran d'accueil et l'image de partage.
 */
export const LOGO_EYE = "M2 16c3.5-5.7 8.2-8.5 14-8.5s10.5 2.8 14 8.5c-3.5 5.7-8.2 8.5-14 8.5S5.5 21.7 2 16Z";
export const LOGO_BLUE = "#1F7AE0";
export const LOGO_BLUE_ON_DARK = "#38A3E8";
export const LOGO_PUPIL = "#0B3A75";

export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  /** Sur fond foncé : un bleu plus clair, pour que l'œil reste lumineux. */
  onDark?: boolean;
  /** Conservé pour compatibilité (anciens dégradés). */
  id?: string;
}) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn("size-7 shrink-0", className)}>
      <path d={LOGO_EYE} fill={onDark ? LOGO_BLUE_ON_DARK : LOGO_BLUE} />
      <circle cx="16" cy="16" r="5.3" fill="#fff" />
      <circle cx="16" cy="16" r="2.5" fill={LOGO_PUPIL} />
    </svg>
  );
}
