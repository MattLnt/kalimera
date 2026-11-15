"use client";

import { CheckCircle2, FlaskConical, Loader2, Send } from "lucide-react";
import { useActionState, useState, useSyncExternalStore } from "react";
import { useFormStatus } from "react-dom";

import type { EmailSender } from "@/lib/crm/documents/email-template";
import { cn } from "@/lib/utils";

type ActionState = { ok?: string; error?: string };
type Action = (prev: ActionState, formData: FormData) => Promise<ActionState>;

const TEST_KEY = "kalimera:test-email";

function subscribeStorage(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}
function readTestTo() {
  try {
    return window.localStorage.getItem(TEST_KEY) ?? "";
  } catch {
    return "";
  }
}

function SubmitButton({ label, busy, icon, variant = "primary", formAction }: { label: string; busy: string; icon: React.ReactNode; variant?: "primary" | "ghost"; formAction?: (formData: FormData) => void }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      formAction={formAction}
      disabled={pending}
      className={cn(
        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-display text-sm font-bold disabled:opacity-70",
        variant === "primary" ? "w-full bg-aegean-600 px-5 py-3 text-white hover:bg-aegean-700" : "shrink-0 bg-white px-4 py-2.5 text-aegean-700 shadow-[0_0_0_1px_#DFE6EF] hover:bg-aegean-50",
      )}
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : icon}
      {pending ? busy : label}
    </button>
  );
}

function Feedback({ state }: { state: ActionState }) {
  if (state.error) return <p role="alert" className="rounded-[12px] bg-[#EEF3FA] px-3 py-2 text-sm text-[#0B3A75]">{state.error}</p>;
  if (state.ok)
    return (
      <p className="flex items-start gap-2 rounded-[12px] bg-[#DCF1EA] px-3 py-2 text-sm text-[#046C4E]">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
        {state.ok}
      </p>
    );
  return null;
}

/**
 * Rédaction de l'e-mail d'un devis ou d'une facture : destinataire, objet et
 * texte pré-remplis et modifiables, signature ajoutée sous le texte, et un
 * envoi de test vers sa propre adresse qui ne change rien au document.
 */
export function EmailComposer({
  id,
  defaultTo,
  defaultSubject,
  defaultBody,
  sender,
  sendAction,
  testAction,
  sendLabel,
  extraFields,
  canSend = true,
  sendHint,
}: {
  id: string;
  defaultTo: string;
  defaultSubject: string;
  defaultBody: string;
  sender: EmailSender;
  sendAction: Action;
  testAction: Action;
  sendLabel: string;
  /** Champs propres au document (numéro du devis…). */
  extraFields?: React.ReactNode;
  /** Faux tant que le document ne peut pas partir (facture non émise) : seul le test est proposé. */
  canSend?: boolean;
  sendHint?: string;
}) {
  const [sendState, send] = useActionState(sendAction, {});
  const [testState, test] = useActionState(testAction, {});
  // Champs contrôlés : un envoi (ou un test) ne remet pas le texte à zéro.
  const [to, setTo] = useState(defaultTo);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  // L'adresse de test est retenue dans ce navigateur.
  const savedTestTo = useSyncExternalStore(subscribeStorage, readTestTo, () => "");
  const [typedTestTo, setTypedTestTo] = useState<string | null>(null);
  const testTo = typedTestTo ?? savedTestTo;

  return (
    <form action={send} className="grid gap-3">
      <input type="hidden" name="id" value={id} />
      <label className="block">
        <span className="field-label">Destinataire</span>
        <input name="to" type="email" value={to} onChange={(event) => setTo(event.target.value)} className="field-input" />
      </label>
      {extraFields}
      <label className="block">
        <span className="field-label">Objet</span>
        <input name="subject" value={subject} onChange={(event) => setSubject(event.target.value)} className="field-input" />
      </label>
      <label className="block">
        <span className="field-label">Message</span>
        <textarea name="body" value={body} onChange={(event) => setBody(event.target.value)} rows={9} className="field-input min-h-[12rem] resize-y leading-relaxed [field-sizing:content]" />
        <span className="mt-1 block text-xs text-[var(--ink-45)]">Une ligne vide sépare deux paragraphes. Le récapitulatif, le bouton et le PDF sont ajoutés sous le texte.</span>
      </label>

      <div className="rounded-[14px] bg-[#F5F8FC] px-3.5 py-3">
        <p className="mb-2 font-display text-[0.6875rem] font-bold tracking-[0.06em] text-[var(--ink-45)] uppercase">Signature</p>
        <div className="flex items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-[10px] bg-gradient-to-br from-[#1F6FD1] to-[#0B3A75] font-display text-xs font-extrabold text-white">
            {sender.signer
              .split(/\s+/)
              .slice(0, 2)
              .map((part) => part[0]?.toUpperCase())
              .join("")}
          </span>
          <span className="min-w-0 text-[0.8125rem] leading-snug">
            <span className="block font-display font-extrabold">{sender.signer}</span>
            {sender.company ? <span className="block text-[var(--ink-65)]">{sender.company}</span> : null}
            <span className="block truncate text-aegean-700">{[sender.email, sender.phone, sender.website].filter(Boolean).join("  |  ") || "Ajoutez e-mail, téléphone et site dans Réglages › Identités"}</span>
          </span>
        </div>
      </div>

      {canSend ? (
        <>
          <SubmitButton label={sendLabel} busy="Envoi…" icon={<Send className="size-4" />} />
          <Feedback state={sendState} />
        </>
      ) : sendHint ? (
        <p className="rounded-[12px] bg-[#F5F8FC] px-3 py-2 text-[0.8125rem] text-[var(--ink-65)]">{sendHint}</p>
      ) : null}

      <div className="mt-1 grid gap-2 border-t border-black/[0.06] pt-3">
        <p className="flex items-center gap-1.5 font-display text-[0.8125rem] font-bold">
          <FlaskConical className="size-4 text-aegean-600" />
          Recevoir un test
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            name="testTo"
            type="email"
            value={testTo}
            onChange={(event) => {
              setTypedTestTo(event.target.value);
              try {
                window.localStorage.setItem(TEST_KEY, event.target.value);
              } catch {}
            }}
            placeholder="votre@adresse.fr"
            aria-label="Adresse de test"
            className="field-input min-w-0 flex-1"
          />
          <SubmitButton label="Envoyer le test" busy="Envoi…" icon={<FlaskConical className="size-4" />} variant="ghost" formAction={test} />
        </div>
        <p className="text-xs text-[var(--ink-45)]">Le même e-mail, avec l&apos;objet et le texte ci-dessus, sans rien envoyer au client ni changer le document.</p>
        <Feedback state={testState} />
      </div>
    </form>
  );
}
