"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export type FaqDraft = {
  questionFr: string;
  answerFr: string;
  questionEn: string;
  answerEn: string;
  questionEs: string;
  answerEs: string;
};

const empty: FaqDraft = {
  questionFr: "",
  answerFr: "",
  questionEn: "",
  answerEn: "",
  questionEs: "",
  answerEs: "",
};

/**
 * Questions fréquentes d'une page d'atterrissage.
 *
 * Les trois langues sont sur la même ligne, comme pour les chiffres clés d'un
 * projet : une FAQ est un couple indissociable, la séparer par onglet de
 * langue ferait perdre le lien entre question et réponse.
 *
 * Ces questions alimentent le bloc visible et les données structurées
 * `FAQPage`, éligibles au résultat déroulant dans Google.
 */
export function FaqEditor({
  name,
  initial = [],
}: {
  name: string;
  initial?: FaqDraft[];
}) {
  const [faqs, setFaqs] = useState<FaqDraft[]>(initial);

  function update(index: number, patch: Partial<FaqDraft>) {
    setFaqs((current) =>
      current.map((faq, position) =>
        position === index ? { ...faq, ...patch } : faq,
      ),
    );
  }

  return (
    <div>
      <span className="field-label">Questions fréquentes</span>
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(
          faqs.filter((faq) => faq.questionFr.trim() && faq.answerFr.trim()),
        )}
      />

      <ul className="grid gap-3">
        {faqs.map((faq, index) => (
          <li
            key={index}
            className="rounded-field bg-aegean-50/60 p-3 shadow-[inset_0_0_0_1px_var(--ink-10)]"
          >
            <div className="flex items-start gap-2">
              <div className="grid flex-1 gap-3">
                {(["Fr", "En", "Es"] as const).map((suffix) => (
                  <div key={suffix} className="grid gap-2">
                    <input
                      value={faq[`question${suffix}`]}
                      onChange={(event) =>
                        update(index, { [`question${suffix}`]: event.target.value })
                      }
                      placeholder={`Question ${suffix.toUpperCase()}`}
                      aria-label={`Question ${suffix.toUpperCase()}`}
                      className="field-input font-display font-semibold"
                    />
                    <textarea
                      value={faq[`answer${suffix}`]}
                      onChange={(event) =>
                        update(index, { [`answer${suffix}`]: event.target.value })
                      }
                      placeholder={`Réponse ${suffix.toUpperCase()}`}
                      aria-label={`Réponse ${suffix.toUpperCase()}`}
                      rows={3}
                      className="field-input resize-y"
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() =>
                  setFaqs((current) =>
                    current.filter((_, position) => position !== index),
                  )
                }
                aria-label="Supprimer cette question"
                className="mt-1 grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-red-700 transition-colors hover:bg-red-50"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => setFaqs((current) => [...current, { ...empty }])}
        className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-4 py-2.5 font-display text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        <Plus className="size-4" />
        Ajouter une question
      </button>

      <p className="mt-1.5 text-xs text-[var(--ink-45)]">
        Le français est obligatoire. Une langue vide reprendra le français.
      </p>
    </div>
  );
}
