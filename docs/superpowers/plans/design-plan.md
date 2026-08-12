# DevPilot — Phase 2 Design System & Identity Plan

Goal: distinctive "diagnostic specification" identity — tokens, fonts, and the full landing page in apps/web.

## Design direction (verbatim — implementers must follow exactly)

DevPilot inspects code like a precision instrument; the landing reads as a technical **specification document** (drafting paper, hairline rules, faint blueprint grid). Two semantic accents everywhere: **teal = pass/healthy**, **amber = finding/warning**. Mono technical eyebrows label each section with the real product sequence: `SCAN`, `REPORT`, `FIX`, `VERIFY`. Signature element: an **annotated code inspection panel** (fake code block with severity annotations + sweeping scan line) used in the hero.

Forbidden (from master prompt Part 3 + frontend-design): purple/blue gradients, generic dark+acid-green, bento boxes with 24px radius, excessive shadows, glassmorphism, numbered 01/02/03 markers, emoji icons, stock AI-credit "stat cards" clichés.

## Global constraints

- TypeScript strict, Next 15 App Router, Tailwind v4 (CSS-first with `@theme`/custom properties in `src/app/globals.css`).
- No code comments. No secrets. Use SVG icons only (inline, no icon lib dependency yet).
- Accessible: keyboard focus visible, semantic HTML, ARIA where needed, `prefers-reduced-motion` respected, responsive 375/768/1024/1440.
- Buttons/links `cursor-pointer`, hover transitions 150–300ms, no layout shift on hover.
- Fonts: JetBrains Mono + IBM Plex Sans via `next/font/google` (self-hosted). Never raw hex in components — always `var(--…)` or Tailwind theme tokens.

## Task 1 — Design tokens, fonts, global styles, layout

Rewrite `apps/web/src/app/globals.css`: full CSS custom-property token set (light theme now; dark theme tokens defined but applied in dashboard phase), body/link/focus styles, selection color, blueprint-grid utility, Tailwind `@theme` mapping so utilities like `bg-background text-foreground` resolve. Add `next/font/google` (JetBrains_Mono 400/500/600/700, IBM_Plex_Sans 400/500/600) in `layout.tsx`, wire to `--font-sans` / `--font-mono`, update metadata, keep placeholder page.

Exact tokens (verbatim):

```
Light (default, :root):
--color-bg: #FAFAF7
--color-surface: #FFFFFF
--color-surface-2: #F0F0E9
--color-text: #16161A
--color-text-muted: #5D5D66
--color-border: #DDDDCD
--color-grid-line: rgba(22,22,26,0.055)
--color-accent-pass: #0E9F8A
--color-accent-pass-soft: rgba(14,159,138,0.12)
--color-accent-finding: #C2650E
--color-accent-finding-soft: rgba(194,101,14,0.12)
--color-ink: #16161A
--color-on-ink: #FAFAF7

Dark (prefers-color-scheme / .dark, applied in dashboard phase):
--color-bg: #0B1020
--color-surface: #121830
--color-surface-2: #1A2338
--color-text: #E7ECF8
--color-text-muted: #93A0C0
--color-border: #232E4D
--color-grid-line: rgba(231,236,248,0.05)
--color-accent-pass: #2BB3A3
--color-accent-pass-soft: rgba(43,179,163,0.14)
--color-accent-finding: #F0A53C
--color-accent-finding-soft: rgba(240,165,60,0.14)
--color-ink: #E7ECF8
--color-on-ink: #0B1020

Radii: --radius-xs:4px --radius-sm:6px --radius-md:8px --radius-lg:12px
Shadows (minimal, paper): --shadow-sm: 0 1px 2px rgba(22,22,26,0.06)
  --shadow-md: 0 2px 8px rgba(22,22,26,0.08)
  --shadow-lg: 0 8px 24px rgba(22,22,26,0.10)
Spacing: 4/8/12/16/24/32/48/64/96 (rem-based 8px base)
Fonts: --font-sans: IBM Plex Sans; --font-mono: JetBrains Mono
```

## Task 2 — Components + Navbar + Hero (signature panel)

Create reusable components in `apps/web/src/components/`:

- `Eyebrow.tsx` — mono uppercase technical label with leading marker (e.g. `SCAN`), takes `children`, size sm, tracking wide, color text-muted.
- `Button.tsx` — variants `primary` (ink bg, on-ink text, md radius) and `ghost`/`outline` (border hairline). 44px min touch target, focus-visible ring, hover 150–300ms.
- `SectionHeading.tsx` — eyebrow + title (mono, large) + lead paragraph.
- `CodePanel.tsx` — the signature: fake code block (mono, small, hairline border, subtle grid bg), header bar with traffic dots + filename + status chip, syntax-ish coloring via muted tones, and **severity annotations** (teal `PASS` / amber `FIND` / amber `WARN` gutter tags) + an absolutely-positioned scan line that animates top→bottom (respect reduced-motion; loop subtle).
- `Container.tsx` — max-width wrapper (1120px) + padding.

Then `Navbar` (sticky, hairline bottom border, paper bg with slight blur; logo = square mono "DP" mark + "DevPilot" wordmark; links SCAN/REPORT/FIX/VERIFY anchors; "Sign in" ghost + "Start analyzing" primary; mobile: hamburger → simple panel) and `Hero` (eyebrow "DEVPILOT — AI CODE INSPECTION", giant mono display headline e.g. "Your code, inspected with precision.", sub copy, primary CTA "Start analyzing a project" + secondary "See how it works", and the CodePanel as the product visual with a small mono caption strip e.g. `analyzing: auth.ts · 3 findings · 1 pass`).

Both responsive and accessible.

## Task 3 — Landing sections + Footer + page assembly

Build the remaining sections in `apps/web/src/app/` (as page.tsx composition or components):

- Trust: mono strip of logos/metrics (no real logos — styled text marks, e.g. `TypeScript`, `Next.js`, `React`, `Node`, `PostgreSQL`) with caption "Built for modern stacks".
- Problem: two-column, hairline-divided; headline about silent failures (unreviewed code, missed vulnerabilities, cargo-cult coverage) — precise, not salesy copy.
- Solution: how DevPilot closes the loop (Scan → Report → Fix → Verify) as a horizontal process strip (this is a REAL sequence, so step markers are justified; use mono tags, not 01/02/03).
- Features: grid (2–4 cols responsive) of 6 features with inline SVG icon + mono label + description: Project analysis, Vulnerability detection, Security review, Test generation, Architecture review, Documentation.
- How it works: numbered real steps (connect repo → run analysis → read report → apply fixes) with hairline list rows.
- AI capabilities: highlight contextual AI (explains why an issue matters, suggests fix, generates test) — avoid chatbot cliché; show a small "AI recommendation" card.
- Security: reassurance section (secrets never stored, encrypted, isolated analyses, access control) with check-style list (SVG).
- Developer workflow: code-panel themed row showing before/after or issue→fix.
- CTA: final band, ink background, mono headline, two buttons.
- Footer: hairline top, columns (Product, Resources, Company, Legal placeholders), copyright, mono tagline.

Assemble all into `page.tsx`. Keep sections as separate components in `apps/web/src/components/sections/` for maintainability. No generic dividers; use hairline borders + section eyebrows.

## Out of scope

Dashboard, auth, dark theme application, backend work, testing infra.
