import { Archive, Mail, MailOpen } from "lucide-react";
import Link from "next/link";

import { archiveMessage, markMessageRead } from "./actions";

import { AdminHeader, EmptyState, Panel } from "@/components/admin/ui";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export const metadata = { title: "Messages" };

const statusLabels = {
  NEW: "Nouveau",
  READ: "Lu",
  ARCHIVED: "Archivé",
} as const;

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const showArchived = filter === "archived";

  const messages = await prisma.contactMessage.findMany({
    where: showArchived ? { status: "ARCHIVED" } : { status: { not: "ARCHIVED" } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
  });

  return (
    <>
      <AdminHeader
        title="Messages"
        subtitle="Les demandes reçues via le formulaire de contact."
      />

      <div className="mb-5 inline-flex gap-1 rounded-full bg-black/5 p-1">
        <Link
          href="/admin/messages"
          className={cn(
            "rounded-full px-4 py-2 font-display text-sm font-bold transition-colors",
            !showArchived ? "bg-white text-aegean-700 shadow-soft" : "text-[var(--ink-45)]",
          )}
        >
          En cours
        </Link>
        <Link
          href="/admin/messages?filter=archived"
          className={cn(
            "rounded-full px-4 py-2 font-display text-sm font-bold transition-colors",
            showArchived ? "bg-white text-aegean-700 shadow-soft" : "text-[var(--ink-45)]",
          )}
        >
          Archivés
        </Link>
      </div>

      {messages.length === 0 ? (
        <EmptyState
          title={showArchived ? "Aucun message archivé" : "Aucun message"}
          description={
            showArchived
              ? "Les messages que vous archivez apparaîtront ici."
              : "Les demandes envoyées depuis le formulaire de contact s'afficheront ici, et vous recevrez aussi un email."
          }
        />
      ) : (
        <div className="grid gap-3">
          {messages.map((message) => (
            <Panel key={message.id} className={message.status === "NEW" ? "ring-2 ring-aegean-200" : ""}>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-base font-bold tracking-[-0.02em]">
                    {message.name}
                    {message.company ? (
                      <span className="font-normal text-[var(--ink-45)]">
                        {" "}
                        · {message.company}
                      </span>
                    ) : null}
                  </p>
                  <p className="text-xs text-[var(--ink-45)]">
                    {formatter.format(message.createdAt)} · {message.locale} ·{" "}
                    {statusLabels[message.status]}
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  {message.status === "NEW" ? (
                    <form action={markMessageRead}>
                      <input type="hidden" name="id" value={message.id} />
                      <button
                        type="submit"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 font-display text-xs font-bold text-[var(--ink-65)] transition-colors hover:bg-black/5 hover:text-ink"
                      >
                        <MailOpen className="size-3.5" />
                        Marquer comme lu
                      </button>
                    </form>
                  ) : null}

                  {message.status !== "ARCHIVED" ? (
                    <form action={archiveMessage}>
                      <input type="hidden" name="id" value={message.id} />
                      <button
                        type="submit"
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 font-display text-xs font-bold text-[var(--ink-65)] transition-colors hover:bg-black/5 hover:text-ink"
                      >
                        <Archive className="size-3.5" />
                        Archiver
                      </button>
                    </form>
                  ) : null}
                </div>
              </div>

              <dl className="mb-4 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                <Row label="Email">
                  <a
                    href={`mailto:${message.email}`}
                    className="text-aegean-700 hover:underline"
                  >
                    {message.email}
                  </a>
                </Row>
                {message.phone ? (
                  <Row label="Téléphone">
                    <a href={`tel:${message.phone}`} className="text-aegean-700 hover:underline">
                      {message.phone}
                    </a>
                  </Row>
                ) : null}
                <Row label="Type de projet">{message.subject}</Row>
                {message.budget ? <Row label="Budget">{message.budget}</Row> : null}
              </dl>

              <div className="rounded-field bg-aegean-50 p-4">
                <p className="text-[0.9375rem] leading-[1.6] whitespace-pre-wrap text-[var(--ink-74)]">
                  {message.message}
                </p>
              </div>

              <a
                href={`mailto:${message.email}?subject=${encodeURIComponent(`Re : ${message.subject}`)}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 font-display text-sm font-bold text-white transition-opacity hover:opacity-90"
              >
                <Mail className="size-4" />
                Répondre
              </a>
            </Panel>
          ))}
        </div>
      )}
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-2">
      <dt className="shrink-0 text-[var(--ink-45)]">{label} :</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}
