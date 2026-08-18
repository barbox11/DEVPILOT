"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AuthCard,
  AuthField,
  useAuthForm,
  useRedirectOnSuccess,
} from "@/components/auth/auth-card";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading, error, run } = useAuthForm(async ({ email, password }) => {
    await login(email, password);
  });
  const goToDashboard = useRedirectOnSuccess();

  return (
    <AuthCard
      mode="login"
      submitLabel="Iniciar sesión"
      loading={loading}
      error={error}
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link
            href="/auth/register"
            className="font-medium text-accent-pass-strong underline underline-offset-4 hover:text-accent-pass"
          >
            Regístrate
          </Link>
        </>
      }
      onSubmit={async () => {
        const ok = await run({ email, password });
        if (ok) goToDashboard();
      }}
    >
      <AuthField
        id="email"
        label="Correo electrónico"
        type="email"
        autoComplete="email"
        placeholder="ana@ejemplo.com"
        value={email}
        onChange={setEmail}
      />
      <AuthField
        id="password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        placeholder="Tu contraseña"
        value={password}
        onChange={setPassword}
      />
    </AuthCard>
  );
}
