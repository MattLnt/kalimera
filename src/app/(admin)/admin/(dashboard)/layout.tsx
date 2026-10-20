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

  const newMessages = await prisma.contactMessage.count({
    where: { status: "NEW" },
  });

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <AdminSidebar
        user={{ name: user.name ?? "", email: user.email ?? "" }}
        newMessages={newMessages}
      />
      <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  );
}
