import { EmptyView } from "@/components/dashboard/view";
import { LayersIcon } from "@/components/dashboard/icons";

export default function ArchitecturePage() {
  return (
    <EmptyView
      eyebrow="ARQUITECTURA"
      title="Arquitectura"
      lead="Límites de módulos y grafos de llamadas."
      emptyTitle="Sin diagramas de arquitectura"
      emptyCopy="El análisis expone acoplamiento, deriva arquitectónica y callejones sin salida del grafo de llamadas."
      icon={<LayersIcon />}
    />
  );
}