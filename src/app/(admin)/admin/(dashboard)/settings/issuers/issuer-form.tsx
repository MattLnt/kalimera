"use client";

import { useActionState } from "react";

import { saveIssuer, type IssuerState } from "./actions";

import { SubmitButton } from "@/components/admin/form-controls";
import { Field, Panel } from "@/components/admin/ui";
import { Select } from "@/components/ui/select";

export type IssuerDraft = {
  id?: string;
  label: string;
  name: string;
  headerLines: string;
  footer: string;
  email: string;
  phone: string;
  website: string;
  vatMention: string;
  paymentTerms: string;
  latePenalty: string;
  recoveryFee: string;
  currency: string;
  bankHolder: string;
  bankName: string;
  iban: string;
  bic: string;
  depositPercent: number;
  quoteValidityDays: number;
  invoicePrefix: string;
  quotePrefix: string;
};

const initial: IssuerState = {};

export function IssuerForm({ issuer }: { issuer: IssuerDraft }) {
  const [state, action] = useActionState(saveIssuer, initial);

  return (
    <form action={action} className="grid gap-4">
      {issuer.id ? <input type="hidden" name="id" value={issuer.id} /> : null}

      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <Panel title="En-tête et pied de page" description="Exactement ce qui s'imprime sur les devis et factures." className="h-full">
          <div className="grid gap-4">
            <Field label="Nom affiché dans le CRM">
              <input name="label" defaultValue={issuer.label} required className="field-input" />
            </Field>
            <Field label="Nom imprimé" hint="En gras, en tête du document.">
              <input name="name" defaultValue={issuer.name} required className="field-input" />
            </Field>
            <Field label="Lignes sous le nom" hint="Une ligne par retour à la ligne : adresse, contact, immatriculation, e-mail.">
              <textarea name="headerLines" rows={4} defaultValue={issuer.headerLines} className="field-input resize-y" />
            </Field>
            <Field label="Pied de page" hint="Centré en bas de chaque document.">
              <input name="footer" defaultValue={issuer.footer} className="field-input" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="E-mail">
                <input name="email" type="email" defaultValue={issuer.email} className="field-input" />
              </Field>
              <Field label="Téléphone">
                <input name="phone" defaultValue={issuer.phone} className="field-input" />
              </Field>
              <Field label="Site">
                <input name="website" defaultValue={issuer.website} className="field-input" />
              </Field>
            </div>
          </div>
        </Panel>

        <Panel title="Coordonnées bancaires" description="Imprimées sur les factures. L'IBAN et le BIC sont à saisir par vous." className="h-full">
          <div className="grid gap-4">
            <Field label="Titulaire du compte">
              <input name="bankHolder" defaultValue={issuer.bankHolder} className="field-input" />
            </Field>
            <Field label="Banque">
              <input name="bankName" defaultValue={issuer.bankName} className="field-input" />
            </Field>
            <Field label="IBAN">
              <input name="iban" defaultValue={issuer.iban} autoComplete="off" spellCheck={false} className="field-input font-mono" />
            </Field>
            <Field label="BIC">
              <input name="bic" defaultValue={issuer.bic} autoComplete="off" spellCheck={false} className="field-input font-mono" />
            </Field>
          </div>
        </Panel>
      </div>

      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        <Panel
          title="Mentions légales"
          description="Vides par défaut : rien ne s'imprime tant que vous ne les avez pas saisies (à valider avec votre comptable)."
          className="h-full"
        >
          <div className="grid gap-4">
            <Field label="Mention de TVA" hint="Ex. « TVA non applicable, art. 293 B du CGI ».">
              <input name="vatMention" defaultValue={issuer.vatMention} className="field-input" />
            </Field>
            <Field label="Conditions de paiement">
              <input name="paymentTerms" defaultValue={issuer.paymentTerms} className="field-input" />
            </Field>
            <Field label="Pénalités de retard">
              <input name="latePenalty" defaultValue={issuer.latePenalty} className="field-input" />
            </Field>
            <Field label="Indemnité forfaitaire de recouvrement">
              <input name="recoveryFee" defaultValue={issuer.recoveryFee} className="field-input" />
            </Field>
          </div>
        </Panel>

        <Panel title="Usages" className="h-full">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Devise par défaut">
              <Select
                name="currency"
                defaultValue={issuer.currency}
                options={[
                  { value: "EUR", label: "Euro (€)" },
                  { value: "USD", label: "Dollar US ($)" },
                ]}
              />
            </Field>
            <Field label="Acompte par défaut (%)">
              <input name="depositPercent" type="number" min={0} max={100} defaultValue={issuer.depositPercent} className="field-input" />
            </Field>
            <Field label="Validité des devis (jours)">
              <input name="quoteValidityDays" type="number" min={1} defaultValue={issuer.quoteValidityDays} className="field-input" />
            </Field>
            <div />
            <Field label="Préfixe des factures" hint="FAC → FAC-2026-11-05">
              <input name="invoicePrefix" defaultValue={issuer.invoicePrefix} className="field-input uppercase" />
            </Field>
            <Field label="Préfixe des devis" hint="DEV → DEV-2026-11-01">
              <input name="quotePrefix" defaultValue={issuer.quotePrefix} className="field-input uppercase" />
            </Field>
          </div>
        </Panel>
      </div>

      {state.error ? <p className="rounded-field bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
      <div className="flex justify-end">
        <SubmitButton label={issuer.id ? "Enregistrer l'identité" : "Créer l'identité"} />
      </div>
    </form>
  );
}
