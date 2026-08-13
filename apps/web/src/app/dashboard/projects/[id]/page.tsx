import { PageHeader } from "@/components/dashboard/view";

const METRICS = [
  { label: "HEALTH SCORE", chip: "bg-accent-pass-soft text-accent-pass-strong" },
  { label: "CODE QUALITY", chip: "bg-accent-pass-soft text-accent-pass-strong" },
  { label: "SECURITY", chip: "bg-accent-finding-soft text-accent-finding-strong" },
  { label: "TESTING", chip: "bg-accent-finding-soft text-accent-finding-strong" },
  { label: "ARCHITECTURE", chip: "bg-accent-pass-soft text-accent-pass-strong" },
];

export default function ProjectDetailPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        eyebrow="DETALLE DEL PROYECTO"
        title="Proyecto sin conectar todavía"
        lead="Puntuaciones, issues y recomendaciones del último análisis se mostrarán aquí."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {METRICS.map((metric) => (
          <div
            key={metric.label}
            className="rounded-md border border-border bg-surface p-5"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
              {metric.label}
            </p>
            <p className="mt-2 font-mono text-3xl font-semibold text-text">
              —
            </p>
            <span
              className={`mt-3 inline-block rounded px-1.5 py-0.5 font-mono text-xs font-semibold ${metric.chip}`}
            >
              PENDIENTE
            </span>
          </div>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div role="status" className="rounded-md border border-border bg-surface p-6">
          <h2 className="font-mono text-sm font-semibold uppercase tracking-[0.2em]">
            Último análisis
          </h2>
          <p className="mt-3 text-sm text-text-muted">
            Aún no se ha ejecutado ningún análisis sobre este proyecto.
          </p>
        </div>
        <div role="status" className="rounded-md border border-border bg-surface p-6">
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