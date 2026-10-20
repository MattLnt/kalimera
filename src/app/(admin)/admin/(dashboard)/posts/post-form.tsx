"use client";

import { useActionState } from "react";

import { deletePost, savePost, type ActionState } from "./actions";

import { DeleteButton, FormError, SubmitButton } from "@/components/admin/form-controls";
import { ImagePicker, type PickedMedia } from "@/components/admin/image-picker";
import { LocaleTabs } from "@/components/admin/locale-tabs";
import { Field, Panel } from "@/components/admin/ui";

export type PostFormData = {
  id?: string;
  key: string;
  category: string;
  published: boolean;
  publishedAt: string;
  coverImage: PickedMedia | null;
  translations: Record<
    "FR" | "EN" | "ES",
    {
      slug: string;
      title: string;
      excerpt: string;
      body: string;
      categoryLabel: string;
      seoTitle: string;
      seoDescription: string;
    }
  >;
};

const initialState: ActionState = {};

export function PostForm({ post }: { post: PostFormData }) {
  const [state, formAction] = useActionState(savePost, initialState);

  return (
    <>
      <form action={formAction} className="grid gap-4">
        {post.id ? <input type="hidden" name="id" value={post.id} /> : null}

        <Panel
          title="Contenu"
          description="Le français est obligatoire. Une langue laissée vide reprendra le français."
        >
          <LocaleTabs
            render={(locale) => {
              const values = post.translations[locale];
              return (
                <>
                  <Field label={`Titre (${locale})`}>
                    <input
                      name={`${locale}_title`}
                      defaultValue={values.title}
                      className="field-input"
                      required={locale === "FR"}
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={`Lien dans l'URL (${locale})`} hint="Généré depuis le titre si vide.">
                      <input
                        name={`${locale}_slug`}
                        defaultValue={values.slug}
                        className="field-input"
                        pattern="[a-z0-9\-]*"
                      />
                    </Field>
                    <Field
                      label={`Catégorie affichée (${locale})`}
                      hint="Ex. « Performance », « Technique », « Mobile »."
                    >
                      <input
                        name={`${locale}_categoryLabel`}
                        defaultValue={values.categoryLabel}
                        className="field-input"
                      />
                    </Field>
                  </div>

                  <Field label={`Accroche (${locale})`} hint="Deux lignes, affichées sur la carte.">
                    <textarea
                      name={`${locale}_excerpt`}
                      defaultValue={values.excerpt}
                      rows={3}
                      className="field-input resize-y"
                    />
                  </Field>

                  <Field
                    label={`Article (${locale})`}
                    hint="Markdown : ## titre, - liste, **gras**, [lien](url)."
                  >
                    <textarea
                      name={`${locale}_body`}
                      defaultValue={values.body}
                      rows={22}
                      className="field-input resize-y font-mono text-[0.8125rem]"
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={`Titre SEO (${locale})`} hint="Facultatif.">
                      <input
                        name={`${locale}_seoTitle`}
                        defaultValue={values.seoTitle}
                        className="field-input"
                        maxLength={70}
                      />
                    </Field>
                    <Field label={`Description SEO (${locale})`} hint="160 caractères maximum.">
                      <input
                        name={`${locale}_seoDescription`}
                        defaultValue={values.seoDescription}
                        className="field-input"
                        maxLength={160}
                      />
                    </Field>
                  </div>
                </>
              );
            }}
          />
        </Panel>

        <Panel title="Image de couverture">
          <ImagePicker
            name="coverImageId"
            initial={post.coverImage}
            label="Couverture"
            hint="Format conseillé : 1600 × 1000 px. Sert aussi à l'aperçu sur les réseaux sociaux."
          />
        </Panel>

        <Panel title="Publication">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Identifiant technique" hint="Référence interne, ne change pas.">
              <input
                name="key"
                defaultValue={post.key}
                className="field-input"
                pattern="[a-z0-9\-]*"
              />
            </Field>

            <Field label="Catégorie interne" hint="engineering, performance, mobile, studio…">
              <input name="category" defaultValue={post.category} className="field-input" />
            </Field>

            <Field
              label="Date de publication"
              hint="Une date future garde l'article invisible jusqu'à cette date."
            >
              <input
                name="publishedAt"
                type="datetime-local"
                defaultValue={post.publishedAt}
                className="field-input"
              />
            </Field>
          </div>

          <label className="mt-6 flex cursor-pointer items-center gap-3">
            <input
              name="published"
              type="checkbox"
              defaultChecked={post.published}
              className="size-4 accent-aegean-600"
            />
            <span className="font-display text-sm font-semibold">
              Publier cet article sur le site
            </span>
          </label>
        </Panel>

        <FormError message={state.error} />

        <div>
          <SubmitButton />
        </div>
      </form>

      {post.id ? (
        <form action={deletePost} className="mt-8 border-t border-black/5 pt-6">
          <input type="hidden" name="id" value={post.id} />
          <DeleteButton
            label="Supprimer cet article"
            confirmMessage="Supprimer cet article et ses traductions ? Cette action est irréversible."
          />
        </form>
      ) : null}
    </>
  );
}
