import Container from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { CodePanel, type CodeLine } from "@/components/code-panel";

const AI_LINES: CodeLine[] = [
  {
    severity: "finding",
    content: (
      <>
        <span className="text-accent-finding-strong">- </span>
        <span className="text-text">createSession(user.id);</span>
      </>
    ),
  },
  {
    severity: "pass",
    content: (
      <>
        <span className="text-accent-pass-strong">+ </span>
        <span className="text-text">
          createSession(user.id, {"{ ttl: 15 * 60 }"});
        </span>
      </>
    ),
  },
  {
    severity: "pass",
    content: (
      <>
        <span className="text-accent-pass-strong">+ </span>
        <span className="text-text">
          {'test("session expires after 15m");'}
        </span>
      </>
    ),
  },
  {
    content: (
      <span className="text-text-muted">
        {"// why: tokens stayed valid after logout"}
      </span>
    ),
  },
];

const POINTS = [
  "Explains why a finding matters, not just where it sits",
  "Drafts fixes against the real codebase, imports and all",
  "Generates tests that pass locally before you apply",
];

export function AICapabilities() {
  return (
    <section id="ai" className="scroll-mt-20 bg-background py-20 md:py-24">
      <Container>
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <SectionHeading
              eyebrow="CONTEXTUAL AI"
              title="An AI that reads the code, not the prompt."
              lead="No chat window, no scripted answers. DevPilot reads the whole repository, explains why an issue matters, drafts the fix in context, and generates a test that proves it."
            />
            <ul className="mt-8 space-y-4">
              {POINTS.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1 w-1 shrink-0 bg-text-muted"
                  />
                  <span className="font-mono text-[13px] text-text">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <CodePanel
            title="fix-audit.ts"
            status="pass"
            scanning={false}
            caption="suggested fix · generated test · passes locally"
            lines={AI_LINES}
          />
        </div>
      </Container>
    </section>
  );
}
