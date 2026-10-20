import { AdminHeader, Panel, StatusBadge } from "@/components/admin/ui";
import { DeleteButton, SubmitButton } from "@/components/admin/form-controls";
import { LocaleTabs } from "@/components/admin/locale-tabs";
import { Field } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";

import { deleteTestimonial, saveTestimonial, toggleTestimonialPublished } from "./actions";

export const metadata = { title: "Témoignages" };

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { position: "asc" },
    include: { translations: true },
  });

  return (
    <>
      <AdminHeader
        title="Témoignages"
        subtitle="Le premier témoignage publié s'affiche en page d'accueil."
      />

      <div className="grid gap-4">
        {testimonials.map((testimonial) => {
          const byLocale = Object.fromEntries(
            testimonial.translations.map((t) => [t.locale, t]),
          );

          return (
            <Panel key={testimonial.id}>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="display-4">{testimonial.author}</h2>
                <div className="flex items-center gap-3">
                  <StatusBadge published={testimonial.published} />
                  <form action={toggleTestimonialPublished}>
                    <input type="hidden" name="id" value={testimonial.id} />
                    <button
                      type="submit"
                      className="cursor-pointer rounded-full px-3 py-2 font-display text-xs font-bold text-[var(--ink-65)] transition-colors hover:bg-black/5 hover:text-ink"
                    >
                      {testimonial.published ? "Dépublier" : "Publier"}
                    </button>
                  </form>
                </div>
              </div>

              <form action={saveTestimonial} className="grid gap-5">
                <input type="hidden" name="id" value={testimonial.id} />

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Client ou société">
                    <input
                      name="author"
                      defaultValue={testimonial.author}
                      className="field-input"
                      required
                    />
                  </Field>
                  <Field label="Ordre d'affichage">
                    <input
                      name="position"
                      type="number"
                      defaultValue={testimonial.position}
                      className="field-input"
                      min={0}
                    />
                  </Field>
                </div>

                <LocaleTabs
                  render={(locale) => (
                    <>
                      <Field label={`Citation (${locale})`}>
                        <textarea
                          name={`${locale}_quote`}
                          defaultValue={byLocale[locale]?.quote ?? ""}
                          rows={4}
                          className="field-input resize-y"
                        />
                      </Field>
                      <Field
                        label={`Signature (${locale})`}
                        hint="Ex. « Directrice marketing — Thalassa Resorts »."
                      >
                        <input
                          name={`${locale}_role`}
                          defaultValue={byLocale[locale]?.role ?? ""}
                          className="field-input"
                        />
                      </Field>
                    </>
                  )}
                />

                <div>
                  <SubmitButton />
                </div>
              </form>

              <form action={deleteTestimonial} className="mt-6 border-t border-black/5 pt-5">
                <input type="hidden" name="id" value={testimonial.id} />
                <DeleteButton
                  label="Supprimer ce témoignage"
                  confirmMessage="Supprimer ce témoignage et ses traductions ?"
                />
              </form>
            </Panel>
          );
        })}

        <Panel
          title="Ajouter un témoignage"
          description="Saisissez au moins la version française ; les autres langues pourront être complétées plus tard."
        >
          <form action={saveTestimonial} className="grid gap-5">
            <Field label="Client ou société">
              <input name="author" className="field-input" required />
            </Field>

            <LocaleTabs
              render={(locale) => (
                <>
                  <Field label={`Citation (${locale})`}>
                    <textarea
                      name={`${locale}_quote`}
                      rows={4}
                      className="field-input resize-y"
                    />
                  </Field>
                  <Field label={`Signature (${locale})`}>
                    <input name={`${locale}_role`} className="field-input" />
                  </Field>
                </>
              )}
            />

            <div>
              <SubmitButton label="Ajouter" busyLabel="Ajout…" />
            </div>
          </form>
        </Panel>
      </div>
    </>
  );
}
