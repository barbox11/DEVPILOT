import { Fragment } from "react";
import Container from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";
import { cn } from "@/lib/cn";

const STEPS = [
  {
    tag: "SCAN",
    anchor: "scan",
    color: "text-text",
    desc: "Every file is read and mapped — structure, dependencies, and data flow.",
  },
  {
    tag: "REPORT",
    anchor: "report",
    color: "text-accent-finding-strong",
    desc: "Findings land as a spec with severity, evidence, and the reason each matters.",
  },
  {
    tag: "FIX",
    anchor: "fix",
    color: "text-accent-pass-strong",
    desc: "Fixes are drafted against the real codebase, not a toy example.",
  },
  {
    tag: "VERIFY",
    anchor: "verify",
    color: "text-accent-pass-strong",
    desc: "Each change is re-checked and tests regenerated before you merge.",
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
          <Eyebrow>THE LOOP</Eyebrow>
          <h2 className="mt-3 font-mono text-2xl font-semibold tracking-tight text-text md:text-3xl">
            Scan, report, fix, verify. Then ship.
          </h2>
          <p className="mt-4 text-text-muted">
            One loop, run end to end, so the code that leaves your branch has
            already been inspected, repaired, and re-checked.
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
