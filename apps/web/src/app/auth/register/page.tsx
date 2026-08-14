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

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { loading, error, run } = useAuthForm(
    async ({ name, email, password }) => {
      await register(name, email, password);
    },
  );
  const goToDashboard = useRedirectOnSuccess();

  return (
    <AuthCard
      mode="register"
      submitLabel="Crear cuenta"
      loading={loading}
      error={error ?? passwordError}
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-accent-pass-strong underline underline-offset-4 hover:text-accent-pass"
          >
            Inicia sesión
          </Link>
        </>
      }
      onSubmit={async () => {
        setPasswordError(null);
        if (password.length < 8) {
          setPasswordError("La contraseña debe tener al menos 8 caracteres.");
          return;
        }
        if (password !== confirm) {
          setPasswordError("Las contraseñas no coinciden.");
          return;
        }
        const ok = await run({ name, email, password });
        if (ok) goToDashboard();
      }}
    >
      <AuthField
        id="name"
        label="Nombre"
        autoComplete="name"
        placeholder="Ana García"
        value={name}
        onChange={setName}
      />
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
        autoComplete="new-password"
        placeholder="Mínimo 8 caracteres"
        value={password}
        onChange={setPassword}
      />
      <AuthField
        id="confirm"
        label="Confirmar contraseña"
        type="password"
        autoComplete="new-password"
        placeholder="Repite la contraseña"
        value={confirm}
        onChange={setConfirm}
      />
    </AuthCard>
  );
}
