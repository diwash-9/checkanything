# Architecture Decision Records (ADRs)

Append-only log of significant decisions. **Never edit a past ADR** — if a decision
changes, add a new one that supersedes it and mark the old one `Superseded by ADR-XXX`.

Format: **Context → Decision → Consequences → Status.**

Status values: `Proposed`, `Accepted`, `Superseded`, `Deprecated`.

---

## ADR-001 — Adopt TypeScript

**Date:** 2026-10-16 · **Status:** Accepted

**Context.** The app started in plain JavaScript. It will soon hold a large registry of
units and conversion factors where a typo or wrong type has real-world consequences
(a wrong land or currency conversion misleads users).

**Decision.** Migrate to TypeScript with `strict: true`. Keep `.tsx` for components,
`.ts` for the domain and data layers.

**Consequences.**

- (+) Compile-time safety for unit/factor definitions; better editor support and
  refactors; self-documenting types.
- (+) Enables discriminated unions for unit kinds (linear vs affine).
- (−) Small learning overhead; build config must be updated (eslint/tsconfig).
- Mitigation: migrate incrementally, strict from the start for new/changed files.

---

## ADR-002 — Hybrid data: static tables + live API

**Date:** 2026-10-16 · **Status:** Accepted

**Context.** Most units are fixed physical/customary definitions; currency rates change
constantly. Some sources suggested going fully offline or fully API-driven.

**Decision.** Static conversion factors live in typed local tables under
`domain/units/categories/*`. Only currency uses a runtime provider (FX API with caching
and fallback).

**Consequences.**

- (+) Zero network cost and full reliability for the vast majority of categories.
- (+) Nepali customary units (which no single API provides) are first-class.
- (−) Static tables must be maintained and tested; only currency is "live".
- Mitigation: source every factor and unit-test it (see CONVERSION-DATA.md).

---

## ADR-003 — Conversion through a category base unit

**Date:** 2026-10-16 · **Status:** Accepted

**Context.** Pairwise factors for every unit combination grow O(n²) and are error-prone.

**Decision.** Define one base unit per category (e.g. metre for length). Convert
`value → base → target`. Represent non-linear units (temperature) as affine
`toBase`/`fromBase` functions rather than factors.

**Consequences.**

- (+) O(n) data, simple and uniform engine, easy to add units.
- (+) Handles temperature correctly (0 °C ≠ 0 K).
- (−) Slight indirection vs a direct factor; negligible cost.
- Note: currency supplies its factors at call time from the rate table; the engine is
  unchanged.

---

## ADR-004 — Prerender/SSG for SEO (framework choice TBD)

**Date:** 2026-10-16 · **Status:** Proposed

**Context.** SEO is a primary goal, but the app is a client-rendered Vite SPA. Search
engines and social previews need real HTML for `/`, category, and pair pages.

**Options.**

1. **Stay on Vite + static prerender** (`vite-react-ssg`, `vite-plugin-ssr`/Vike, or a
   custom prerender step). Least churn; keeps the current stack.
2. **Migrate to Next.js (App Router)** on Vercel. Best-in-class SSR/SSG, but a larger
   rewrite and more framework to learn.
3. **Astro + React islands.** Excellent content/SEO with minimal JS, but another
   migration and less "pure React" for learning.

**Decision (proposed).** Adopt option 1 first: keep the Vite SPA, add a build-time
prerender step for content routes, and revisit Next.js if content/i18n complexity grows.
Decide before Phase 4 ships.

**Consequences.**

- (+) Fast path to crawlable pages with minimal disruption.
- (−) Custom prerender is less ergonomic than a framework; may hit limits later.
- Revisit trigger: > ~500 content pages, or a need for per-request SSR/dynamic OG images.

---

## ADR-005 — Numeric precision: IEEE-754 `number`, format at the edges

**Date:** 2026-10-16 · **Status:** Accepted

**Context.** Floating point can produce `0.30000000000000004`. Financial and land
conversions need to look correct and be auditable.

**Decision.** Compute with native `number` (double precision). Never round mid-
calculation; round only for display with per-category significant-figure rules. Treat
currency like other categories but with money-appropriate decimals.

**Consequences.**

- (+) Simple, fast, dependency-free; adequate precision for display-scale values.
- (−) Not arbitrary-precision. If exact decimal money math becomes a requirement,
  revisit with `decimal.js`/`big.js` (new ADR).
- Mitigation: known-value tests; avoid accumulating operations.

---

## ADR-006 — No global state library (yet)

**Date:** 2026-10-16 · **Status:** Accepted

**Context.** It's tempting to reach for Redux/Zustand early.

**Decision.** Use the **URL as the source of truth** for category/pair/value, React
state for transient UI, and `localStorage` for persistence (history, favourites, theme).
Introduce a store only when a concrete need appears.

**Consequences.**

- (+) Fewer dependencies, shareable/back-button-correct state for free.
- (−) May refactor if cross-cutting client state grows a lot.
- Revisit trigger: complex multi-step flows or heavy shared client state.

---

## ADR-007 — Never expose the FX API key in the client

**Date:** 2026-10-16 · **Status:** Accepted

**Context.** The current hook hardcodes the exchangerate-api key in client code, so it
is shipped to every visitor and must be considered compromised.

**Decision.** Move rate fetching behind a Vercel serverless function (`/api/rates`). The
key lives only in server-side env vars (`FX_API_KEY`). The client calls our endpoint.
Rotate the leaked key.

**Consequences.**

- (+) Secret stays server-side; enables caching and rate limiting.
- (−) Requires a serverless function and env config on Vercel.
- Action: **rotate the existing key immediately.**
