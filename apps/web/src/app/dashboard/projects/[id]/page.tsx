"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard/view";
import { useProject } from "@/lib/queries";

const METRICS = [
  {
    label: "HEALTH SCORE",
    key: "healthScore" as const,
    chip: "bg-accent-pass-soft text-accent-pass-strong",
  },
  {
    label: "CODE QUALITY",
    key: "qualityScore" as const,
    chip: "bg-accent-pass-soft text-accent-pass-strong",
  },
  {
    label: "SECURITY",
    key: "securityScore" as const,
    chip: "bg-accent-finding-soft text-accent-finding-strong",
  },
  {
    label: "TESTING",
    key: "testingScore" as const,
    chip: "bg-accent-finding-soft text-accent-finding-strong",
  },
  {
    label: "ARCHITECTURE",
    key: "architectureScore" as const,
    chip: "bg-accent-pass-soft text-accent-pass-strong",
  },
];

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError } = useProject(params.id);

  const project = data?.project;
  const latestAnalysis = project?.analyses?.[0];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="DETALLE DEL PROYECTO"
        title={
          isLoading
            ? "Cargando proyecto…"
            : (project?.name ?? "Proyecto no encontrado")
        }
        lead={
          project?.repoUrl
            ? `Repositorio: ${project.repoUrl} · Rama ${project.defaultBranch ?? "main"}`
            : "Puntuaciones, issues y recomendaciones del último análisis se mostrarán aquí."
        }
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {METRICS.map((metric) => {
          const value =
            latestAnalysis && latestAnalysis[metric.key] != null
              ? `${latestAnalysis[metric.key]}`
              : "—";
          const pending = !latestAnalysis || latestAnalysis[metric.key] == null;
          return (
            <div
              key={metric.label}
              className="rounded-md border border-border bg-surface p-5"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                {metric.label}
              </p>
              <p className="mt-2 font-mono text-3xl font-semibold text-text">
                {isLoading ? "…" : value}
              </p>
              <span
                className={`mt-3 inline-block rounded px-1.5 py-0.5 font-mono text-xs font-semibold ${metric.chip}`}
              >
                {pending ? "PENDIENTE" : "OK"}
              </span>
            </div>
          );
        })}
      </div>

      {isError ? (
        <div
          role="alert"
          className="mt-8 rounded-md border border-border bg-surface px-6 py-10 text-center"
        >
          <p className="font-mono text-sm text-accent-finding-strong">
            No se pudo cargar el proyecto.
          </p>
        </div>
      ) : null}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div
          role="status"
          className="rounded-md border border-border bg-surface p-6"
        >
          <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em]">
            Último análisis
          </h2>
          {latestAnalysis ? (
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex justify-between">
                <span className="text-text-muted">Estado</span>
                <span className="font-mono">{latestAnalysis.status}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-text-muted">Rama</span>
                <span className="font-mono">
                  {latestAnalysis.branch ?? "—"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-text-muted">Commit</span>
                <span className="font-mono">
                  {latestAnalysis.commitSha
                    ? latestAnalysis.commitSha.slice(0, 7)
                    : "—"}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-text-muted">Iniciado</span>
                <span className="font-mono">
                  {latestAnalysis.startedAt
                    ? new Date(latestAnalysis.startedAt).toLocaleString("es-ES")
                    : "—"}
                </span>
              </li>
            </ul>
          ) : (
            <p className="mt-3 text-sm text-text-muted">
              Aún no se ha ejecutado ningún análisis sobre este proyecto.
            </p>
          )}
        </div>
        <div
          role="status"
          className="rounded-md border border-border bg-surface p-6"
        >
          <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em]">
            Recomendaciones de IA
          </h2>
          <p className="mt-3 text-sm text-text-muted">
            Las correcciones sugeridas se listarán aquí tras el primer análisis.
          </p>
        </div>
      </div>
    </div>
  );
}
