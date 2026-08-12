import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EyebrowProps = {
  children: ReactNode;
  className?: string;
};

export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-text-muted",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="inline-block h-0.5 w-0.5 bg-text-muted"
      />
      {children}
    </span>
  );
}
