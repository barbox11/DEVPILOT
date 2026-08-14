"use client";

import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { ApiError } from "@/lib/api";

export type AuthMode = "login" | "register";

export function AuthCard({
  mode,
  submitLabel,
  footer,
  children,
  onSubmit,
  loading,
  error,
}: {
  mode: AuthMode;
  submitLabel: string;
  footer: ReactNode;
  children: ReactNode;
  onSubmit: () => Promise<void>;
  loading: boolean;
  error: string | null;
}) {
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await onSubmit();
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-md border border-border bg-surface p-8 shadow-sm">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-pass-strong">
          {mode === "login" ? "ACCESO" : "REGISTRO"}
        </p>
        <h1 className="mt-3 font-mono text-2xl font-semibold tracking-tight">
          {mode === "login"
            ? "Inicia sesión en tu panel"
            : "Crea tu cuenta de DevPilot"}
        </h1>
        <p className="mt-3 text-sm text-text-muted">
          {mode === "login"
            ? "Accede a tus análisis, proyectos y recomendaciones."
            : "Empieza a analizar tu código y a seguir su salud."}
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {children}

          {error ? (
            <div
              role="alert"
              className="rounded-md border border-accent-finding bg-accent-finding-soft px-4 py-3 text-sm text-accent-finding-strong"
            >
              {error}
            </div>
          ) : null}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? mode === "login"
                ? "Entrando…"
                : "Creando cuenta…"
              : submitLabel}
          </Button>
        </form>
      </div>
      <p className="mt-6 text-center text-sm text-text-muted">{footer}</p>
    </div>
  );
}

export function AuthField({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-mono text-xs font-semibold uppercase tracking-[0.2em] text-text-muted"
      >
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-text placeholder:text-text-muted/60 focus:border-accent-pass focus:outline-none focus:ring-2 focus:ring-accent-pass/30"
      />
    </div>
  );
}

export function useAuthForm(
  onSubmit: (values: Record<string, string>) => Promise<void>,
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run(values: Record<string, string>): Promise<boolean> {
    setError(null);
    setLoading(true);
    try {
      await onSubmit(values);
      return true;
    } catch (caught) {
      const message =
        caught instanceof ApiError
          ? caught.message
          : "No se pudo completar la solicitud. Inténtalo de nuevo.";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, run };
}

export function useRedirectOnSuccess() {
  const router = useRouter();
  return () => {
    router.replace("/dashboard");
    router.refresh();
  };
}
