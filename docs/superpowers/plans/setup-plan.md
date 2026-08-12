# DevPilot — Phase 1 Setup Plan

Goal: scaffold the DevPilot monorepo (Next.js web + Express api + Prisma) and verify it builds.

## Global constraints

- TypeScript strict throughout.
- Web must be Next.js 15 App Router + Tailwind CSS + ESLint, in `apps/web` with `src/` dir and `@/*` alias.
- API must be Express + TypeScript + Prisma in `apps/api`. Never connect frontend directly to the DB.
- No secrets in code or docs. Env templates only (`.env.example`).
- No comments in code unless asked.
- Keep files consistent with root workspace (npm workspaces, package name `@devpilot/web`, `@devpilot/api`).

## Task 1 — Scaffold apps/web

Create a Next.js 15 application at `apps/web`:

- TypeScript, App Router, `src/` directory, Tailwind CSS, ESLint, import alias `@/*`.
- Package name `@devpilot/web`, private.
- `package.json` scripts: dev, build, start, lint, typecheck, test (vitest).
- Base layout (`src/app/layout.tsx`) with metadata title "DevPilot" and description.
- Minimal root page (`src/app/page.tsx`) placeholder — real landing comes later.
- Global styles using Tailwind (`src/app/globals.css`) with a small set of CSS variables for the design tokens (colors + fonts) to be refined later.
- `.env.example` with `NEXT_PUBLIC_API_URL=http://localhost:4000`.
- Do NOT install Playwright yet.
- Run `npm install` (workspace) then `npm run build` (or `next build`) and `npm run lint` and fix until clean. Report versions.

## Task 2 — Scaffold apps/api

Create an Express TypeScript API at `apps/api`:

- TypeScript strict, `src/` layout: `src/index.ts` (entry), `src/app.ts` (express app), `src/routes/index.ts`, `src/middleware/error.ts`.
- `GET /api/health` → `{ status: "ok", service: "devpilot-api", timestamp }`.
- `GET /` → basic JSON info.
- Global JSON error handler middleware + 404 handler.
- CORS enabled for localhost:3000.
- `PORT` from env (default 4000).
- Package name `@devpilot/api`, private.
- Prisma 6: `prisma/schema.prisma` with `provider = "postgresql"` and a placeholder `HealthCheck` model (id, checkedAt) for future use; datasource `url = env("DATABASE_URL")`.
- Prisma script: `prisma:generate`, `prisma:migrate`.
- `.env.example` with `DATABASE_URL` and `DATABASE_URL_UNPOOLED` placeholders (no real values), `PORT=4000`, `CORS_ORIGIN=http://localhost:3000`.
- tsconfig with `target ES2022`, `module NodeNext`, `strict true`, `outDir dist`.
- Run `npx prisma generate` to verify schema is valid, `npm run build` (tsc), and a lint script. Fix until clean.

## Task 3 — Root integration

- Verify `npm install` works from root for both workspaces.
- Verify `npm run lint` and `npm run typecheck` pass at root.
- Verify `npm run dev` starts both (manual spot check optional; at minimum verify builds).
- Confirm env templates are consistent.

## Out of scope for Phase 1

- Neon connection, migrations against a live DB, auth, landing design, dashboard, tests, deployment.
