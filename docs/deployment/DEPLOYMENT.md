# DevPilot — Deployment

## Target platform (real)

| Layer | Platform | URL |
|---|---|---|
| Frontend (apps/web) | Vercel (Next.js 15) | https://devpilot-web-bay.vercel.app |
| Backend (apps/api) | Vercel (Express serverless, preset Express) | https://devpilot-api.vercel.app |
| Database | Neon PostgreSQL (rama main) | URL directa en `apps/api/.env` (gitignored) |

> **Nota de URL**: el nombre `devpilot-web.vercel.app` ya estaba ocupado; Vercel asignó
> `devpilot-web-bay.vercel.app`. `CORS_ORIGIN` en el API y `NEXT_PUBLIC_API_URL` en el web
> apuntan a los dominios reales.

## Cómo se desplegó

Dos proyectos Vercel independientes bajo la org `barbox` (cuenta `barbox11`):

1. **API** (`barbox/devpilot-api`): preset **Express**, `rootDirectory` = `apps/api`.
   - Vercel detecta la app Express automáticamente desde `src/app.ts` y genera una función
     Node que sirve **todas** las rutas (`/(.*) -> /`). El `api/index.ts` que se intentó
     agregar provocaba que Vercel reservara el namespace `/api/*` con 404 y se eliminó
     (el preset Express no lo necesita).
   - `vercel.json` en `apps/api` fija `buildCommand: npx prisma generate` (genera el client
     antes de empaquetar la función).
   - Env producción: `DATABASE_URL` (directa, `?sslmode=require`, sin pooler ni
     `channel_binding`) y `CORS_ORIGIN` = URL del web.
2. **Web** (`barbox/devpilot-web`): preset **Next.js**, `rootDirectory` = `apps/web`.
   - Env producción: `NEXT_PUBLIC_API_URL` = https://devpilot-api.vercel.app (se hornea en
     el bundle en build time).

Despliegues: `vercel link --project <nombre> --yes` y `vercel deploy --prod --yes` desde
cada app. Los archivos `.vercel/project.json`, `.env.local` y `auth.json` del CLI quedan
gitignored (no subir credenciales).

## Backend on Vercel — decisión

- La API Express es stateless y REST: se sirve como función serverless de Node (preset
  Express de Vercel), lo que cumple el plan de `DEPLOYMENT.md`.
- **No usar el directorio `api/`**: Vercel reserva `/api/*` para funciones por archivo y
  genera un 404 de plataforma para el resto, pisando la app Express montada en `/api`.
- Prisma: se usa la URL **directa** de Neon (la pooled con `channel_binding` no la alcanza
  el query engine; ver ai-handoff 006). En serverless el client se genera en build
  (`npx prisma generate`).
- Si en el futuro se necesitan websockets/jobs largos, mover la API a un host Node dedicado.

## Environments

Cada proyecto tiene variables por entorno (production usado; preview/development opcionales):

| Variable | Proyecto | Valor (producción) |
|---|---|---|
| `DATABASE_URL` | api | URL directa Neon (gitignored) |
| `CORS_ORIGIN` | api | https://devpilot-web-bay.vercel.app (soporta lista separada por comas) |
| `NEXT_PUBLIC_API_URL` | web | https://devpilot-api.vercel.app |

## Flujo de despliegue

```
LOCAL -> TEST -> GIT -> GITHUB -> VERCEL (deploy manual desde CLI o CI)
```

Para un nuevo deploy:

```bash
cd apps/api && vercel deploy --prod --yes
cd apps/web && vercel deploy --prod --yes
```

## Database branches (Neon)

| Environment | Neon branch |
|---|---|
| development | `dev` |
| testing | `test` |
| production | `main` (usada hoy; rama por defecto del proyecto) |

Migrations: `npm run prisma:migrate` desde `apps/api` contra la rama correspondiente.

## Status

Producción validada (login demo, overview 3/4/3/78, detalle, AI review, CORS) y luego, por
decisión de seguridad, se **eliminaron los usuarios demo de la Neon de producción** y el seed
quedó sin credenciales (opcional por entorno `SEED_DEMO_EMAIL`/`SEED_DEMO_PASSWORD`).
Pendiente: CI/CD automático, preview branches y dominio custom.