"use client";

import {
  PageHeader,
  SkeletonGrid,
  EmptyState,
} from "@/components/dashboard/view";
import { useIssues } from "@/lib/queries";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

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

export function CategoryIssues({
  eyebrow,
  title,
  lead,
  category,
  emptyTitle,
  emptyCopy,
  icon,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  category: string;
  emptyTitle: string;
  emptyCopy: string;
  icon: ReactNode;
}) {
  const { data, isLoading, isError } = useIssues();
  const issues = (data?.issues ?? []).filter(
    (issue) => issue.category === category,
  );

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader eyebrow={eyebrow} title={title} lead={lead} />
      <div className="mt-8">
        {isLoading ? (
          <SkeletonGrid count={3} />
        ) : isError ? (
          <div
            role="alert"
            className="rounded-md border border-border bg-surface px-6 py-10 text-center"
          >
            <p className="font-mono text-sm text-accent-finding-strong">
              No se pudieron cargar los datos.
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Comprueba que la API esté en marcha y vuelve a intentarlo.
            </p>
          </div>
        ) : issues.length === 0 ? (
          <EmptyState icon={icon} title={emptyTitle} copy={emptyCopy} />
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
