import Container from "@/components/container";
import { SectionHeading } from "@/components/section-heading";

const STEPS = [
  {
    tag: "1",
    title: "Connect a repository",
    copy: "Grant read access to a repository or push a local snapshot. Analysis never leaves the sandbox.",
  },
  {
    tag: "2",
    title: "DevPilot analyzes",
    copy: "Every file is read and mapped — structure, dependencies, auth paths, and test coverage.",
  },
  {
    tag: "3",
    title: "Read the report",
    copy: "Findings arrive as a spec: severity, evidence, and the reason each issue matters.",
  },
  {
    tag: "4",
    title: "Apply fixes & verify",
    copy: "Accept the drafted fixes, regenerate tests, and watch each change verify clean.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-20 bg-surface-2 py-20 md:py-24">
      <Container>
        <div className="max-w-2xl">
          <SectionHeading
            eyebrow="HOW IT WORKS"
            title="Four steps, from repository to merge."
            lead="DevPilot is a pipeline, not a chatbot. You connect a repo, it analyzes, you read, you apply."
          />
        </div>
        <ol className="mt-12">
          {STEPS.map((step) => (
            <li
              key={step.tag}
              className="flex gap-6 border-t border-border py-6 last:border-b"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm border border-border bg-surface font-mono text-sm font-semibold text-text">
                {step.tag}
              </span>
              <div>
                <h3 className="font-mono text-sm font-semibold text-text">
                  {step.title}
                </h3>
                <p className="mt-1.5 max-w-2xl text-sm text-text-muted">
                  {step.copy}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
