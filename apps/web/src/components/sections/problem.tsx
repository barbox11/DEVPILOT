import Container from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";

function DocIssueIcon() {
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
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6" />
      <path d="M9 17h4" />
    </svg>
  );
}

function ShieldIssueIcon() {
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

function BeakerIssueIcon() {
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

const ISSUES = [
  {
    title: "Unreviewed pull requests",
    copy: "A merge that ships without review writes a latent defect into branch history. The author was the only person who ever read it.",
    Icon: DocIssueIcon,
  },
  {
    title: "Vulnerabilities found in prod",
    copy: "CI passes, audits pass, and the hole still surfaces in an incident post-mortem instead of a pull-request review.",
    Icon: ShieldIssueIcon,
  },
  {
    title: "Cargo-cult test coverage",
    copy: "Coverage percentage is not correctness. A suite that never fails teaches no one about the behavior it claims to lock in.",
    Icon: BeakerIssueIcon,
  },
];

export function Problem() {
  return (
    <section id="problem" className="scroll-mt-20 bg-background py-20 md:py-24">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 md:gap-0">
          <div className="md:pr-12 lg:pr-20">
            <Eyebrow>THE PROBLEM</Eyebrow>
            <h2 className="mt-3 font-mono text-2xl font-semibold tracking-tight text-text md:text-3xl">
              Breakage is rarely loud.
            </h2>
            <p className="mt-4 max-w-md text-text-muted">
              Most damage ships quietly: a merge that never got a second look, a
              dependency with a known hole, a test suite that proves nothing. By
              the time anything is obvious, it is already in production.
            </p>
          </div>
          <div className="md:border-l md:border-border md:pl-12 lg:pl-20">
            <ul className="divide-y divide-border">
              {ISSUES.map((issue) => (
                <li
                  key={issue.title}
                  className="flex gap-5 py-6 first:pt-0 last:pb-0"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-accent-finding-soft text-accent-finding-strong">
                    <issue.Icon />
                  </span>
                  <div>
                    <h3 className="font-mono text-sm font-semibold text-text">
                      {issue.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-text-muted">
                      {issue.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
