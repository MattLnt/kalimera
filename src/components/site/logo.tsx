import { cn } from "@/lib/utils";

/**
 * Tracés du logo, partagés avec le favicon et l'image de partage :
 * l'œil grec (le « mati ») épuré en regard, une amande au trait et un iris
 * bleu ciel, dans le carré bleu de la marque.
 */
export const LOGO_EYE = "M5.5 16c2.8-4.3 6.3-6.5 10.5-6.5s7.7 2.2 10.5 6.5c-2.8 4.3-6.3 6.5-10.5 6.5S8.3 20.3 5.5 16Z";
export const LOGO_IRIS = { cx: 16, cy: 16, r: 3.2, fill: "#7DD3FC" } as const;

export function Logo({
  className,
  id = "logo",
}: {
  className?: string;
  /** Les dégradés SVG ont besoin d'un identifiant unique par instance. */
  id?: string;
}) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn("size-7 shrink-0", className)}>
      <rect width="32" height="32" rx="10" fill={`url(#${id})`} />
      <path d={LOGO_EYE} stroke="#fff" strokeWidth="1.9" strokeLinejoin="round" />
      <circle {...LOGO_IRIS} />
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#2A86E8" />
          <stop offset="1" stopColor="#07213F" />
        </linearGradient>
      </defs>
    </svg>
  );
}
