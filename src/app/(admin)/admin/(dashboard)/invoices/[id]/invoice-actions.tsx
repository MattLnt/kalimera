"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { addPayment, issueInvoice, sendInvoice, type InvoiceActionState } from "../actions";

import { DatePicker } from "@/components/ui/date-picker";

const initial: InvoiceActionState = {};

function Submit({ label, busy }: { label: string; busy: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-aegean-600 px-5 py-3 font-display text-sm font-bold text-white hover:bg-aegean-700 disabled:opacity-70">
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {pending ? busy : label}
    </button>
  );
}

function Feedback({ state }: { state: InvoiceActionState }) {
  if (state.error) return <p role="alert" className="rounded-field bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>;
  if (state.ok)
    return (
      <p className="flex items-start gap-2 rounded-field bg-green-50 px-3 py-2 text-sm text-green-800">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
        {state.ok}
      </p>
    );
  return null;
}

export function IssueForm({ id, suggestedNumber, today }: { id: string; suggestedNumber: string | null; today: string }) {
  const [state, action] = useActionState(issueInvoice, initial);
  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="id" value={id} />
      <label className="block">
        <span className="field-label">Numéro</span>
        <input name="number" defaultValue={suggestedNumber ?? ""} className="field-input font-mono" />
        <span className="mt-1 block text-xs text-[var(--ink-45)]">Proposé automatiquement ; modifiable. Il ne changera plus ensuite.</span>
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Date d&apos;émission</span>
          <DatePicker name="issueDate" defaultValue={today} clearable={false} />
        </label>
        <label className="block">
          <span className="field-label">Échéance</span>
          <DatePicker name="dueDate" defaultValue={today} placeholder="À réception" />
        </label>
      </div>
      <Submit label="Émettre la facture" busy="Émission…" />
      <Feedback state={state} />
    </form>
  );
}

export function SendForm({ id, defaultTo }: { id: string; defaultTo: string }) {
  const [state, action] = useActionState(sendInvoice, initial);
  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="id" value={id} />
      <input name="to" type="email" required defaultValue={defaultTo} className="field-input" aria-label="Destinataire" placeholder="Destinataire" />
      <textarea name="message" rows={2} className="field-input resize-y" placeholder="Message personnel (facultatif)" />
      <Submit label="Envoyer par e-mail" busy="Envoi…" />
      <Feedback state={state} />
    </form>
  );
}

export function PaymentForm({ id, remaining, today }: { id: string; remaining: string; today: string }) {
  const [state, action] = useActionState(addPayment, initial);
  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="id" value={id} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Montant reçu</span>
          <input name="amount" inputMode="decimal" defaultValue={remaining} required className="field-input" />
        </label>
        <label className="block">
          <span className="field-label">Reçu le</span>
          <DatePicker name="receivedAt" defaultValue={today} clearable={false} />
        </label>
      </div>
      <input name="reference" className="field-input" placeholder="Référence du virement (facultatif)" aria-label="Référence" />
      <Submit label="Enregistrer le virement" busy="Enregistrement…" />
      <Feedback state={state} />
    </form>
  );
}
