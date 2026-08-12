import { Fragment } from "react";
import Container from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { cn } from "@/lib/cn";

const STEPS = [
  {
    tag: "ESCANEAR",
    anchor: "escanear",
    color: "text-text",
    desc: "Cada archivo se lee y se mapea: estructura, dependencias y flujo de datos.",
  },
  {
    tag: "INFORME",
    anchor: "informe",
    color: "text-accent-finding-strong",
    desc: "Los hallazgos llegan como una especificación con severidad, evidencia y el porqué de cada uno.",
  },
  {
    tag: "CORREGIR",
    anchor: "corregir",
    color: "text-accent-pass-strong",
    desc: "Las correcciones se redactan contra el código real, no contra un ejemplo de juguete.",
  },
  {
    tag: "VERIFICAR",
    anchor: "verificar",
    color: "text-accent-pass-strong",
    desc: "Cada cambio se re-chequea y las pruebas se regeneran antes de fusionar.",
  },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function Solution() {
  return (
    <section className="scroll-mt-20 bg-surface-2 py-20 md:py-24">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>EL BUCLE</Eyebrow>
          <h2 className="mt-3 font-mono text-2xl font-semibold tracking-tight text-text md:text-3xl">
            Escanear, informar, corregir, verificar. Luego publicar.
          </h2>
          <p className="mt-4 text-text-muted">
            Un solo bucle ejecutado de principio a fin, para que el código que
            sale de tu rama ya haya sido inspeccionado, reparado y verificado.
          </p>
        </div>
        <div className="mt-12 grid md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
          {STEPS.map((step, index) => (
            <Fragment key={step.tag}>
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="hidden items-center justify-center px-2 text-text-muted md:flex"
                >
                  <ArrowIcon />
                </span>
              ) : null}
              <div
                id={step.anchor}
                className={cn(
                  "scroll-mt-20 py-6 md:py-6",
                  index === 0
                    ? "border-t border-border md:border-t-0 md:border-l-0"
                    : "border-t border-border md:border-l md:border-t-0 md:pl-8",
                )}
              >
                <span
                  className={`font-mono text-xs font-semibold uppercase tracking-[0.2em] ${step.color}`}
                >
                  {step.tag}
                </span>
                <p className="mt-3 text-sm text-text-muted">{step.desc}</p>
              </div>
            </Fragment>
          ))}
        </div>
      </Container>
    </section>
  );
}
