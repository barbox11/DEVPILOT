"use client";

import {
  PageHeader,
  SkeletonGrid,
  EmptyState,
} from "@/components/dashboard/view";
import { PulseIcon } from "@/components/dashboard/icons";
import { useActivity } from "@/lib/queries";

export default function ActivityPage() {
  const { data, isLoading, isError } = useActivity();
  const activity = data?.activity ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="ACTIVIDAD"
        title="Actividad"
        lead="Historial de acciones del equipo sobre proyectos y análisis."
      />
      <div className="mt-8">
        {isLoading ? (
          <SkeletonGrid count={3} />
        ) : isError ? (
          <div
            role="alert"
            className="rounded-md border border-border bg-surface px-6 py-10 text-center"
          >
            <p className="font-mono text-sm text-accent-finding-strong">
              No se pudo cargar la actividad.
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Comprueba que la API esté en marcha y vuelve a intentarlo.
            </p>
          </div>
        ) : activity.length === 0 ? (
          <EmptyState
            icon={<PulseIcon />}
            title="Sin actividad reciente"
            copy="Los eventos aparecerán aquí en cuanto el equipo empiece a conectar repositorios y ejecutar análisis."
          />
        ) : (
          <ul className="space-y-2">
            {activity.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3"
              >
                <PulseIcon className="h-4 w-4 shrink-0 text-accent-pass" />
                <span className="text-sm">{item.action}</span>
                <span className="ml-auto shrink-0 font-mono text-xs text-text-muted">
                  {new Date(item.createdAt).toLocaleString("es-ES")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
