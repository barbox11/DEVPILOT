import Container from "@/components/container";
import { Button } from "@/components/button";

export function CTA() {
  return (
    <section className="bg-background py-20 md:py-24">
      <Container>
        <div className="mx-auto max-w-4xl rounded-md bg-ink px-6 py-16 text-center text-on-ink md:py-20">
          <h2 className="font-mono text-2xl font-semibold tracking-tight text-on-ink md:text-3xl">
            Inspect your next PR before it lands.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-on-ink/70">
            Point DevPilot at your repository and read the report before your
            merge button does.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              href="#scan"
              className="bg-on-ink text-ink hover:bg-on-ink/90"
            >
              Start analyzing
            </Button>
            <Button
              href="#how"
              variant="outline"
              className="border-on-ink/40 text-on-ink hover:border-on-ink/80 bg-transparent"
            >
              See how it works
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
