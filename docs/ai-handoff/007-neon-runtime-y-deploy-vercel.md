# 007 — Fase Neon + deploy: runtime conectado y Vercel en producción

## Objetivo

Resolver la conexión runtime de la API a Neon (Prioridad 1) y desplegar web + API a Vercel
(Prioridad 2). Todo validado de punta a punta con datos reales del seed demo.

## Credenciales (solo locales, NO subidas)

- Neon `DATABASE_URL` / `DATABASE_URL_UNPOOLED`: en `apps/api/.env` (gitignored). La directa
  (host `ep-old-king-axeiw8iq.c-4.us-east-2.aws.neon.tech/barbox11?sslmode=require`, SIN
  `channel_binding`, SIN `-pooler`) es la que usa la app.
- Vercel: org `barbox`, token y Project/Org IDs usados vía CLI. `auth.json` del CLI quedó en
  `C:\Users\57320\AppData\Roaming\xdg.data\com.vercel.cli\auth.json` (fuera del repo).
  `.vercel/project.json` y `.env.local` por app, gitignored.
- **No copiar tokens/URLs reales en docs ni commits** (GitHub Push Protection).

## Realizado — Prioridad 1 (runtime API→Neon)

El fallo de `Can't reach database server` **no** era env cacheado: tras matar todos los
procesos node y arrancar limpio, el primer login falló igual (transitorio) y el reintento
inmediato funcionó. Causa raíz: **Neon auto-suspende el compute**; la primera conexión tras
inactividad falla hasta que el compute despierta (reintentar resuelve). `node prisma-test.mjs`
y `tsx` plano conectaban porque el compute ya estaba activo en ese momento.

Validado en dev (`localhost:4000`):
- `POST /api/auth/login` (usuario demo del seed) → `{ user, token }`.
- `GET /api/overview` → `{projects:3, completedAnalyses:1, openIssues:4, recommendations:3, avgHealth:78}`.
- Detalle proyecto `web-app` → 1 análisis, 4 issues, 3 recomendaciones.
- `GET /api/recommendations` → 3, con `issue` vinculado (flujo IA contextual).

**Cambio de datos**: el issue LOW del seed estaba `ACCEPTED` → se pasó a `OPEN` en
`prisma/seed.ts` y en la DB (overview ahora da `openIssues:4` como spec).

## Realizado — Prioridad 2 (deploy Vercel)

Dos proyectos en la org `barbox`:

| Proyecto | Preset | URL producción | Env prod |
|---|---|---|---|
| `devpilot-api` | Express | https://devpilot-api.vercel.app | `DATABASE_URL` (directa), `CORS_ORIGIN` |
| `devpilot-web` | Next.js | https://devpilot-web-bay.vercel.app | `NEXT_PUBLIC_API_URL` = API prod |

Aprendizajes clave (IMPORTANTES para próximos deploys):

1. **NO crear un directorio `api/` en `apps/api`**: Vercel lo trata como namespace de
   funciones y genera `^/api(/.*)?$ → 404`, rompiendo la app Express montada en `/api`.
   El preset Express de Vercel **detecta la app sola** desde `src/app.ts` (handler
   `apps/api/src/app.js`) y sirve `/(.*) → /`. Se probó un `api/index.ts` que solo
   enrutaba `/`; se eliminó.
2. **`vercel.json`** en `apps/api` con `"buildCommand": "npx prisma generate"` (genera el
   client antes de empaquetar la función).
3. **URL de proyecto web**: `devpilot-web.vercel.app` ya estaba tomado → Vercel asignó
   `devpilot-web-bay.vercel.app`. Por eso `CORS_ORIGIN` se corrigió al dominio real.
4. **CORS multi-origen**: `src/app.ts` ahora parsea `CORS_ORIGIN` como lista separada por
   comas (dev localhost:3000 + dominio prod). Validado: POST 200 con ACAO correcto y
   preflight OPTIONS 204.
5. **Prisma en serverless**: funciona con URL directa; el client se genera en build.
   `vercel build` local en Windows puede fallar con `EPERM` si un proceso node tiene la DLL
   `query_engine-windows.dll.node` abierta (matar el dev server antes de build local).

Validado en producción:
- login → token; overview `3/4/3/78`; detalle proyecto (4 issues, 3 recs); recommendations 3.
- CORS desde `https://devpilot-web-bay.vercel.app` → `Access-Control-Allow-Origin` correcto.
- Bundle del web con `https://devpilot-api.vercel.app` horneado en los chunks JS.

## Checks

- `npm test` 17/17 ✓ (web 9 + api 8). `npm run typecheck` y `npm run lint` api ✓.
- Deploy API v3 (CORS) Ready en 27s. Deploy web Ready en 1m.

## Pendiente de roadmap

- **Validar dashboard en navegador** con demo contra prod (https://devpilot-web-bay.vercel.app).
- **Playwright E2E** (registro→login→crear proyecto→análisis) — requiere entorno con DB.
- **Tests de integración** vitest + supertest sobre rutas autenticadas contra Neon.
- **Graphify**: grafo de la arquitectura → `docs/`.
- **Documentación API**: `docs/api` (auth, overview, issues, recommendations, CRUD proyectos).
- **Flujo de análisis real** (el pipeline de escaneo/revisión IA no está implementado).
- Deploy mejoras: CI/CD automático, preview branches con env por entorno, dominio custom.

## Archivos clave

- `apps/api/src/app.ts` (CORS multi-origen) · `apps/api/prisma/seed.ts` (issue LOW → OPEN)
- `apps/api/vercel.json` (buildCommand prisma generate) · `.vercel/` y `.env.local` gitignored
- Docs: `docs/progress/PROJECT_STATUS.md` (~60%) · `docs/deployment/DEPLOYMENT.md` (actualizado)

## Estado de git

- Working tree: modificados `apps/api/{.gitignore,prisma/seed.ts,src/app.ts}`,
  `apps/web/.gitignore`; nuevo `apps/api/vercel.json`. Sin secrets.
- `origin/main` hasta `5b2943c`.

## Instrucciones para la próxima sesión

1. Validar el dashboard en navegador con el usuario demo del seed (credenciales configuradas
   vía `SEED_DEMO_EMAIL`/`SEED_DEMO_PASSWORD`, nunca en el repo) contra
   https://devpilot-web-bay.vercel.app (overview → detalle → AI review → issues).
2. Seguir el roadmap: Playwright E2E, tests de integración, Graphify, `docs/api`.
3. Toda la metodología, UI, mensajes, commits y docs en español.
4. Ante un `Can't reach database server` tras inactividad: reintentar (cold start de Neon).