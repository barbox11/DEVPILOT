"use client";

import {
  PageHeader,
  SkeletonGrid,
  EmptyState,
  DataError,
} from "@/components/dashboard/view";
import { BotIcon } from "@/components/dashboard/icons";
import { useRecommendations } from "@/lib/queries";
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

export default function AiReviewPage() {
  const { data, isLoading, isError, refetch } = useRecommendations();
  const offline = !useOnline();
  const recommendations = data?.recommendations ?? [];

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="IA CONTEXTUAL"
        title="Revisión con IA"
        lead="Issue → por qué importa → análisis → recomendación → fix sugerido → test."
      />
      <div className="mt-8">
        {isLoading ? (
          <SkeletonGrid count={3} />
        ) : isError ? (
          <DataError offline={offline} onRetry={() => void refetch()} />
        ) : recommendations.length === 0 ? (
          <EmptyState
            icon={<BotIcon />}
            title="Sin revisiones de IA"
            copy="Las correcciones sugeridas por el agente de revisión aparecerán aquí, encadenadas a cada hallazgo."
          />
        ) : (
          <ul className="space-y-4">
            {recommendations.map((recommendation) => {
              const issue = recommendation.issue;
              return (
                <li
                  key={recommendation.id}
                  className="rounded-md border border-border bg-surface p-5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent-pass-strong">
                      RECOMENDACIÓN
                    </span>
                    <span className="font-mono text-xs text-text-muted">
                      {recommendation.analysis?.project.name}
                    </span>
                    <span className="ml-auto font-mono text-xs text-text-muted">
                      {new Date(recommendation.createdAt).toLocaleDateString(
                        "es-ES",
                      )}
                    </span>
                  </div>

                  <h3 className="mt-3 font-mono text-sm font-semibold">
                    {recommendation.title}
                  </h3>

                  {issue ? (
                    <div className="mt-4 space-y-3">
                      <div className="rounded-md border border-border bg-background px-4 py-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                          El hallazgo
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "inline-block rounded px-1.5 py-0.5 font-mono text-xs font-semibold",
                              SEVERITY_CHIP[issue.severity] ??
                                SEVERITY_CHIP.MEDIUM,
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
                        <p className="mt-2 text-sm text-text">
                          {issue.title}
                        </p>
                      </div>

                      <div className="rounded-md border border-border bg-background px-4 py-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                          Por qué importa
                        </p>
                        <p className="mt-2 text-sm text-text-muted">
                          {issue.description}
                        </p>
                      </div>

                      <div className="rounded-md border border-border bg-background px-4 py-3">
                        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                          Recomendación de la IA
                        </p>
                        <p className="mt-2 text-sm text-accent-pass-strong">
                          {recommendation.body}
                        </p>
                      </div>

                      {issue.suggestedFix ? (
                        <div className="rounded-md border border-border bg-background px-4 py-3">
                          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
                            Fix sugerido
                          </p>
                          <pre className="mt-2 overflow-x-auto font-mono text-xs leading-relaxed text-text">
                            {issue.suggestedFix}
                          </pre>
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-text-muted">
                      {recommendation.body}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}