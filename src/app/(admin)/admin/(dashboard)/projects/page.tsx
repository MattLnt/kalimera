import { ChevronDown, ChevronUp, Pencil, Star } from "lucide-react";
import Link from "next/link";

import { moveProject, toggleProjectPublished } from "./actions";

import { AdminHeader, EmptyState, LocaleBadges, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Projets" };

const kindLabels: Record<string, string> = {
  WEBSITE: "Site vitrine",
  ECOMMERCE: "E-commerce",
  WEBAPP: "Application web",
  MOBILE: "Application mobile",
  DESIGN: "Design",
};

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({
    orderBy: { position: "asc" },
    include: { translations: { select: { locale: true, title: true } } },
  });

  return (
    <>
      <AdminHeader
        title="Projets"
        subtitle="Le portfolio affiché en page d'accueil et sur la page Projets."
        action={
          <Button asChild variant="blue" size="sm">
            <Link href="/admin/projects/new">Nouveau projet</Link>
          </Button>
        }
      />

      {projects.length === 0 ? (
        <EmptyState
          title="Aucun projet"
          description="Ajoutez votre premier projet : capture d'écran, chiffres clés et description en trois langues."
          action={
            <Button asChild variant="blue" size="sm">
              <Link href="/admin/projects/new">Nouveau projet</Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-2">
          {projects.map((project, index) => {
            const fr = project.translations.find((t) => t.locale === "FR");
            return (
              <li
                key={project.id}
                className="surface-card flex flex-wrap items-center gap-3 p-4"
              >
                <div className="flex shrink-0 flex-col gap-0.5">
                  <MoveButton id={project.id} direction="up" disabled={index === 0} />
                  <MoveButton
                    id={project.id}
                    direction="down"
                    disabled={index === projects.length - 1}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 truncate font-display text-base font-bold tracking-[-0.02em]">
                    {fr?.title ?? project.key}
                    {project.featured ? (
                      <Star
                        className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
                        aria-label="Mis en avant"
                      />
                    ) : null}
                  </p>
                  <p className="truncate text-xs text-[var(--ink-45)]">
                    {project.client} · {kindLabels[project.kind]} · {project.year}
                  </p>
                </div>

                <LocaleBadges locales={project.translations.map((t) => t.locale)} />
                <StatusBadge published={project.published} />

                <form action={toggleProjectPublished}>
                  <input type="hidden" name="id" value={project.id} />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-full px-3 py-2 font-display text-xs font-bold text-[var(--ink-65)] transition-colors hover:bg-black/5 hover:text-ink"
                  >
                    {project.published ? "Dépublier" : "Publier"}
                  </button>
                </form>

                <Link
                  href={`/admin/projects/${project.id}`}
                  aria-label={`Modifier ${fr?.title ?? project.key}`}
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
}: {
  id: string;
  direction: "up" | "down";
  disabled: boolean;
}) {
  return (
    <form action={moveProject}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="direction" value={direction} />
      <button
        type="submit"
        disabled={disabled}
        aria-label={direction === "up" ? "Monter" : "Descendre"}
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
