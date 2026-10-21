"use client";

import { useActionState } from "react";

import { deleteLanding, saveLanding, type ActionState } from "./actions";

import { FaqEditor, type FaqDraft } from "@/components/admin/faq-editor";
import {
  DeleteButton,
  FormError,
  SubmitButton,
  TagListInput,
} from "@/components/admin/form-controls";
import { LocaleTabs } from "@/components/admin/locale-tabs";
import { Field, Panel } from "@/components/admin/ui";
import { serviceIconNames } from "@/components/site/service-icons";

export type LandingFormData = {
  id?: string;
  kind: "SECTOR" | "LOCATION";
  key: string;
  icon: string;
  highlights: string[];
  position: number;
  published: boolean;
  serviceIds: string[];
  projectIds: string[];
  faqs: FaqDraft[];
  translations: Record<
    "FR" | "EN" | "ES",
    {
      slug: string;
      title: string;
      lead: string;
      body: string;
      seoTitle: string;
      seoDescription: string;
    }
  >;
};

const initialState: ActionState = {};

export function LandingForm({
  landing,
  services,
  projects,
}: {
  landing: LandingFormData;
  services: { id: string; title: string }[];
  projects: { id: string; title: string }[];
}) {
  const [state, formAction] = useActionState(saveLanding, initialState);

  return (
    <>
      <form action={formAction} className="grid gap-4">
        {landing.id ? <input type="hidden" name="id" value={landing.id} /> : null}
        <input
          type="hidden"
          name="services"
          id="services-field"
          defaultValue={JSON.stringify(landing.serviceIds)}
        />
        <input
          type="hidden"
          name="projects"
          id="projects-field"
          defaultValue={JSON.stringify(landing.projectIds)}
        />

        <Panel
          title="Contenu"
          description="Le français est obligatoire. Une langue laissée vide reprendra automatiquement le français sur le site."
        >
          <LocaleTabs
            render={(locale) => {
              const values = landing.translations[locale];
              return (
                <>
                  <Field
                    label={`Titre (${locale})`}
                    hint={
                      locale === "FR"
                        ? "Obligatoire. Mettez-y la requête visée, par exemple « Développement web à Aix-en-Provence »."
                        : "Laissez vide pour reprendre le français."
                    }
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
                    label={`Chapeau (${locale})`}
                    hint="Deux lignes sous le titre, et la description affichée dans Google si aucune description SEO n'est renseignée."
                  >
                    <textarea
                      name={`${locale}_lead`}
                      defaultValue={values.lead}
                      rows={3}
                      className="field-input resize-y"
                    />
                  </Field>

                  <Field
                    label={`Contenu de la page (${locale})`}
                    hint="Markdown accepté. Visez au moins 600 mots : en dessous, la page a peu de chances de se positionner."
                  >
                    <textarea
                      name={`${locale}_body`}
                      defaultValue={values.body}
                      rows={18}
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

        <Panel
          title="Questions fréquentes"
          description="Elles s'affichent en bas de page et alimentent les données structurées FAQ, éligibles au résultat déroulant de Google."
        >
          <FaqEditor name="faqs" initial={landing.faqs} />
        </Panel>

        <Panel
          title="Preuve"
          description="Une page d'atterrissage sans réalisation citée convertit mal. Reliez au moins un projet quand vous en avez un dans ce secteur ou cette ville."
        >
          {projects.length > 0 ? (
            <fieldset>
              <legend className="field-label">Réalisations citées</legend>
              <div className="flex flex-wrap gap-2">
                {projects.map((project) => (
                  <Checkbox
                    key={project.id}
                    fieldId="projects-field"
                    id={project.id}
                    label={project.title}
                    defaultChecked={landing.projectIds.includes(project.id)}
                  />
                ))}
              </div>
            </fieldset>
          ) : null}

          {services.length > 0 ? (
            <fieldset className="mt-6">
              <legend className="field-label">Services mis en avant</legend>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <Checkbox
                    key={service.id}
                    fieldId="services-field"
                    id={service.id}
                    label={service.title}
                    defaultChecked={landing.serviceIds.includes(service.id)}
                  />
                ))}
              </div>
            </fieldset>
          ) : null}
        </Panel>

        <Panel title="Réglages">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Famille de page"
              hint="Détermine la route : /secteurs/… ou /developpement-web/…"
            >
              <select name="kind" defaultValue={landing.kind} className="field-input">
                <option value="SECTOR">Secteur d&apos;activité</option>
                <option value="LOCATION">Ville ou marché</option>
              </select>
            </Field>

            <Field
              label="Identifiant technique"
              hint="Sert de référence interne. Ne change jamais, même si le titre évolue."
            >
              <input
                name="key"
                defaultValue={landing.key}
                className="field-input"
                pattern="[a-z0-9\-]*"
              />
            </Field>

            <Field label="Icône" hint="Affichée sur la carte de la page.">
              <select name="icon" defaultValue={landing.icon} className="field-input">
                {serviceIconNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Ordre d'affichage" hint="Le plus petit nombre s'affiche en premier.">
              <input
                name="position"
                type="number"
                defaultValue={landing.position}
                className="field-input"
                min={0}
              />
            </Field>

            <div className="sm:col-span-2">
              <TagListInput
                name="highlights"
                label="Pastilles affichées sous le titre"
                initial={landing.highlights}
                placeholder="Confidentialité"
                hint="Trois maximum. Identiques dans toutes les langues."
              />
            </div>
          </div>

          <label className="mt-6 flex cursor-pointer items-center gap-3">
            <input
              name="published"
              type="checkbox"
              defaultChecked={landing.published}
              className="size-4 accent-aegean-600"
            />
            <span className="font-display text-sm font-semibold">
              Publier cette page sur le site
            </span>
          </label>
        </Panel>

        <FormError message={state.error} />

        <div className="flex items-center gap-3">
          <SubmitButton />
        </div>
      </form>

      {landing.id ? (
        <form action={deleteLanding} className="mt-8 border-t border-black/5 pt-6">
          <input type="hidden" name="id" value={landing.id} />
          <DeleteButton
            label="Supprimer cette page"
            confirmMessage="Supprimer cette page, ses traductions et ses questions ? Cette action est irréversible."
          />
        </form>
      ) : null}
    </>
  );
}

/** Case à cocher qui entretient la liste JSON du champ caché associé. */
function Checkbox({
  fieldId,
  id,
  label,
  defaultChecked,
}: {
  fieldId: string;
  id: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-full bg-aegean-50 px-3.5 py-2 font-display text-xs font-semibold text-aegean-700">
      <input
        type="checkbox"
        value={id}
        defaultChecked={defaultChecked}
        className="size-3.5 accent-aegean-600"
        onChange={(event) => {
          const field = document.getElementById(
            fieldId,
          ) as HTMLInputElement | null;
          if (!field) return;
          const current: string[] = JSON.parse(field.value || "[]");
          field.value = JSON.stringify(
            event.target.checked
              ? [...new Set([...current, id])]
              : current.filter((item) => item !== id),
          );
        }}
      />
      {label}
    </label>
  );
}
