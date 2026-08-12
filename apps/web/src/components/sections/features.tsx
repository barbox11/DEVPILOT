import type { ComponentType } from "react";
import Container from "@/components/container";
import { SectionHeading } from "@/components/section-heading";

function FileSearchIcon() {
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
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
      <circle cx="11" cy="11" r="3.5" />
      <path d="m13.5 13.5 2.5 2.5" />
    </svg>
  );
}

function ShieldAlertIcon() {
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

function LockIcon() {
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
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function BeakerIcon() {
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

function LayersIcon() {
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
      <path d="m3 7 9-4 9 4-9 4-9-4z" />
      <path d="m3 12 9 4 9-4" />
      <path d="m3 17 9 4 9-4" />
    </svg>
  );
}

function BookOpenIcon() {
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
      <path d="M2 5h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2z" />
      <path d="M22 5h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

const FEATURES: Array<{
  title: string;
  desc: string;
  Icon: ComponentType;
}> = [
  {
    title: "Project analysis",
    desc: "Maps the whole repository — structure, flows, and dependencies — before the first finding.",
    Icon: FileSearchIcon,
  },
  {
    title: "Vulnerability detection",
    desc: "Flags risky dependencies, unsafe patterns, and known weaknesses in context.",
    Icon: ShieldAlertIcon,
  },
  {
    title: "Security review",
    desc: "A structured pass on auth, input handling, and data flow for exploitable gaps.",
    Icon: LockIcon,
  },
  {
    title: "Test generation",
    desc: "Generates tests that cover real behavior, keyed to the changes you are about to make.",
    Icon: BeakerIcon,
  },
  {
    title: "Architecture review",
    desc: "Reads module boundaries and call graphs to surface coupling, drift, and dead ends.",
    Icon: LayersIcon,
  },
  {
    title: "Documentation",
    desc: "Keeps specs and READMEs in sync with what the code actually does today.",
    Icon: BookOpenIcon,
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="scroll-mt-20 bg-background py-20 md:py-24"
    >
      <Container>
        <div className="max-w-2xl">
          <SectionHeading
            eyebrow="CAPABILITIES"
            title="Six passes, from structure to docs."
            lead="Each capability reads the same mapped codebase, so findings stay consistent and grounded in the code rather than in guesses."
          />
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="rounded-md border border-border bg-surface p-6"
            >
              <span className="grid h-10 w-10 place-items-center rounded-sm bg-surface-2 text-text">
                <feature.Icon />
              </span>
              <h3 className="mt-5 font-mono text-sm font-semibold text-text">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-text-muted">{feature.desc}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
