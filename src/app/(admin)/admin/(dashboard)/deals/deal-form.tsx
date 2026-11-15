"use client";

import { useActionState, useState } from "react";

import { saveDeal, type FormState } from "./actions";

import { SubmitButton } from "@/components/admin/form-controls";
import { Field, Panel } from "@/components/admin/ui";
import { DatePicker } from "@/components/ui/date-picker";
import { Select } from "@/components/ui/select";
import { dealStages } from "@/lib/crm/labels";

export type DealDraft = {
  id?: string;
  clientId: string;
  title: string;
  stage: string;
  amount: string;
  probability: string;
  description: string;
  startDate: string;
  dueDate: string;
  lostReason: string;
};

const initial: FormState = {};

export function DealForm({ deal, clients }: { deal: DealDraft; clients: { id: string; name: string }[] }) {
  const [state, action] = useActionState(saveDeal, initial);
  const [stage, setStage] = useState(deal.stage || "LEAD");

  return (
    <form action={action} className="grid gap-4">
      {deal.id ? <input type="hidden" name="id" value={deal.id} /> : null}

      <div className="grid items-stretch gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Panel title="Le projet" className="h-full">
          <div className="grid gap-4">
            <Field label="Client">
              <Select
                name="clientId"
                required
                defaultValue={deal.clientId}
                placeholder="Choisir un client"
                options={clients.map((client) => ({ value: client.id, label: client.name }))}
              />
            </Field>
            <Field label="Nom du projet" hint="Ce qui sera livré : « Boutique B2B avec devis en ligne ».">
              <input name="title" defaultValue={deal.title} required className="field-input" />
            </Field>
            <Field label="Description" hint="Le besoin, le périmètre, ce qui a été convenu.">
              <textarea name="description" rows={6} defaultValue={deal.description} className="field-input resize-y" />
            </Field>
          </div>
        </Panel>

        <Panel title="Suivi" className="h-full">
          <div className="grid gap-4">
            <Field label="Étape">
              <Select
                name="stage"
                defaultValue={stage}
                onValueChange={setStage}
                options={dealStages.map((item) => ({ value: item.value, label: item.label }))}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Montant estimé HT" hint="Remplacé automatiquement par le total des devis dès qu'il y en a.">
                <div className="relative">
                  <input name="amount" inputMode="decimal" defaultValue={deal.amount} placeholder="15 000" className="field-input pr-9" />
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[var(--ink-45)]">€</span>
                </div>
              </Field>
              <Field label="Probabilité">
                <div className="relative">
                  <input name="probability" type="number" min={0} max={100} defaultValue={deal.probability} placeholder="50" className="field-input pr-9" />
                  <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-[var(--ink-45)]">%</span>
                </div>
              </Field>
              <Field label="Démarrage">
                <DatePicker name="startDate" defaultValue={deal.startDate} placeholder="Non fixé" />
              </Field>
              <Field label="Livraison prévue">
                <DatePicker name="dueDate" defaultValue={deal.dueDate} placeholder="Non fixée" />
              </Field>
            </div>
            {stage === "LOST" ? (
              <Field label="Pourquoi perdu ?" hint="Prix, délai, concurrent, projet abandonné… utile pour la suite.">
                <input name="lostReason" defaultValue={deal.lostReason} className="field-input" />
              </Field>
            ) : null}
          </div>
        </Panel>
      </div>

      {state.error ? (
        <p role="alert" className="rounded-field bg-[#EEF3FA] px-4 py-3 text-sm text-[#0B3A75]">
          {state.error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <SubmitButton label={deal.id ? "Enregistrer" : "Créer le projet"} />
      </div>
    </form>
  );
}
