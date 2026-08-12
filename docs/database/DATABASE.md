# DevPilot — Database

## Provider

PostgreSQL on Neon. Separate branches per environment (development / testing / production).

## Access rule

```
BACKEND API  →  PRISMA  →  DATABASE_URL  →  NEON
```

The frontend never connects directly to Neon. Only the API layer (apps/api) holds DB access.

## ORM

Prisma 6 (`prisma-client-js`). Schema lives at `apps/api/prisma/schema.prisma`.

## Current schema (Phase 1 placeholder)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model HealthCheck {
  id        Int      @id @default(autoincrement())
  checkedAt DateTime @default(now())
}
```

`HealthCheck` validates connectivity (a row written on health checks). Real models (users, projects, analyses, issues, security findings, recommendations) will be designed and added in the data-model phase.

## Environment variables

Required in `apps/api`:

- `DATABASE_URL` — pooled connection URL (Prisma + PgBouncer/pooler)
- `DATABASE_URL_UNPOOLED` — direct connection URL (migrations)

Placeholders only in `.env.example` today. Real values will be requested before the first migration.

## Commands

- `npm run prisma:generate --workspace @devpilot/api` — generate client
- `npm run prisma:migrate --workspace @devpilot/api` — `prisma migrate dev` (requires a live DB)

## Status

Not connected (no live DB yet). `prisma generate` verified locally. Migrations blocked on Neon credentials.
