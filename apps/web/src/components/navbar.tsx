"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/container";
import { Button } from "@/components/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/cn";

const NAV_LINKS = [
  { href: "#escanear", label: "ESCANEAR" },
  { href: "#informe", label: "INFORME" },
  { href: "#corregir", label: "CORREGIR" },
  { href: "#verificar", label: "VERIFICAR" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <Container>
        <nav
          aria-label="Main"
          className="flex h-16 items-center justify-between gap-6"
        >
          <Link href="/" className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="grid h-8 w-8 place-items-center rounded-sm bg-ink font-mono text-sm font-bold text-on-ink"
            >
              DP
            </span>
            <span className="hidden font-mono text-base font-semibold tracking-tight text-text sm:inline">
              DevPilot
            </span>
          </Link>

          <ul className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted transition-colors duration-200 hover:text-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Button href="#" variant="outline" size="sm">
              Iniciar sesión
            </Button>
            <Button href="#escanear" size="sm">
              Comenzar análisis
            </Button>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center text-text md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label="Alternar navegación"
            onClick={() => setOpen((value) => !value)}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="square"
              aria-hidden="true"
            >
              {open ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </nav>
      </Container>

      <div
        id="mobile-nav"
        className={cn(
          "md:hidden",
          open ? "block border-t border-border bg-background" : "hidden",
        )}
      >
        <Container>
          <ul className="flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 font-mono text-xs uppercase tracking-[0.2em] text-text-muted transition-colors duration-200 hover:text-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 pb-5">
            <ThemeToggle className="w-full" />
            <Button
              href="#"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Iniciar sesión
            </Button>
            <Button
              href="#escanear"
              size="sm"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Comenzar análisis
            </Button>
          </div>
        </Container>
      </div>
    </header>
  );
}
