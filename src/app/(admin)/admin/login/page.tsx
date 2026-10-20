import { redirect } from "next/navigation";

import { LoginForm } from "./login-form";

import { Logo } from "@/components/site/logo";
import { auth } from "@/lib/auth";

export const metadata = { title: "Connexion" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) redirect("/admin");

  const { error, callbackUrl } = await searchParams;

  return (
    <main className="grid min-h-dvh place-items-center px-5 py-12">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex items-center justify-center gap-2 font-display text-xl font-extrabold tracking-[-0.04em]">
          <Logo id="logo-login" className="size-8" />
          Kalimera
        </div>

        <div className="surface-card p-7 sm:p-9">
          <h1 className="display-3 mb-1.5">Administration</h1>
          <p className="mb-7 text-[0.9375rem] text-[var(--ink-65)]">
            Connectez-vous pour gérer les services, les projets et le journal.
          </p>
          <LoginForm
            initialError={error}
            callbackUrl={callbackUrl ?? "/admin"}
          />
        </div>

        <p className="mt-6 text-center text-[0.8125rem] text-[var(--ink-45)]">
          Accès réservé à l’équipe Kalimera.
        </p>
      </div>
    </main>
  );
}
