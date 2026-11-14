import { redirect } from "next/navigation";

import { AdminSidebar } from "@/components/admin/sidebar";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Garde unique de toute l'administration : aucune page de ce segment ne
  // s'affiche sans session valide.
  const user = await requireUser();
  if (!user) redirect("/admin/login");

  const endOfToday = new Date();
  endOfToday.setUTCHours(23, 59, 59, 999);

  const [messages, tasks] = await Promise.all([
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    // Pastille « Tâches » : ce qui est dû aujourd'hui ou en retard.
    prisma.task.count({ where: { status: { not: "DONE" }, dueAt: { lte: endOfToday } } }),
  ]);

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <AdminSidebar
        user={{ name: user.name ?? "", email: user.email ?? "" }}
        counts={{ messages, tasks }}
      />
      {/* En bas sur mobile, la place de la barre de navigation. */}
      <main className="min-w-0 flex-1 px-4 pt-5 pb-28 sm:px-8 sm:pt-8 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
