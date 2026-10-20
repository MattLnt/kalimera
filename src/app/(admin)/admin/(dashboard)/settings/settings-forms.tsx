"use client";

import { useActionState } from "react";

import { changePassword, updateProfile, type SettingsState } from "./actions";

import { FormError, SubmitButton } from "@/components/admin/form-controls";
import { Field, Panel } from "@/components/admin/ui";

const initialState: SettingsState = {};

function Success({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p
      role="status"
      className="rounded-field bg-green-50 px-4 py-3 text-sm text-green-800"
    >
      {message}
    </p>
  );
}

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const [state, formAction] = useActionState(updateProfile, initialState);

  return (
    <Panel title="Votre compte" description="Nom affiché et adresse de connexion.">
      <form action={formAction} className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nom">
            <input name="name" defaultValue={name} className="field-input" required />
          </Field>
          <Field label="Adresse email">
            <input
              name="email"
              type="email"
              defaultValue={email}
              className="field-input"
              required
            />
          </Field>
        </div>

        <FormError message={state.error} />
        <Success message={state.success} />

        <div>
          <SubmitButton />
        </div>
      </form>
    </Panel>
  );
}

export function PasswordForm() {
  const [state, formAction] = useActionState(changePassword, initialState);

  return (
    <Panel
      title="Mot de passe"
      description="Douze caractères minimum. Utilisez un gestionnaire de mots de passe."
    >
      <form action={formAction} className="grid max-w-md gap-5">
        <Field label="Mot de passe actuel">
          <input
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            className="field-input"
            required
          />
        </Field>

        <Field label="Nouveau mot de passe">
          <input
            name="newPassword"
            type="password"
            autoComplete="new-password"
            minLength={12}
            className="field-input"
            required
          />
        </Field>

        <Field label="Confirmer le nouveau mot de passe">
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={12}
            className="field-input"
            required
          />
        </Field>

        <FormError message={state.error} />
        <Success message={state.success} />

        <div>
          <SubmitButton label="Changer le mot de passe" />
        </div>
      </form>
    </Panel>
  );
}
