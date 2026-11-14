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
    // Le dégradé bleu du site encadre toute l'administration : la barre
    // latérale est posée dessus, sur toute la hauteur, et le contenu est une
    // grande surface claire bordée par ce bleu.
    <div className="night-panel relative isolate flex min-h-dvh flex-col bg-fixed lg:flex-row">
      <span aria-hidden className="grain-layer fixed! z-0" />
      <AdminSidebar
        user={{ name: user.name ?? "", email: user.email ?? "" }}
        counts={{ messages, tasks }}
      />
      {/* En bas sur mobile, la place de la barre de navigation. */}
      <main className="relative z-1 min-w-0 flex-1 rounded-t-[26px] bg-canvas px-4 pt-6 pb-28 text-ink sm:px-8 sm:pt-8 lg:my-3 lg:mr-3 lg:rounded-[26px] lg:px-10 lg:py-10 2xl:px-14 lg:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_30px_60px_-30px_rgba(0,0,0,0.6)]">
        <div className="mx-auto w-full max-w-[1720px]">{children}</div>
      </main>
    </div>
  );
}
