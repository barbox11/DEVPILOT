import { Eyebrow } from "@/components/eyebrow";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  lead?: string;
};

export function SectionHeading({ eyebrow, title, lead }: SectionHeadingProps) {
  return (
    <div>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-mono text-2xl font-semibold tracking-tight text-text md:text-3xl">
        {title}
      </h2>
      {lead ? <p className="mt-3 max-w-xl text-text-muted">{lead}</p> : null}
    </div>
  );
}
