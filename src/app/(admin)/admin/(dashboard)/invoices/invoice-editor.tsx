"use client";

import { FileText, Layers, Loader2, StickyNote, UserRound } from "lucide-react";
import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";

import { saveInvoice, type InvoiceActionState } from "./actions";
import type { EditorClient, EditorIssuer } from "../quotes/quote-editor";

import { amountToCents, centsToAmount, LotsEditor, type LotDraft } from "@/components/admin/crm/lots-editor";
import { OpenDraftPreview } from "@/components/admin/crm/open-preview";
import { Field, Panel } from "@/components/admin/ui";
import { Select } from "@/components/ui/select";
import { renderDocument } from "@/lib/crm/documents/render";

export type InvoiceDraft = {
  id?: string;
  kind: "STANDARD" | "DEPOSIT" | "BALANCE" | "CREDIT_NOTE";
  clientId: string;
  dealId: string;
  issuerId: string;
  currency: string;
  title: string;
  contextLine: string;
  notes: string;
  lots: LotDraft[];
};

const initial: InvoiceActionState = {};

export function InvoiceEditor({ initialDraft, issuers, clients }: { initialDraft: InvoiceDraft; issuers: EditorIssuer[]; clients: EditorClient[] }) {
  const [draft, setDraft] = useState(initialDraft);
  const [state, action] = useActionState(saveInvoice, initial);
  const set = (patch: Partial<InvoiceDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const client = clients.find((item) => item.id === draft.clientId);
  const issuer = issuers.find((item) => item.id === draft.issuerId);
  const symbol = draft.currency === "USD" ? "$" : "€";
  const lots = draft.lots.filter((lot) => lot.title.trim());
  const total = lots.reduce((sum, lot) => sum + amountToCents(lot.amount), 0);

  const preview = useMemo(
    () =>
      renderDocument({
        kind: "INVOICE",
        docType: draft.kind === "CREDIT_NOTE" ? "AVOIR" : "FACTURE",
        number: null,
        date: new Date(),
        currency: draft.currency,
        title: draft.title || "Titre de la facture",
        issuer: issuer?.doc ?? { name: "Identité à choisir", headerLines: "", footer: "" },
        client: client?.doc ?? { name: "Client à choisir", addressLines: [] },
        lines: lots.map((lot) => ({ title: lot.title, description: lot.description, amountCents: amountToCents(lot.amount) })),
        totalCents: total,
        draft: true,
        contextLine: draft.contextLine,
        notes: draft.notes,
      }),
    [draft, issuer, client, lots, total],
  );

  const payload = JSON.stringify({
    id: draft.id,
    clientId: draft.clientId,
    dealId: draft.dealId || null,
    issuerId: draft.issuerId,
    currency: draft.currency,
    title: draft.title,
    contextLine: draft.contextLine,
    notes: draft.notes,
    lots: lots.map((lot) => ({ title: lot.title, description: lot.description, amountCents: amountToCents(lot.amount) })),
  });

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form action={action} className="grid gap-4">
        <input type="hidden" name="payload" value={payload} />

        <Panel title="Destinataire et émetteur" description="À qui, au nom de qui, dans quelle devise." icon={<UserRound className="size-4" />}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Client">
              <Select
                name="client"
                defaultValue={draft.clientId}
                placeholder="Choisir un client"
                onValueChange={(clientId) => {
                  const next = clients.find((item) => item.id === clientId);
                  const nextIssuer = issuers.find((item) => item.id === next?.defaultIssuerId);
                  set({ clientId, dealId: "", issuerId: nextIssuer?.id ?? draft.issuerId, currency: nextIssuer?.currency ?? draft.currency });
                }}
                options={clients.map((item) => ({ value: item.id, label: item.name }))}
              />
            </Field>
            <Field label="Émise au nom de">
              <Select
                key={draft.issuerId}
                name="issuer"
                defaultValue={draft.issuerId}
                placeholder="Choisir l'identité"
                onValueChange={(issuerId) => set({ issuerId, currency: issuers.find((item) => item.id === issuerId)?.currency ?? draft.currency })}
                options={issuers.map((item) => ({ value: item.id, label: item.label }))}
              />
            </Field>
            <Field label="Projet rattaché">
              <Select
                key={`deal-${draft.clientId}`}
                name="deal"
                defaultValue={draft.dealId}
                placeholder="Aucun"
                onValueChange={(value) => set({ dealId: value })}
                options={[{ value: "", label: "Aucun" }, ...(client?.deals ?? []).map((deal) => ({ value: deal.id, label: deal.title }))]}
              />
            </Field>
            <Field label="Devise">
              <Select
                key={`cur-${draft.currency}`}
                name="currency"
                defaultValue={draft.currency}
                onValueChange={(value) => set({ currency: value })}
                options={[
                  { value: "EUR", label: "Euro (€)" },
                  { value: "USD", label: "Dollar US ($)" },
                ]}
              />
            </Field>
          </div>
        </Panel>

        <Panel title="Contenu" description="Titre et ligne de contexte, en tête de la facture." icon={<FileText className="size-4" />}>
          <div className="grid gap-4">
            <Field label="Titre">
              <input value={draft.title} onChange={(event) => set({ title: event.target.value })} placeholder="Projet Exemple — Évolution de la plateforme" className="field-input font-display font-bold" />
            </Field>
            <Field label="Ligne de contexte" hint="Facultatif. Ex. « Prestation hors devis du 23/07/2026 ».">
              <input value={draft.contextLine} onChange={(event) => set({ contextLine: event.target.value })} className="field-input" />
            </Field>
          </div>
        </Panel>

        <Panel title="Détail des prestations" description="Une ligne par prestation, avec son montant." icon={<Layers className="size-4" />} action={<span className="rounded-full bg-aegean-50 px-3 py-1 font-display text-[0.8125rem] font-extrabold text-aegean-800 tabular-nums">{centsToAmount(total)} {symbol}</span>}>
          <LotsEditor lots={draft.lots} onChange={(next) => set({ lots: next })} currencySymbol={symbol} titlePlaceholder="Envoi d'une notification par e-mail" />
        </Panel>

        <Panel title="Note finale" description="Facultatif, imprimée en gris sous le total." icon={<StickyNote className="size-4" />}>
          <textarea value={draft.notes} onChange={(event) => set({ notes: event.target.value })} rows={2} className="field-input resize-y" />
        </Panel>

        {state.error ? <p role="alert" className="rounded-field bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</p> : null}
        <div className="sticky bottom-24 z-10 flex justify-end lg:bottom-4">
          <SaveButton />
        </div>
      </form>

      <div className="sticky top-4 hidden xl:block">
        <div className="mb-2 flex items-center justify-between px-1 text-xs font-bold text-[var(--ink-45)]">
          <span>Aperçu du document · {issuer?.label ?? "aucune identité"}</span>
          <OpenDraftPreview html={preview} />
        </div>
        <div className="overflow-hidden rounded-[18px] bg-white shadow-lift ring-1 ring-black/5">
          <iframe title="Aperçu de la facture" srcDoc={preview} className="h-[calc(100dvh-7rem)] w-full" />
        </div>
      </div>
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-aegean-600 px-6 py-3 font-display text-sm font-bold text-white shadow-[0_12px_28px_-12px_rgba(21,98,184,0.9)] hover:bg-aegean-700 disabled:opacity-70"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {pending ? "Enregistrement…" : "Enregistrer le brouillon"}
    </button>
  );
}
