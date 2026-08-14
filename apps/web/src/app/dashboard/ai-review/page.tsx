"use client";

import {
  PageHeader,
  SkeletonGrid,
  EmptyState,
} from "@/components/dashboard/view";
import { BotIcon } from "@/components/dashboard/icons";
import { useRecommendations } from "@/lib/queries";

export default function AiReviewPage() {
  const { data, isLoading, isError } = useRecommendations();
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
          <div
            role="alert"
            className="rounded-md border border-border bg-surface px-6 py-10 text-center"
          >
            <p className="font-mono text-sm text-accent-finding-strong">
              No se pudieron cargar las recomendaciones.
            </p>
            <p className="mt-2 text-sm text-text-muted">
              Comprueba que la API esté en marcha y vuelve a intentarlo.
            </p>
          </div>
        ) : recommendations.length === 0 ? (
          <EmptyState
            icon={<BotIcon />}
            title="Sin revisiones de IA"
            copy="Las recomendaciones se redactan contra el código real, con imports incluidos y pruebas que pasan localmente."
          />
        ) : (
          <ul className="space-y-3">
            {recommendations.map((recommendation) => (
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
                <p className="mt-2 text-sm text-text-muted">
                  {recommendation.body}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
