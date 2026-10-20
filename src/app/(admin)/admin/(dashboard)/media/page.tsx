import Image from "next/image";

import { deleteMedia, updateMediaAlt } from "./actions";

import { DeleteButton, SubmitButton } from "@/components/admin/form-controls";
import { AdminHeader, EmptyState, Field, Panel } from "@/components/admin/ui";
import { optimized } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Médias" };

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      _count: {
        select: {
          projectCovers: true,
          projectGalleries: true,
          postCovers: true,
        },
      },
    },
  });

  return (
    <>
      <AdminHeader
        title="Médias"
        subtitle="Les images envoyées depuis les fiches projet et article. Renseignez le texte alternatif : il sert aux lecteurs d'écran et au référencement."
      />

      {media.length === 0 ? (
        <EmptyState
          title="Aucune image"
          description="Les images apparaissent ici dès que vous en ajoutez une à un projet ou à un article."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {media.map((item) => {
            const uses =
              item._count.projectCovers +
              item._count.projectGalleries +
              item._count.postCovers;

            return (
              <Panel key={item.id}>
                <div className="mb-4 overflow-hidden rounded-field bg-aegean-50">
                  <Image
                    src={optimized(item.url, { width: 600 })}
                    alt={item.altFr || ""}
                    width={item.width}
                    height={item.height}
                    className="h-auto w-full"
                  />
                </div>

                <p className="mb-4 text-xs text-[var(--ink-45)]">
                  {item.width} × {item.height} px · {Math.round(item.bytes / 1024)} Ko ·{" "}
                  {item.format.toUpperCase()} ·{" "}
                  {uses === 0
                    ? "non utilisée"
                    : `utilisée ${uses} fois`}
                </p>

                <form action={updateMediaAlt} className="grid gap-3">
                  <input type="hidden" name="id" value={item.id} />
                  <Field label="Texte alternatif (FR)">
                    <input name="altFr" defaultValue={item.altFr} className="field-input" />
                  </Field>
                  <Field label="Texte alternatif (EN)">
                    <input name="altEn" defaultValue={item.altEn} className="field-input" />
                  </Field>
                  <Field label="Texte alternatif (ES)">
                    <input name="altEs" defaultValue={item.altEs} className="field-input" />
                  </Field>
                  <div>
                    <SubmitButton label="Enregistrer les textes" />
                  </div>
                </form>

                {uses === 0 ? (
                  <form action={deleteMedia} className="mt-4 border-t border-black/5 pt-4">
                    <input type="hidden" name="id" value={item.id} />
                    <DeleteButton
                      label="Supprimer cette image"
                      confirmMessage="Supprimer cette image de la bibliothèque et de Cloudinary ?"
                    />
                  </form>
                ) : (
                  <p className="mt-4 border-t border-black/5 pt-4 text-xs text-[var(--ink-45)]">
                    Cette image est utilisée : retirez-la d’abord des contenus concernés
                    pour pouvoir la supprimer.
                  </p>
                )}
              </Panel>
            );
          })}
        </div>
      )}
    </>
  );
}
