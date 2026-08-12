import Container from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { CodePanel, type CodeLine } from "@/components/code-panel";

const AI_LINES: CodeLine[] = [
  {
    severity: "finding",
    content: (
      <>
        <span className="text-accent-finding-strong">- </span>
        <span className="text-text">createSession(user.id);</span>
      </>
    ),
  },
  {
    severity: "pass",
    content: (
      <>
        <span className="text-accent-pass-strong">+ </span>
        <span className="text-text">
          createSession(user.id, {"{ ttl: 15 * 60 }"});
        </span>
      </>
    ),
  },
  {
    severity: "pass",
    content: (
      <>
        <span className="text-accent-pass-strong">+ </span>
        <span className="text-text">
          {'test("la sesión expira a los 15 min");'}
        </span>
      </>
    ),
  },
  {
    content: (
      <span className="text-text-muted">
        {"// motivo: los tokens seguían válidos tras cerrar sesión"}
      </span>
    ),
  },
];

const POINTS = [
  "Explica por qué importa un hallazgo, no solo dónde está",
  "Redacta correcciones sobre el código real, imports incluidos",
  "Genera pruebas que pasan localmente antes de aplicar",
];

export function AICapabilities() {
  return (
    <section id="ia" className="scroll-mt-20 bg-background py-20 md:py-24">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <SectionHeading
              eyebrow="IA CONTEXTUAL"
              title="Una IA que lee el código, no el prompt."
              lead="Sin ventana de chat ni respuestas guionadas. DevPilot lee todo el repositorio, explica por qué importa un problema, redacta la corrección en contexto y genera una prueba que lo demuestra."
            />
            <ul className="mt-8 space-y-4">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 shrink-0 bg-text-muted"
                  />
                  <span className="font-mono text-[13px] text-text">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <CodePanel
            title="fix-audit.ts"
            status="pass"
            scanning={false}
            caption="corrección sugerida · prueba generada · pasa localmente"
            lines={AI_LINES}
          />
        </div>
      </Container>
    </section>
  );
}
