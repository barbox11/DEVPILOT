import { EmptyView } from "@/components/dashboard/view";
import { AlertIcon } from "@/components/dashboard/icons";

export default function IssuesPage() {
  return (
    <EmptyView
      eyebrow="HALLAZGOS"
      title="Issues"
      lead="Todos los hallazgos por severidad: errores, calidad y testing."
      emptyTitle="Sin hallazgos registrados"
      emptyCopy="Cuando se complete un análisis, los hallazgos aparecerán aquí con severidad, evidencia y corrección sugerida."
      icon={<AlertIcon />}
    />
  );
}