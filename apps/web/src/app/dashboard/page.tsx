"use client";

import {
  PageHeader,
  SkeletonGrid,
  EmptyState,
  DataError,
} from "@/components/dashboard/view";
import { FolderIcon, PulseIcon } from "@/components/dashboard/icons";
import { useOverview } from "@/lib/queries";
import { useOnline } from "@/lib/use-online";

export default function OverviewPage() {
  const { data, isLoading, isError, refetch } = useOverview();
  const offline = !useOnline();

  const metrics = [
    {
      label: "PROYECTOS",
      value: data?.metrics.projects ?? "—",
    },
    {
      label: "ANÁLISIS",
      value: data?.metrics.completedAnalyses ?? "—",
    },
    {
      label: "HALLAZGOS",
      value: data?.metrics.openIssues ?? "—",
    },
    {
      label: "SALUD MEDIA",
      value:
        data?.metrics.avgHealth != null ? `${data.metrics.avgHealth}%` : "—",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="VISIÓN GENERAL"
        title="Salud de tus proyectos"
        lead="Métricas agregadas: calidad, seguridad, testing y arquitectura de todos tus análisis."
      />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-md border border-border bg-surface p-5"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
              {metric.label}
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold text-text">
              {isLoading ? "…" : metric.value}
            </p>
          </div>
        ))}
      </div>

      {isLoading ? (
        <SkeletonGrid count={4} />
      ) : isError ? (
        <DataError offline={offline} onRetry={() => void refetch()} />
      ) : data && data.metrics.projects > 0 ? (
        <div className="mt-10 space-y-4">
          <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
            Proyectos recientes
          </h2>
          <ul className="space-y-3">
            {data.recentProjects.map((project) => (
              <li
                key={project.id}
                className="flex items-center justify-between rounded-md border border-border bg-surface p-4"
              >
                <div className="flex items-center gap-3">
                  <FolderIcon className="h-5 w-5 text-text-muted" />
                  <div>
                    <p className="font-mono text-sm font-medium">
                      {project.name}
                    </p>
                    {project.repoUrl ? (
                      <p className="truncate text-xs text-text-muted">
                        {project.repoUrl}
                      </p>
                    ) : (
                      <p className="text-xs text-text-muted">Sin repositorio</p>
                    )}
                  </div>
                </div>
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                  {project._count.analyses} análisis
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <EmptyState
          icon={<FolderIcon className="h-6 w-6" />}
          title="Conecta tu primer repositorio"
          copy="Apunta DevPilot a un repositorio para empezar el primer análisis y ver el informe completo."
          ctaHref="/dashboard/projects"
          ctaLabel="Ir a proyectos"
        />
      )}

      {data && data.recentActivity.length > 0 ? (
        <div className="mt-10 space-y-4">
          <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
            Actividad reciente
          </h2>
          <ul className="space-y-2">
            {data.recentActivity.map((activity) => (
              <li
                key={activity.id}
                className="flex items-center gap-3 rounded-md border border-border bg-surface px-4 py-3"
              >
                <PulseIcon className="h-4 w-4 text-accent-pass" />
                <span className="text-sm">{activity.action}</span>
                <span className="ml-auto font-mono text-xs text-text-muted">
                  {new Date(activity.createdAt).toLocaleDateString("es-ES")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
