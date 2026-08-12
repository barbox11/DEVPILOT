import Container from "@/components/container";
import { SectionHeading } from "@/components/section-heading";

const POINTS = [
  {
    title: "Secrets are never stored",
    copy: "Keys and tokens are read in memory and discarded once the analysis completes.",
  },
  {
    title: "Encrypted in transit",
    copy: "Traffic is TLS 1.3 end to end; payloads are protected between your repo and the analysis.",
  },
  {
    title: "Isolated analyses",
    copy: "Every repository runs in a fresh, disposable sandbox with no network egress.",
  },
  {
    title: "Role-based access",
    copy: "Each teammate sees only the reports and repositories their role allows.",
  },
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m4 12 5 5L20 6" />
    </svg>
  );
}

export function Security() {
  return (
    <section id="security" className="scroll-mt-20 bg-surface-2 py-20 md:py-24">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <SectionHeading
            eyebrow="SECURITY"
            title="Inspection you can trust with the source."
            lead="DevPilot is designed to touch as little as possible and keep what it sees private. The guarantees are plain, and they hold for every run."
          />
          <ul className="divide-y divide-border self-center">
            {POINTS.map((point) => (
              <li
                key={point.title}
                className="flex gap-5 py-5 first:pt-0 last:pb-0"
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-sm bg-accent-pass-soft text-accent-pass-strong">
                  <CheckIcon />
                </span>
                <div>
                  <h3 className="font-mono text-sm font-semibold text-text">
                    {point.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-muted">{point.copy}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
