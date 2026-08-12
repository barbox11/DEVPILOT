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
        {"  return data; // res.ok never checked"}
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
      id="workflow"
      className="scroll-mt-20 bg-background py-20 md:py-24"
    >
      <Container>
        <div className="max-w-2xl">
          <SectionHeading
            eyebrow="DEV WORKFLOW"
            title="From finding to applied fix, in one loop."
            lead="The loop does not end at the scan. The fix is drafted, applied to the branch, and verified before you merge."
          />
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <CodePanel
            title="before.ts"
            status="finding"
            scanning={false}
            caption="before: unchecked mutation · no tests"
            lines={BEFORE_LINES}
          />
          <CodePanel
            title="after.ts"
            status="pass"
            scanning={false}
            caption="applied: 1 fix · test added"
            lines={AFTER_LINES}
          />
        </div>
      </Container>
    </section>
  );
}
