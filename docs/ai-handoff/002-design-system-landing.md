# 002 — Design System + Identity + Landing

## Objetivo

Definir la identidad visual de DevPilot y construir el landing completo con un sistema de diseño propio (no genérico), siguiendo UI UX Pro Max (búsquedas + design-system persistido) y Frontend Design (dirección deliberada y distintiva).

## Decisión de identidad (frontend-design)

Se rechazó el default de la herramienta (dark OLED + verde ácido + Inter) por genérico. Dirección elegida: **"Especificación de diagnóstico"** — DevPilot inspecciona código como un instrumento de precisión que emite un spec sheet técnico.

- Landing = documento técnico en luz (papel `#FAFAF7`, hairline rules, grid de blueprint).
- App (dashboard, fase posterior) = consola de instrumento (dark `#0B1020`, tokens listos bajo `.dark`).
- Dos acentos semánticos: teal = pass, amber = finding. Eyebrows mono con etiquetas reales del flujo: SCAN/REPORT/FIX/VERIFY.
- Signature: panel de código anotado con severidad (PASS/FIND/WARN) + línea de escaneo.

## Realizado

- Tokens completos en `globals.css` (`:root` light + `.dark`), radii, shadows, spacing, fuentes.
- Fuentes self-hosted vía `next/font/google`: JetBrains Mono (400-700) + IBM Plex Sans (400-600).
- `cn()` con `tailwind-merge` (robusto ante orden CSS de Tailwind v4).
- Componentes: Container, Eyebrow, Button (primary/outline, sm/md), SectionHeading, CodePanel (signature), Navbar (sticky + móvil con a11y), Hero.
- Secciones: Trust, Problem, Solution (`#scan`), Features, HowItWorks, AICapabilities, Security, Workflow, CTA, Footer.
- `@utility bg-grid` (blueprint) + animación de scan con `prefers-reduced-motion`.
- Design system persistido en `design-system/devpilot/MASTER.md` + `pages/landing.md` (override explícito).

## Archivos clave

- `apps/web/src/app/globals.css`, `layout.tsx`, `page.tsx`
- `apps/web/src/lib/cn.ts`
- `apps/web/src/components/{container,eyebrow,button,section-heading,code-panel,navbar,hero}.tsx`
- `apps/web/src/components/sections/*.tsx`
- `design-system/devpilot/**`

## Decisiones técnicas

- Sin librería de iconos: SVGs inline stroke 1.5. Sin animación JS: CSS keyframes con reduced-motion aware.
- Dark tokens bajo clase `.dark` (no prefers-color-scheme) para que el landing quede light-only hasta el dashboard.
- Tokens strong para chips (`#0a6d60`/`#9c4f0b`) → contraste ≥4.5:1.

## Problemas / Soluciones

- Tailwind v4 ordena utilidades por propiedad → overrides no ganaban cascada (CTA con texto invisible, CRITICAL). Fix: `tailwind-merge` en `cn()` con className last-wins; verificado en HTML prerenderizado.
- Contraste de chips < 4.5:1 → tokens strong.
- Tokens dark se auto-aplicarían en OS dark → scoped a `.dark`.

## Tests

- Ninguno todavía (Vitest en fase testing).
- Evidencia: build/lint/typecheck exit 0 (web) + revisión final clean (2 menores corregidos: overflow móvil del CodePanel, trust reusa Eyebrow; resto parkeado: anchors futuros, max-w 1152 vs plan, metadata genérica).

## Pendientes

- Dashboard shell (aplicar `.dark`, navegación Overview/Projects/Issues/Security/Testing/Architecture/AI Review/Activity/Settings).
- Modelo de datos Prisma + auth.
- Neon/Vercel/GitHub (credentiales).

## Siguiente tarea sugerida

Fase 3 — Dashboard shell con identidad dark de instrumento, o modelo de datos Prisma completo si se prioriza backend.

## Contexto para otra IA

- Identidad: spec sheet light (landing) / instrumento dark (app). Acentos semánticos teal=pass, amber=finding.
- Reusa: Container, Eyebrow, Button, SectionHeading, CodePanel, cn (twMerge last-wins).
- Tokens solo en globals.css; componentes jamás hex. Extrañeza: `text-text` y `text-text-muted` son utilidades válidas.
- Dark: añadir clase `dark` al `<html>` para activar tokens (fase dashboard).
- CTA en fondo ink necesita overrides con className (twMerge los resuelve).
- No hay credenciales reales; pedir al usuario antes de conectar servicios.
