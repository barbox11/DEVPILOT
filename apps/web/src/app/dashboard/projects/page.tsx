import {
  PageHeader,
  EmptyState,
} from "@/components/dashboard/view";
import { FolderIcon } from "@/components/dashboard/icons";

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="PROYECTOS"
        title="Repositorios conectados"
        lead="Cada repositorio mantiene su historial de análisis y puntuaciones."
      />
      <div className="mt-8 space-y-3">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            aria-hidden="true"
            className="h-16 animate-pulse rounded-md border border-border bg-surface-2"
          />
        ))}
      </div>
      <EmptyState
        icon={<FolderIcon />}
        title="Todavía no hay repositorios"
        copy="Conecta un repositorio para empezar el análisis y seguir la salud de tu código."
      />
    </div>
  );
}