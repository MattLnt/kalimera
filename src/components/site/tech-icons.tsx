import {
  siCloudinary,
  siExpo,
  siFigma,
  siNextdotjs,
  siNodedotjs,
  siPostgresql,
  siPrisma,
  siReact,
  siResend,
  siStripe,
  siTailwindcss,
  siTypescript,
  siVercel,
  type SimpleIcon,
} from "simple-icons";

import { cn } from "@/lib/utils";

/**
 * Logos officiels des technologies, servis depuis `simple-icons`.
 *
 * Les marques sont importées une par une et non par lot : le paquet contient
 * plusieurs milliers d'icônes, et un import global les embarquerait toutes
 * dans le bundle.
 *
 * Chaque marque porte sa couleur officielle. Celles dont la couleur est le
 * noir — Next.js, Vercel, Resend — deviennent blanches sur fond sombre,
 * sinon elles disparaîtraient dans le panneau bleu nuit.
 */

/** Clé normalisée : « Next.js », « nextjs » et « Next JS » se rejoignent. */
const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

const icons: Record<string, SimpleIcon> = {
  nextjs: siNextdotjs,
  next: siNextdotjs,
  react: siReact,
  reactnative: siReact,
  expo: siExpo,
  typescript: siTypescript,
  nodejs: siNodedotjs,
  node: siNodedotjs,
  postgresql: siPostgresql,
  postgres: siPostgresql,
  prisma: siPrisma,
  tailwindcss: siTailwindcss,
  tailwind: siTailwindcss,
  stripe: siStripe,
  vercel: siVercel,
  figma: siFigma,
  cloudinary: siCloudinary,
  resend: siResend,
};

/** Une marque noire est illisible sur le panneau bleu nuit. */
const isDarkMark = (icon: SimpleIcon) => {
  const value = parseInt(icon.hex, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 70;
};

export function hasTechIcon(name: string) {
  return normalize(name) in icons;
}

export function TechIcon({
  name,
  tone = "light",
  className,
}: {
  name: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const icon = icons[normalize(name)];
  if (!icon) return null;

  const color = tone === "dark" && isDarkMark(icon) ? "#fff" : `#${icon.hex}`;

  return (
    <svg
      viewBox="0 0 24 24"
      role="img"
      aria-hidden
      className={cn("size-4 shrink-0", className)}
      fill={color}
    >
      <path d={icon.path} />
    </svg>
  );
}

/**
 * Bandeau de technologies. Les entrées sans logo connu — « Back-office »,
 * « Multilingue » — restent affichées en texte seul plutôt que de recevoir
 * une icône générique qui ne voudrait rien dire.
 */
export function TechStrip({
  items,
  tone = "light",
  size = "md",
  className,
}: {
  items: readonly string[];
  tone?: "light" | "dark";
  size?: "sm" | "md";
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <ul className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <li
          key={item}
          className={cn(
            "flex items-center gap-2 rounded-full font-display font-bold tracking-[-0.01em] transition-colors duration-300",
            size === "sm"
              ? "px-3 py-1.5 text-[0.75rem]"
              : "px-3.5 py-2 text-[0.8125rem]",
            tone === "light"
              ? "bg-white text-ink shadow-[inset_0_0_0_1px_var(--ink-10)] hover:shadow-[inset_0_0_0_1px_var(--color-aegean-200)]"
              : "bg-white/10 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] hover:bg-white/16",
          )}
        >
          <TechIcon
            name={item}
            tone={tone}
            className={size === "sm" ? "size-3.5" : "size-4"}
          />
          {item}
        </li>
      ))}
    </ul>
  );
}
