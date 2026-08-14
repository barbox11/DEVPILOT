import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-grid min-h-screen">
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
          <div className="mb-8 flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="grid h-8 w-8 place-items-center rounded-sm bg-ink font-mono text-sm font-bold text-on-ink"
              >
                DP
              </span>
              <span className="font-mono text-base font-semibold tracking-tight text-text">
                DevPilot
              </span>
            </Link>
          </div>
          {children}
          <p className="mt-10 text-center text-xs text-text-muted">
            Al continuar aceptas los términos del servicio de DevPilot.
          </p>
        </div>
      </div>
    </div>
  );
}
