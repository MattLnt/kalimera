"use client";

import { useActionState } from "react";

import { deleteService, saveService, type ActionState } from "./actions";

import { DeleteButton, FormError, SubmitButton, TagListInput } from "@/components/admin/form-controls";
import { LocaleTabs } from "@/components/admin/locale-tabs";
import { Field, Panel } from "@/components/admin/ui";
import { serviceIconNames } from "@/components/site/service-icons";

export type ServiceFormData = {
  id?: string;
  key: string;
  icon: string;
  stack: string[];
  position: number;
  published: boolean;
  translations: Record<
    "FR" | "EN" | "ES",
    {
      slug: string;
      title: string;
      summary: string;
      body: string;
      seoTitle: string;
      seoDescription: string;
    }
  >;
};

const initialState: ActionState = {};

export function ServiceForm({ service }: { service: ServiceFormData }) {
  const [state, formAction] = useActionState(saveService, initialState);

  return (
    <>
      <form action={formAction} className="grid gap-4">
        {service.id ? <input type="hidden" name="id" value={service.id} /> : null}

        <Panel
          title="Contenu"
          description="Le français est obligatoire. Une langue laissée vide reprendra automatiquement le français sur le site."
        >
          <LocaleTabs
            render={(locale) => {
              const values = service.translations[locale];
              return (
                <>
                  <Field
                    label={`Titre (${locale})`}
                    hint={locale === "FR" ? "Obligatoire." : "Laissez vide pour reprendre le français."}
                  >
                    <input
                      name={`${locale}_title`}
                      defaultValue={values.title}
                      className="field-input"
                      required={locale === "FR"}
                    />
                  </Field>

                  <Field
                    label={`Lien dans l'URL (${locale})`}
                    hint="Généré depuis le titre si laissé vide. Évitez de le modifier une fois la page en ligne."
                  >
                    <input
                      name={`${locale}_slug`}
                      defaultValue={values.slug}
                      className="field-input"
                      pattern="[a-z0-9\-]*"
                    />
                  </Field>

                  <Field
                    label={`Résumé (${locale})`}
                    hint="Deux lignes maximum : c'est le texte de la carte en page d'accueil."
                  >
                    <textarea
                      name={`${locale}_summary`}
                      defaultValue={values.summary}
                      rows={3}
                      className="field-input resize-y"
                    />
                  </Field>

                  <Field
                    label={`Contenu de la page (${locale})`}
                    hint="Markdown accepté : ## pour un titre, - pour une liste, **gras**."
                  >
                    <textarea
                      name={`${locale}_body`}
                      defaultValue={values.body}
                      rows={14}
                      className="field-input resize-y font-mono text-[0.8125rem]"
                    />
                  </Field>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label={`Titre SEO (${locale})`}
                      hint="Facultatif. Reprend le titre si vide."
                    >
                      <input
                        name={`${locale}_seoTitle`}
                        defaultValue={values.seoTitle}
                        className="field-input"
                        maxLength={70}
                      />
                    </Field>
                    <Field
                      label={`Description SEO (${locale})`}
                      hint="Facultatif, 160 caractères maximum."
                    >
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

        <Panel title="Réglages">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Identifiant technique"
              hint="Sert de référence interne. Ne change jamais, même si le titre évolue."
            >
              <input
                name="key"
                defaultValue={service.key}
                className="field-input"
                pattern="[a-z0-9\-]*"
              />
            </Field>

            <Field label="Icône" hint="Affichée en haut de la carte du service.">
              <select name="icon" defaultValue={service.icon} className="field-input">
                {serviceIconNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </Field>

            <TagListInput
              name="stack"
              label="Pastilles affichées sur la carte"
              initial={service.stack}
              placeholder="Next.js"
              hint="Identiques dans toutes les langues."
            />

            <Field label="Ordre d'affichage" hint="Le plus petit nombre s'affiche en premier.">
              <input
                name="position"
                type="number"
                defaultValue={service.position}
                className="field-input"
                min={0}
              />
            </Field>
          </div>

          <label className="mt-6 flex cursor-pointer items-center gap-3">
            <input
              name="published"
              type="checkbox"
              defaultChecked={service.published}
              className="size-4 accent-aegean-600"
            />
            <span className="font-display text-sm font-semibold">
              Publier ce service sur le site
            </span>
          </label>
        </Panel>

        <FormError message={state.error} />

        <div className="flex items-center gap-3">
          <SubmitButton />
        </div>
      </form>

      {service.id ? (
        <form action={deleteService} className="mt-8 border-t border-black/5 pt-6">
          <input type="hidden" name="id" value={service.id} />
          <DeleteButton
            label="Supprimer ce service"
            confirmMessage="Supprimer ce service et ses trois traductions ? Cette action est irréversible."
          />
        </form>
      ) : null}
    </>
  );
}
