# Agent Context — CheckAnything

Orientation for AI coding agents (and humans) working in this repo. **Read this first,
then the docs it points to.**

## What this is

**CheckAnything** (`checkanything.vercel.app`) — a universal unit converter. Started as
a React currency converter; now expanding to convert anything to anything, with Nepali
customary land units (bigha/kattha/dhur, ropani/aana/paisa/daam) as a first-class,
sourced feature.

## Before you write code

1. Read [`docs/CONTEXT.md`](./docs/CONTEXT.md) for vision, scope, and glossary.
2. Read [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for the engine and structure.
3. Read [`docs/CONVENTIONS.md`](./docs/CONVENTIONS.md) for style and workflow.
4. Check [`docs/ROADMAP.md`](./docs/ROADMAP.md) for what phase we're in.
5. For any conversion factor, read [`docs/CONVERSION-DATA.md`](./docs/CONVERSION-DATA.md) —
   **factors must be sourced and tested.**

## Hard rules

- 🚫 **Never commit or push without the owner's explicit approval.** This is a standing
  project rule from the owner.
- 🚫 **Never hardcode secrets/API keys** in client code. The FX key goes in a server-side
  env var (`FX_API_KEY`) behind `/api/rates`. The previously committed key is
  compromised and must be rotated (ADR-007).
- 🚫 **No unsourced conversion factors.** Every factor needs a citation in
  `CONVERSION-DATA.md` and a test asserting a known value.
- 🚫 **Do not ship unverified units.** Rows flagged ⚠️ in `CONVERSION-DATA.md` (e.g.
  traditional mass units) must stay out until sourced.
- ✅ **Domain layer stays pure** (`src/domain/`): no React, no `fetch`, no side effects.
- ✅ **Adding a unit/category must not require UI changes** — it's data in the registry.
- ✅ Keep docs and code in sync in the same change.

## Stack & commands

React 19 · Vite 6 · TypeScript (strict, in progress) · Tailwind v4 · React Router ·
Vitest · Vercel.

```bash
npm run dev      # dev server
npm run build    # production build
npm run lint     # eslint
npm test         # vitest (once added)
```

## Key concepts

- **Category** → a dimension (Length, Currency, Land). One **base unit** each.
- **Unit** → linear (`factor` to base) or affine (`toBase`/`fromBase`, e.g. temperature).
- **convert(value, from, to, ctx)** → `value → base → target`. Currency factors come from
  a runtime rate table.
- **Pair** → a from→to conversion; SEO pages are built per pair (`/length/km-to-mi`).

## Current focus

**Phase 0 — Foundation is complete.** Next is **Phase 1 — Universal converter core**:
add static categories (length, mass, volume, temperature, area) as data in
`src/domain/units/categories/`, plus global search. See the roadmap.

## Where things live

- Domain / engine / units → `src/domain/`
- Currency data + rate client → `src/data/currency/`
- Feature hooks → `src/features/converter/`
- UI → `src/components/` + `src/pages/`
- Server FX proxy → `server/` + `api/`
- Project docs → `docs/`

## Verify before finishing

```bash
npm run typecheck && npm run lint && npm test && npm run build
```
