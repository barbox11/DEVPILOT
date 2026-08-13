import { EmptyView } from "@/components/dashboard/view";
import { ShieldIcon } from "@/components/dashboard/icons";

export default function SecurityPage() {
  return (
    <EmptyView
      eyebrow="SEGURIDAD"
      title="Seguridad"
      lead="Vulnerabilidades y patrones inseguros detectados en contexto."
      emptyTitle="Sin hallazgos de seguridad"
      emptyCopy="La pasada de seguridad revisa autenticación, manejo de entradas y flujo de datos en busca de brechas explotables."
      icon={<ShieldIcon />}
    />
  );
}