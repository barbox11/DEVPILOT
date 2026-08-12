import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CodeLine = {
  severity?: "pass" | "finding" | "warn";
  content: ReactNode;
};

type CodePanelProps = {
  title?: string;
  status?: "pass" | "finding";
  scanning?: boolean;
  caption?: string;
  lines?: CodeLine[];
};

const chipClasses = "rounded px-1.5 py-0.5 font-mono text-xs font-semibold";

const statusChip = {
  pass: {
    label: "OK",
    className: "bg-accent-pass-soft text-accent-pass-strong",
  },
  finding: {
    label: "HALLAZGO",
    className: "bg-accent-finding-soft text-accent-finding-strong",
  },
} as const;

const severityChip = {
  pass: {
    label: "OK",
    className: "bg-accent-pass-soft text-accent-pass-strong",
  },
  finding: {
    label: "HALLAZGO",
    className: "bg-accent-finding-soft text-accent-finding-strong",
  },
  warn: {
    label: "ADVERTENCIA",
    className: "bg-accent-finding-soft text-accent-finding-strong",
  },
} as const;

function tokens(parts: readonly (readonly [string, "kw" | "pl"])[]): ReactNode {
  return parts.map(([text, kind], index) => (
    <span
      key={index}
      className={kind === "kw" ? "text-text" : "text-text-muted"}
    >
      {text}
    </span>
  ));
}

const defaultLines: CodeLine[] = [
  {
    content: tokens([
      ["import ", "kw"],
      ["{ verifySession } ", "pl"],
      ["from ", "kw"],
      ['"./session";', "pl"],
    ]),
  },
  {
    content: tokens([
      ["const ", "kw"],
      ["{ ok, claims } = verifySession(token);", "pl"],
    ]),
  },
  {
    content: tokens([
      ["if ", "kw"],
      ["(!ok) {", "pl"],
    ]),
  },
  {
    content: tokens([
      ["  throw ", "kw"],
      ["new ", "kw"],
      ['InvalidToken("sesión expirada");', "pl"],
    ]),
    severity: "finding",
  },
  {
    content: tokens([["}", "pl"]]),
  },
  {
    content: tokens([
      ["const ", "kw"],
      ["user = ", "pl"],
      ["await ", "kw"],
      ["loadUser(claims.sub);", "pl"],
    ]),
  },
  {
    content: tokens([
      ["if ", "kw"],
      ["(user.mfa && !claims.mfaVerified) {", "pl"],
    ]),
    severity: "warn",
  },
  {
    content: tokens([
      ["  return ", "kw"],
      ['fail(403, "mfa_required");', "pl"],
    ]),
    severity: "finding",
  },
  {
    content: tokens([["}", "pl"]]),
  },
  {
    content: tokens([['log("auth.pass", user.id);', "pl"]]),
    severity: "pass",
  },
];

export function CodePanel({
  title = "auth.ts",
  status = "finding",
  scanning = true,
  caption,
  lines,
}: CodePanelProps) {
  const body = lines ?? defaultLines;
  const captionText =
    caption ??
    (lines ? undefined : "analizando: auth.ts · 2 hallazgos · 1 correcto");
  return (
    <figure className="overflow-hidden rounded-md border border-border bg-surface font-mono text-[13px] leading-6 shadow-md">
      <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-2">
        <span
          aria-hidden="true"
          className="flex items-center gap-1.5 text-text-muted/50"
        >
          {[0, 1, 2].map((dot) => (
            <svg
              key={dot}
              viewBox="0 0 8 8"
              className="h-2.5 w-2.5"
              aria-hidden="true"
            >
              <circle cx="4" cy="4" r="4" fill="currentColor" />
            </svg>
          ))}
        </span>
        <span className="font-mono text-xs text-text-muted">{title}</span>
        <span
          className={cn("ml-auto", chipClasses, statusChip[status].className)}
        >
          {statusChip[status].label}
        </span>
      </div>

      <div className="relative overflow-hidden bg-surface">
        <div aria-hidden="true" className="absolute inset-0 bg-grid" />
        <div className="overflow-x-auto">
          <div className="relative">
            {body.map((line, index) => (
              <div key={index} className="flex items-center gap-3 px-4">
                <span className="flex-1 whitespace-pre text-text-muted">
                  {line.content}
                </span>
                {line.severity ? (
                  <span
                    className={cn(
                      chipClasses,
                      severityChip[line.severity].className,
                    )}
                  >
                    {severityChip[line.severity].label}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
        {scanning ? (
          <span
            aria-hidden="true"
            className="scan-line animate-scan pointer-events-none absolute inset-x-0 top-0"
          />
        ) : null}
      </div>

      {captionText ? (
        <figcaption className="border-t border-border px-4 py-2 font-mono text-xs text-text-muted">
          {captionText}
        </figcaption>
      ) : null}
    </figure>
  );
}
