import { ChevronDown, ChevronUp, Pencil } from "lucide-react";
import Link from "next/link";

import { moveLanding, toggleLandingPublished } from "./actions";

import { AdminHeader, EmptyState, LocaleBadges, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { LandingKind } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Secteurs & villes" };

export default async function AdminLandingsPage() {
  const landings = await prisma.landing.findMany({
    orderBy: [{ kind: "asc" }, { position: "asc" }],
    include: {
      translations: { select: { locale: true, title: true } },
      _count: { select: { projects: true, faqs: true } },
    },
  });

  const groups = [
    {
      kind: LandingKind.SECTOR,
      title: "Secteurs d'activité",
      subtitle: "Les pages qui visent un métier. Ce sont les plus qualifiées.",
    },
    {
      kind: LandingKind.LOCATION,
      title: "Villes & marchés",
      subtitle: "Les pages géographiques, pour le référencement local et les marchés servis.",
    },
  ];

  return (
    <>
      <AdminHeader
        title="Secteurs & villes"
        subtitle="Les pages d'atterrissage qui captent les requêtes : un métier ou une ville par page."
        action={
          <Button asChild variant="blue" size="sm">
            <Link href="/admin/landings/new">Nouvelle page</Link>
          </Button>
        }
      />

      {landings.length === 0 ? (
        <EmptyState
          title="Aucune page d'atterrissage"
          description="Créez une page par secteur et par ville visée : c'est ce qui capte les recherches que vos pages services ne couvrent pas."
          action={
            <Button asChild variant="blue" size="sm">
              <Link href="/admin/landings/new">Nouvelle page</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-8">
          {groups.map((group) => {
            const items = landings.filter((landing) => landing.kind === group.kind);
            if (items.length === 0) return null;

            return (
              <section key={group.kind}>
                <h2 className="font-display text-base font-bold tracking-[-0.02em]">
                  {group.title}
                </h2>
                <p className="mt-1 mb-3 text-xs text-[var(--ink-45)]">
                  {group.subtitle}
                </p>

                <ul className="grid gap-2">
                  {items.map((landing, index) => {
                    const fr = landing.translations.find((item) => item.locale === "FR");
                    return (
                      <li
                        key={landing.id}
                        className="surface-card flex flex-wrap items-center gap-3 p-4"
                      >
                        <div className="flex shrink-0 flex-col gap-0.5">
                          <MoveButton
                            id={landing.id}
                            direction="up"
                            disabled={index === 0}
                            label="Monter"
                          />
                          <MoveButton
                            id={landing.id}
                            direction="down"
                            disabled={index === items.length - 1}
                            label="Descendre"
                          />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-base font-bold tracking-[-0.02em]">
                            {fr?.title ?? landing.key}
                          </p>
                          <p className="truncate text-xs text-[var(--ink-45)]">
                            {landing._count.projects} réalisation
                            {landing._count.projects > 1 ? "s" : ""} ·{" "}
                            {landing._count.faqs} question
                            {landing._count.faqs > 1 ? "s" : ""}
                          </p>
                        </div>

                        {/* Une page sans preuve convertit mal : on le signale ici. */}
                        {landing._count.projects === 0 ? (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 font-display text-[0.6875rem] font-bold text-amber-700">
                            Sans preuve
                          </span>
                        ) : null}

                        <LocaleBadges
                          locales={landing.translations.map((item) => item.locale)}
                        />
                        <StatusBadge published={landing.published} />

                        <form action={toggleLandingPublished}>
                          <input type="hidden" name="id" value={landing.id} />
                          <button
                            type="submit"
                            className="cursor-pointer rounded-full px-3 py-2 font-display text-xs font-bold text-[var(--ink-65)] transition-colors hover:bg-black/5 hover:text-ink"
                          >
                            {landing.published ? "Dépublier" : "Publier"}
                          </button>
                        </form>

                        <Link
                          href={`/admin/landings/${landing.id}`}
                          aria-label={`Modifier ${fr?.title ?? landing.key}`}
                          className="grid size-9 place-items-center rounded-full bg-ink text-white transition-opacity hover:opacity-90"
                        >
                          <Pencil className="size-4" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
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
    <form action={moveLanding}>
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
