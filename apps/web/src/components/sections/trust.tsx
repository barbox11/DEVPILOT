import Container from "@/components/container";
import { Eyebrow } from "@/components/eyebrow";

const STACK_MARKS = [
  "TypeScript",
  "Next.js",
  "React",
  "Node.js",
  "PostgreSQL",
  "Vercel",
];

export function Trust() {
  return (
    <section className="border-y border-border bg-background">
      <Container>
        <div className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between md:py-4">
          <Eyebrow>Built for modern stacks</Eyebrow>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {STACK_MARKS.map((mark) => (
              <li key={mark} className="font-mono text-[13px] text-text-muted">
                {mark}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
