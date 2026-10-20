"use client";

import { CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { submitEnquiry, type ContactState } from "./actions";

import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

const subjects = [
  "website",
  "ecommerce",
  "webapp",
  "mobile",
  "design",
  "maintenance",
  "other",
] as const;

const budgets = ["under10", "10to25", "25to50", "over50", "unknown"] as const;

const initialState: ContactState = { status: "idle" };

export function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, formAction] = useActionState(submitEnquiry, initialState);

  if (state.status === "success") {
    return (
      <div className="surface-card p-8 text-center sm:p-12">
        <span className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-aegean-100 text-aegean-700">
          <CheckCircle2 className="size-7" />
        </span>
        <h2 className="display-3">{t("successTitle")}</h2>
        <p className="mx-auto mt-3 max-w-[40ch] text-[var(--ink-65)]">
          {t("successBody")}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="surface-card p-6 sm:p-10">
      <input type="hidden" name="locale" value={locale} />

      {/* Piège à robots : masqué visuellement et retiré de l'ordre de tabulation. */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <h2 className="display-3 mb-7">{t("formTitle")}</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("name")} error={state.errors?.name}>
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            className="field-input"
            aria-invalid={state.errors?.name ? "true" : undefined}
          />
        </Field>

        <Field label={t("email")} error={state.errors?.email}>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className="field-input"
            aria-invalid={state.errors?.email ? "true" : undefined}
          />
        </Field>

        <Field label={t("company")} optional={t("optional")}>
          <input
            name="company"
            type="text"
            autoComplete="organization"
            className="field-input"
          />
        </Field>

        <Field label={t("phone")} optional={t("optional")}>
          <input name="phone" type="tel" autoComplete="tel" className="field-input" />
        </Field>

        <Field label={t("subject")} error={state.errors?.subject}>
          <select
            name="subject"
            required
            defaultValue=""
            className="field-input"
            aria-invalid={state.errors?.subject ? "true" : undefined}
          >
            <option value="" disabled>
              {t("subjectPlaceholder")}
            </option>
            {subjects.map((key) => (
              <option key={key} value={t(`subjects.${key}`)}>
                {t(`subjects.${key}`)}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t("budget")} optional={t("optional")}>
          <select name="budget" defaultValue="" className="field-input">
            <option value="">{t("budgetPlaceholder")}</option>
            {budgets.map((key) => (
              <option key={key} value={t(`budgets.${key}`)}>
                {t(`budgets.${key}`)}
              </option>
            ))}
          </select>
        </Field>

        <div className="sm:col-span-2">
          <Field label={t("message")} error={state.errors?.message}>
            <textarea
              name="message"
              required
              rows={6}
              minLength={20}
              placeholder={t("messagePlaceholder")}
              className="field-input resize-y"
              aria-invalid={state.errors?.message ? "true" : undefined}
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem] text-[var(--ink-65)]">
            <input
              name="consent"
              type="checkbox"
              required
              className="mt-1 size-4 shrink-0 accent-aegean-600"
            />
            <span>{t("consent")}</span>
          </label>
          {state.errors?.consent ? (
            <p className="field-error">{state.errors.consent}</p>
          ) : null}
        </div>
      </div>

      {state.errors?.form ? (
        <p
          role="alert"
          className="mt-6 rounded-field bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.errors.form}
        </p>
      ) : null}

      {state.status === "error" && !state.errors?.form ? (
        <p role="alert" className="mt-6 text-sm text-red-700">
          {t("errorTitle")}{" "}
          {t("errorBody", { email: siteConfig.email })}
        </p>
      ) : null}

      <SubmitButton idle={t("submit")} busy={t("submitting")} />
    </form>
  );
}

function SubmitButton({ idle, busy }: { idle: string; busy: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="blue"
      disabled={pending}
      className="mt-8 disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? busy : idle}
    </Button>
  );
}

function Field({
  label,
  optional,
  error,
  children,
}: {
  label: string;
  optional?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="field-label">
        {label}
        {optional ? (
          <span className="ml-1.5 font-normal text-[var(--ink-45)]">({optional})</span>
        ) : null}
      </label>
      {children}
      {error ? <p className="field-error">{error}</p> : null}
    </div>
  );
}
