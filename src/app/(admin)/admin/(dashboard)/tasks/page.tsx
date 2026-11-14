import { createTask } from "./actions";

import { TaskList } from "@/components/admin/crm/task-list";
import { AdminHeader, Panel } from "@/components/admin/ui";
import { Select } from "@/components/ui/select";
import { daysAgo } from "@/lib/crm/format";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Tâches" };
export const dynamic = "force-dynamic";

/** Bornes de la journée à Paris, en UTC. */
function parisDayBounds(now = new Date()) {
  const date = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  const start = new Date(`${date}T00:00:00+01:00`);
  return { start, end: new Date(start.getTime() + 86400000) };
}

export default async function TasksPage() {
  const { start, end } = parisDayBounds();
  const include = { client: { select: { id: true, name: true } }, deal: { select: { id: true, title: true } } };

  const [open, done, clients] = await Promise.all([
    prisma.task.findMany({
      where: { status: { not: "DONE" } },
      orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { priority: "desc" }, { createdAt: "asc" }],
      include,
    }),
    prisma.task.findMany({
      where: { status: "DONE", completedAt: { gte: daysAgo(7) } },
      orderBy: { completedAt: "desc" },
      include,
      take: 30,
    }),
    prisma.client.findMany({ where: { status: { not: "ARCHIVED" } }, orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  const late = open.filter((task) => task.dueAt && task.dueAt < start);
  const today = open.filter((task) => task.dueAt && task.dueAt >= start && task.dueAt < end);
  const upcoming = open.filter((task) => task.dueAt && task.dueAt >= end);
  const someday = open.filter((task) => !task.dueAt);

  const groups = [
    { title: "En retard", tasks: late, empty: "Rien en retard. Bravo." },
    { title: "Aujourd'hui", tasks: today, empty: "Rien de prévu aujourd'hui." },
    { title: "À venir", tasks: upcoming, empty: "Rien de planifié." },
    { title: "Sans date", tasks: someday, empty: "Aucune tâche sans échéance." },
  ];

  return (
    <>
      <AdminHeader title="Tâches" subtitle="Relances, livrables, rappels : tout ce qui doit être fait, et quand." />

      <Panel className="mb-4">
        <form action={createTask} className="grid gap-2 sm:grid-cols-[1fr_200px_160px_140px_auto]">
          <input name="title" required placeholder="Nouvelle tâche : relancer, envoyer, préparer…" className="field-input" aria-label="Tâche" />
          <Select
            name="clientId"
            placeholder="Client (facultatif)"
            options={[{ value: "", label: "Aucun client" }, ...clients.map((client) => ({ value: client.id, label: client.name }))]}
          />
          <input name="dueAt" type="date" className="field-input" aria-label="Échéance" />
          <Select
            name="priority"
            defaultValue="NORMAL"
            options={[
              { value: "LOW", label: "Basse" },
              { value: "NORMAL", label: "Normale" },
              { value: "HIGH", label: "Haute" },
            ]}
          />
          <button type="submit" className="cursor-pointer rounded-full bg-aegean-600 px-5 py-3 font-display text-sm font-bold text-white hover:bg-aegean-700">
            Ajouter
          </button>
        </form>
      </Panel>

      <div className="grid items-stretch gap-4 lg:grid-cols-2">
        {groups.map((group) => (
          <Panel
            key={group.title}
            title={`${group.title}${group.tasks.length ? ` · ${group.tasks.length}` : ""}`}
            className={group.title === "En retard" && group.tasks.length ? "ring-2 ring-red-200" : ""}
          >
            <TaskList tasks={group.tasks} showContext emptyLabel={group.empty} />
          </Panel>
        ))}
      </div>

      {done.length > 0 ? (
        <Panel title="Faites ces 7 derniers jours" className="mt-4">
          <TaskList tasks={done} showContext />
        </Panel>
      ) : null}
    </>
  );
}
