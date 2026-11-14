import { ArrowLeft, Inbox } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * En-tête de page : retour en pastille, surtitre, titre affirmé, sous-titre,
 * actions à droite ; `children` se place dessous (chiffres clés).
 */
export function AdminHeader({
  title,
  subtitle,
  action,
  back,
  eyebrow,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  back?: { href: string; label: string };
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-8">
      {back ? (
        <Link
          href={back.href}
          className="group/back mb-4 inline-flex items-center gap-1.5 rounded-full bg-white py-1.5 pr-3.5 pl-2 font-display text-[0.8125rem] font-semibold text-[var(--ink-65)] shadow-[0_1px_2px_rgba(7,33,63,0.06)] ring-1 ring-black/[0.04] transition-colors hover:text-aegean-700"
        >
          <span className="grid size-5 place-items-center rounded-full bg-aegean-50 text-aegean-700 transition-transform group-hover/back:-translate-x-0.5">
            <ArrowLeft className="size-3" />
          </span>
          {back.label}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <div className="min-w-0">
          {eyebrow ? (
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-aegean-100 py-1.5 pr-3.5 pl-2.5 font-display text-[0.6875rem] font-semibold text-aegean-700">
              <span aria-hidden className="size-[7px] rounded-full bg-aegean-500" />
              {eyebrow}
            </span>
          ) : null}
          {title ? (
            <h1 className="font-display text-[clamp(1.75rem,2.4vw,2.375rem)] leading-[1.05] font-extrabold tracking-[-0.045em] text-ink">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="mt-2 max-w-[70ch] text-[0.9375rem] text-[var(--ink-65)] first-letter:uppercase">{subtitle}</p>
          ) : null}
        </div>
        {action ? <div className="flex flex-wrap items-center gap-2">{action}</div> : null}
      </div>
      {children ? <div className="mt-7">{children}</div> : null}
    </header>
  );
}

/** Carte du CRM : blanche, liseré fin, ombre douce. */
export const cardClass =
  "rounded-[22px] bg-white shadow-[0_0_0_1px_#DFE6EF,0_1px_2px_rgba(7,33,63,0.04),0_16px_32px_-22px_rgba(7,33,63,0.28)]";

export function Panel({
  children,
  className,
  title,
  description,
  icon,
  action,
  flush = false,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  /** Pictogramme dans une tuile, devant le titre. */
  icon?: React.ReactNode;
  /** Lien ou bouton à droite du titre. */
  action?: React.ReactNode;
  /** Sans marge intérieure sous l'en-tête : pour un tableau bord à bord. */
  flush?: boolean;
}) {
  return (
    <section className={cn(cardClass, "flex flex-col", flush ? "overflow-hidden" : "p-5 sm:p-6", className)}>
      {title ? (
        <div className={cn("flex items-start gap-3", flush ? "border-b border-black/[0.05] px-5 py-4 sm:px-6" : "mb-5")}>
          {icon ? (
            <span className="grid size-9 shrink-0 place-items-center rounded-[11px] bg-gradient-to-br from-aegean-50 to-aegean-100 text-aegean-700 ring-1 ring-aegean-200/60">
              {icon}
            </span>
          ) : null}
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-[1.0625rem] leading-tight font-bold tracking-[-0.025em] text-ink">{title}</h2>
            {description ? <p className="mt-1 text-[0.8125rem] leading-snug text-[var(--ink-45)]">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      <div className="flex-1">{children}</div>
    </section>
  );
}

export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[0.6875rem] font-bold",
        published ? "bg-green-100 text-green-800" : "bg-[#DDF2F4] text-[#0A6B74]",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          published ? "bg-green-600" : "bg-[#94A3B8]",
        )}
      />
      {published ? "Publié" : "Brouillon"}
    </span>
  );
}

/** Pastille indiquant si les trois langues sont renseignées. */
export function LocaleBadges({ locales }: { locales: string[] }) {
  const all = ["FR", "EN", "ES"];
  return (
    <span className="flex gap-1">
      {all.map((code) => {
        const filled = locales.includes(code);
        return (
          <span
            key={code}
            title={filled ? `${code} renseigné` : `${code} manquant`}
            className={cn(
              "rounded px-1.5 py-0.5 font-display text-[0.625rem] font-bold",
              filled
                ? "bg-aegean-100 text-aegean-700"
                : "bg-black/5 text-[var(--ink-45)] line-through",
            )}
          >
            {code}
          </span>
        );
      })}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn(cardClass, "px-6 py-16 text-center")}>
      <span className="mx-auto mb-5 grid size-14 place-items-center rounded-[18px] bg-gradient-to-br from-aegean-50 to-aegean-100 text-aegean-600 ring-1 ring-aegean-200/60">
        <Inbox className="size-6" />
      </span>
      <h2 className="font-display text-[1.25rem] font-bold tracking-[-0.03em]">{title}</h2>
      <p className="mx-auto mt-2 max-w-[44ch] text-[0.9375rem] text-[var(--ink-65)]">
        {description}
      </p>
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="field-label">
        {label}
      </label>
      {children}
      {hint && !error ? (
        <p className="mt-1.5 text-xs text-[var(--ink-45)]">{hint}</p>
      ) : null}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}

/** Pastille colorée : statut, étape, type. Tons définis dans lib/crm/labels. */
export function Pill({
  className,
  dot,
  children,
}: {
  className: string;
  dot?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[0.6875rem] font-bold whitespace-nowrap",
        className,
      )}
    >
      {dot ? <span className={cn("size-1.5 rounded-full", dot)} /> : null}
      {children}
    </span>
  );
}

/**
 * Chiffre clé : tuile d'icône en dégradé, valeur affirmée, précision et
 * tendance facultative. `tone="dark"` reste disponible pour un fond bleu nuit.
 */
/**
 * Couleurs des indicateurs, les mêmes que les statuts : bleu = en cours,
 * bleu-vert = en attente, vert = acquis, bleu nuit = urgent, gris = neutre.
 */
const statColors = {
  blue: { tile: "#1F7AE0", soft: "#E3EFFC", ink: "#155399" },
  teal: { tile: "#0E9AA7", soft: "#DDF2F4", ink: "#0A6B74" },
  green: { tile: "#059669", soft: "#DCF1EA", ink: "#046C4E" },
  navy: { tile: "#0B3A75", soft: "#DCE5F1", ink: "#0B3A75" },
  slate: { tile: "#64748B", soft: "#ECEFF3", ink: "#475569" },
} as const;
export type StatColor = keyof typeof statColors;

export function StatCard({
  label,
  value,
  hint,
  icon,
  href,
  tone = "light",
  trend,
  color = "blue",
  chip,
  meter,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  href?: string;
  tone?: "light" | "dark";
  trend?: { label: string; direction: "up" | "down" | "flat" };
  /** Couleur de l'indicateur (tuile, pastille, jauge). */
  color?: StatColor;
  /** Pastille mise en avant sous le chiffre (« 3 devis », « 1 en retard »). */
  chip?: string;
  /** Jauge de 0 à 100 au pied de la carte. */
  meter?: number;
}) {
  const dark = tone === "dark";
  const c = statColors[color];
  const body = (
    <>
      <div className="flex items-center gap-2.5">
        {icon ? (
          <span
            className={cn("grid size-9 shrink-0 place-items-center rounded-[11px]", dark ? "bg-white/10 text-aegean-200" : "text-white")}
            style={dark ? undefined : { background: c.tile, boxShadow: `0 8px 16px -10px ${c.tile}` }}
          >
            {icon}
          </span>
        ) : null}
        <span className={cn("font-display text-[0.9375rem] font-bold tracking-[-0.01em]", dark ? "text-white/70" : "text-ink/80")}>{label}</span>
      </div>
      <p className={cn("mt-4 font-display text-[clamp(1.75rem,2.3vw,2.25rem)] leading-none font-extrabold tracking-[-0.045em]", dark ? "text-white" : "text-ink")}>
        {value}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-[0.8125rem]">
        {chip ? (
          <span className="rounded-full px-2.5 py-0.5 font-display text-[0.75rem] font-bold" style={{ background: c.soft, color: c.ink }}>
            {chip}
          </span>
        ) : null}
        {trend ? (
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 font-display text-[0.75rem] font-bold",
              trend.direction === "up" ? "bg-[#DCF1EA] text-[#046C4E]" : trend.direction === "down" ? "bg-[#DCE5F1] text-[#0B3A75]" : "bg-black/5 text-[var(--ink-65)]",
            )}
          >
            {trend.direction === "up" ? "↑ " : trend.direction === "down" ? "↓ " : ""}
            {trend.label}
          </span>
        ) : null}
        {hint ? <span className={dark ? "text-white/55" : "text-[var(--ink-65)]"}>{hint}</span> : null}
      </div>
      {meter !== undefined && !dark ? (
        <div className="mt-auto pt-4">
          <div className="h-1.5 rounded-full" style={{ background: c.soft }}>
            <div className="h-full rounded-full" style={{ width: `${Math.max(0, Math.min(100, meter))}%`, background: c.tile }} />
          </div>
        </div>
      ) : null}
    </>
  );
  const box = dark
    ? "group/stat relative flex h-full flex-col overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm transition-colors"
    : cn(cardClass, "group/stat relative flex h-full flex-col p-5 transition-[box-shadow,transform] duration-300");
  return href ? (
    <Link href={href} className={cn(box, dark ? "hover:bg-white/[0.12]" : "hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_#D5DEEA,0_22px_40px_-22px_rgba(7,33,63,0.35)]")}>
      {body}
    </Link>
  ) : (
    <div className={box}>{body}</div>
  );
}

/**
 * Tableau de données du CRM, dans une carte. Les lignes sont des liens
 * entiers : placer `<RowLink>` dans la première cellule.
 */
export function DataTable({ head, children, className }: { head: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(cardClass, "overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="crm-table">
          <thead>{head}</thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

/** Lien qui couvre toute la ligne du tableau (le `tr` est en position relative). */
export function RowLink({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <Link href={href} className={cn("after:absolute after:inset-0 after:content-['']", className)}>
      {children}
    </Link>
  );
}

/** Avatar à initiales, teinte stable par nom. */
export function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const gradients = [
    // Toujours dans les bleus Kalimera : la couleur vive est réservée aux statuts.
    "from-aegean-400 to-aegean-700",
    "from-aegean-300 to-aegean-600",
    "from-aegean-500 to-aegean-800",
    "from-slate-400 to-aegean-700",
    "from-aegean-500 to-slate-800",
  ];
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const initials = name
    .split(/\s+/)
    .filter((part) => /^\p{L}/u.test(part))
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center bg-gradient-to-br font-display font-bold text-white",
        gradients[hash % gradients.length],
        size === "sm" ? "size-8 rounded-[10px] text-[0.6875rem]" : size === "lg" ? "size-14 rounded-[18px] text-lg" : "size-10 rounded-[12px] text-xs",
      )}
    >
      {initials || "?"}
    </span>
  );
}

/** Onglets de filtre, en pastilles. */
export function FilterTabs({ tabs }: { tabs: { href: string; label: string; active: boolean; count?: number }[] }) {
  return (
    <div className="mb-5 flex max-w-full gap-1 overflow-x-auto rounded-full bg-black/5 p-1 [scrollbar-width:none] sm:inline-flex">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 font-display text-sm font-bold whitespace-nowrap transition-colors",
            tab.active ? "bg-white text-aegean-700 shadow-soft" : "text-[var(--ink-45)] hover:text-ink",
          )}
        >
          {tab.label}
          {tab.count !== undefined ? (
            <span className={cn("rounded-full px-1.5 text-[0.6875rem]", tab.active ? "bg-aegean-100" : "bg-black/5")}>
              {tab.count}
            </span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}

/** Bouton d'action principal des pages d'administration. */
export function ActionLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-display text-sm font-bold transition-colors",
        variant === "primary"
          ? "bg-aegean-600 text-white shadow-[0_8px_20px_-10px_rgba(21,98,184,0.8)] hover:bg-aegean-700"
          : "bg-white text-ink shadow-soft hover:bg-aegean-50",
      )}
    >
      {children}
    </Link>
  );
}
