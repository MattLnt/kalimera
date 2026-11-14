"use client";

import { useActionState } from "react";

import { saveClient, type FormState } from "./actions";

import { SubmitButton } from "@/components/admin/form-controls";
import { Field, Panel } from "@/components/admin/ui";
import { Select } from "@/components/ui/select";
import { clientStatus } from "@/lib/crm/labels";

export type ClientDraft = {
  id?: string;
  name: string;
  legalName: string;
  siren: string;
  vatNumber: string;
  email: string;
  phone: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  country: string;
  source: string;
  status: string;
  summary: string;
  defaultIssuerId: string;
  printAddress: boolean;
};

const sources = ["Formulaire de contact", "Rendez-vous en ligne", "Recommandation", "Réseau", "Prospection", "Google", "Autre"];

const countries = [
  { value: "FR", label: "France" },
  { value: "BE", label: "Belgique" },
  { value: "LU", label: "Luxembourg" },
  { value: "CH", label: "Suisse" },
  { value: "ES", label: "Espagne" },
  { value: "US", label: "États-Unis" },
  { value: "OTHER", label: "Autre" },
];

const initial: FormState = {};

export function ClientForm({ client, issuers }: { client: ClientDraft; issuers: { id: string; label: string }[] }) {
  const [state, action] = useActionState(saveClient, initial);
  const isNew = !client.id;

  return (
    <form action={action} className="grid gap-4">
      {client.id ? <input type="hidden" name="id" value={client.id} /> : null}

      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <Panel title="Identité" className="h-full">
          <div className="grid gap-4">
            <Field label="Nom du client" hint="Le nom d'usage : « Côté BURO ».">
              <input name="name" defaultValue={client.name} required className="field-input" autoFocus={isNew} />
            </Field>
            <Field label="Raison sociale" hint="Telle qu'elle doit figurer sur les factures.">
              <input name="legalName" defaultValue={client.legalName} className="field-input" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="SIREN / n° d'entreprise">
                <input name="siren" defaultValue={client.siren} className="field-input" />
              </Field>
              <Field label="N° de TVA intracom.">
                <input name="vatNumber" defaultValue={client.vatNumber} className="field-input" />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Statut">
                <Select
                  name="status"
                  defaultValue={client.status || "LEAD"}
                  options={Object.entries(clientStatus).map(([value, item]) => ({ value, label: item.label }))}
                />
              </Field>
              <Field label="Origine">
                <Select
                  name="source"
                  defaultValue={client.source}
                  placeholder="Non renseignée"
                  options={sources.map((value) => ({ value, label: value }))}
                />
              </Field>
            </div>
          </div>
        </Panel>

        <Panel title="Coordonnées" className="h-full">
          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="E-mail">
                <input name="email" type="email" defaultValue={client.email} className="field-input" />
              </Field>
              <Field label="Téléphone">
                <input name="phone" type="tel" defaultValue={client.phone} className="field-input" />
              </Field>
            </div>
            <Field label="Site web">
              <input name="website" type="url" placeholder="https://" defaultValue={client.website} className="field-input" />
            </Field>
            <Field label="Adresse">
              <input name="addressLine1" defaultValue={client.addressLine1} className="field-input" />
            </Field>
            <input name="addressLine2" aria-label="Complément d'adresse" placeholder="Complément" defaultValue={client.addressLine2} className="field-input" />
            <div className="grid gap-4 sm:grid-cols-[120px_1fr_1fr]">
              <Field label="Code postal">
                <input name="postalCode" defaultValue={client.postalCode} className="field-input" />
              </Field>
              <Field label="Ville">
                <input name="city" defaultValue={client.city} className="field-input" />
              </Field>
              <Field label="Pays">
                <Select name="country" defaultValue={client.country || "FR"} options={countries} />
              </Field>
            </div>
          </div>
        </Panel>
      </div>

      {isNew ? (
        <Panel title="Interlocuteur principal" description="Facultatif : vous pourrez en ajouter d'autres sur la fiche.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Field label="Prénom">
              <input name="contactFirstName" className="field-input" />
            </Field>
            <Field label="Nom">
              <input name="contactLastName" className="field-input" />
            </Field>
            <Field label="Fonction">
              <input name="contactRole" className="field-input" />
            </Field>
            <Field label="E-mail">
              <input name="contactEmail" type="email" className="field-input" />
            </Field>
            <Field label="Téléphone">
              <input name="contactPhone" type="tel" className="field-input" />
            </Field>
          </div>
        </Panel>
      ) : null}

      <Panel title="Devis et factures">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Émis par défaut au nom de" hint="Proposé à la création de ses devis et factures.">
            <Select
              name="defaultIssuerId"
              defaultValue={client.defaultIssuerId}
              placeholder="Aucune préférence"
              options={[{ value: "", label: "Aucune préférence" }, ...issuers.map((issuer) => ({ value: issuer.id, label: issuer.label }))]}
            />
          </Field>
          <label className="flex cursor-pointer items-start gap-3 self-end rounded-field bg-black/[0.03] px-4 py-3 text-[0.875rem]">
            <input name="printAddress" type="checkbox" defaultChecked={client.printAddress} className="mt-0.5 size-4 accent-aegean-600" />
            <span>
              <span className="block font-display font-bold">Imprimer l&apos;adresse sur les documents</span>
              <span className="text-[var(--ink-45)]">Décochez pour n&apos;imprimer que le nom (sous-traitance, par exemple).</span>
            </span>
          </label>
        </div>
      </Panel>

      <Panel title="Mémo" description="Ce qu'il faut savoir avant d'appeler : contexte, enjeux, ton.">
        <textarea name="summary" rows={4} defaultValue={client.summary} className="field-input resize-y" />
      </Panel>

      {state.error ? (
        <p role="alert" className="rounded-field bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <SubmitButton label={isNew ? "Créer la fiche" : "Enregistrer"} />
      </div>
    </form>
  );
}

export const emptyClient: ClientDraft = {
  name: "",
  legalName: "",
  siren: "",
  vatNumber: "",
  email: "",
  phone: "",
  website: "",
  addressLine1: "",
  addressLine2: "",
  postalCode: "",
  city: "",
  country: "FR",
  source: "",
  status: "LEAD",
  summary: "",
  defaultIssuerId: "",
  printAddress: true,
};
