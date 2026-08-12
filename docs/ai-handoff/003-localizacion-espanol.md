# 003 — Localización a Español (Landing)

## Objetivo

Pasar todo el frontend visible de la landing a español, manteniendo la identidad visual "diagnostic specification" intacta y la navegación funcional.

## Realizado

- `layout.tsx`: `lang="es"`, metadata en español.
- `navbar.tsx`: enlaces `ESCANEAR / INFORME / CORREGIR / VERIFICAR` con anclas `#escanear / #informe / #corregir / #verificar`; botones "Iniciar sesión" y "Comenzar análisis"; `aria-label` en español.
- `hero.tsx`: eyebrow `DEVPILOT — INSPECCIÓN DE CÓDIGO CON IA`, titular "Tu código, inspeccionado con precisión", copy y CTAs en español.
- `solution.tsx`: sección "EL BUCLE", pasos `ESCANEAR/INFORME/CORREGIR/VERIFICAR`, anclas idempotentes con los enlaces del navbar.
- `code-panel.tsx`: chips de severidad `OK / HALLAZGO / ADVERTENCIA`, captions y literales de código legibles en español (identificadores de código intactos).
- Secciones: `trust` (stacks), `problem` (id `#problema`), `features` (id `#capacidades`), `how-it-works` (id `#como-funciona`), `ai-capabilities` (id `#ia`, "IA CONTEXTUAL", código demo y pruebas en español), `security` (id `#seguridad`, "SEGURIDAD"), `workflow` ("FLUJO DE DESARROLLO", panels antes/después), `cta`, `footer` (Producto/Recursos/Empresa/Legal, tagline en español).
- IDs de anclas renombrados a español (sin conflictos con el HTML).

## Archivos clave

- `apps/web/src/app/{layout,page}.tsx`
- `apps/web/src/components/{navbar,hero,code-panel}.tsx`
- `apps/web/src/components/sections/{trust,problem,solution,features,how-it-works,ai-capabilities,security,workflow,cta,footer}.tsx`

## Cambios

- Todo texto visible al usuario en español. Identificadores de código JavaScript inline se mantienen en inglés (son código, no UI).

## Decisiones

- Se traducen las etiquetas técnicas de severidad (PASS→OK, FIND→HALLAZGO, WARN→ADVERTENCIA) para cumplir "todo en español".
- Los anclajes se traducen también para consistencia total del producto (el usuario pidió español completo).
- No se tocó identidad/estilos; solo contenido (regla: no sobrescribir sin análisis).

## Problemas / Soluciones

- Prettier había reformateado archivos y un bloque de `hero.tsx` quedó duplicado → se reescribió el archivo completo y se verificó contenido servido.
- Prettier no puede parsear directivas `@theme`/`@utility` de Tailwind v4 en `globals.css` (warning esperado, no es un defecto).

## Tests / Validación

- `npm run lint` y `npm run typecheck`: exit 0.
- `npm run build`: exit 0 (web + api).
- Verificación en HTML servido (dev server, HTTP 200): textos en español presentes, textos en inglés ausentes.

## Pendientes

- Partes 2-10 del master prompt no entregadas; requeridas para validar cumplimiento total.
- Dashboard (Fase 3), modelo de datos, auth, credenciales Neon/Vercel.

## Siguiente tarea sugerida

Fase 3 — dashboard shell con identidad dark de instrumento (aplicar clase `.dark` al `<html>`), o modelo de datos Prisma si se prioriza backend.

## Contexto para otra IA

- Identidad: spec sheet light (landing) / instrumento dark (app). Acentos semánticos teal=ok / amber=hallazgo.
- Reusa: Container, Eyebrow, Button, SectionHeading, CodePanel, cn (twMerge last-wins).
- Tokens solo en globals.css; componentes jamás hex. `text-text` y `text-text-muted` son utilidades válidas.
- Dark: añadir clase `dark` al `<html>` para activar tokens (fase dashboard).
- Anclas actuales: `#escanear #informe #corregir #verificar #problema #capacidades #como-funciona #ia #seguridad #flujo-de-trabajo`.
- CTA en fondo ink necesita overrides con className (twMerge los resuelve).
- No hay credenciales reales; pedir al usuario antes de conectar servicios.