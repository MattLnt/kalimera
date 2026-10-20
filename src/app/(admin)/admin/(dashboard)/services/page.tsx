import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import Link from "next/link";

import { moveService, toggleServicePublished } from "./actions";

import { AdminHeader, EmptyState, LocaleBadges, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { position: "asc" },
    include: { translations: { select: { locale: true, title: true } } },
  });

  return (
    <>
      <AdminHeader
        title="Services"
        subtitle="Les prestations affichées en page d'accueil et sur la page Services."
        action={
          <Button asChild variant="blue" size="sm">
            <Link href="/admin/services/new">Nouveau service</Link>
          </Button>
        }
      />

      {services.length === 0 ? (
        <EmptyState
          title="Aucun service"
          description="Créez votre premier service : il apparaîtra en page d'accueil et dans le pied de page."
          action={
            <Button asChild variant="blue" size="sm">
              <Link href="/admin/services/new">Nouveau service</Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-2">
          {services.map((service, index) => {
            const fr = service.translations.find((t) => t.locale === "FR");
            return (
              <li
                key={service.id}
                className="surface-card flex flex-wrap items-center gap-3 p-4"
              >
                <div className="flex shrink-0 flex-col gap-0.5">
                  <MoveButton
                    id={service.id}
                    direction="up"
                    disabled={index === 0}
                    label="Monter"
                  />
                  <MoveButton
                    id={service.id}
                    direction="down"
                    disabled={index === services.length - 1}
                    label="Descendre"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-base font-bold tracking-[-0.02em]">
                    {fr?.title ?? service.key}
                  </p>
                  <p className="truncate text-xs text-[var(--ink-45)]">{service.key}</p>
                </div>

                <LocaleBadges locales={service.translations.map((t) => t.locale)} />
                <StatusBadge published={service.published} />

                <form action={toggleServicePublished}>
                  <input type="hidden" name="id" value={service.id} />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-full px-3 py-2 font-display text-xs font-bold text-[var(--ink-65)] transition-colors hover:bg-black/5 hover:text-ink"
                  >
                    {service.published ? "Dépublier" : "Publier"}
                  </button>
                </form>

                <Link
                  href={`/admin/services/${service.id}`}
                  aria-label={`Modifier ${fr?.title ?? service.key}`}
                  className="grid size-9 place-items-center rounded-full bg-ink text-white transition-opacity hover:opacity-90"
                >
                  <Pencil className="size-4" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function MoveButton({
  id,
  direction,
  disabled,
  label,
}: {
  id: string;
  direction: "up" | "down";
  disabled: boolean;
  label: string;
}) {
  return (
    <form action={moveService}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="direction" value={direction} />
      <button
        type="submit"
        disabled={disabled}
        aria-label={label}
        className="grid size-6 cursor-pointer place-items-center rounded text-[var(--ink-45)] transition-colors hover:bg-black/5 hover:text-ink disabled:cursor-not-allowed disabled:opacity-25"
      >
        {direction === "up" ? (
          <ChevronUp className="size-4" />
        ) : (
          <ChevronDown className="size-4" />
        )}
      </button>
    </form>
  );
}
