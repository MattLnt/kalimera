"use client";

import { Ban, Clock, Code2, FileText, Layers, ListPlus, Loader2, ScrollText, Sparkles, TrendingUp, UserRound, Wallet, X } from "lucide-react";
import { useActionState, useMemo, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";

import { saveQuote, type QuoteActionState } from "./actions";
import { generateQuoteDraft } from "./ai";

import { amountToCents, centsToAmount, LotsEditor, newLotKey, type LotDraft } from "@/components/admin/crm/lots-editor";
import { OpenDraftPreview } from "@/components/admin/crm/open-preview";
import { OptionalSections } from "@/components/admin/crm/optional-sections";
import { Field, Panel } from "@/components/admin/ui";
import { Select } from "@/components/ui/select";
import { renderDocument, type DocClient, type DocIssuer } from "@/lib/crm/documents/render";
import { cn } from "@/lib/utils";

export type EditorIssuer = { id: string; label: string; currency: string; depositPercent: number; validityDays: number; doc: DocIssuer };
export type EditorClient = { id: string; name: string; defaultIssuerId: string | null; doc: DocClient; deals: { id: string; title: string }[] };

export type QuoteDraft = {
  id?: string;
  clientId: string;
  dealId: string;
  issuerId: string;
  currency: string;
  title: string;
  context: string;
  perimeter: string;
  lots: LotDraft[];
  stack: string;
  depositPercent: string;
  paymentNote: string;
  delay: string;
  outOfScope: string;
  evolutions: string;
  terms: string;
  validityDays: string;
  requireSignature: boolean;
};

const initial: QuoteActionState = {};
const listOf = (text: string) => text.split("\n").map((line) => line.trim()).filter(Boolean);

/**
 * Éditeur de devis : le formulaire à gauche, le document tel qu'il partira à
 * droite, mis à jour à chaque frappe. « Rédiger avec l'IA » remplit tout à
 * partir d'un descriptif et d'un tarif ; on relit, on ajuste, on enregistre.
 */
export function QuoteEditor({
  initialDraft,
  issuers,
  clients,
}: {
  initialDraft: QuoteDraft;
  issuers: EditorIssuer[];
  clients: EditorClient[];
}) {
  const [draft, setDraft] = useState(initialDraft);
  // Acompte : désactivé = 0 %, le dernier pourcentage est gardé pour le rallumer.
  const depositOn = Number(draft.depositPercent) > 0;
  const [lastDeposit, setLastDeposit] = useState(() => Number(draft.depositPercent) || 50);
  const [state, action] = useActionState(saveQuote, initial);
  const set = (patch: Partial<QuoteDraft>) => setDraft((current) => ({ ...current, ...patch }));

  const client = clients.find((item) => item.id === draft.clientId);
  const issuer = issuers.find((item) => item.id === draft.issuerId);
  const symbol = draft.currency === "USD" ? "$" : "€";
  const lots = draft.lots.filter((lot) => lot.title.trim());
  const total = lots.reduce((sum, lot) => sum + amountToCents(lot.amount), 0);

  const chooseClient = (clientId: string) => {
    const next = clients.find((item) => item.id === clientId);
    const nextIssuer = issuers.find((item) => item.id === (next?.defaultIssuerId ?? draft.issuerId)) ?? issuer;
    set({
      clientId,
      dealId: next?.deals.some((deal) => deal.id === draft.dealId) ? draft.dealId : "",
      issuerId: nextIssuer?.id ?? draft.issuerId,
      currency: nextIssuer?.currency ?? draft.currency,
    });
  };

  const chooseIssuer = (issuerId: string) => {
    const next = issuers.find((item) => item.id === issuerId);
    set({
      issuerId,
      currency: next?.currency ?? draft.currency,
      depositPercent: draft.id ? draft.depositPercent : String(next?.depositPercent ?? 50),
      validityDays: draft.id ? draft.validityDays : String(next?.validityDays ?? 30),
    });
  };

  // Aperçu : exactement le gabarit du PDF.
  const preview = useMemo(
    () =>
      renderDocument({
        kind: "QUOTE",
        number: null,
        date: new Date(),
        currency: draft.currency,
        title: draft.title || "Titre du devis",
        issuer: issuer?.doc ?? { name: "Identité à choisir", headerLines: "", footer: "" },
        client: client?.doc ?? { name: "Client à choisir", addressLines: [] },
        lines: lots.map((lot) => ({ title: lot.title, description: lot.description, amountCents: amountToCents(lot.amount) })),
        totalCents: total,
        draft: true,
        validityDays: Number(draft.validityDays) || 30,
        context: draft.context,
        perimeter: draft.perimeter,
        stack: listOf(draft.stack),
        depositPercent: Number(draft.depositPercent) || 0,
        paymentNote: draft.paymentNote,
        delay: draft.delay,
        outOfScope: draft.outOfScope,
        evolutions: listOf(draft.evolutions),
        terms: draft.terms,
        signature: null,
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
    context: draft.context,
    perimeter: draft.perimeter,
    lots: lots.map((lot) => ({ title: lot.title, description: lot.description, amountCents: amountToCents(lot.amount) })),
    stack: listOf(draft.stack),
    depositPercent: Math.min(100, Math.max(0, Math.round(Number(draft.depositPercent) || 0))),
    paymentNote: draft.paymentNote,
    delay: draft.delay,
    outOfScope: draft.outOfScope,
    evolutions: listOf(draft.evolutions),
    terms: draft.terms,
    validityDays: Math.max(1, Math.round(Number(draft.validityDays) || 30)),
    requireSignature: draft.requireSignature,
  });

  return (
    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <form action={action} className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-4">
        <input type="hidden" name="payload" value={payload} />

        <AiPanel
          clientId={draft.clientId}
          currency={draft.currency}
          onDraft={(result) =>
            set({
              title: result.title,
              context: result.context,
              perimeter: result.perimeter,
              lots: result.lots.map((lot) => ({ key: newLotKey(), title: lot.title, description: lot.description, amount: centsToAmount(lot.amountCents) })),
              stack: result.stack.join("\n"),
              delay: result.delay,
              outOfScope: result.outOfScope,
              evolutions: result.evolutions.join("\n"),
              paymentNote: result.paymentNote,
            })
          }
        />

        <Panel title="Destinataire et émetteur" description="À qui, au nom de qui, dans quelle devise." icon={<UserRound className="size-4" />}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Client">
              <Select
                name="client"
                defaultValue={draft.clientId}
                placeholder="Choisir un client"
                onValueChange={chooseClient}
                options={clients.map((item) => ({ value: item.id, label: item.name }))}
              />
            </Field>
            <Field label="Émis au nom de">
              <Select
                key={draft.issuerId}
                name="issuer"
                defaultValue={draft.issuerId}
                placeholder="Choisir l'identité"
                onValueChange={chooseIssuer}
                options={issuers.map((item) => ({ value: item.id, label: item.label }))}
              />
            </Field>
            <Field label="Projet rattaché">
              <Select
                key={`deal-${draft.clientId}`}
                name="deal"
                defaultValue={draft.dealId}
                placeholder={client?.deals.length ? "Aucun" : "Aucun projet pour ce client"}
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

        <Panel title="Le projet" description="Titre, contexte et périmètre, en tête du devis." icon={<FileText className="size-4" />}>
          <div className="grid gap-4">
            <Field label="Titre">
              <input value={draft.title} onChange={(event) => set({ title: event.target.value })} placeholder="Plateforme de gestion interne — Version 1" className="field-input font-display font-bold" />
            </Field>
            <Field label="Contexte">
              <textarea value={draft.context} onChange={(event) => set({ context: event.target.value })} rows={4} className="field-input resize-y" />
            </Field>
            <Field label="Périmètre" hint="Imprimé en gras sous le contexte.">
              <input value={draft.perimeter} onChange={(event) => set({ perimeter: event.target.value })} placeholder="outil strictement interne (pas de portail public)" className="field-input" />
            </Field>
          </div>
        </Panel>

        <Panel title="Lots et tarification" description="Une ligne par lot, avec son contenu et son prix." icon={<Layers className="size-4" />} action={<span className="rounded-full bg-aegean-50 px-3 py-1 font-display text-[0.8125rem] font-extrabold text-aegean-800 tabular-nums">{centsToAmount(total)} {symbol}</span>}>
          <LotsEditor lots={draft.lots} onChange={(next) => set({ lots: next })} currencySymbol={symbol} />
        </Panel>

        <Panel title="Paiement et validité" description="Acompte, durée de validité et mode d'accord." icon={<Wallet className="size-4" />}>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Acompte" hint={depositOn ? "Pourcentage du total, demandé à la commande." : "Désactivé : aucune mention d'acompte sur le devis ni sur les factures."}>
              <div className="flex gap-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={depositOn}
                  aria-label="Demander un acompte"
                  onClick={() => set({ depositPercent: depositOn ? "0" : String(lastDeposit || 50) })}
                  className={cn("field-input flex w-auto shrink-0 cursor-pointer items-center gap-2.5 font-display font-bold", depositOn ? "text-aegean-700" : "text-[var(--ink-45)]")}
                >
                  <span className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", depositOn ? "bg-aegean-600" : "bg-black/15")}>
                    <span className={cn("absolute top-0.5 size-4 rounded-full bg-white transition-[left]", depositOn ? "left-[18px]" : "left-0.5")} />
                  </span>
                  {depositOn ? null : "Aucun"}
                </button>
                {depositOn ? (
                  <div className="relative min-w-0 flex-1">
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={draft.depositPercent}
                      onChange={(event) => {
                        set({ depositPercent: event.target.value });
                        if (Number(event.target.value) > 0) setLastDeposit(Number(event.target.value));
                      }}
                      aria-label="Pourcentage d'acompte"
                      className="field-input pr-8"
                    />
                    <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-[var(--ink-45)]">%</span>
                  </div>
                ) : null}
              </div>
            </Field>
            <Field label="Validité (jours)">
              <input type="number" min={1} value={draft.validityDays} onChange={(event) => set({ validityDays: event.target.value })} className="field-input" />
            </Field>
            <Field label="Signature en ligne">
              <button
                type="button"
                onClick={() => set({ requireSignature: !draft.requireSignature })}
                aria-pressed={draft.requireSignature}
                className={cn(
                  "field-input flex cursor-pointer items-center justify-between font-display font-bold",
                  draft.requireSignature ? "text-aegean-700" : "text-[var(--ink-45)]",
                )}
              >
                {draft.requireSignature ? "Demandée" : "Accord hors ligne"}
                <span className={cn("relative h-5 w-9 rounded-full transition-colors", draft.requireSignature ? "bg-aegean-600" : "bg-black/15")}>
                  <span className={cn("absolute top-0.5 size-4 rounded-full bg-white transition-[left]", draft.requireSignature ? "left-[18px]" : "left-0.5")} />
                </span>
              </button>
            </Field>
            <div className="sm:col-span-3">
              <Field label="Précision sous les modalités">
                <input value={draft.paymentNote} onChange={(event) => set({ paymentNote: event.target.value })} placeholder="Le découpage en lots structure le suivi ; la facturation suit deux échéances." className="field-input" />
              </Field>
            </div>
          </div>
        </Panel>

        <Panel title="Sections facultatives" description="Ouvrez une section pour la remplir ; vide, elle n'apparaît pas sur le devis." icon={<ListPlus className="size-4" />}>
          <OptionalSections
            sections={[
              { key: "delay", icon: Clock, title: "Délai", hint: "Durée de réalisation estimée", value: draft.delay, onChange: (value) => set({ delay: value }), rows: 2, placeholder: "Délai de réalisation estimé : 4 à 6 semaines à compter de la validation du devis." },
              { key: "stack", icon: Code2, title: "Stack technique", hint: "Une technologie par ligne", value: draft.stack, onChange: (value) => set({ stack: value }), placeholder: "Next.js (App Router), hébergement Vercel" },
              { key: "outOfScope", icon: Ban, title: "Hors périmètre", hint: "Ce qui est explicitement exclu", value: draft.outOfScope, onChange: (value) => set({ outOfScope: value }), rows: 2 },
              { key: "evolutions", icon: TrendingUp, title: "Évolutions envisageables", hint: "Une piste par ligne, pour un devis complémentaire", value: draft.evolutions, onChange: (value) => set({ evolutions: value }) },
              { key: "terms", icon: ScrollText, title: "Conditions particulières", hint: "Clauses propres à ce devis", value: draft.terms, onChange: (value) => set({ terms: value }), rows: 2 },
            ]}
          />
        </Panel>

        {state.error ? <p role="alert" className="rounded-field bg-[#EEF3FA] px-4 py-3 text-sm text-[#0B3A75]">{state.error}</p> : null}
        <div className="sticky bottom-24 z-10 flex justify-end lg:bottom-4">
          <SaveButton />
        </div>
      </form>

      {/* Aperçu : le document à l'échelle d'une page A4. */}
      <div className="sticky top-4 hidden xl:block">
        <div className="mb-2 flex items-center justify-between px-1 text-xs font-bold text-[var(--ink-45)]">
          <span>Aperçu du document · {issuer?.label ?? "aucune identité"}</span>
          <OpenDraftPreview html={preview} />
        </div>
        <div className="overflow-hidden rounded-[18px] bg-white shadow-lift ring-1 ring-black/5">
          <iframe title="Aperçu du devis" srcDoc={preview} className="h-[calc(100dvh-7rem)] w-full" />
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

type AiDraft = Extract<Awaited<ReturnType<typeof generateQuoteDraft>>, { ok: true }>["draft"];

function AiPanel({ clientId, currency, onDraft }: { clientId: string; currency: string; onDraft: (draft: AiDraft) => void }) {
  const [open, setOpen] = useState(false);
  const [brief, setBrief] = useState("");
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex cursor-pointer items-center gap-3 rounded-[22px] bg-gradient-to-r from-aegean-600 to-aegean-800 p-4 text-left text-white shadow-[0_16px_36px_-18px_rgba(21,98,184,0.9)]"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-white/15">
          <Sparkles className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block font-display text-[0.9375rem] font-bold">Rédiger avec l&apos;IA</span>
          <span className="block text-[0.8125rem] text-white/70">Un descriptif : contexte, lots et sections rédigés, vous gardez la main sur les prix.</span>
        </span>
      </button>
    );
  }

  const run = () => {
    setError("");
    startTransition(async () => {
      const result = await generateQuoteDraft({ clientId: clientId || undefined, brief, currency });
      if (result.ok) {
        onDraft(result.draft);
        setOpen(false);
      } else setError(result.error);
    });
  };

  return (
    <div className="rounded-[22px] bg-gradient-to-br from-aegean-600 to-aegean-800 p-5 text-white">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="size-5" />
        <p className="flex-1 font-display font-bold">Rédiger avec l&apos;IA</p>
        <button type="button" onClick={() => setOpen(false)} aria-label="Fermer" className="grid size-8 cursor-pointer place-items-center rounded-full hover:bg-white/10">
          <X className="size-4" />
        </button>
      </div>
      <textarea
        value={brief}
        onChange={(event) => setBrief(event.target.value)}
        rows={4}
        placeholder="Boutique click & collect pour une boulangerie : 2 boutiques, commande en ligne, paiement sur place, back-office pour les horaires…"
        className="w-full resize-y rounded-[14px] border border-white/20 bg-white/10 px-4 py-3 text-[0.9375rem] text-white outline-none placeholder:text-white/50 focus:border-white/50"
      />
      <div className="mt-2 flex flex-wrap gap-2">
<span className="flex-1" />
        <button
          type="button"
          onClick={run}
          disabled={pending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-2.5 font-display text-sm font-bold text-aegean-800 disabled:opacity-70"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {pending ? "Rédaction…" : "Générer"}
        </button>
      </div>
      <p className="mt-2 text-xs text-white/60">
        L&apos;IA s&apos;appuie sur vos services et les notes d&apos;appel du client. Elle reprend seulement ce que vous écrivez, sans rien inventer ; un prix n&apos;est repris que s&apos;il figure dans le descriptif (« design : 800 € »). Elle remplace le contenu actuel du formulaire.
      </p>
      {error ? <p className="mt-2 rounded-[12px] bg-red-500/20 px-3 py-2 text-sm">{error}</p> : null}
    </div>
  );
}
