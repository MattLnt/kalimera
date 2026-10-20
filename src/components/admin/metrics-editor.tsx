"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export type MetricDraft = {
  value: string;
  labelFr: string;
  labelEn: string;
  labelEs: string;
};

const empty: MetricDraft = { value: "", labelFr: "", labelEn: "", labelEs: "" };

/**
 * Chiffres clés d'un projet. Le premier est affiché en badge au survol de la
 * carte ; tous apparaissent sur la fiche projet.
 */
export function MetricsEditor({
  name,
  initial = [],
}: {
  name: string;
  initial?: MetricDraft[];
}) {
  const [metrics, setMetrics] = useState<MetricDraft[]>(initial);

  function update(index: number, patch: Partial<MetricDraft>) {
    setMetrics((current) =>
      current.map((metric, position) =>
        position === index ? { ...metric, ...patch } : metric,
      ),
    );
  }

  return (
    <div>
      <span className="field-label">Chiffres clés</span>
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(metrics.filter((metric) => metric.value.trim()))}
      />

      <ul className="grid gap-3">
        {metrics.map((metric, index) => (
          <li
            key={index}
            className="rounded-field bg-aegean-50/60 p-3 shadow-[inset_0_0_0_1px_var(--ink-10)]"
          >
            <div className="flex items-start gap-2">
              <div className="grid flex-1 gap-2 sm:grid-cols-4">
                <input
                  value={metric.value}
                  onChange={(event) => update(index, { value: event.target.value })}
                  placeholder="98"
                  aria-label="Valeur"
                  className="field-input font-display font-bold"
                />
                <input
                  value={metric.labelFr}
                  onChange={(event) => update(index, { labelFr: event.target.value })}
                  placeholder="Libellé FR"
                  aria-label="Libellé français"
                  className="field-input"
                />
                <input
                  value={metric.labelEn}
                  onChange={(event) => update(index, { labelEn: event.target.value })}
                  placeholder="Libellé EN"
                  aria-label="Libellé anglais"
                  className="field-input"
                />
                <input
                  value={metric.labelEs}
                  onChange={(event) => update(index, { labelEs: event.target.value })}
                  placeholder="Libellé ES"
                  aria-label="Libellé espagnol"
                  className="field-input"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setMetrics((current) =>
                    current.filter((_, position) => position !== index),
                  )
                }
                aria-label="Supprimer ce chiffre"
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
        onClick={() => setMetrics((current) => [...current, { ...empty }])}
        className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-full bg-ink px-4 py-2.5 font-display text-sm font-bold text-white transition-opacity hover:opacity-90"
      >
        <Plus className="size-4" />
        Ajouter un chiffre
      </button>

      <p className="mt-1.5 text-xs text-[var(--ink-45)]">
        Le premier chiffre s’affiche en badge au survol de la carte projet.
      </p>
    </div>
  );
}
