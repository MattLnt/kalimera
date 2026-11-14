import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * En-tête de page d'administration : titre, sous-titre et action à droite.
 *
 * Sur une page principale (sans lien retour), c'est un bandeau bleu nuit —
 * le panneau sombre du site, avec son grain et son arche. Les fiches de
 * détail gardent un en-tête clair, plus discret, sous leur lien retour.
 * `children` se place dans le bandeau, sous le titre : les chiffres du
 * tableau de bord, par exemple.
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
  if (!back) {
    return (
      <header className="night-panel relative isolate mb-6 overflow-hidden rounded-[30px] px-6 py-7 shadow-lift sm:px-9 sm:py-9">
        <span
          aria-hidden
          className="pointer-events-none absolute -top-28 right-[-6%] size-[26rem] rounded-full bg-[radial-gradient(circle,rgba(98,169,242,0.4),transparent_68%)]"
        />
        <span aria-hidden className="arch-deco" style={{ width: "26%", right: "-4%", bottom: "-70%" }} />
        <span aria-hidden className="grain-layer" />
        <div className="relative z-2 flex flex-wrap items-end justify-between gap-5">
          <div className="min-w-0">
            {eyebrow ? (
              <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pr-3.5 pl-2.5 font-display text-[0.6875rem] font-semibold text-white backdrop-blur-sm">
                <span aria-hidden className="size-[7px] rounded-full bg-aegean-400" />
                {eyebrow}
              </span>
            ) : null}
            <h1 className="font-display text-[clamp(1.75rem,3.2vw,2.5rem)] leading-[1.05] font-extrabold tracking-[-0.045em] text-white">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-2 max-w-[60ch] text-[0.9375rem] text-white/65 first-letter:uppercase">{subtitle}</p>
            ) : null}
          </div>
          {action}
        </div>
        {children ? <div className="relative z-2 mt-7">{children}</div> : null}
      </header>
    );
  }

  return (
    <header className="mb-7">
      {back ? (
        <Link
          href={back.href}
          className="mb-3 inline-block font-display text-sm font-semibold text-aegean-700 hover:underline"
        >
          ← {back.label}
        </Link>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="display-3">{title}</h1>
          {subtitle ? (
            <p className="mt-1.5 text-[0.9375rem] text-[var(--ink-65)]">{subtitle}</p>
          ) : null}
        </div>
        {action}
      </div>
    </header>
  );
}

export function Panel({
  children,
  className,
  title,
  description,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
}) {
  return (
    <section className={cn("surface-card p-5 sm:p-7", className)}>
      {title ? (
        <div className="mb-5">
          <h2 className="display-4">{title}</h2>
          {description ? (
            <p className="mt-1 text-[0.875rem] text-[var(--ink-65)]">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[0.6875rem] font-bold",
        published ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          published ? "bg-green-600" : "bg-amber-500",
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
    <div className="surface-card px-6 py-14 text-center">
      <h2 className="display-4">{title}</h2>
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
 * Chiffre clé. `tone="dark"` pour le poser en verre dépoli dans un bandeau
 * bleu nuit, comme les chiffres des héros du site.
 */
export function StatCard({
  label,
  value,
  hint,
  icon,
  href,
  tone = "light",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  href?: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className={cn("font-display text-[0.75rem] font-bold", dark ? "text-white/60" : "text-[var(--ink-45)]")}>{label}</span>
        {icon ? (
          <span
            className={cn(
              "grid size-8 place-items-center rounded-[10px]",
              dark ? "bg-white/10 text-aegean-200" : "bg-aegean-50 text-aegean-700",
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <p className={cn("mt-2 font-display text-[1.625rem] leading-none font-extrabold tracking-[-0.04em]", dark && "text-white")}>
        {value}
      </p>
      {hint ? <p className={cn("mt-2 text-[0.8125rem]", dark ? "text-white/50" : "text-[var(--ink-45)]")}>{hint}</p> : null}
    </>
  );
  const box = dark
    ? "flex h-full flex-col rounded-[20px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm transition-colors"
    : "surface-card flex h-full flex-col p-5";
  return href ? (
    <Link href={href} className={cn(box, dark ? "hover:bg-white/[0.12]" : "surface-card-hover")}>
      {body}
    </Link>
  ) : (
    <div className={box}>{body}</div>
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
