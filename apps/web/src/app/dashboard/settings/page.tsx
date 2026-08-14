"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard/view";
import { Button } from "@/components/button";
import { useAuth } from "@/lib/auth";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/login");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="AJUSTES"
        title="Configuración"
        lead="Datos de tu cuenta y sesión."
      />
      <div className="mt-8 rounded-md border border-border bg-surface p-6">
        <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em]">
          Cuenta
        </h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
              Nombre
            </dt>
            <dd className="mt-1 text-sm">{user?.name ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
              Correo electrónico
            </dt>
            <dd className="mt-1 text-sm">{user?.email ?? "—"}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
              Rol
            </dt>
            <dd className="mt-1 font-mono text-sm">{user?.role ?? "—"}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void handleLogout()}
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
}
