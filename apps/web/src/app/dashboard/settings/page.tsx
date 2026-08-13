import { EmptyView } from "@/components/dashboard/view";
import { CogIcon } from "@/components/dashboard/icons";

export default function SettingsPage() {
  return (
    <EmptyView
      eyebrow="AJUSTES"
      title="Preferencias del panel"
      lead="Perfil, repositorios, notificaciones y datos."
      emptyTitle="Configuración disponible tras la autenticación"
      emptyCopy="Perfil, roles y preferencias se habilitarán cuando el flujo de cuentas esté conectado a la base de datos."
      icon={<CogIcon />}
    />
  );
}