"use client";

import { CategoryIssues } from "@/components/dashboard/category-issues";
import { ShieldIcon } from "@/components/dashboard/icons";

export default function SecurityPage() {
  return (
    <CategoryIssues
      eyebrow="SEGURIDAD"
      title="Seguridad"
      lead="Vulnerabilidades y patrones inseguros detectados en contexto."
      category="SECURITY"
      emptyTitle="Sin hallazgos de seguridad"
      emptyCopy="La pasada de seguridad revisa autenticación, manejo de entradas y flujo de datos en busca de brechas explotables."
      icon={<ShieldIcon />}
    />
  );
}
