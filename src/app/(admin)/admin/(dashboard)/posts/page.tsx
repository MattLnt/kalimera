import { Pencil } from "lucide-react";
import Link from "next/link";

import { togglePostPublished } from "./actions";

import { AdminHeader, EmptyState, LocaleBadges, StatusBadge } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Journal" };

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    include: { translations: { select: { locale: true, title: true } } },
  });

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <>
      <AdminHeader
        title="Journal"
        subtitle="Les articles publiés sur le site, dans les trois langues."
        action={
          <Button asChild variant="blue" size="sm">
            <Link href="/admin/posts/new">Nouvel article</Link>
          </Button>
        }
      />

      {posts.length === 0 ? (
        <EmptyState
          title="Aucun article"
          description="Écrivez votre premier article : il apparaîtra en page d'accueil et dans le journal."
          action={
            <Button asChild variant="blue" size="sm">
              <Link href="/admin/posts/new">Nouvel article</Link>
            </Button>
          }
        />
      ) : (
        <ul className="grid gap-2">
          {posts.map((post) => {
            const fr = post.translations.find((t) => t.locale === "FR");
            const scheduled =
              post.published && post.publishedAt && post.publishedAt > new Date();

            return (
              <li key={post.id} className="surface-card flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-base font-bold tracking-[-0.02em]">
                    {fr?.title ?? post.key}
                  </p>
                  <p className="truncate text-xs text-[var(--ink-45)]">
                    {post.publishedAt ? formatter.format(post.publishedAt) : "Sans date"}
                    {scheduled ? " · programmé" : ""}
                  </p>
                </div>

                <LocaleBadges locales={post.translations.map((t) => t.locale)} />
                <StatusBadge published={post.published} />

                <form action={togglePostPublished}>
                  <input type="hidden" name="id" value={post.id} />
                  <button
                    type="submit"
                    className="cursor-pointer rounded-full px-3 py-2 font-display text-xs font-bold text-[var(--ink-65)] transition-colors hover:bg-black/5 hover:text-ink"
                  >
                    {post.published ? "Dépublier" : "Publier"}
                  </button>
                </form>

                <Link
                  href={`/admin/posts/${post.id}`}
                  aria-label={`Modifier ${fr?.title ?? post.key}`}
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
