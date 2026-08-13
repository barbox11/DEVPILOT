import { EmptyView } from "@/components/dashboard/view";
import { PulseIcon } from "@/components/dashboard/icons";

export default function ActivityPage() {
  return (
    <EmptyView
      eyebrow="ACTIVIDAD"
      title="Actividad"
      lead="Historial de acciones del equipo sobre proyectos y análisis."
      emptyTitle="Sin actividad reciente"
      emptyCopy="Los eventos aparecerán aquí en cuanto el equipo empiece a conectar repositorios y ejecutar análisis."
      icon={<PulseIcon />}
    />
  );
}