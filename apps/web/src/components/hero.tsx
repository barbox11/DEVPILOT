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
          <Eyebrow>DEVPILOT — AI CODE INSPECTION</Eyebrow>
          <h1 className="mx-auto mt-6 max-w-3xl font-mono text-4xl font-bold tracking-tight text-text md:text-6xl">
            Your code,{" "}
            <span className="relative inline-block">
              inspected
              <span
                aria-hidden="true"
                className="absolute -bottom-1.5 left-0 h-[3px] w-full bg-accent-finding-soft"
              />
            </span>{" "}
            with precision.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-text-muted">
            Point DevPilot at any repository. It scans every file, flags errors
            and blind spots, and drafts the fixes as a report you can review and
            apply.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button href="#scan">Start analyzing a project</Button>
            <Button href="#scan" variant="outline">
              See how it works
            </Button>
          </div>
          <div className="mt-16 w-full max-w-3xl text-left">
            <CodePanel
              title="auth.ts"
              status="finding"
              caption="analyzing: auth.ts · 2 findings · 1 pass"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
