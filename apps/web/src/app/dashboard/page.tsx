import {
  PageHeader,
  SkeletonGrid,
  EmptyState,
} from "@/components/dashboard/view";
import { FolderIcon } from "@/components/dashboard/icons";

export default function OverviewPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="VISIÓN GENERAL"
        title="Salud de tus proyectos"
        lead="Métricas agregadas: calidad, seguridad, testing y arquitectura de todos tus análisis."
      />
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {["PROYECTOS", "ANÁLISIS", "HALLAZGOS", "SALUD"].map((label) => (
          <div
            key={label}
            className="rounded-md border border-border bg-surface p-5"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
              {label}
            </p>
            <p className="mt-2 font-mono text-2xl font-semibold text-text">
              —
            </p>
          </div>
        ))}
      </div>
      <SkeletonGrid count={4} />
      <EmptyState
        icon={<FolderIcon className="h-6 w-6" />}
        title="Conecta tu primer repositorio"
        copy="Apunta DevPilot a un repositorio para empezar el primer análisis y ver el informe completo."
        ctaHref="/dashboard/projects"
        ctaLabel="Ir a proyectos"
      />
    </div>
  );
}