# 006 — Fase 3.6 + Neon: pulido UI/UX y conexión a la base de datos real

## Objetivo

Cerrar la auditoría de la Parte 3 del master prompt (FRONTEND + UI/UX) corrigiendo 3 gaps detectados, y conectar el proyecto a Neon (base de datos real) con migración y seed de datos demo. Pendiente de resolver: la conexión del **runtime dev** de la API a Neon y el deploy a Vercel.

## Credenciales proporcionadas por el usuario (solo locales, NO subidas)

- Neon pooled y directa/unpooled: guardadas en `apps/api/.env` (`DATABASE_URL` directa con `?sslmode=require` y `DATABASE_URL_UNPOOLED`). Redactadas aquí por seguridad.
- Vercel token: `vcp_...` (NO usado aún; se necesita también Project ID / Org ID o `vercel link`)

> **Seguridad**: las credenciales viven SOLO en `apps/api/.env` y `apps/web/.env`, que están gitignored (`git check-ignore` confirmado). No se han subido al repo. **No copiar tokens/URLs reales en docs ni commits** (GitHub Push Protection los bloquea).

## Realizado (Parte 3 UI/UX — gap 1, 2 y 3)

Commit `e070fbb` — "feat: pulir UI/UX del dashboard (detalle real, IA contextual, estados offline/success)".

### Gap 1 — Detalle de proyecto con datos reales
- `apps/api/src/services/projectService.ts`: `getProjectDetail` ahora incluye `analyses` con `issues` y `recommendations` anidadas.
- `apps/web/src/lib/queries.ts`: tipo `ProjectWithDetails` (Project + analyses con issues/recommendations), `Activity` restaurado, `Issue.suggestedFix`, `Recommendation.issue`, y `useProject` tipado a `ProjectWithDetails`.
- `apps/web/src/app/dashboard/projects/[id]/page.tsx` reescrito: puntuaciones (health/quality/security/testing/architecture), tarjetas "Último análisis" y "Recomendaciones de IA", y lista de hallazgos con chip de severidad, categoría, archivo:línea, descripción, recomendación y **fix sugerido** (bloque `<pre>`).

### Gap 2 — Estados Offline y Success
- `apps/web/src/lib/api.ts`: `api()` detecta error de red (`TypeError`) y lanza `ApiError("Sin conexión con la API", 0)`; helper `isOffline()`.
- `apps/web/src/lib/use-online.ts`: hook `useOnline()` (listeners `online`/`offline`).
- `apps/web/src/components/dashboard/view.tsx`: nuevos `DataError` (distingue "Sin conexión" de error de API, con botón Reintentar) y `SuccessBanner`.
- Integrado `DataError` + retry + offline en: `dashboard/page.tsx`, `projects/page.tsx`, `issues/page.tsx`, `activity/page.tsx`, `ai-review/page.tsx`, `category-issues.tsx`. `projects/page.tsx` añade `SuccessBanner` tras crear/eliminar.

### Gap 3 — Flujo IA contextual (issue → por qué → análisis → recomendación → fix → test)
- `apps/api/src/services/recommendationService.ts`: `listRecommendationsForUser` incluye el `issue` relacionado (severity, category, file, lineStart, title, description, suggestedFix).
- `apps/web/src/lib/queries.ts`: `Recommendation.issue`.
- `apps/web/src/app/dashboard/ai-review/page.tsx` reescrito: cada recomendación renderiza el flujo completo (chip "El issue", "Por qué importa", "Recomendación de la IA", "Fix sugerido").

## Realizado (Neon — migración + seed)

Commit `067a3b6` — "feat: conectar Neon y sembrar datos de prueba (migración init + seed)".

- **`prisma migrate dev --name init`** aplicado a Neon (directa). Migración `20260814155613_init` creada. Verificado con `prisma migrate dev` (el CLI SÍ conecta usando `DATABASE_URL_UNPOOLED`).
- **`prisma/seed.ts`** (`npm run prisma:seed` → `tsx prisma/seed.ts`): crea el usuario demo
  SOLO si `SEED_DEMO_EMAIL`/`SEED_DEMO_PASSWORD` están definidas en el entorno (gitignored;
  sin credenciales en el repo), y siembra 3 proyectos (`web-app`, `api-gateway`,
  `legacy-crm`), 1 análisis COMPLETED (health 78, quality 82, security 71, testing 64,
  architecture 88), 4 issues (CRITICAL/HIGH/MEDIUM/LOW con `suggestedFix`), 3
  recomendaciones (2 vinculadas a issues), 3 generated tests, 3 actividades.
- **`package.json` (api)**: script `prisma:seed` + bloque `prisma.seed`. Migración y seed pusheados.
- Resultado del seed verificado en Neon: `user:1, projects:3, analyses:1, issues:4, recommendations:3, generatedTests:3, activity:3`.

## Checks

- Parte 3 UI/UX: `lint` ✓ `typecheck` ✓ `build` (16 rutas) ✓ `test` 17/17 ✓ (web 9 + api 8). Commit `e070fbb`.
- Neon: CLI de Prisma conecta (migración + seed OK). Seed devuelve los counts esperados.

## Pendiente / bloqueado (PRIORITARIO)

### 1. CONEXIÓN RUNTIME de la API a Neon (NO resuelto)
- **Síntoma**: el CLI de Prisma (`prisma migrate dev`, `node prisma-test.mjs`) SÍ conecta a Neon con la URL directa `?sslmode=require` (sin `channel_binding`). Pero la API en `npm run dev` (tsx) NO conecta: `Can't reach database server at ep-old-king-axeiw8iq.c-4.us-east-2.aws.neon.tech:5432`.
- **Diagnóstico parcial**: al usar `channel_binding=require` en `DATABASE_URL`, el runtime fallaba. Se quitó `channel_binding` del `.env` (queda `?sslmode=require`). `node prisma-test.mjs` con esa misma URL devolvió `USERS: 1` (funciona). Sin embargo, tras reiniciar el proceso dev varias veces, **seguía fallando** — sospecha de proceso heredando env cacheado (dotenv en `index.ts` carga `.env` una vez; `tsx watch` recompila pero el proceso npm padre retiene env). Falta una comprobación limpia de principio a fin.
- **Próximo paso sugerido**:
  1. Matar TODOS los procesos node.
  2. Confirmar `apps/api/.env` = `DATABASE_URL` directa (host `ep-old-king-axeiw8iq.c-4.us-east-2.aws.neon.tech/barbox11` con `?sslmode=require`, SIN `channel_binding`, SIN `-pooler`).
  3. Arrancar `npm run dev`, esperar "listening", y llamar `POST /api/auth/login` con las
      credenciales del usuario demo (definidas por env en el seed) → debe devolver
      `{ session: { token } }`.
  4. Con el token, `GET /api/overview` → debe devolver `projects=3, openIssues=4, recommendations=3, avgHealth=78`.
  5. Si sigue fallando, probar setear `DATABASE_URL_UNPOOLED` como URL de runtime o investigar `channel_binding`/firewall/shadows. Confirmar también `CORS_ORIGIN=http://localhost:3000`.
- **Nota**: la URL directa que funcionó en CLI usó `?sslmode=require`. El pooler (`-pooler`) conecta a TCP 5432 pero el query engine de Prisma no lo alcanza; usar la directa.

### 2. Deploy a Vercel (NO iniciado)
- Se tiene el **token Vercel** `vcp_8...` pero **falta Project ID / Org ID** (o hacer `vercel link`). El token está en la sesión pero NO en el repo ni en `.env`.
- Próximos pasos: `npm i -D vercel` en `apps/web` (o global), `npx vercel link` (asociar a proyecto/org), `npx vercel deploy --prod`, configurar variables de entorno de producción (ver sección siguiente), y verificar `NEXT_PUBLIC_API_URL` apunte al backend desplegado.
- **Backend**: decidir deploy serverless (misma URL Vercel) vs. hostear la API Express aparte (Render/Railway/Fly). La API Express no es nativa serverless: habrá que adaptarla (handler) si se sube a Vercel.

### 3. Variables de entorno para producción (sin resolver)
- `apps/web/.env` local: `NEXT_PUBLIC_API_URL=http://localhost:4000` (solo dev).
- En producción el frontend debe apuntar al backend desplegado; hay que definir la URL pública definitiva de la API.

### 4. Verificación E2E con datos reales
- Conectar el dashboard a la DB real: login con demo → ver overview con métricas reales, detalle de proyecto con issues/recomendaciones, flujo IA contextual. No verificado en navegador aún (la API dev no conectaba).

## Pendiente de roadmap (ya documentado en PROJECT_STATUS)

- **Testing E2E**: Playwright (registro→login→crear proyecto→análisis), requiere entorno con DB.
- **API tests de integración**: vitest + supertest sobre rutas autenticadas, requiere DB real.
- **Graphify**: grafo de conocimiento de la arquitectura → `docs/`.
- **Documentación API**: `docs/api` con rutas auth/overview/issues/recommendations/CRUD proyectos.
- **Flujo de análisis real**: la app crea análisis con datos simulados en seed; el pipeline real de escaneo/revisión IA no está implementado (fuera del alcance actual si el master prompt lo requiere).

## Archivos clave

- Migración: `apps/api/prisma/migrations/20260814155613_init/migration.sql` · `migration_lock.toml`
- Seed: `apps/api/prisma/seed.ts` · `apps/api/package.json` (bloque `prisma.seed`)
- UI/UX: `apps/web/src/app/dashboard/**` · `apps/web/src/components/dashboard/{view,category-issues}.tsx` · `apps/web/src/lib/{api,queries,use-online}.{ts,tsx}`
- API servicios: `apps/api/src/services/{projectService,recommendationService}.ts`
- Docs: `docs/progress/PROJECT_STATUS.md` (fase 3.6, ~52%)

## Estado de git

- `origin/main` hasta `067a3b6`. Rama `main`. `.env*` gitignored (credenciales NO subidas). Sin cambios pendientes en el working tree (limpio).

## Instrucciones para la próxima sesión

1. **Prioridad 1**: resolver la conexión runtime de la API a Neon (pasos de diagnóstico arriba) y validar login + overview + detalle + AI review con datos reales.
2. **Prioridad 2**: deploy a Vercel (necesitar Project ID/Org ID o `vercel link`) y decidir hosting del backend.
3. Seguir el roadmap (Playwright, tests de integración, Graphify, docs API).
4. Toda la metodología, UI, mensajes, commits y docs en español.