import { FileText, FolderKanban, LayoutGrid, Mail } from "lucide-react";
import Link from "next/link";

import { AdminHeader, Panel } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const metadata = { title: "Tableau de bord" };

export default async function AdminHomePage() {
  const [
    servicesCount,
    servicesDraft,
    projectsCount,
    projectsDraft,
    postsCount,
    postsDraft,
    newMessages,
    recentMessages,
    missingTranslations,
  ] = await Promise.all([
    prisma.service.count(),
    prisma.service.count({ where: { published: false } }),
    prisma.project.count(),
    prisma.project.count({ where: { published: false } }),
    prisma.post.count(),
    prisma.post.count({ where: { published: false } }),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    prisma.contactMessage.findMany({
      where: { status: { not: "ARCHIVED" } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    // Contenus publiés auxquels il manque au moins une des trois langues.
    prisma.project.count({
      where: { published: true, translations: { none: { locale: "ES" } } },
    }),
  ]);

  const cards = [
    {
      href: "/admin/services",
      label: "Services",
      icon: LayoutGrid,
      total: servicesCount,
      draft: servicesDraft,
    },
    {
      href: "/admin/projects",
      label: "Projets",
      icon: FolderKanban,
      total: projectsCount,
      draft: projectsDraft,
    },
    {
      href: "/admin/posts",
      label: "Articles",
      icon: FileText,
      total: postsCount,
      draft: postsDraft,
    },
    {
      href: "/admin/messages",
      label: "Messages non lus",
      icon: Mail,
      total: newMessages,
      draft: 0,
      highlight: newMessages > 0,
    },
  ];

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <>
      <AdminHeader
        title="Tableau de bord"
        subtitle="Vue d'ensemble du contenu et des demandes entrantes."
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className={cn(
                "surface-card surface-card-hover p-5",
                card.highlight && "ring-2 ring-aegean-300",
              )}
            >
              <span className="grid size-10 place-items-center rounded-field bg-aegean-100 text-aegean-700">
                <Icon className="size-4.5" />
              </span>
              <p className="mt-4 font-display text-3xl font-extrabold tracking-[-0.04em]">
                {card.total}
              </p>
              <p className="text-[0.9375rem] text-[var(--ink-65)]">{card.label}</p>
              {card.draft > 0 ? (
                <p className="mt-1 text-xs text-amber-700">
                  dont {card.draft} en brouillon
                </p>
              ) : null}
            </Link>
          );
        })}
      </div>

      {missingTranslations > 0 ? (
        <Panel className="mb-4 bg-amber-50 ring-1 ring-amber-200">
          <p className="font-display text-sm font-bold text-amber-900">
            {missingTranslations} projet{missingTranslations > 1 ? "s" : ""} publié
            {missingTranslations > 1 ? "s" : ""} sans version espagnole
          </p>
          <p className="mt-1 text-[0.875rem] text-amber-800">
            Le site affichera la version française aux visiteurs espagnols. Complétez
            la traduction depuis la fiche du projet.
          </p>
        </Panel>
      ) : null}

      <Panel
        title="Dernières demandes"
        description="Les cinq messages les plus récents du formulaire de contact."
      >
        {recentMessages.length === 0 ? (
          <p className="text-[0.9375rem] text-[var(--ink-45)]">
            Aucune demande pour l’instant.
          </p>
        ) : (
          <ul className="grid gap-2">
            {recentMessages.map((message) => (
              <li
                key={message.id}
                className="flex flex-wrap items-center gap-3 rounded-field bg-aegean-50/60 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-bold">
                    {message.name}
                    <span className="font-normal text-[var(--ink-45)]">
                      {" "}
                      — {message.subject}
                    </span>
                  </p>
                  <p className="truncate text-xs text-[var(--ink-45)]">
                    {formatter.format(message.createdAt)}
                  </p>
                </div>
                {message.status === "NEW" ? (
                  <span className="rounded-full bg-aegean-600 px-2.5 py-1 font-display text-[0.6875rem] font-bold text-white">
                    Nouveau
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        <Link
          href="/admin/messages"
          className="mt-4 inline-block font-display text-sm font-bold text-aegean-700 hover:underline"
        >
          Voir tous les messages →
        </Link>
      </Panel>
    </>
  );
}
