"use client";

import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import { createTaskQuick, deleteTaskQuick, updateTaskField } from "../board-actions";

import {
  Board,
  BoardError,
  DateCell,
  StatusCell,
  TextCell,
  useOptimisticItems,
  type BoardColumn,
} from "@/components/admin/board/board";
import { optionOf, taskPriorityOptions, taskStatusOptions } from "@/lib/crm/vivid";
import { cn } from "@/lib/utils";

export type BoardTaskRow = {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueAt: string;
  client: { id: string; name: string } | null;
  deal: { id: string; title: string } | null;
};

/* ------------------------------------------------------------------ tableau */

export function TasksBoard({ tasks, today }: { tasks: BoardTaskRow[]; today: string }) {
  const { items, patch, error } = useOptimisticItems(tasks);
  const update = (id: string, field: keyof BoardTaskRow, value: unknown) =>
    patch(id, { [field]: value } as Partial<BoardTaskRow>, () => updateTaskField(id, field, value));

  const groups = useMemo(
    () => taskStatusOptions.map((status) => ({ key: status.value, label: status.label, color: status.color, items: items.filter((item) => item.status === status.value) })),
    [items],
  );

  const columns: BoardColumn<BoardTaskRow>[] = [
    {
      key: "title",
      label: "Tâche",
      width: "minmax(300px,2fr)",
      render: (task) => <TextCell value={task.title} onChange={(value) => update(task.id, "title", value)} className={task.status === "DONE" ? "text-[var(--ink-45)] line-through" : "font-semibold"} />,
    },
    {
      key: "status",
      label: "Statut",
      width: "130px",
      align: "center",
      render: (task) => <StatusCell value={task.status} options={taskStatusOptions} onChange={(value) => update(task.id, "status", value)} />,
    },
    {
      key: "priority",
      label: "Priorité",
      width: "120px",
      align: "center",
      render: (task) => <StatusCell value={task.priority} options={taskPriorityOptions} onChange={(value) => update(task.id, "priority", value)} />,
    },
    {
      key: "due",
      label: "Échéance",
      width: "120px",
      align: "center",
      render: (task) => <DateCell value={task.dueAt} late={Boolean(task.dueAt && task.dueAt < today && task.status !== "DONE")} onChange={(value) => update(task.id, "dueAt", value)} />,
    },
    {
      key: "context",
      label: "Client · projet",
      width: "minmax(200px,1.2fr)",
      render: (task) =>
        task.client || task.deal ? (
          <div className="min-w-0 px-3 leading-tight">
            {task.client ? (
              <Link href={`/admin/clients/${task.client.id}`} className="block truncate text-[0.8125rem] font-semibold text-aegean-700 hover:underline">
                {task.client.name}
              </Link>
            ) : null}
            {task.deal ? (
              <Link href={`/admin/deals/${task.deal.id}`} className="block truncate text-[0.75rem] text-[var(--ink-45)] hover:underline">
                {task.deal.title}
              </Link>
            ) : null}
          </div>
        ) : (
          <span className="px-3 text-[var(--ink-45)]">—</span>
        ),
    },
    {
      key: "actions",
      label: "",
      width: "52px",
      align: "center",
      render: (task) => (
        <button
          type="button"
          aria-label="Supprimer la tâche"
          onClick={() => patch(task.id, { status: "__deleted" }, () => deleteTaskQuick(task.id))}
          className="grid size-8 cursor-pointer place-items-center rounded-full text-[var(--ink-45)] opacity-0 transition-opacity group-hover/row:opacity-100 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="size-4" />
        </button>
      ),
    },
  ];

  return (
    <>
      <Board
        groups={groups}
        columns={columns}
        quickAdd={{
          placeholder: "Ajouter une tâche (Entrée)",
          onAdd: async (status, title) => {
            const result = await createTaskQuick(title, status);
            return result.ok ? null : result.error;
          },
        }}
      />
      <BoardError message={error} />
    </>
  );
}

/* ------------------------------------------------------------------- kanban */

export function TasksKanban({ tasks, today }: { tasks: BoardTaskRow[]; today: string }) {
  const { items, patch, error } = useOptimisticItems(tasks);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);

  return (
    <>
      <div className="grid gap-3 md:grid-cols-3">
        {taskStatusOptions.map((status) => {
          const column = items.filter((item) => item.status === status.value);
          return (
            <section
              key={status.value}
              onDragOver={(event) => {
                event.preventDefault();
                setOver(status.value);
              }}
              onDragLeave={() => setOver(null)}
              onDrop={(event) => {
                event.preventDefault();
                setOver(null);
                if (dragging) patch(dragging, { status: status.value }, () => updateTaskField(dragging, "status", status.value));
                setDragging(null);
              }}
              className={cn("rounded-[18px] bg-black/[0.035] p-2.5 transition-colors", over === status.value && "bg-aegean-100/60 ring-2 ring-aegean-300")}
            >
              <header className="mb-2.5 flex items-center gap-2 rounded-[10px] px-3 py-2 font-display text-[0.875rem] font-bold text-white" style={{ background: status.color }}>
                {status.label}
                <span className="ml-auto rounded-full bg-white/25 px-2 text-[0.6875rem]">{column.length}</span>
              </header>
              <ul className="grid min-h-20 gap-2">
                {column.map((task) => {
                  const priority = optionOf(taskPriorityOptions, task.priority);
                  const late = task.dueAt && task.dueAt < today && task.status !== "DONE";
                  return (
                    <li
                      key={task.id}
                      draggable
                      onDragStart={() => setDragging(task.id)}
                      onDragEnd={() => setDragging(null)}
                      className={cn("cursor-grab rounded-[14px] bg-white p-3 shadow-[0_1px_2px_rgba(7,33,63,0.06)] active:cursor-grabbing", dragging === task.id && "opacity-40")}
                    >
                      <p className={cn("text-[0.875rem] font-semibold", task.status === "DONE" && "text-[var(--ink-45)] line-through")}>{task.title}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[0.6875rem]">
                        <span className="rounded-[6px] px-1.5 py-0.5 font-bold text-white" style={{ background: priority.color }}>
                          {priority.label}
                        </span>
                        {task.dueAt ? (
                          <span className={cn("rounded-[6px] bg-black/[0.05] px-1.5 py-0.5 font-semibold", late && "bg-red-100 text-red-700")}>
                            {new Date(`${task.dueAt}T00:00:00Z`).toLocaleDateString("fr-FR", { timeZone: "UTC", day: "numeric", month: "short" })}
                          </span>
                        ) : null}
                        {task.client ? <span className="truncate text-[var(--ink-45)]">{task.client.name}</span> : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
      <BoardError message={error} />
    </>
  );
}

/* ---------------------------------------------------------------- calendrier */

const monthFmt = new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", month: "long", year: "numeric" });

export function TasksCalendar({ tasks, today }: { tasks: BoardTaskRow[]; today: string }) {
  const [month, setMonth] = useState(today.slice(0, 7));
  const first = new Date(`${month}-01T00:00:00Z`);
  const start = new Date(first);
  start.setUTCDate(1 - ((first.getUTCDay() + 6) % 7));
  const cells = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(start.getUTCDate() + index);
    return date.toISOString().slice(0, 10);
  });
  const shift = (delta: number) => {
    const next = new Date(first);
    next.setUTCMonth(next.getUTCMonth() + delta);
    setMonth(next.toISOString().slice(0, 7));
  };
  const undated = tasks.filter((task) => !task.dueAt && task.status !== "DONE");

  return (
    <div className="grid gap-4">
      <div className="overflow-hidden rounded-[14px] bg-white ring-1 ring-black/[0.07]">
        <div className="flex items-center gap-2 border-b border-black/[0.07] px-4 py-3">
          <p className="flex-1 font-display text-[1rem] font-bold first-letter:uppercase">{monthFmt.format(first)}</p>
          <button type="button" onClick={() => setMonth(today.slice(0, 7))} className="cursor-pointer rounded-full bg-black/[0.04] px-3 py-1.5 font-display text-xs font-bold hover:bg-aegean-50">
            Aujourd&apos;hui
          </button>
          <button type="button" onClick={() => shift(-1)} aria-label="Mois précédent" className="grid size-8 cursor-pointer place-items-center rounded-full hover:bg-black/[0.05]">
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" onClick={() => shift(1)} aria-label="Mois suivant" className="grid size-8 cursor-pointer place-items-center rounded-full hover:bg-black/[0.05]">
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-7 border-b border-black/[0.05] bg-[#fafbfd]">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <span key={day} className="px-2 py-1.5 font-display text-[0.6875rem] font-bold tracking-wide text-[var(--ink-45)] uppercase">
              {day}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((date) => {
            const inMonth = date.startsWith(month);
            const dayTasks = tasks.filter((task) => task.dueAt === date);
            return (
              <div key={date} className={cn("min-h-28 border-r border-b border-black/[0.05] p-1.5 [&:nth-child(7n)]:border-r-0", !inMonth && "bg-black/[0.015]")}>
                <span
                  className={cn(
                    "mb-1 inline-grid size-6 place-items-center rounded-full text-[0.75rem] font-semibold",
                    date === today ? "bg-aegean-600 text-white" : inMonth ? "text-ink" : "text-[var(--ink-45)]",
                  )}
                >
                  {Number(date.slice(8))}
                </span>
                <ul className="grid gap-1">
                  {dayTasks.slice(0, 4).map((task) => {
                    const status = optionOf(taskStatusOptions, task.status);
                    return (
                      <li key={task.id} className={cn("truncate rounded-[6px] px-1.5 py-0.5 text-[0.6875rem] font-semibold text-white", task.status === "DONE" && "line-through opacity-60")} style={{ background: status.color }} title={task.title}>
                        {task.title}
                      </li>
                    );
                  })}
                  {dayTasks.length > 4 ? <li className="px-1 text-[0.6875rem] text-[var(--ink-45)]">+ {dayTasks.length - 4}</li> : null}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      {undated.length ? (
        <div className="rounded-[14px] bg-white p-4 ring-1 ring-black/[0.07]">
          <p className="mb-2 font-display text-[0.8125rem] font-bold">Sans échéance · {undated.length}</p>
          <div className="flex flex-wrap gap-2">
            {undated.map((task) => (
              <span key={task.id} className="rounded-full bg-black/[0.04] px-3 py-1.5 text-[0.8125rem] font-semibold">
                {task.title}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
