import { CalendarClock, Check, Trash2 } from "lucide-react";
import Link from "next/link";

import { createTask, deleteTask, toggleTask } from "@/app/(admin)/admin/(dashboard)/tasks/actions";
import { formatDate } from "@/lib/crm/format";
import { cn } from "@/lib/utils";

type TaskRow = {
  id: string;
  title: string;
  status: "TODO" | "DOING" | "DONE";
  priority: "LOW" | "NORMAL" | "HIGH";
  dueAt: Date | null;
  client?: { id: string; name: string } | null;
  deal?: { id: string; title: string } | null;
};

/** Liste de tâches cochables, réutilisée sur les fiches et la page Tâches. */
export function TaskList({
  tasks,
  showContext = false,
  emptyLabel = "Rien à faire pour l'instant.",
}: {
  tasks: TaskRow[];
  showContext?: boolean;
  emptyLabel?: string;
}) {
  if (tasks.length === 0) {
    return <p className="py-2 text-[0.875rem] text-[var(--ink-45)]">{emptyLabel}</p>;
  }
  const now = new Date();

  return (
    <ul className="grid gap-1">
      {tasks.map((task) => {
        const done = task.status === "DONE";
        const late = !done && task.dueAt && task.dueAt < now;
        return (
          <li key={task.id} className="group flex items-start gap-3 rounded-field px-2 py-2 hover:bg-black/[0.02]">
            <form action={toggleTask}>
              <input type="hidden" name="id" value={task.id} />
              <button
                type="submit"
                aria-label={done ? "Marquer comme à faire" : "Marquer comme fait"}
                className={cn(
                  "mt-0.5 grid size-5 cursor-pointer place-items-center rounded-[6px] border-2 transition-colors",
                  done ? "border-green-600 bg-green-600 text-white" : "border-black/20 hover:border-aegean-500",
                )}
              >
                {done ? <Check className="size-3" strokeWidth={3} /> : null}
              </button>
            </form>
            <div className="min-w-0 flex-1">
              <p className={cn("text-[0.9375rem]", done && "text-[var(--ink-45)] line-through")}>
                {task.priority === "HIGH" && !done ? (
                  <span className="mr-1.5 inline-block size-2 rounded-full bg-red-500 align-middle" title="Priorité haute" />
                ) : null}
                {task.title}
              </p>
              <p className="flex flex-wrap items-center gap-x-2 text-xs text-[var(--ink-45)]">
                {task.dueAt ? (
                  <span className={cn("inline-flex items-center gap-1", late && "font-bold text-red-600")}>
                    <CalendarClock className="size-3" />
                    {formatDate(task.dueAt)}
                  </span>
                ) : null}
                {showContext && task.client ? (
                  <Link href={`/admin/clients/${task.client.id}`} className="hover:text-aegean-700 hover:underline">
                    {task.client.name}
                  </Link>
                ) : null}
                {showContext && task.deal ? (
                  <Link href={`/admin/deals/${task.deal.id}`} className="hover:text-aegean-700 hover:underline">
                    {task.deal.title}
                  </Link>
                ) : null}
              </p>
            </div>
            <form action={deleteTask} className="opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
              <input type="hidden" name="id" value={task.id} />
              <button type="submit" aria-label="Supprimer la tâche" className="grid size-7 cursor-pointer place-items-center rounded-full text-[var(--ink-45)] hover:bg-red-50 hover:text-red-700">
                <Trash2 className="size-3.5" />
              </button>
            </form>
          </li>
        );
      })}
    </ul>
  );
}

/** Ajout rapide : un titre, une échéance facultative, Entrée. */
export function QuickTaskForm({ clientId, dealId }: { clientId?: string; dealId?: string }) {
  return (
    <form action={createTask} className="mt-3 flex flex-wrap gap-2">
      {clientId ? <input type="hidden" name="clientId" value={clientId} /> : null}
      {dealId ? <input type="hidden" name="dealId" value={dealId} /> : null}
      <input name="title" required placeholder="Nouvelle tâche…" className="field-input min-w-0 flex-1 py-2.5" aria-label="Nouvelle tâche" />
      <input name="dueAt" type="date" className="field-input w-auto py-2.5" aria-label="Échéance" />
      <button type="submit" className="cursor-pointer rounded-full bg-aegean-600 px-4 font-display text-sm font-bold text-white hover:bg-aegean-700">
        Ajouter
      </button>
    </form>
  );
}
