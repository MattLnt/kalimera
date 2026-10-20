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
