import { EmptyView } from "@/components/dashboard/view";
import { BotIcon } from "@/components/dashboard/icons";

export default function AiReviewPage() {
  return (
    <EmptyView
      eyebrow="IA CONTEXTUAL"
      title="Revisión con IA"
      lead="Issue → por qué importa → análisis → recomendación → fix sugerido → test."
      emptyTitle="Sin revisiones de IA"
      emptyCopy="Las recomendaciones se redactan contra el código real, con imports incluidos y pruebas que pasan localmente."
      icon={<BotIcon />}
    />
  );
}