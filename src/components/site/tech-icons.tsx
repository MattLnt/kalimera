import { cn } from "@/lib/utils";

/**
 * Marques des technologies, dessinées ici plutôt qu'importées.
 *
 * Deux décisions assumées :
 *
 * 1. **Monochrome.** Un alignement de logos officiels multicolores jure avec
 *    la palette du site et donne un aspect de page de sponsors. Un jeu
 *    monochrome au même poids de trait se lit comme un système.
 * 2. **En SVG inline.** Aucun fichier à charger, aucune dépendance, et les
 *    marques héritent de `currentColor` — elles fonctionnent donc sur fond
 *    clair comme sur le panneau bleu nuit.
 *
 * Les formes reprennent la géométrie reconnaissable de chaque marque ; les
 * technologies sans symbole simple reçoivent un monogramme.
 */

type MarkProps = { className?: string };

const box = "0 0 24 24";

/** Atome React : trois ellipses croisées autour d'un noyau. */
function ReactMark({ className }: MarkProps) {
  return (
    <svg viewBox={box} fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.1">
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </g>
    </svg>
  );
}

/** Next.js : le cercle et la diagonale du N. */
function NextMark({ className }: MarkProps) {
  return (
    <svg viewBox={box} fill="none" aria-hidden className={className}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8.6 16.2V7.8l7.1 9.2M15.3 7.8v5.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Triangle Vercel. */
function VercelMark({ className }: MarkProps) {
  return (
    <svg viewBox={box} fill="none" aria-hidden className={className}>
      <path d="M12 3.5 22 20.5H2L12 3.5Z" fill="currentColor" />
    </svg>
  );
}

/** Les deux vagues superposées de Tailwind. */
function TailwindMark({ className }: MarkProps) {
  return (
    <svg viewBox={box} fill="none" aria-hidden className={className}>
      <path
        d="M3 10c1-3.4 3-5.1 6-5.1 4.5 0 5 3.4 7.3 4 1.5.4 2.8-.2 3.7-1.7-1 3.4-3 5.1-6 5.1-4.5 0-5.1-3.4-7.4-4C5.2 7.9 3.9 8.5 3 10Z"
        fill="currentColor"
      />
      <path
        d="M3 18.6c1-3.4 3-5.1 6-5.1 4.5 0 5 3.4 7.3 4 1.5.4 2.8-.2 3.7-1.7-1 3.4-3 5.1-6 5.1-4.5 0-5.1-3.4-7.4-4-1.4-.4-2.7.2-3.6 1.7Z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  );
}

/** Hexagone Node.js. */
function NodeMark({ className }: MarkProps) {
  return (
    <svg viewBox={box} fill="none" aria-hidden className={className}>
      <path
        d="M12 2.5l8.2 4.75v9.5L12 21.5 3.8 16.75v-9.5L12 2.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path
        d="M9.6 9.2v4.6a1.6 1.6 0 0 1-3.2 0M14.4 14.8c-1.5 0-2.4-.6-2.4-1.6s.9-1.5 2.4-1.6c1.5-.1 2.4-.5 2.4-1.5s-.9-1.6-2.4-1.6"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Cylindres empilés : la base de données. */
function DatabaseMark({ className }: MarkProps) {
  return (
    <svg viewBox={box} fill="none" aria-hidden className={className}>
      <g stroke="currentColor" strokeWidth="1.3">
        <ellipse cx="12" cy="6" rx="7.5" ry="3" />
        <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6" />
        <path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
      </g>
    </svg>
  );
}

/** Prisme Prisma : le triangle et son arête interne. */
function PrismaMark({ className }: MarkProps) {
  return (
    <svg viewBox={box} fill="none" aria-hidden className={className}>
      <path
        d="M11 2.6 3.2 16.4a1.4 1.4 0 0 0 .7 2l10.4 3.3a1.4 1.4 0 0 0 1.8-1.7L12.6 3.1a1 1 0 0 0-1.6-.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <path d="M11.4 7.3 7.1 16.6l6 1.9-1.7-11.2Z" fill="currentColor" opacity="0.45" />
    </svg>
  );
}

/** Les cinq modules de Figma. */
function FigmaMark({ className }: MarkProps) {
  return (
    <svg viewBox={box} fill="none" aria-hidden className={className}>
      <g fill="currentColor">
        <path d="M8.5 2.5h3.5v5H8.5a2.5 2.5 0 0 1 0-5Z" opacity="0.55" />
        <path d="M12 2.5h3.5a2.5 2.5 0 0 1 0 5H12v-5Z" />
        <path d="M8.5 9h3.5v5H8.5a2.5 2.5 0 0 1 0-5Z" />
        <circle cx="15.5" cy="11.5" r="2.5" opacity="0.55" />
        <path d="M8.5 15.5H12V19a2.5 2.5 0 1 1-3.5-3.5Z" opacity="0.8" />
      </g>
    </svg>
  );
}

/** Monogramme, pour les marques sans symbole simple. */
function Monogram({ label, className }: MarkProps & { label: string }) {
  return (
    <svg viewBox={box} fill="none" aria-hidden className={className}>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="1.3"
      />
      <text
        x="12"
        y="12"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        style={{
          font: `700 ${label.length > 2 ? 7 : 8.5}px ui-sans-serif, system-ui, sans-serif`,
          letterSpacing: "-0.04em",
        }}
      >
        {label}
      </text>
    </svg>
  );
}

/** Chevrons : le repli pour toute technologie non référencée. */
function CodeMark({ className }: MarkProps) {
  return (
    <svg viewBox={box} fill="none" aria-hidden className={className}>
      <path
        d="M9 7.5 4.5 12 9 16.5M15 7.5 19.5 12 15 16.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Correspondance entre le nom saisi en base et sa marque.
 *
 * Les clés sont normalisées — minuscules, sans ponctuation — de façon à ce que
 * « Next.js », « nextjs » et « Next JS » tombent sur la même entrée : les
 * pastilles sont saisies à la main depuis l'administration.
 */
const marks: Record<string, (props: MarkProps) => React.ReactElement> = {
  nextjs: NextMark,
  next: NextMark,
  react: ReactMark,
  reactnative: ReactMark,
  expo: ReactMark,
  typescript: (props) => <Monogram label="TS" {...props} />,
  javascript: (props) => <Monogram label="JS" {...props} />,
  nodejs: NodeMark,
  node: NodeMark,
  postgresql: DatabaseMark,
  postgres: DatabaseMark,
  database: DatabaseMark,
  prisma: PrismaMark,
  tailwindcss: TailwindMark,
  tailwind: TailwindMark,
  stripe: (props) => <Monogram label="S" {...props} />,
  vercel: VercelMark,
  figma: FigmaMark,
  cloudinary: (props) => <Monogram label="CL" {...props} />,
  resend: (props) => <Monogram label="@" {...props} />,
  swift: (props) => <Monogram label="SW" {...props} />,
};

const normalize = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]/g, "");

export function TechIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Mark = marks[normalize(name)] ?? CodeMark;
  return <Mark className={cn("size-4 shrink-0", className)} />;
}

export function hasTechIcon(name: string) {
  return normalize(name) in marks;
}

/**
 * Bandeau de technologies. Utilisé sur les pages d'atterrissage et les fiches
 * service, là où la liste des outils est un argument et pas une décoration.
 */
export function TechStrip({
  items,
  tone = "light",
  className,
}: {
  items: readonly string[];
  tone?: "light" | "dark";
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "flex items-center gap-2 rounded-full px-3.5 py-2 font-display text-[0.8125rem] font-bold tracking-[-0.01em] transition-colors duration-300",
            tone === "light"
              ? "bg-white text-ink shadow-[inset_0_0_0_1px_var(--ink-10)] hover:shadow-[inset_0_0_0_1px_var(--color-aegean-200)]"
              : "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] hover:bg-white/16",
          )}
        >
          <TechIcon
            name={item}
            className={tone === "light" ? "text-aegean-600" : "text-aegean-200"}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
