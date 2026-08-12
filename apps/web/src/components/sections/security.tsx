import Container from "@/components/container";
import { SectionHeading } from "@/components/section-heading";

const POINTS = [
  {
    title: "Los secretos nunca se almacenan",
    copy: "Las claves y tokens se leen en memoria y se descartan al terminar el análisis.",
  },
  {
    title: "Cifrado en tránsito",
    copy: "El tráfico es TLS 1.3 de extremo a extremo; las cargas se protegen entre tu repositorio y el análisis.",
  },
  {
    title: "Análisis aislados",
    copy: "Cada repositorio se ejecuta en un sandbox nuevo y desechable, sin salida de red.",
  },
  {
    title: "Acceso por roles",
    copy: "Cada miembro del equipo solo ve los informes y repositorios que su rol permite.",
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 12 5 5L20 6" />
    </svg>
  );
}

export function Security() {
  return (
    <section
      id="seguridad"
      className="scroll-mt-20 bg-surface-2 py-20 md:py-24"
    >
      <Container>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <SectionHeading
            eyebrow="SEGURIDAD"
            title="Inspección en la que puedes confiar el código fuente."
            lead="DevPilot está diseñado para tocar lo menos posible y mantener privado lo que ve. Las garantías son claras y se cumplen en cada ejecución."
          />
          <ul className="divide-y divide-border self-center">
            {POINTS.map((point) => (
              <li
                key={point.title}
                className="flex gap-5 py-5 first:pt-0 last:pb-0"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-sm bg-accent-pass-soft text-accent-pass-strong">
                  <CheckIcon />
                </span>
                <div>
                  <h3 className="font-mono text-sm font-semibold text-text">
                    {point.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">{point.copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
