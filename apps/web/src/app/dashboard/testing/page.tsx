import { EmptyView } from "@/components/dashboard/view";
import { FlaskIcon } from "@/components/dashboard/icons";

export default function TestingPage() {
  return (
    <EmptyView
      eyebrow="TESTING"
      title="Testing"
      lead="Cobertura y pruebas generadas por análisis."
      emptyTitle="Sin análisis de testing"
      emptyCopy="DevPilot genera pruebas que cubren el comportamiento real y las valida localmente antes de aplicar."
      icon={<FlaskIcon />}
    />
  );
}