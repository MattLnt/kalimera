import { AlarmClock, CalendarDays, CalendarCheck2, CheckCircle2, Columns3, ListTodo, Table2 } from "lucide-react";

import { TasksBoard, TasksCalendar, TasksKanban, type BoardTaskRow } from "./tasks-board";

import { ViewSwitcher } from "@/components/admin/board/board";
import { AdminHeader, StatCard } from "@/components/admin/ui";
import { daysAgo, toDateInput } from "@/lib/crm/format";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Tâches" };
export const dynamic = "force-dynamic";

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const { view = "table" } = await searchParams;
  const today = toDateInput(new Date());

  // Les tâches ouvertes, et celles terminées ces 14 derniers jours.
  const tasks = await prisma.task.findMany({
    where: { OR: [{ status: { not: "DONE" } }, { completedAt: { gte: daysAgo(14) } }] },
    orderBy: [{ dueAt: { sort: "asc", nulls: "last" } }, { priority: "desc" }, { createdAt: "asc" }],
    include: { client: { select: { id: true, name: true } }, deal: { select: { id: true, title: true } } },
  });

  const rows: BoardTaskRow[] = tasks.map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    dueAt: toDateInput(task.dueAt),
    client: task.client,
    deal: task.deal,
  }));

  const open = rows.filter((row) => row.status !== "DONE");
  const late = open.filter((row) => row.dueAt && row.dueAt < today);
  const dueToday = open.filter((row) => row.dueAt === today);
  const done = rows.filter((row) => row.status === "DONE");

  const views = [
    { key: "table", label: "Tableau", icon: <Table2 className="size-4" />, href: "/admin/tasks?view=table" },
    { key: "kanban", label: "Kanban", icon: <Columns3 className="size-4" />, href: "/admin/tasks?view=kanban" },
    { key: "calendar", label: "Calendrier", icon: <CalendarDays className="size-4" />, href: "/admin/tasks?view=calendar" },
  ];

  return (
    <>
      <AdminHeader eyebrow="Pilotage" title="Tâches" subtitle="Relances, livrables, rappels. Modifiez statut, priorité ou échéance d'un clic ; glissez les cartes dans le kanban.">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard color="blue" icon={<ListTodo className="size-4" />} label="Ouvertes" value={String(open.length)} />
          <StatCard color="red" icon={<AlarmClock className="size-4" />} label="En retard" value={String(late.length)} hint={late.length ? "À rattraper" : "Rien en retard"} />
          <StatCard color="orange" icon={<CalendarCheck2 className="size-4" />} label="Aujourd'hui" value={String(dueToday.length)} />
          <StatCard color="green" icon={<CheckCircle2 className="size-4" />} label="Faites (14 j)" value={String(done.length)} />
        </div>
      </AdminHeader>

      <div className="mb-5">
        <ViewSwitcher views={views} current={view} />
      </div>

      {view === "kanban" ? <TasksKanban tasks={rows} today={today} /> : view === "calendar" ? <TasksCalendar tasks={rows} today={today} /> : <TasksBoard tasks={rows} today={today} />}
    </>
  );
}
