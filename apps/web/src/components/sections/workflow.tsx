import Container from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { CodePanel, type CodeLine } from "@/components/code-panel";

const BEFORE_LINES: CodeLine[] = [
  {
    content: (
      <span className="text-text">
        {"export async function createUser(body) {"}
      </span>
    ),
  },
  {
    severity: "finding",
    content: (
      <span className="text-text">
        {"  const res = await fetch('/api/users', {"}
      </span>
    ),
  },
  {
    severity: "finding",
    content: (
      <span className="text-text">{"    method: 'POST', body });"}</span>
    ),
  },
  {
    content: (
      <span className="text-text">{"  const data = await res.json();"}</span>
    ),
  },
  {
    severity: "finding",
    content: (
      <span className="text-text">
        {"  return data; // res.ok nunca se comprueba"}
      </span>
    ),
  },
  {
    content: <span className="text-text">{"}"}</span>,
  },
];

const AFTER_LINES: CodeLine[] = [
  {
    content: (
      <span className="text-text">
        {"export async function createUser(body: UserBody) {"}
      </span>
    ),
  },
  {
    content: (
      <span className="text-text">
        {"  const res = await fetch('/api/users', {"}
      </span>
    ),
  },
  {
    content: <span className="text-text">{"    method: 'POST',"}</span>,
  },
  {
    content: (
      <span className="text-text">{"    body: JSON.stringify(body),"}</span>
    ),
  },
  {
    content: <span className="text-text">{"  });"}</span>,
  },
  {
    severity: "pass",
    content: (
      <span className="text-text">
        {"  if (!res.ok) throw new ApiError(res.status);"}
      </span>
    ),
  },
  {
    content: <span className="text-text">{"  return res.json();"}</span>,
  },
  {
    content: <span className="text-text">{"}"}</span>,
  },
];

export function Workflow() {
  return (
    <section
      id="flujo-de-trabajo"
      className="scroll-mt-20 bg-background py-20 md:py-24"
    >
      <Container>
        <div className="max-w-2xl">
          <SectionHeading
            eyebrow="FLUJO DE DESARROLLO"
            title="Del hallazgo a la corrección aplicada, en un solo bucle."
            lead="El bucle no termina en el escaneo. La corrección se redacta, se aplica a la rama y se verifica antes de fusionar."
          />
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <CodePanel
            title="antes.ts"
            status="finding"
            scanning={false}
            caption="antes: mutación sin comprobar · sin pruebas"
            lines={BEFORE_LINES}
          />
          <CodePanel
            title="despues.ts"
            status="pass"
            scanning={false}
            caption="aplicado: 1 corrección · prueba añadida"
            lines={AFTER_LINES}
          />
        </div>
      </Container>
    </section>
  );
}
