# DevPilot API — Referencia de rutas

_Base URL local: `http://localhost:4000` · todos los endpoints bajo `/api`._

## Convenciones

- Respuestas JSON. Errores normalizados: `{ "error": { "message": "…" } }`.
- Auth: cabecera `Authorization: Bearer <token>` obtenida de `/auth/login` o `/auth/register`.
- Validación zod en body/params/query. Errores de validación → 400.
- API en ESM estricto (imports con `.js`).

## Públicas (sin auth)

### `GET /api/health`

Estado del servicio.

### `GET /api`

Información de la API.

## Auth

### `POST /api/auth/register`

Crea un usuario y devuelve una sesión.

Body: `{ name, email, password }` (password >= 8). → 201 `{ user, token }`. 409 si el email ya existe.

### `POST /api/auth/login`

Inicia sesión y devuelve una sesión nueva.

Body: `{ email, password }` → 200 `{ user, token }`. 401 si las credenciales no son válidas.

### `POST /api/auth/logout`

Auth. Invalida la sesión del token. → 200 `{ ok: true }`.

### `GET /api/auth/me`

Auth. Devuelve el usuario actual. → 200 `{ user: { id, email, name, role } }`.

## Dashboard

### `GET /api/overview`

Auth. Métricas agregadas del usuario.

→ 200:
```json
{
  "metrics": { "projects": 0, "completedAnalyses": 0, "openIssues": 0, "recommendations": 0, "avgHealth": null },
  "recentProjects": [],
  "recentActivity": []
}
```

## Proyectos

### `GET /api/projects`

Auth. Lista los proyectos del usuario (con `_count.analyses`). → 200 `{ projects }`.

### `POST /api/projects`

Auth. Crea un proyecto. → 201 `{ project }`.

Body: `{ name, repoUrl?, defaultBranch? }`.

### `GET /api/projects/:id`

Auth. Detalle del proyecto (con hasta 10 análisis y `_count`). → 200 `{ project }` · 404 si no existe o no es del usuario.

### `PATCH /api/projects/:id`

Auth. Actualiza `name`/`repoUrl`/`defaultBranch` (al menos uno). → 200 `{ project }` · 404.

### `DELETE /api/projects/:id`

Auth. Elimina el proyecto (cascada sobre análisis). → 200 `{ ok: true }` · 404.

## Análisis

### `GET /api/analyses`

Auth. Lista todos los análisis del usuario (con proyecto y `_count` de issues/recommendations). → 200 `{ analyses }`.

### `GET /api/analyses/project/:projectId`

Auth. Análisis de un proyecto. → 200 `{ analyses }` · 404 si el proyecto no es del usuario.

### `POST /api/analyses/project/:projectId`

Auth. Crea un análisis (PENDING). → 201 `{ analysis }` · 404.

Body: `{ branch?, commitSha? }`.

### `GET /api/analyses/:id`

Auth. Detalle con issues, recommendations y generatedTests. → 200 `{ analysis }` · 404.

## Issues

### `GET /api/issues`

Auth. Issues del usuario (máx. 100). Filtros opcionales por query: `?category=SECURITY&severity=HIGH` (valores de los enums `IssueCategory`/`Severity`). → 200 `{ issues }` (cada issue incluye `analysis.project`).

### `GET /api/issues/analysis/:analysisId`

Auth. Issues de un análisis concreto. → 200 `{ issues }`.

### `PATCH /api/issues/:id/status`

Auth. Cambia el estado. → 200 `{ issue }` · 404.

Body: `{ status: "OPEN" | "ACCEPTED" | "REJECTED" | "FIXED" }`.

## Recomendaciones

### `GET /api/recommendations`

Auth. Recomendaciones del usuario (con `analysis.project`). → 200 `{ recommendations }`.

### `GET /api/recommendations/analysis/:analysisId`

Auth. Recomendaciones de un análisis. → 200 `{ recommendations }`.

## Actividad

### `GET /api/activity`

Auth. Últimas 20 actividades del usuario. → 200 `{ activity }`.