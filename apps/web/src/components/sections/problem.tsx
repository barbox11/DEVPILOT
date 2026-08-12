import Container from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";

function DocIssueIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  );
}

function ShieldIssueIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6z" />
      <path d="M12 8v3" />
      <path d="M12 14.5h.01" />
    </svg>
  );
}

function BeakerIssueIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 3h6" />
      <path d="M10 3v6.5L5.2 18a2 2 0 0 0 1.7 3h10.2a2 2 0 0 0 1.7-3L14 9.5V3" />
      <path d="M7.5 14h9" />
    </svg>
  );
}

const ISSUES = [
  {
    title: "Pull requests sin revisar",
    copy: "Un merge que se publica sin revisión escribe un defecto latente en el historial de la rama. El autor fue la única persona que lo leyó.",
    Icon: DocIssueIcon,
  },
  {
    title: "Vulnerabilidades en producción",
    copy: "El CI pasa, las auditorías pasan, y el agujero aparece en el post-mortem de un incidente en lugar de en la revisión del pull request.",
    Icon: ShieldIssueIcon,
  },
  {
    title: "Cobertura de pruebas de imitación",
    copy: "El porcentaje de cobertura no es corrección. Una suite que nunca falla no enseña nada sobre el comportamiento que dice asegurar.",
    Icon: BeakerIssueIcon,
  },
];

export function Problem() {
  return (
    <section
      id="problema"
      className="scroll-mt-20 bg-background py-20 md:py-24"
    >
      <Container>
        <div className="grid gap-12 md:grid-cols-2 md:gap-0">
          <div className="md:pr-12 lg:pr-20">
            <Eyebrow>EL PROBLEMA</Eyebrow>
            <h2 className="mt-3 font-mono text-2xl font-semibold tracking-tight text-text md:text-3xl">
              Romper rara vez hace ruido.
            </h2>
            <p className="mt-4 max-w-md text-text-muted">
              La mayor parte del daño llega en silencio: un merge que nunca tuvo
              una segunda mirada, una dependencia con un agujero conocido, una
              suite de pruebas que no demuestra nada. Cuando algo se vuelve
              evidente, ya está en producción.
            </p>
          </div>
          <div className="md:border-l md:border-border md:pl-12 lg:pl-20">
            <ul className="divide-y divide-border">
              {ISSUES.map((issue) => (
                <li
                  key={issue.title}
                  className="flex gap-5 py-6 first:pt-0 last:pb-0"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-accent-finding-soft text-accent-finding-strong">
                    <issue.Icon />
                  </span>
                  <div>
                    <h3 className="font-mono text-sm font-semibold text-text">
                      {issue.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-text-muted">
                      {issue.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
