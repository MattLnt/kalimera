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
