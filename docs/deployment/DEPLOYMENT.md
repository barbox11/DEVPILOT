# DevPilot — Deployment

## Target platform

| Layer | Platform |
|---|---|
| Frontend (apps/web) | Vercel |
| Backend (apps/api) | Vercel (serverless-compatible Express) |
| Database | Neon PostgreSQL |

## Deployment flow

```
LOCAL  ──►  TEST  ──►  GIT  ──►  GITHUB  ──►  CI  ──►  VERCEL PREVIEW  ──►  QA  ──►  PRODUCTION
```

## Environments

Vercel environments and their variables:

| Environment | Trigger | Purpose |
|---|---|---|
| Development | push / feature branch | local dev + feature verification |
| Preview | pull request | QA before merge |
| Production | merge to `main` | live SaaS |

Every environment has its own variables (identical keys, different values):

- `DATABASE_URL` / `DATABASE_URL_UNPOOLED` → corresponding Neon branch
- `NEXT_PUBLIC_API_URL` → API origin for the frontend
- `CORS_ORIGIN` → allowed web origin for the API
- `PORT` → provided by Vercel at runtime

## Backend on Vercel — decision

The Express API is lightweight (no long-lived sockets, stateless). Before enabling Vercel Functions:

1. Verify serverless compatibility (each request is a fresh function invocation).
2. Prisma: use pooled `DATABASE_URL` (PgBouncer/Neon pooler) and generate the client at build time.
3. If a persistent server is ever required (websockets, long jobs), do NOT force Vercel — propose an alternative (e.g. a dedicated Node host) per the architecture-first rule.

## Database branches (Neon)

| Environment | Neon branch |
|---|---|
| development | `dev` |
| testing | `test` |
| production | `main` |

Migrations: `prisma migrate` runs against each branch in CI before/after deploy.

## Required credentials (requested at deploy time — not invented)

- NEON: `DATABASE_URL`, `DATABASE_URL_UNPOOLED` (+ optionally project branch ids)
- VERCEL: Project ID, Organization ID, access token
- GITHUB: repository + remote, and token if the tooling requires it

## Status

Not configured yet (Phase 1 scaffold). This document is the plan.
