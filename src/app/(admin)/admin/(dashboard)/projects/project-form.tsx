"use client";

import { useActionState } from "react";

import { deleteProject, saveProject, type ActionState } from "./actions";

import {
  DeleteButton,
  FormError,
  SubmitButton,
  TagListInput,
} from "@/components/admin/form-controls";
import { GalleryPicker, ImagePicker, type PickedMedia } from "@/components/admin/image-picker";
import { LocaleTabs } from "@/components/admin/locale-tabs";
import { MetricsEditor, type MetricDraft } from "@/components/admin/metrics-editor";
import { Field, Panel } from "@/components/admin/ui";

export type ProjectFormData = {
  id?: string;
  key: string;
  kind: string;
  client: string;
  year: number;
  liveUrl: string;
  stack: string[];
  accent: string;
  featured: boolean;
  position: number;
  published: boolean;
  coverImage: PickedMedia | null;
  gallery: PickedMedia[];
  serviceIds: string[];
  metrics: MetricDraft[];
  translations: Record<
    "FR" | "EN" | "ES",
    {
      slug: string;
      title: string;
      category: string;
      summary: string;
      challenge: string;
      solution: string;
      outcome: string;
      seoTitle: string;
      seoDescription: string;
    }
  >;
};

const kinds = [
  { value: "WEBSITE", label: "Site vitrine" },
  { value: "ECOMMERCE", label: "E-commerce" },
  { value: "WEBAPP", label: "Application web" },
  { value: "MOBILE", label: "Application mobile" },
  { value: "DESIGN", label: "Design" },
];

const accents = [
  { value: "g1", label: "Bleu clair" },
  { value: "g2", label: "Bleu vif" },
  { value: "g3", label: "Bleu pâle" },
  { value: "g4", label: "Bleu nuit" },
];

const initialState: ActionState = {};

export function ProjectForm({
  project,
  services,
}: {
  project: ProjectFormData;
  services: { id: string; title: string }[];
}) {
  const [state, formAction] = useActionState(saveProject, initialState);

  return (
    <>
      <form action={formAction} className="grid gap-4">
        {project.id ? <input type="hidden" name="id" value={project.id} /> : null}
        <input
          type="hidden"
          name="services"
          // Rempli par les cases à cocher ci-dessous via un champ miroir.
          id="services-field"
          defaultValue={JSON.stringify(project.serviceIds)}
        />

        <Panel
          title="Contenu"
          description="Le français est obligatoire. Une langue laissée vide reprendra le français."
        >
          <LocaleTabs
            render={(locale) => {
              const values = project.translations[locale];
              return (
                <>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={`Titre (${locale})`}>
                      <input
                        name={`${locale}_title`}
                        defaultValue={values.title}
                        className="field-input"
                        required={locale === "FR"}
                      />
                    </Field>
                    <Field
                      label={`Sur-titre (${locale})`}
                      hint="Ex. « Site vitrine · Hôtellerie »."
                    >
                      <input
                        name={`${locale}_category`}
                        defaultValue={values.category}
                        className="field-input"
                      />
                    </Field>
                  </div>

                  <Field label={`Lien dans l'URL (${locale})`} hint="Généré depuis le titre si vide.">
                    <input
                      name={`${locale}_slug`}
                      defaultValue={values.slug}
                      className="field-input"
                      pattern="[a-z0-9\-]*"
                    />
                  </Field>

                  <Field label={`Résumé (${locale})`} hint="Une phrase, affichée en haut de la fiche.">
                    <textarea
                      name={`${locale}_summary`}
                      defaultValue={values.summary}
                      rows={2}
                      className="field-input resize-y"
                    />
                  </Field>

                  <Field label={`Le besoin (${locale})`}>
                    <textarea
                      name={`${locale}_challenge`}
                      defaultValue={values.challenge}
                      rows={4}
                      className="field-input resize-y"
                    />
                  </Field>

                  <Field label={`Ce qu'on a fait (${locale})`}>
                    <textarea
                      name={`${locale}_solution`}
                      defaultValue={values.solution}
                      rows={4}
                      className="field-input resize-y"
                    />
                  </Field>

                  <Field label={`Le résultat (${locale})`}>
                    <textarea
                      name={`${locale}_outcome`}
                      defaultValue={values.outcome}
                      rows={4}
                      className="field-input resize-y"
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

        <Panel title="Images">
          <div className="grid gap-6">
            <ImagePicker
              name="coverImageId"
              initial={project.coverImage}
              label="Capture d'écran principale"
              hint="Affichée dans la fenêtre de navigateur de la carte. Format conseillé : 1600 × 1000 px, cadrée sur le haut de la page."
            />
            <GalleryPicker
              name="gallery"
              initial={project.gallery}
              label="Galerie"
              hint="Images supplémentaires affichées en bas de la fiche projet."
            />
          </div>
        </Panel>

        <Panel title="Chiffres clés">
          <MetricsEditor name="metrics" initial={project.metrics} />
        </Panel>

        <Panel title="Réglages">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Client">
              <input
                name="client"
                defaultValue={project.client}
                className="field-input"
                required
              />
            </Field>

            <Field label="Année de mise en ligne">
              <input
                name="year"
                type="number"
                defaultValue={project.year}
                className="field-input"
                min={2000}
                max={2100}
              />
            </Field>

            <Field label="Type de projet" hint="Un projet mobile s'affiche dans une maquette de téléphone.">
              <select name="kind" defaultValue={project.kind} className="field-input">
                {kinds.map((kind) => (
                  <option key={kind.value} value={kind.value}>
                    {kind.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Couleur de la carte" hint="Utilisée en fond derrière la maquette.">
              <select name="accent" defaultValue={project.accent} className="field-input">
                {accents.map((accent) => (
                  <option key={accent.value} value={accent.value}>
                    {accent.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Adresse du site en ligne" hint="Facultatif. Affichée dans la barre d'adresse de la maquette.">
              <input
                name="liveUrl"
                type="url"
                defaultValue={project.liveUrl}
                placeholder="https://exemple.com"
                className="field-input"
              />
            </Field>

            <Field label="Identifiant technique" hint="Référence interne, ne change pas.">
              <input
                name="key"
                defaultValue={project.key}
                className="field-input"
                pattern="[a-z0-9\-]*"
              />
            </Field>

            <TagListInput
              name="stack"
              label="Technologies"
              initial={project.stack}
              placeholder="Next.js"
            />

            <Field label="Ordre d'affichage" hint="Le plus petit nombre s'affiche en premier.">
              <input
                name="position"
                type="number"
                defaultValue={project.position}
                className="field-input"
                min={0}
              />
            </Field>
          </div>

          {services.length > 0 ? (
            <fieldset className="mt-6">
              <legend className="field-label">Services mobilisés</legend>
              <div className="flex flex-wrap gap-2">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className="flex cursor-pointer items-center gap-2 rounded-full bg-aegean-50 px-3.5 py-2 font-display text-xs font-semibold text-aegean-700"
                  >
                    <input
                      type="checkbox"
                      value={service.id}
                      defaultChecked={project.serviceIds.includes(service.id)}
                      className="size-3.5 accent-aegean-600"
                      onChange={(event) => {
                        // Le champ caché conserve la liste au format JSON.
                        const field = document.getElementById(
                          "services-field",
                        ) as HTMLInputElement | null;
                        if (!field) return;
                        const current: string[] = JSON.parse(field.value || "[]");
                        field.value = JSON.stringify(
                          event.target.checked
                            ? [...new Set([...current, service.id])]
                            : current.filter((id) => id !== service.id),
                        );
                      }}
                    />
                    {service.title}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          <div className="mt-6 grid gap-3">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                name="featured"
                type="checkbox"
                defaultChecked={project.featured}
                className="size-4 accent-aegean-600"
              />
              <span className="font-display text-sm font-semibold">
                Mettre en avant en page d’accueil
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-3">
              <input
                name="published"
                type="checkbox"
                defaultChecked={project.published}
                className="size-4 accent-aegean-600"
              />
              <span className="font-display text-sm font-semibold">
                Publier ce projet sur le site
              </span>
            </label>
          </div>
        </Panel>

        <FormError message={state.error} />

        <div>
          <SubmitButton />
        </div>
      </form>

      {project.id ? (
        <form action={deleteProject} className="mt-8 border-t border-black/5 pt-6">
          <input type="hidden" name="id" value={project.id} />
          <DeleteButton
            label="Supprimer ce projet"
            confirmMessage="Supprimer ce projet, ses traductions et ses chiffres clés ? Cette action est irréversible."
          />
        </form>
      ) : null}
    </>
  );
}
