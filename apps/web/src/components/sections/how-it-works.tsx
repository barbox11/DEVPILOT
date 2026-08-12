import Container from "@/components/container";
import { SectionHeading } from "@/components/section-heading";

const STEPS = [
  {
    tag: "1",
    title: "Conecta un repositorio",
    copy: "Otorga acceso de lectura a un repositorio o sube una copia local. El análisis nunca sale del sandbox.",
  },
  {
    tag: "2",
    title: "DevPilot analiza",
    copy: "Cada archivo se lee y se mapea: estructura, dependencias, rutas de autenticación y cobertura de pruebas.",
  },
  {
    tag: "3",
    title: "Lee el informe",
    copy: "Los hallazgos llegan como especificación: severidad, evidencia y el motivo de cada problema.",
  },
  {
    tag: "4",
    title: "Aplica correcciones y verifica",
    copy: "Acepta las correcciones redactadas, regenera las pruebas y observa cómo cada cambio verifica limpio.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="scroll-mt-20 bg-surface-2 py-20 md:py-24"
    >
      <Container>
        <div className="max-w-2xl">
          <SectionHeading
            eyebrow="CÓMO FUNCIONA"
            title="Cuatro pasos, del repositorio al merge."
            lead="DevPilot es un pipeline, no un chatbot. Conectas un repo, analiza, lees, aplicas."
          />
        </div>
        <ol className="mt-12">
          {STEPS.map((step) => (
            <li
              key={step.tag}
              className="flex gap-6 border-t border-border py-6 last:border-b"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-border bg-surface font-mono text-sm font-semibold text-text">
                {step.tag}
              </span>
              <div>
                <h3 className="font-mono text-sm font-semibold text-text">
                  {step.title}
                </h3>
                <p className="mt-1.5 max-w-2xl text-sm text-text-muted">
                  {step.copy}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
