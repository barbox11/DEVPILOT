"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard/view";
import { useProject } from "@/lib/queries";
import { cn } from "@/lib/cn";

const METRICS = [
  { label: "HEALTH SCORE", key: "healthScore" as const, chip: "bg-accent-pass-soft text-accent-pass-strong" },
  { label: "CODE QUALITY", key: "qualityScore" as const, chip: "bg-accent-pass-soft text-accent-pass-strong" },
  { label: "SECURITY", key: "securityScore" as const, chip: "bg-accent-finding-soft text-accent-finding-strong" },
  { label: "TESTING", key: "testingScore" as const, chip: "bg-accent-finding-soft text-accent-finding-strong" },
  { label: "ARCHITECTURE", key: "architectureScore" as const, chip: "bg-accent-pass-soft text-accent-pass-strong" },
];

const SEVERITY_CHIP: Record<string, string> = {
  CRITICAL: "bg-accent-finding-soft text-accent-finding-strong",
  HIGH: "bg-accent-finding-soft text-accent-finding-strong",
  MEDIUM: "bg-accent-pass-soft text-accent-pass-strong",
  LOW: "bg-surface-2 text-text-muted",
};

const SEVERITY_LABEL: Record<string, string> = {
  CRITICAL: "CRÍTICO",
  HIGH: "ALTO",
  MEDIUM: "MEDIO",
  LOW: "BAJO",
};

export default function ProjectDetailPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, isError } = useProject(params.id);

  const project = data?.project;
  const latestAnalysis = project?.analyses?.[0];
  const issues = latestAnalysis?.issues ?? [];
  const recommendations = latestAnalysis?.recommendations ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="DETALLE DEL PROYECTO"
        title={isLoading ? "Cargando proyecto…" : (project?.name ?? "Proyecto no encontrado")}
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
                <span className="font-mono">{latestAnalysis.branch ?? "—"}</span>
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
              <li className="flex justify-between">
                <span className="text-text-muted">Hallazgos</span>
                <span className="font-mono">{issues.length}</span>
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
          {recommendations.length > 0 ? (
            <ul className="mt-3 space-y-3">
              {recommendations.map((recommendation) => (
                <li
                  key={recommendation.id}
                  className="rounded-md border border-border bg-background p-4"
                >
                  <p className="font-mono text-xs font-semibold text-accent-pass-strong">
                    {recommendation.title}
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    {recommendation.body}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-text-muted">
              Las correcciones sugeridas se listarán aquí tras el primer análisis.
            </p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em] text-text-muted">
          Hallazgos del último análisis
        </h2>
        {issues.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {issues.map((issue) => (
              <li
                key={issue.id}
                className="rounded-md border border-border bg-surface p-5"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={cn(
                      "inline-block rounded px-1.5 py-0.5 font-mono text-xs font-semibold",
                      SEVERITY_CHIP[issue.severity] ?? SEVERITY_CHIP.MEDIUM,
                    )}
                  >
                    {SEVERITY_LABEL[issue.severity] ?? issue.severity}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
                    {issue.category}
                  </span>
                  <span className="ml-auto font-mono text-xs text-text-muted">
                    {issue.file}
                    {issue.lineStart ? `:${issue.lineStart}` : ""}
                  </span>
                </div>
                <h3 className="mt-3 font-mono text-sm font-semibold">
                  {issue.title}
                </h3>
                <p className="mt-2 text-sm text-text-muted">
                  {issue.description}
                </p>
                {issue.recommendation ? (
                  <p className="mt-3 rounded-md border border-border bg-background px-4 py-3 text-sm text-accent-pass-strong">
                    {issue.recommendation}
                  </p>
                ) : null}
                {issue.suggestedFix ? (
                  <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-background px-4 py-3 font-mono text-xs leading-relaxed text-text">
                    {issue.suggestedFix}
                  </pre>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-text-muted">
            No hay hallazgos en el último análisis.
          </p>
        )}
      </div>
    </div>
  );
}