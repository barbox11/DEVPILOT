# Page Override — Landing (DevPilot)

This page overrides MASTER.md. Identity: **"Diagnostic specification"** — DevPilot inspects code like a precision instrument; the landing reads as a technical spec document.

## DO NOT (MASTER.md defaults rejected)

- Dark OLED style / `#0F172A` bg / `#22C55E` acid-green accent / Inter-only
- Gradients, glassmorphism, 24px-radius bento cards, heavy shadows, `01/02/03` markers, emoji icons, "stat card" AI clichés

## Palette (light spec sheet — verbatim)

- Background `#FAFAF7` paper · Surface `#FFFFFF` · Surface-2 `#F0F0E9`
- Text `#16161A` ink · Muted `#5D5D66` · Border/hairline `#DDDDCD`
- Grid line `rgba(22,22,26,0.055)` (blueprint grid, 32px)
- Pass accent `#0E9F8A` (teal, healthy) · Finding accent `#C2650E` (amber, warnings)
- Ink buttons `#16161A` bg / `#FAFAF7` text
- Radii 4/6/8/12 · shadows minimal paper

## Typography

- Display + technical labels: **JetBrains Mono** (restraint)
- Body: **IBM Plex Sans**
- Section eyebrows: mono uppercase with leading marker, tracking wide, muted color. Real product sequence labels: `SCAN` `REPORT` `FIX` `VERIFY`.

## Signature

- **Annotated code inspection panel**: fake code block, mono, hairline border, subtle grid bg, severity gutter tags (teal `PASS` / amber `FIND` / `WARN`), animated scan line (reduced-motion off). Used in hero.

## Structure

Navbar → Hero(signature panel) → Trust → Problem → Solution(Scan→Report→Fix→Verify) → Features → How It Works → AI capabilities → Security → Developer workflow → CTA → Footer. Hairline rules + eyebrows as dividers.

## UX rules (from MASTER pre-delivery checklist, kept)

SVG icons only · cursor-pointer on clickables · 44px touch targets · focus-visible rings · 150-300ms hovers · `prefers-reduced-motion` · responsive 375/768/1024/1440 · contrast ≥4.5:1.
