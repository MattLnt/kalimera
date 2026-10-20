"use client";

import {
  ExternalLink,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  LayoutGrid,
  LogOut,
  Mail,
  Quote,
  Settings,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutGrid, exact: true },
  { href: "/admin/services", label: "Services", icon: LayoutGrid },
  { href: "/admin/projects", label: "Projets", icon: FolderKanban },
  { href: "/admin/posts", label: "Journal", icon: FileText },
  { href: "/admin/testimonials", label: "Témoignages", icon: Quote },
  { href: "/admin/media", label: "Médias", icon: ImageIcon },
  { href: "/admin/messages", label: "Messages", icon: Mail, badge: true },
  { href: "/admin/settings", label: "Réglages", icon: Settings },
];

export function AdminSidebar({
  user,
  newMessages,
}: {
  user: { name: string; email: string };
  newMessages: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="shrink-0 border-b border-black/5 bg-white lg:sticky lg:top-0 lg:h-dvh lg:w-64 lg:border-r lg:border-b-0">
      <div className="flex h-full flex-col gap-6 p-4 lg:p-5">
        <Link
          href="/admin"
          className="flex items-center gap-2 font-display text-lg font-extrabold tracking-[-0.04em]"
        >
          <Logo id="logo-admin" />
          Kalimera
        </Link>

        <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
          {nav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2.5 rounded-field px-3 py-2.5 font-display text-sm font-semibold whitespace-nowrap transition-colors",
                  active
                    ? "bg-aegean-600 text-white"
                    : "text-[var(--ink-65)] hover:bg-aegean-50 hover:text-ink",
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
                {item.badge && newMessages > 0 ? (
                  <span
                    className={cn(
                      "ml-auto rounded-full px-2 py-0.5 text-[0.6875rem] font-bold",
                      active ? "bg-white/20 text-white" : "bg-aegean-600 text-white",
                    )}
                  >
                    {newMessages}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto hidden gap-2 lg:grid">
          <a
            href="/fr"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2.5 rounded-field px-3 py-2.5 font-display text-sm font-semibold text-[var(--ink-65)] transition-colors hover:bg-aegean-50 hover:text-ink"
          >
            <ExternalLink className="size-4" />
            Voir le site
          </a>

          <div className="rounded-field bg-aegean-50 px-3 py-3">
            <p className="truncate font-display text-sm font-bold">{user.name}</p>
            <p className="truncate text-xs text-[var(--ink-45)]">{user.email}</p>
          </div>

          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex cursor-pointer items-center gap-2.5 rounded-field px-3 py-2.5 font-display text-sm font-semibold text-[var(--ink-65)] transition-colors hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="size-4" />
            Se déconnecter
          </button>
        </div>
      </div>
    </aside>
  );
}
