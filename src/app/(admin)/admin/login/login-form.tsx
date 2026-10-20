"use client";

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
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="field-input"
        />
      </div>

      {error ? (
        <p role="alert" className="rounded-field bg-red-50 px-4 py-3 text-sm text-red-700">
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
