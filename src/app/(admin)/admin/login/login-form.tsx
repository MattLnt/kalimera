"use client";

import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function LoginForm({
  initialError,
  callbackUrl,
}: {
  initialError?: string;
  callbackUrl: string;
}) {
  const router = useRouter();
  const [error, setError] = useState(
    initialError ? "Identifiants incorrects." : "",
  );
  const [pending, setPending] = useState(false);
  const [reveal, setReveal] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const data = new FormData(event.currentTarget);
    const result = await signIn("credentials", {
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
      redirect: false,
    });

    if (result?.error) {
      // Message volontairement vague : il ne doit pas révéler si l'email existe.
      setError("Identifiants incorrects.");
      setPending(false);
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5">
      <div>
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus
          className="field-input"
        />
      </div>

      <div>
        <label htmlFor="password" className="field-label">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={reveal ? "text" : "password"}
            required
            autoComplete="current-password"
            className="field-input pr-12"
          />
          <button
            type="button"
            onClick={() => setReveal((value) => !value)}
            aria-label={reveal ? "Masquer le mot de passe" : "Afficher le mot de passe"}
            aria-pressed={reveal}
            className="absolute inset-y-0 right-1.5 my-auto grid size-9 cursor-pointer place-items-center rounded-full text-[var(--ink-45)] transition-colors hover:bg-black/5 hover:text-ink"
          >
            {reveal ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="rounded-field bg-[#EEF3FA] px-4 py-3 text-sm text-[#0B3A75]">
          {error}
        </p>
      ) : null}

      <Button
        type="submit"
        variant="blue"
        disabled={pending}
        className="mt-1 w-full justify-between disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
    </form>
  );
}
