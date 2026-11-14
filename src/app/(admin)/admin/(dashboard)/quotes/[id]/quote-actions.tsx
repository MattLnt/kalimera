"use client";

import { CheckCircle2, Handshake, Loader2, Send } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { acceptQuote, sendQuote, type QuoteActionState } from "../actions";

import { DatePicker } from "@/components/ui/date-picker";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const initial: QuoteActionState = {};

function Submit({ label, busy, tone = "primary" }: { label: string; busy: string; tone?: "primary" | "green" }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-3 font-display text-sm font-bold text-white disabled:opacity-70",
        tone === "green" ? "bg-green-600 hover:bg-green-700" : "bg-aegean-600 hover:bg-aegean-700",
      )}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {pending ? busy : label}
    </button>
  );
}

function Feedback({ state }: { state: QuoteActionState }) {
  if (state.error) return <p role="alert" className="mt-3 rounded-field bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>;
  if (state.ok)
    return (
      <p className="mt-3 flex items-start gap-2 rounded-field bg-green-50 px-3 py-2 text-sm text-green-800">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
        {state.ok}
      </p>
    );
  return null;
}

/** Envoi par e-mail : numéro proposé, modifiable, et message personnel. */
export function SendQuoteForm({
  id,
  defaultTo,
  suggestedNumber,
  hasNumber,
  resend,
}: {
  id: string;
  defaultTo: string;
  suggestedNumber: string | null;
  hasNumber: boolean;
  resend: boolean;
}) {
  const [state, action] = useActionState(sendQuote, initial);
  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="id" value={id} />
      <label className="block">
        <span className="field-label">Destinataire</span>
        <input name="to" type="email" required defaultValue={defaultTo} className="field-input" />
      </label>
      {!hasNumber ? (
        <label className="block">
          <span className="field-label">Numéro</span>
          <input name="number" defaultValue={suggestedNumber ?? ""} className="field-input font-mono" />
          <span className="mt-1 block text-xs text-[var(--ink-45)]">Proposé automatiquement ; modifiable.</span>
        </label>
      ) : null}
      <label className="block">
        <span className="field-label">Message personnel <span className="font-normal text-[var(--ink-45)]">· facultatif</span></span>
        <textarea name="message" rows={3} className="field-input resize-y" placeholder="Suite à notre échange de mardi, voici notre proposition." />
      </label>
      <Submit label={resend ? "Renvoyer le devis" : "Envoyer le devis"} busy="Envoi…" />
      <Feedback state={state} />
    </form>
  );
}

/** Accord hors ligne : à l'oral, par e-mail… avec récapitulatif facultatif. */
export function AcceptQuoteForm({
  id,
  defaultTo,
  suggestedNumber,
  hasNumber,
  today,
}: {
  id: string;
  defaultTo: string;
  suggestedNumber: string | null;
  hasNumber: boolean;
  today: string;
}) {
  const [state, action] = useActionState(acceptQuote, initial);
  const [recap, setRecap] = useState(false);
  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="id" value={id} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Accord donné</span>
          <Select
            name="mode"
            defaultValue="VERBAL"
            options={[
              { value: "VERBAL", label: "À l'oral" },
              { value: "EMAIL", label: "Par e-mail" },
              { value: "PURCHASE_ORDER", label: "Sur bon de commande" },
              { value: "OTHER", label: "Autre" },
            ]}
          />
        </label>
        <label className="block">
          <span className="field-label">Le</span>
          <DatePicker name="date" defaultValue={today} clearable={false} />
        </label>
      </div>
      {!hasNumber ? (
        <label className="block">
          <span className="field-label">Numéro</span>
          <input name="number" defaultValue={suggestedNumber ?? ""} className="field-input font-mono" />
        </label>
      ) : null}
      <label className="block">
        <span className="field-label">Note <span className="font-normal text-[var(--ink-45)]">· facultatif</span></span>
        <input name="note" className="field-input" placeholder="Validé au téléphone avec Valentino" />
      </label>
      <label className="flex cursor-pointer items-start gap-3 text-[0.875rem] text-[var(--ink-65)]">
        <input name="sendRecap" type="checkbox" checked={recap} onChange={(event) => setRecap(event.target.checked)} className="mt-1 size-4 accent-aegean-600" />
        <span>Envoyer un récapitulatif écrit au client, avec le devis en PDF : une trace de l&apos;accord, sans effort pour lui.</span>
      </label>
      {recap ? <input name="to" type="email" required defaultValue={defaultTo} className="field-input" aria-label="Destinataire du récapitulatif" /> : null}
      <Submit label="Marquer comme accepté" busy="Enregistrement…" tone="green" />
      <Feedback state={state} />
    </form>
  );
}

export function ActionTabs({ canSend, canAccept, send, accept }: { canSend: boolean; canAccept: boolean; send: React.ReactNode; accept: React.ReactNode }) {
  const [tab, setTab] = useState<"send" | "accept">(canSend ? "send" : "accept");
  if (!canSend && !canAccept) return null;
  return (
    <div className="surface-card p-5">
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-black/5 p-1">
        {canSend ? (
          <button type="button" onClick={() => setTab("send")} className={cn("flex cursor-pointer items-center justify-center gap-1.5 rounded-full py-2 font-display text-sm font-bold", tab === "send" ? "bg-white text-aegean-700 shadow-soft" : "text-[var(--ink-45)]")}>
            <Send className="size-4" />
            Envoyer
          </button>
        ) : null}
        {canAccept ? (
          <button type="button" onClick={() => setTab("accept")} className={cn("flex cursor-pointer items-center justify-center gap-1.5 rounded-full py-2 font-display text-sm font-bold", tab === "accept" ? "bg-white text-green-700 shadow-soft" : "text-[var(--ink-45)]", !canSend && "col-span-2")}>
            <Handshake className="size-4" />
            Accord reçu
          </button>
        ) : null}
      </div>
      {tab === "send" && canSend ? send : accept}
    </div>
  );
}
