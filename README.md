# DevPilot

AI-assisted development platform. Analyze code, detect errors and vulnerabilities, review quality and architecture, generate recommendations, tests, and documentation — all through a professional SaaS product.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, TypeScript, Tailwind CSS |
| Backend | Node.js, TypeScript, Express |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Testing | Vitest, Playwright (planned) |
| Deployment | Vercel (frontend), Neon (PostgreSQL) (planned, not yet configured) |

## Repository layout

```
apps/
  web/       # Next.js frontend (landing + dashboard)
  api/       # Express backend (REST API + Prisma)
docs/        # Architecture, API, database, deployment, progress
```

## Architecture rule

```
FRONTEND → BACKEND API → SERVICES → PRISMA → NEON POSTGRESQL
```

The frontend never connects directly to Neon.

## Getting started

1. `npm install`
2. Copy `.env.example` to `.env.local` (web) and `.env` (api) and fill in values.
3. `npm run dev`
4. Open http://localhost:3000 (frontend) and http://localhost:4000/api (backend).

See `docs/` for full documentation.
