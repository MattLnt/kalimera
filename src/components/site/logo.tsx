import { cn } from "@/lib/utils";

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
      {/* L'arche : la colonne grecque réduite à son geste. */}
      <path
        d="M10 23V15a6 6 0 0 1 12 0v8"
        stroke="#fff"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#2A86E8" />
          <stop offset="1" stopColor="#07213F" />
        </linearGradient>
      </defs>
    </svg>
  );
}
