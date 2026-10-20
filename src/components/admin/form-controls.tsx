"use client";

import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

/** Bouton de soumission qui se verrouille pendant l'envoi. */
export function SubmitButton({
  label = "Enregistrer",
  busyLabel = "Enregistrement…",
}: {
  label?: string;
  busyLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="blue"
      disabled={pending}
      className="disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? busyLabel : label}
    </Button>
  );
}

/** Bouton de suppression : demande confirmation avant de soumettre. */
export function DeleteButton({
  label = "Supprimer",
  confirmMessage = "Supprimer définitivement ? Cette action est irréversible.",
}: {
  label?: string;
  confirmMessage?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
      className="inline-flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 font-display text-sm font-bold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
      {label}
    </button>
  );
}

/**
 * Liste de valeurs courtes (technologies, pastilles). Sérialisée dans un
 * champ caché au format JSON pour n'avoir qu'une valeur à lire côté serveur.
 */
export function TagListInput({
  name,
  initial = [],
  label,
  placeholder = "Ajouter…",
  hint,
}: {
  name: string;
  initial?: string[];
  label: string;
  placeholder?: string;
  hint?: string;
}) {
  const [items, setItems] = useState<string[]>(initial);
  const [draft, setDraft] = useState("");

  function add() {
    const value = draft.trim();
    if (!value || items.includes(value)) {
      setDraft("");
      return;
    }
    setItems([...items, value]);
    setDraft("");
  }

  return (
    <div>
      <span className="field-label">{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(items)} />

      {items.length > 0 ? (
        <ul className="mb-2.5 flex flex-wrap gap-1.5">
          {items.map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 rounded-full bg-aegean-50 py-1.5 pr-2 pl-3 font-display text-xs font-semibold text-aegean-700"
            >
              {item}
              <button
                type="button"
                onClick={() => setItems(items.filter((value) => value !== item))}
                aria-label={`Retirer ${item}`}
                className="cursor-pointer rounded-full p-0.5 hover:bg-aegean-200"
              >
                <Trash2 className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          placeholder={placeholder}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            // Entrée ajoute la valeur sans soumettre tout le formulaire.
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            }
          }}
          className="field-input"
        />
        <button
          type="button"
          onClick={add}
          aria-label="Ajouter"
          className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-field bg-ink text-white transition-opacity hover:opacity-90"
        >
          <Plus className="size-4" />
        </button>
      </div>

      {hint ? <p className="mt-1.5 text-xs text-[var(--ink-45)]">{hint}</p> : null}
    </div>
  );
}

/** Message d'erreur global renvoyé par une action serveur. */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-field bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </p>
  );
}
