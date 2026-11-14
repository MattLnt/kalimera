import { Building2, Plus } from "lucide-react";
import Link from "next/link";

import { toggleIssuerArchive } from "./actions";

import { ActionLink, AdminHeader, Pill } from "@/components/admin/ui";
import { toneClasses } from "@/lib/crm/labels";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Identités de facturation" };
export const dynamic = "force-dynamic";

export default async function IssuersPage() {
  const issuers = await prisma.issuer.findMany({
    orderBy: [{ archived: "asc" }, { position: "asc" }],
    include: { _count: { select: { quotes: true, invoices: true } } },
  });

  return (
    <>
      <AdminHeader
        title="Identités de facturation"
        subtitle="Au nom de qui sont émis les devis et factures : en-tête, mentions, banque et numérotation propres à chacune."
        back={{ href: "/admin/settings", label: "Réglages" }}
        action={
          <ActionLink href="/admin/settings/issuers/new">
            <Plus className="size-4" />
            Nouvelle identité
          </ActionLink>
        }
      />

      <ul className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3">
        {issuers.map((issuer) => {
          const missing = [
            !issuer.iban ? "IBAN" : null,
            !issuer.vatMention ? "mention TVA" : null,
            !issuer.paymentTerms ? "conditions de paiement" : null,
          ].filter(Boolean);
          return (
            <li key={issuer.id} className={issuer.archived ? "opacity-50" : ""}>
              <div className="surface-card flex h-full flex-col gap-3 p-5">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-aegean-50 text-aegean-700">
                    <Building2 className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-[1rem] font-bold tracking-[-0.02em]">{issuer.label}</p>
                    <p className="text-[0.8125rem] text-[var(--ink-45)]">
                      {issuer.currency} · acompte {issuer.depositPercent} % · {issuer.invoicePrefix}-AAAA-MM-NN
                    </p>
                  </div>
                  {issuer.archived ? <Pill className={toneClasses.neutral}>Archivée</Pill> : null}
                </div>
                <p className="text-[0.8125rem] leading-relaxed whitespace-pre-line text-[var(--ink-65)]">
                  <strong className="text-ink">{issuer.name}</strong>
                  {"\n"}
                  {issuer.headerLines}
                </p>
                {missing.length ? (
                  <p className="rounded-field bg-[#E9F6F7] px-3 py-2 text-[0.75rem] text-[#0A6B74]">À compléter : {missing.join(", ")}</p>
                ) : null}
                <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-3 text-xs text-[var(--ink-45)]">
                  <span>
                    {issuer._count.quotes} devis · {issuer._count.invoices} factures
                  </span>
                  <div className="flex items-center gap-1">
                    <form action={toggleIssuerArchive}>
                      <input type="hidden" name="id" value={issuer.id} />
                      <button type="submit" className="cursor-pointer rounded-full px-3 py-1.5 font-display font-bold hover:bg-black/5">
                        {issuer.archived ? "Réactiver" : "Archiver"}
                      </button>
                    </form>
                    <Link href={`/admin/settings/issuers/${issuer.id}`} className="rounded-full bg-aegean-50 px-3 py-1.5 font-display font-bold text-aegean-700 hover:bg-aegean-100">
                      Modifier
                    </Link>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
