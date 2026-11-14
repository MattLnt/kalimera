import { ArrowRight, Building2 } from "lucide-react";
import Link from "next/link";

import { PasswordForm, ProfileForm } from "./settings-forms";

import { AdminHeader, Panel } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { cloudinaryConfigured } from "@/lib/cloudinary";
import { emailConfigured } from "@/lib/email";

export const metadata = { title: "Réglages" };

export default async function SettingsPage() {
  const user = await requireUser();

  const services = [
    { label: "Base de données (Railway)", ok: Boolean(process.env.DATABASE_URL) },
    { label: "Images (Cloudinary)", ok: cloudinaryConfigured },
    { label: "Emails (Resend)", ok: emailConfigured },
    { label: "URL publique du site", ok: Boolean(process.env.NEXT_PUBLIC_SITE_URL) },
  ];

  return (
    <>
      <AdminHeader title="Réglages" subtitle="Votre compte et l'état des services connectés." />

      <div className="grid gap-4">
        <Link
          href="/admin/settings/issuers"
          className="surface-card surface-card-hover flex items-center gap-4 p-5"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-aegean-50 text-aegean-700">
            <Building2 className="size-5" />
          </span>
          <span className="flex-1">
            <span className="block font-display text-[1rem] font-bold tracking-[-0.02em]">Identités de facturation</span>
            <span className="block text-[0.875rem] text-[var(--ink-65)]">
              Kalimera LLC, nom propre, Estelle : en-têtes, mentions, banque et numérotation des devis et factures.
            </span>
          </span>
          <ArrowRight className="size-4 text-aegean-600" />
        </Link>
        <ProfileForm name={user?.name ?? ""} email={user?.email ?? ""} />
        <PasswordForm />

        <Panel
          title="Services connectés"
          description="Un service manquant n'empêche pas le site de fonctionner, mais désactive la fonction correspondante."
        >
          <ul className="grid gap-2.5">
            {services.map((service) => (
              <li key={service.label} className="flex items-center gap-3">
                <span
                  aria-hidden
                  className={`size-2.5 rounded-full ${service.ok ? "bg-green-500" : "bg-amber-500"}`}
                />
                <span className="text-[0.9375rem]">{service.label}</span>
                <span className="ml-auto font-display text-xs font-bold text-[var(--ink-45)]">
                  {service.ok ? "Configuré" : "Non configuré"}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </>
  );
}
