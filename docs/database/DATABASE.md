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

## Current schema (Phase 3A — dominio)

```prisma
// Resumen. Schema completo: apps/api/prisma/schema.prisma
enum UserRole { OWNER MEMBER }
enum AnalysisStatus { PENDING RUNNING COMPLETED FAILED CANCELLED }
enum Severity { CRITICAL HIGH MEDIUM LOW }
enum IssueCategory { ERROR SECURITY QUALITY TESTING ARCHITECTURE PERFORMANCE DOCUMENTATION }
enum IssueStatus { OPEN ACCEPTED REJECTED FIXED }
enum TestStatus { PASSED FAILED SKIPPED }

User            // auth: email único, passwordHash, rol
Session         // tokens de sesión con expiración
Project         // repos, defaultBranch, ownerId
Analysis        // ejecución de análisis con scores (health, quality, security, testing, architecture)
Issue           // hallazgos: severidad, categoría, archivo, sugerencia de fix, estado
Recommendation  // recomendaciones de IA (opcionalmente ligadas a un Issue)
GeneratedTest   // tests generados por el análisis
Activity        // log de actividad del producto (JSON metadata)
```

Relaciones clave: `User 1—N Project`, `Project 1—N Analysis`, `Analysis 1—N {Issue, Recommendation, GeneratedTest, Activity}`, `User 1—N Session`, `Issue 1—N Recommendation` (deleción: `SetNull`).

Detalles de diseño:

- **IDs `cuid()`** para escalar sin secuencias dependientes del orden.
- **Índices** en todas las FKs (`@@index`) y en `Issue.severity` para filtros del dashboard.
- **Borrado por cascada** al eliminar `Project`/`Analysis`; `Activity` usa `SetNull` sobre referencias opcionales.
- Los **scores** (`healthScore`, etc.) viven en `Analysis` como `Int?` hasta que el pipeline de análisis los calcule; `null` = aún sin puntuar.
- `metadata Json?` en `Activity` permite instrumentar eventos sin migrar el esquema.

## Environment variables

Required in `apps/api`:

- `DATABASE_URL` — pooled connection URL (Prisma + PgBouncer/pooler)
- `DATABASE_URL_UNPOOLED` — direct connection URL (migrations)

Placeholders only in `.env.example` today. Real values will be requested before the first migration.

## Commands

- `npm run prisma:generate --workspace @devpilot/api` — generate client
- `npm run prisma:migrate --workspace @devpilot/api` — `prisma migrate dev` (requires a live DB)

## Status

Schema de dominio v1 (Fase 3A) validado (`prisma validate`) y cliente generado localmente. Conexión real y migraciones bloqueadas en credenciales Neon.
