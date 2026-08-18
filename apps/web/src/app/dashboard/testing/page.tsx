"use client";

import { CategoryIssues } from "@/components/dashboard/category-issues";
import { FlaskIcon } from "@/components/dashboard/icons";

export default function TestingPage() {
  return (
    <CategoryIssues
      eyebrow="TESTING"
      title="Pruebas"
      lead="Cobertura y pruebas generadas por análisis."
      category="TESTING"
      emptyTitle="Sin análisis de testing"
      emptyCopy="DevPilot genera pruebas que cubren el comportamiento real y las valida localmente antes de aplicar."
      icon={<FlaskIcon />}
    />
  );
}
