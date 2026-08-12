# 001 — Project Setup

## Objetivo

Crear la base del monorepo DevPilot (SaaS de asistencia IA para desarrolladores): estructura, frontend Next.js, backend Express + Prisma, y documentación obligatoria.

## Realizado

- Git repo inicializado (branch `main`), `.gitignore` global (secretos/env/builds/tooling).
- Monorepo npm workspaces (`apps/*`, `packages/*`), scripts root `dev`, `build`, `lint`, `typecheck`, `format`, `test`.
- `apps/web` — Next.js 15.5.23 (App Router, `src/`, Tailwind v4, ESLint flat, alias `@/*`), placeholder page + layout, tokens de diseño CSS en `globals.css`, `.env.example`.
- `apps/api` — Express 4.22 + TypeScript ESM estricto, `GET /api/health` y `GET /`, error middleware global (máscara en producción para >=500), Prisma 6 con modelo placeholder `HealthCheck`, `.env.example` con placeholders.
- Docs: `ARCHITECTURE.md`, `DEPLOYMENT.md`, `DATABASE.md`, `PROJECT_STATUS.md`, este handoff.
- Verificación: install/build/lint/typecheck exit 0 en ambos workspaces; smoke test `/api/health` → 200.

## Archivos clave

- `package.json` (root), `.gitignore`
- `apps/web/src/app/{layout,page,globals}.{tsx,css}`, `apps/web/package.json`, `apps/web/eslint.config.mjs`
- `apps/api/src/{index,app}.ts`, `apps/api/src/routes/index.ts`, `apps/api/src/middleware/error.ts`
- `apps/api/prisma/schema.prisma`, `apps/api/tsconfig.json`

## Decisiones

- Next 15 (no 16): create-next-app hoy genera Next 16; se ancló `next@15.5.23` para estabilidad del stack acordado.
- ESM (`"type": "module"`) en API con imports `*.js` (NodeNext).
- Prisma dentro de `apps/api`; migraciones diferidas hasta tener Neon real.
- Paquete `packages/shared` diferido hasta que exista código compartido real.
- Sin Turborepo por ahora (workspaces suficientes; se evalúa si build escala lento).

## Problemas / Soluciones

- create-next-app falló por carpeta `apps/` inexistente → creada antes de re-ejecutar.
- `.env.example` de web quedaba ignorado por patrón `.env*` del gitignore → añadido `!.env.example`.
- `@eslint/eslintrc` era dependencia transitiva de eslint-config-next → declarado explícitamente.
- `errorHandler` filtraba mensajes internos en producción → máscara genérica para >=500 en prod (log real en servidor).

## Tests

- Ninguno todavía (vitest se cablea en fase de testing).
- Evidencia: build/lint/typecheck exit 0; `GET /api/health` → `{"status":"ok","service":"devpilot-api",...}`.

## Pendientes

- Conectar Neon (requiere credenciales reales) + primeras migraciones.
- Configurar Vercel + GitHub (requiere credenciales/repo).
- Sistema de diseño definitivo (paleta/fuentes) con UI UX Pro Max + Frontend Design.
- Landing + Dashboard.

## Siguiente tarea sugerida

Fase 2 — Sistema de diseño y diseño de identidad visual (skills UI UX Pro Max + Frontend Design), o bien Fase de datos (modelo Prisma completo) si llegan credenciales Neon primero.

## Contexto para otra IA

- Repo: monorepo npm workspaces. Root scripts para dev/build/lint/typecheck.
- Frontend `apps/web` (Next 15) → API `apps/api` (Express) → Prisma → Neon. Nunca DB directa desde frontend.
- No hay credenciales reales en el repo; pedirlas al usuario antes de conectar servicios.
- Secretos jamás en código/docs; solo `.env*` (gitignored) o Vercel/GitHub Secrets.
- Versiones: Node >=22, Next 15.5, Express 4.22, Prisma 6, TypeScript 5.9.
