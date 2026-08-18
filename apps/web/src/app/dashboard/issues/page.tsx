"use client";

import {
  PageHeader,
  SkeletonGrid,
  EmptyState,
  DataError,
} from "@/components/dashboard/view";
import { AlertIcon } from "@/components/dashboard/icons";
import { useIssues } from "@/lib/queries";
import { useOnline } from "@/lib/use-online";
import { cn } from "@/lib/cn";

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

export default function IssuesPage() {
  const { data, isLoading, isError, refetch } = useIssues();
  const offline = !useOnline();
  const issues = data?.issues ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="HALLAZGOS"
        title="Hallazgos"
        lead="Todos los hallazgos por severidad: errores, calidad y testing."
      />
      <div className="mt-8">
        {isLoading ? (
          <SkeletonGrid count={3} />
        ) : isError ? (
          <DataError offline={offline} onRetry={() => void refetch()} />
        ) : issues.length === 0 ? (
          <EmptyState
            icon={<AlertIcon />}
            title="Sin hallazgos registrados"
            copy="Cuando se complete un análisis, los hallazgos aparecerán aquí con severidad, evidencia y corrección sugerida."
          />
        ) : (
          <ul className="space-y-3">
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
                  <span className="font-mono text-xs text-text-muted">
                    {issue.analysis?.project.name}
                  </span>
                  <span className="ml-auto font-mono text-xs text-text-muted">
                    {new Date(issue.createdAt).toLocaleDateString("es-ES")}
                  </span>
                </div>
                <h3 className="mt-3 font-mono text-sm font-semibold">
                  {issue.title}
                </h3>
                <p className="mt-1 truncate text-sm text-text-muted">
                  {issue.file}
                  {issue.lineStart ? `:${issue.lineStart}` : ""}
                </p>
                <p className="mt-3 text-sm">{issue.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
