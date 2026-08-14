"use client";

import { CategoryIssues } from "@/components/dashboard/category-issues";
import { LayersIcon } from "@/components/dashboard/icons";

export default function ArchitecturePage() {
  return (
    <CategoryIssues
      eyebrow="ARQUITECTURA"
      title="Arquitectura"
      lead="Límites de módulos y grafos de llamadas."
      category="ARCHITECTURE"
      emptyTitle="Sin diagramas de arquitectura"
      emptyCopy="El análisis expone acoplamiento, deriva arquitectónica y callejones sin salida del grafo de llamadas."
      icon={<LayersIcon />}
    />
  );
}
