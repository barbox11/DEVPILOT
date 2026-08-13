import Container from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { Button } from "@/components/button";
import { CodePanel } from "@/components/code-panel";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div aria-hidden="true" className="absolute inset-0 bg-grid" />
      <Container>
        <div className="relative flex flex-col items-center py-20 text-center md:py-28">
          <Eyebrow>DEVPILOT — INSPECCIÓN DE CÓDIGO CON IA</Eyebrow>
          <h1 className="mx-auto mt-6 max-w-3xl font-mono text-4xl font-bold tracking-tight text-text md:text-6xl">
            Tu código,{" "}
            <span className="relative inline-block">
              inspeccionado
              <span
                aria-hidden="true"
                className="absolute -bottom-1.5 left-0 h-[3px] w-full bg-accent-finding-soft"
              />
            </span>{" "}
            con precisión.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-text-muted">
            Apunta DevPilot a cualquier repositorio. Escanea cada archivo,
            detecta errores y puntos ciegos, y redacta las correcciones como un
            informe que puedes revisar y aplicar.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button href="#escanear">Comenzar a analizar un proyecto</Button>
            <Button href="#como-funciona" variant="outline">
              Ver cómo funciona
            </Button>
          </div>
          <div className="mt-16 w-full max-w-3xl text-left">
            <CodePanel
              title="auth.ts"
              status="finding"
              caption="analizando: auth.ts · 2 hallazgos · 1 correcto"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
