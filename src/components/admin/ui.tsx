import Link from "next/link";

import { cn } from "@/lib/utils";

/** En-tête de page d'administration : titre, sous-titre et action à droite. */
export function AdminHeader({
  title,
  subtitle,
  action,
  back,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  back?: { href: string; label: string };
}) {
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

/** Chiffre clé du tableau de bord. */
export function StatCard({
  label,
  value,
  hint,
  icon,
  href,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="font-display text-[0.75rem] font-bold text-[var(--ink-45)]">{label}</span>
        {icon ? (
          <span className="grid size-8 place-items-center rounded-[10px] bg-aegean-50 text-aegean-700">{icon}</span>
        ) : null}
      </div>
      <p className="mt-2 font-display text-[1.625rem] leading-none font-extrabold tracking-[-0.04em]">{value}</p>
      {hint ? <p className="mt-2 text-[0.8125rem] text-[var(--ink-45)]">{hint}</p> : null}
    </>
  );
  return href ? (
    <Link href={href} className="surface-card surface-card-hover flex h-full flex-col p-5">
      {body}
    </Link>
  ) : (
    <div className="surface-card flex h-full flex-col p-5">{body}</div>
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
