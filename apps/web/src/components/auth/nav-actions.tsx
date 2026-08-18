"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/button";
import { useAuth } from "@/lib/auth";

export function AuthNavActions({ className = "" }: { className?: string }) {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  if (loading) {
    return (
      <span
        aria-hidden="true"
        className={`inline-block h-11 w-24 animate-pulse rounded-md bg-surface-2 ${className}`}
      />
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span className="hidden max-w-32 truncate font-mono text-xs uppercase tracking-[0.2em] text-text-muted lg:inline">
          {user.name}
        </span>
        <Button href="/dashboard" size="sm">
          Panel de control
        </Button>
        <button
          type="button"
          onClick={() => void handleLogout()}
          className="inline-flex cursor-pointer items-center justify-center font-mono text-xs uppercase tracking-[0.2em] text-text-muted transition-colors duration-200 hover:text-text"
        >
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/auth/login"
      className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-md border border-border bg-surface px-4 py-2 font-mono text-xs font-medium uppercase tracking-[0.2em] text-text transition-colors duration-200 hover:border-ink/40"
    >
      Iniciar sesión
    </Link>
  );
}
