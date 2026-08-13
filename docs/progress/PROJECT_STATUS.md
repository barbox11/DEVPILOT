# DevPilot Project Status

_Updated: 2026-08-13_

## Current phase

Fase 3 sin credenciales completada (commits `b13c375`..`e6251b6`): a11y, SEO, vitest, CI, schema Prisma (3A), services API (3B) y dashboard shell (3C). Próxima: auth o conexión Neon (pedir credenciales).

## Overall progress

~38%

## Completed

- Phase 1: monorepo (Next.js 15 web + Express api + Prisma), docs, verified green (commit b293b1f)
- Phase 2: design system + full landing
  - Identity "Diagnostic specification": paper palette (light) + instrument-console dark tokens (.dark, dormant)
  - Fonts: JetBrains Mono (display/labels) + IBM Plex Sans (body), self-hosted via next/font
  - Landing: Navbar, Hero (signature CodePanel with scan line), Trust, Problem, Solution (SCAN→REPORT→FIX→VERIFY), Features, HowItWorks, AICapabilities, Security, Workflow, CTA, Footer
  - Components: Container, Eyebrow, Button (twMerge), SectionHeading, CodePanel, plus cn() with tailwind-merge
  - CSS: tokens, bg-grid blueprint utility, scan animation (reduced-motion aware)
  - Design system persisted in design-system/devpilot/ (MASTER + pages/landing override)
  - Review loop: 3 tasks, 3 fix rounds (dark tokens scoping, chip contrast ≥4.5:1, CTA cascade CRITICAL via twMerge), final review clean (minors: 2 fixed — code panel mobile overflow, trust reuses Eyebrow; rest parked)
  - Phase 2 cerrada: prettier format run, dead nav anchors corregidos (SCAN/REPORT/FIX/VERIFY → pasos de Solution), cta.tsx colapsado corregido, `__pycache__/` gitignored, build/lint/typecheck re-verificados verde
- Phase 2.5 (localización): landing íntegramente en español — `lang="es"`, metadata, navbar (Iniciar sesión/Comenzar análisis), hero, las 10 secciones, footer, chips de severidad (OK/HALLAZGO/ADVERTENCIA), captions e IDs de anclas (`#escanear/#informe/#corregir/#verificar`). Verificado en HTML servido (200, textos es presentes, en ausentes). Commit `13dceb5` pusheado a `origin/main` (github.com/barbox11/DEVPILOT).
- Phase 2.6 (dark mode): tokens dark bajo `.dark` activados, `color-scheme`, script inyector anti-FOUC en `layout.tsx`, `ThemeToggle` en navbar (desktop + mobile), preferencia persistida en `localStorage("devpilot-theme")` con fallback a `prefers-color-scheme`. Commit `6853687` pusheado.
- Phase 3 (sin credenciales):
  - A11y + SEO: skip link, aria-labels en español, enlaces muertos eliminados, metadata OG/Twitter/JSON-LD, `robots.txt`, `sitemap.xml` (commits `b13c375`, `19a03ca`).
  - Testing: vitest + `@vitejs/plugin-react`, `npm test` verde (6 tests). Commit `d1ed375`.
  - CI: GitHub Actions (lint+typecheck+build+test). Commit `75c2400`.
  - 3A Datos: schema Prisma completo (User, Session, Project, Analysis, Issue, Recommendation, GeneratedTest, Activity + enums), validado y generado. Commit `20d7653`.
  - 3B API: services layer, zod validation, auth Bearer por sesión, rutas REST protegidas. Commit `348ca03`.
  - 3C Dashboard: shell dark de instrumento, 9 secciones + detalle de proyecto con estados skeleton/empty, `noindex`. Commit `e6251b6`.
  - ai-handoff 004 documentado.

## In progress

- Ninguno. Fase 3 sin credenciales cerrada y verificada verde (lint/typecheck/build/test). A la espera de dirección: auth o credenciales Neon.

## Pending

- Dashboard shell (Overview, Projects, Issues, Security, Testing, Architecture, AI Review, Activity, Settings) → shell creado; falta conectar datos reales.
- Auth (registro/login/logout + sesión) + conectar dashboard a la API.
- Neon connection + migraciones (blocked on credentials)
- Vercel + GitHub setup (blocked on credentials/repo)
- Testing infra (Vitest + Playwright): Vitest ✔ · Playwright pendiente
- Datos reales en el dashboard (fetch a la API, TanStack Query)
- Navbar `#report/#fix/#verify` anchors → corregidos: ahora apuntan a los pasos SCAN/REPORT/FIX/VERIFY de la sección Solution

## Blocked

- DB/deploy steps pause for credentials. Design/dashboard phases can proceed independently.

## Problems

- create-next-app généra Next 16 → anclado Next 15.5.23.
- npm audit: 3 advisories high transitivos en next@15 (postcss/sharp); fix = Next 16 breaking → seguimiento.
- Tailwind v4 orden CSS → overrides perdían cascada (CTA). Resuelto con tailwind-merge en cn().

## Solutions

- twMerge garantiza overrides last-wins (verificado en HTML renderizado).
- Chips de severidad usan tokens strong (#0a6d60 / #9c4f0b) → contraste ≥4.5:1.
- Tokens dark bajo clase `.dark` (inactivos hasta dashboard).

## Decisions

- Identidad "spec sheet" light para landing; dark "instrumento" para dashboard (misma familia de acentos).
- Sin librería de iconos: SVGs inline stroke-1.5. Sin Turborepo todavía.
- Sin librería de animación: CSS keyframes con prefers-reduced-motion.
- Ctrl. final: docs agree con landing.md; MASTER.md genérico explícitamente overrideado.

## Credentials required

- NEON: `DATABASE_URL`, `DATABASE_URL_UNPOOLED` — PENDING
- VERCEL: Project ID / Org ID / Token — PENDING
- GITHUB: remote + token — PENDING

## Environment configuration

- Node v22.16.0, npm 11.14.1, git 2.45.2, Python 3.12.10. Windows / PowerShell 5.1.

## Database status

- Schema de dominio v1 (Fase 3A) diseñado, `prisma validate` + `prisma generate` OK. Migraciones pending credenciales Neon.

## Backend status

- Express scaffold + services layer + validación zod + auth Bearer (session). Rutas REST autenticadas bajo `/api`. Sin features de negocio conectadas a DB real aún.

## Frontend status

- Landing completa y verde con dark mode + a11y + SEO. Dashboard shell (Fase 3C) con 9 secciones + detalle de proyecto, estados skeleton/empty. Conexión a API pendiente de auth.

## Testing status

- Vitest instalado en workspace web con `vitest.config.mts`; `npm test` verde (6 tests: `cn`, `CodePanel`). Playwright pendiente.

## Deployment status

- Plan en DEPLOYMENT.md. No configurado.

## Vercel status

- Not configured.

## Neon status

- Not configured.

## GitHub status

- Remote configurado: `origin` → `https://github.com/barbox11/DEVPILOT.git`. Commits `b293b1f` y `13dceb5` pusheados.

## Security status

- Env gitignored; `.env.example` templates versionados; error API enmascara >=500 en prod; frontend sin acceso a DB; sin secrets en código.

## Documentation status

- ARCHITECTURE, DEPLOYMENT, DATABASE, PROJECT_STATUS, ai-handoff 001 (setup) + 002 (design system/landing) + 003 (localización). design-system/devpilot persistido. `/docs/api` y `/docs/testing` sin contenido aún. Falta entregar al proyecto las partes 2-10 del master prompt.

## Next tasks

1. Auth: registro/login/logout con sesión sobre el schema 3A (no requiere credenciales para código).
2. Pedir credenciales Neon (DATABASE_URL) → migraciones → conectar dashboard a la API real.
3. Después Vercel (deploy) y Playwright E2E.

## Recommended next step

Auth con sesión para desbloquear las rutas API y conectar el dashboard a datos reales; al llegar a migraciones, pedir credenciales Neon.
