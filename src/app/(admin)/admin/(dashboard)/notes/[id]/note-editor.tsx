"use client";

import { Check, Eye, Loader2, Pause, PenLine, Pin, Play, Timer } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { saveNote, type NoteDraft } from "../actions";

import { Select } from "@/components/ui/select";
import { noteKind } from "@/lib/crm/labels";
import { cn } from "@/lib/utils";

/** Blocs à insérer d'un clic pendant l'appel. */
const snippets = [
  { label: "Besoin", text: "\n## Besoin exprimé\n" },
  { label: "Budget", text: "\n## Budget\n" },
  { label: "Délai", text: "\n## Délai\n" },
  { label: "Décideurs", text: "\n## Décideurs\n" },
  { label: "Objection", text: "\n> Objection : " },
  { label: "Action", text: "\n- [ ] " },
];

function toLocalInput(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

/**
 * Éditeur de note, pensé pour être rempli en direct pendant un appel :
 * chronomètre, blocs à insérer, et enregistrement automatique — on ne pense
 * jamais à cliquer sur « Enregistrer » quand le client parle.
 */
export function NoteEditor({
  initial,
  deals,
  live,
}: {
  initial: NoteDraft;
  deals: { id: string; title: string }[];
  live: boolean;
}) {
  const [draft, setDraft] = useState(initial);
  const [preview, setPreview] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const textRef = useRef<HTMLTextAreaElement>(null);

  // Chronomètre d'appel : démarre seul quand on arrive depuis « Nouvel appel ».
  const [running, setRunning] = useState(live);
  const [seconds, setSeconds] = useState((initial.durationMin ?? 0) * 60);
  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const update = useCallback((patch: Partial<NoteDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setDirty(true);
  }, []);

  // La durée suit le chronomètre, à la minute près.
  const minutes = Math.round(seconds / 60);
  useEffect(() => {
    if (running && minutes !== draft.durationMin) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronise la durée avec le chronomètre
      update({ durationMin: minutes });
    }
  }, [minutes, running, draft.durationMin, update]);

  const save = useCallback(
    (value: NoteDraft) => {
      startTransition(async () => {
        const result = await saveNote(value);
        setSavedAt(result.savedAt);
        setDirty(false);
      });
    },
    [],
  );

  // Enregistrement automatique, une seconde et demie après la dernière frappe.
  useEffect(() => {
    if (!dirty) return;
    const timer = window.setTimeout(() => save(draft), 1500);
    return () => window.clearTimeout(timer);
  }, [draft, dirty, save]);

  // Ctrl/Cmd + S enregistre tout de suite.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "s") {
        event.preventDefault();
        save(draft);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft, save]);

  // Avertit avant de quitter avec des modifications non enregistrées.
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  const insert = (text: string) => {
    const area = textRef.current;
    if (!area) return update({ body: draft.body + text });
    const start = area.selectionStart;
    const body = draft.body.slice(0, start) + text + draft.body.slice(area.selectionEnd);
    update({ body });
    requestAnimationFrame(() => {
      area.focus();
      area.setSelectionRange(start + text.length, start + text.length);
    });
  };

  const clock = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  return (
    <div className="surface-card flex h-full flex-col overflow-hidden">
      {/* Barre d'outils */}
      <div className="flex flex-wrap items-center gap-2 border-b border-black/5 p-3 sm:p-4">
        {draft.kind === "CALL" || draft.kind === "MEETING" ? (
          <button
            type="button"
            onClick={() => setRunning((value) => !value)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 font-display text-sm font-bold tabular-nums transition-colors",
              running ? "bg-red-50 text-red-700" : "bg-aegean-50 text-aegean-700",
            )}
          >
            {running ? (
              <>
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                </span>
                {clock}
                <Pause className="size-3.5" />
              </>
            ) : (
              <>
                <Timer className="size-4" />
                {seconds > 0 ? clock : "Chronomètre"}
                <Play className="size-3.5" />
              </>
            )}
          </button>
        ) : null}

        <div className="flex flex-wrap gap-1">
          {snippets.map((snippet) => (
            <button
              key={snippet.label}
              type="button"
              onClick={() => insert(snippet.text)}
              className="cursor-pointer rounded-full bg-black/5 px-3 py-1.5 font-display text-xs font-bold text-[var(--ink-65)] transition-colors hover:bg-aegean-100 hover:text-aegean-800"
            >
              + {snippet.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => update({ pinned: !draft.pinned })}
            aria-pressed={draft.pinned}
            title="Épingler en haut de la fiche"
            className={cn(
              "grid size-9 cursor-pointer place-items-center rounded-full transition-colors",
              draft.pinned ? "bg-amber-100 text-amber-700" : "text-[var(--ink-45)] hover:bg-black/5",
            )}
          >
            <Pin className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setPreview((value) => !value)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 font-display text-xs font-bold text-[var(--ink-65)] hover:bg-black/5"
          >
            {preview ? <PenLine className="size-3.5" /> : <Eye className="size-3.5" />}
            {preview ? "Écrire" : "Aperçu"}
          </button>
          <span className="flex min-w-24 items-center justify-end gap-1.5 text-xs text-[var(--ink-45)]">
            {pending ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                Enregistrement
              </>
            ) : dirty ? (
              "Modifié"
            ) : savedAt ? (
              <>
                <Check className="size-3.5 text-green-600" />
                Enregistré
              </>
            ) : null}
          </span>
        </div>
      </div>

      {/* En-tête de la note */}
      <div className="grid gap-3 border-b border-black/5 p-4 sm:grid-cols-[1fr_170px_200px_110px] sm:p-5">
        <input
          value={draft.title}
          onChange={(event) => update({ title: event.target.value })}
          placeholder="Titre de la note"
          aria-label="Titre"
          className="field-input font-display text-[1.0625rem] font-bold"
        />
        <Select
          name="kind"
          defaultValue={draft.kind}
          onValueChange={(value) => update({ kind: value as NoteDraft["kind"] })}
          options={Object.entries(noteKind).map(([value, item]) => ({ value, label: item.label }))}
        />
        <input
          type="datetime-local"
          aria-label="Date"
          value={toLocalInput(draft.occurredAt)}
          onChange={(event) => update({ occurredAt: new Date(event.target.value).toISOString() })}
          className="field-input"
        />
        <label className="relative">
          <span className="sr-only">Durée en minutes</span>
          <input
            type="number"
            min={0}
            value={draft.durationMin ?? ""}
            onChange={(event) => update({ durationMin: event.target.value ? Number(event.target.value) : null })}
            placeholder="Durée"
            className="field-input pr-12"
          />
          <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-xs text-[var(--ink-45)]">min</span>
        </label>
        {deals.length > 0 ? (
          <div className="sm:col-span-4">
            <Select
              name="dealId"
              defaultValue={draft.dealId ?? ""}
              placeholder="Rattacher à un projet (facultatif)"
              onValueChange={(value) => update({ dealId: value || null })}
              options={[{ value: "", label: "Aucun projet" }, ...deals.map((deal) => ({ value: deal.id, label: deal.title }))]}
            />
          </div>
        ) : null}
      </div>

      {/* Corps */}
      {preview ? (
        <div className="prose-admin min-h-[50vh] flex-1 overflow-y-auto p-5 sm:p-7">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft.body || "*Note vide.*"}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          ref={textRef}
          value={draft.body}
          onChange={(event) => update({ body: event.target.value })}
          placeholder="Écrivez pendant l'appel… (Markdown accepté : ## titre, - liste, - [ ] action)"
          className="min-h-[50vh] flex-1 resize-none bg-transparent p-5 font-mono text-[0.9375rem] leading-relaxed outline-none sm:p-7"
          spellCheck
        />
      )}
    </div>
  );
}
