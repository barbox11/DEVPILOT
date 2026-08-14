import type { ReactNode } from "react";
import { Button } from "@/components/button";
import { isOffline } from "@/lib/api";

export function PageHeader({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-pass-strong">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-mono text-2xl font-semibold tracking-tight md:text-3xl">
        {title}
      </h1>
      {lead ? (
        <p className="mt-4 space-y-4 text-base text-text-muted">{lead}</p>
      ) : null}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div
      aria-hidden="true"
      className="h-36 animate-pulse rounded-md border border-border bg-surface-2"
    />
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export function EmptyView({
  eyebrow,
  title,
  lead,
  emptyTitle,
  emptyCopy,
  icon,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  emptyTitle: string;
  emptyCopy: string;
  icon: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow={eyebrow} title={title} lead={lead} />
      <SkeletonGrid count={3} />
      <EmptyState title={emptyTitle} copy={emptyCopy} icon={icon} />
    </div>
  );
}

export function EmptyState({
  title,
  copy,
  ctaHref,
  ctaLabel,
  icon,
}: {
  title: string;
  copy: string;
  ctaHref?: string;
  ctaLabel?: string;
  icon: ReactNode;
}) {
  return (
    <div className="mt-10 rounded-md border border-border bg-surface px-6 py-16 text-center">
      <span
        aria-hidden="true"
        className="mx-auto grid h-12 w-12 place-items-center rounded-sm bg-surface-2 text-text-muted"
      >
        {icon}
      </span>
      <h2 className="mt-5 font-mono text-base font-semibold text-text">
        {title}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">{copy}</p>
      {ctaHref && ctaLabel ? (
        <div className="mt-6">
          <Button href={ctaHref} size="sm">
            {ctaLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function DataError({
  offline,
  onRetry,
}: {
  offline?: boolean;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="mt-10 rounded-md border border-border bg-surface px-6 py-12 text-center"
    >
      <p className="font-mono text-sm font-semibold text-accent-finding-strong">
        {offline ?? isOffline()
          ? "Sin conexión"
          : "No se pudieron cargar los datos"}
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm text-text-muted">
        {offline ?? isOffline()
          ? "Revisa tu conexión y vuelve a intentarlo."
          : "Comprueba que la API esté en marcha y vuelve a intentarlo."}
      </p>
      {onRetry ? (
        <div className="mt-6">
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            Reintentar
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function SuccessBanner({ message }: { message: string }) {
  return (
    <div
      role="status"
      className="rounded-md border border-accent-pass bg-accent-pass-soft px-4 py-3 text-sm text-accent-pass-strong"
    >
      {message}
    </div>
  );
}
