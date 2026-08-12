import Container from "@/components/container";
import { Button } from "@/components/button";

export function CTA() {
  return (
    <section className="bg-background py-20 md:py-24">
      <Container>
        <div className="mx-auto max-w-4xl rounded-md bg-ink px-6 py-16 text-center text-on-ink md:py-20">
          <h2 className="font-mono text-2xl font-semibold tracking-tight text-on-ink md:text-3xl">
            Inspecciona tu próximo PR antes de que llegue.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-on-ink/70">
            Apunta DevPilot a tu repositorio y lee el informe antes de que tu
            botón de merge lo haga.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              href="#escanear"
              className="bg-on-ink text-ink hover:bg-on-ink/90"
            >
              Comenzar análisis
            </Button>
            <Button
              href="#como-funciona"
              variant="outline"
              className="border-on-ink/40 text-on-ink hover:border-on-ink/80 bg-transparent"
            >
              Ver cómo funciona
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
