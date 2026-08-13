"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/issues", label: "Issues" },
  { href: "/dashboard/security", label: "Security" },
  { href: "/dashboard/testing", label: "Testing" },
  { href: "/dashboard/architecture", label: "Architecture" },
  { href: "/dashboard/ai-review", label: "AI Review" },
  { href: "/dashboard/activity", label: "Activity" },
  { href: "/dashboard/settings", label: "Settings" },
];

export function DashboardShell({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    let stored: string | null = null;
    try {
      stored = localStorage.getItem("devpilot-theme");
    } catch {
      // almacenamiento no disponible; ignorar
    }
    root.classList.add("dark");
    return () => {
      if (!stored || stored === "light") root.classList.remove("dark");
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-text">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-surface-2 md:block">
        <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
          <span className="grid h-8 w-8 place-items-center rounded-sm bg-ink font-mono text-sm font-bold text-on-ink">
            DP
          </span>
          <span className="font-mono text-base font-semibold tracking-tight">
            DevPilot
          </span>
        </div>
        <nav aria-label="Panel de control" className="p-3">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center rounded-sm px-3 py-2 font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-200",
                      active
                        ? "bg-surface text-text"
                        : "text-text-muted hover:bg-surface hover:text-text",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      <div className="md:pl-64">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
              instrumento · panel
            </p>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
              devpilot
            </span>
          </div>
          <nav
            aria-label="Secciones del panel"
            className="overflow-x-auto border-t border-border md:hidden"
          >
            <ul className="flex gap-1 px-3 py-2">
              {NAV.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "whitespace-nowrap rounded-sm px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-200",
                        active
                          ? "bg-surface text-text"
                          : "text-text-muted hover:bg-surface hover:text-text",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </header>
        <main id="contenido" className="px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}