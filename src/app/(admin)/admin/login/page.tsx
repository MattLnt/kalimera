import { CalendarCheck2, FileSignature, Users } from "lucide-react";
import { redirect } from "next/navigation";

import { LoginForm } from "./login-form";

import { Logo } from "@/components/site/logo";
import { Arches, Orbs } from "@/components/ui/decor";
import { auth } from "@/lib/auth";

export const metadata = { title: "Connexion" };

const promises = [
  { icon: Users, title: "Clients & projets", body: "Chaque échange, chaque note d'appel, au même endroit." },
  { icon: FileSignature, title: "Devis signés en ligne", body: "Envoyés, consultés, signés, puis facturés." },
  { icon: CalendarCheck2, title: "Agenda", body: "Les rendez-vous pris sur le site, réglés d'ici." },
];

/**
 * Connexion à l'espace studio. Écran partagé sur ordinateur : l'univers
 * Kalimera à gauche, le formulaire à droite. Sur téléphone, le formulaire
 * seul, sous un bandeau de marque.
 */
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/admin");

  const { error, callbackUrl } = await searchParams;

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      {/* ------------------------------------------------ univers */}
      <section className="night-panel relative isolate flex flex-col overflow-hidden px-6 pt-8 pb-10 text-white sm:px-12 lg:px-16 lg:py-14">
        <Orbs />
        <Arches count={7} className="h-[70%] opacity-50" />
        <span aria-hidden className="grain-layer" />

        <div className="relative z-2 flex items-center gap-2.5 font-display text-xl font-extrabold tracking-[-0.04em]">
          <Logo id="logo-login" className="size-8" />
          Kalimera
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[0.625rem] font-bold tracking-[0.1em] uppercase">
            Studio
          </span>
        </div>

        <div className="relative z-2 mt-10 hidden flex-1 flex-col justify-center lg:flex">
          <p className="font-display text-[0.75rem] font-bold tracking-[0.14em] text-aegean-200 uppercase">
            Καλημέρα
          </p>
          <h1 className="mt-4 max-w-[14ch] font-display text-[clamp(2.5rem,4.2vw,4rem)] leading-[1.02] font-extrabold tracking-[-0.05em]">
            Bonjour. Le studio vous attend.
          </h1>

          <ul className="mt-12 grid max-w-md gap-4">
            {promises.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-4 rounded-[20px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-white/10">
                  <item.icon className="size-5" />
                </span>
                <span>
                  <span className="block font-display text-[0.9375rem] font-bold">{item.title}</span>
                  <span className="mt-0.5 block text-[0.875rem] text-white/60">{item.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="relative z-2 mt-6 hidden text-[0.8125rem] text-white/40 lg:block">
          kalimera.agency — espace réservé
        </p>
      </section>

      {/* ------------------------------------------------ formulaire */}
      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[400px]">
          <h2 className="font-display text-[2rem] leading-tight font-extrabold tracking-[-0.045em]">
            Connexion
          </h2>
          <p className="mt-2 mb-8 text-[0.9375rem] text-[var(--ink-65)]">
            Clients, projets, devis et contenus du site.
          </p>

          <LoginForm initialError={error} callbackUrl={callbackUrl ?? "/admin"} />

          <p className="mt-8 text-center text-[0.8125rem] text-[var(--ink-45)]">
            Accès réservé à l’équipe Kalimera.
          </p>
        </div>
      </section>
    </main>
  );
}
