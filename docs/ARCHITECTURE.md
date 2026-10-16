# Architecture

How CheckAnything is built and why. For the reasoning behind individual choices, see
[DECISIONS.md](./DECISIONS.md) (ADRs).

---

## 1. Overview

A **single-page React app** that is _data-driven_: all conversion knowledge lives in a
unit registry, and the UI renders whatever the registry contains. Adding a unit or a
whole category is a data change, not a UI rewrite.

```text
                 ┌──────────────────────────────────────────────┐
                 │                   UI layer                    │
                 │  pages/  ─ routes: /, /:category, /:pair      │
                 │  components/ (ui kit, converter shell)        │
                 └───────────────┬──────────────────────────────┘
                                 │ reads
                 ┌───────────────▼──────────────────────────────┐
                 │              domain layer (pure)              │
                 │  units/ registry  →  convert()  →  format()   │
                 │  no React, no fetch, fully unit-tested        │
                 └───────────────┬──────────────────────────────┘
                    factors │            │ rates (currency only)
                 ┌──────────▼───┐   ┌────▼──────────────────────┐
                 │ static data  │   │ runtime providers         │
                 │ (TS tables)  │   │ FX API + cache + fallback │
                 └──────────────┘   └───────────────────────────┘
```

**The golden rule:** the `domain` layer is pure TypeScript with no React or network
dependencies. It can be tested and reasoned about in isolation.

---

## 2. Stack

| Concern         | Choice                                             | Why                                                           |
| --------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| UI library      | **React 19**                                       | Already in use; learning goal.                                |
| Build tool      | **Vite 6**                                         | Already in use; fast HMR.                                     |
| Language        | **TypeScript** (strict)                            | Type-safe unit definitions; catches factor/typo errors.       |
| Styling         | **Tailwind CSS v4**                                | Already in use; utility-first, small output.                  |
| Routing         | **React Router**                                   | Standard; enables category/pair pages.                        |
| State           | React state + a tiny store; URL as source of truth | Avoid heavy state libs early.                                 |
| Data fetching   | `fetch` + a small cache (TanStack Query optional)  | FX rates only.                                                |
| Validation      | Zod _(optional)_                                   | Validate URL params and API responses.                        |
| Forms           | none needed                                        | Type-to-convert, no form submission.                          |
| Testing         | **Vitest** + React Testing Library                 | Fast, Vite-native.                                            |
| Rendering (SEO) | Prerender/SSG — see **ADR-004**                    | Category/pair pages must be crawlable.                        |
| Deploy          | **Vercel**                                         | Free, preview deploys, serverless functions for the FX proxy. |

Rationale for TypeScript is recorded in ADR-001; hybrid data in ADR-002.

---

## 3. Folder structure

Current layout (Phase 0). Files marked _(planned)_ arrive in later phases.

```text
api/
└── rates.ts                    # Vercel serverless function (GET /api/rates)
server/
├── rates.ts                    # server-side provider chain + fetchRates()
└── vitePlugin.ts               # emulates /api/rates during `vite dev`
src/
├── app/
│   ├── App.tsx                 # route tree
│   └── main.tsx                # React root + BrowserRouter
├── pages/
│   ├── HomePage.tsx            # hero + featured converter + categories
│   ├── CategoryPage.tsx        # /:category
│   ├── PairPage.tsx            # /:category/:from-to
│   └── NotFoundPage.tsx
├── components/
│   ├── ui/                     # Button, Input, Select, Card, Result
│   ├── layout/                 # Header, Footer, Container, Layout
│   └── converter/              # Converter, UnitField, SwapButton, RateHint
├── features/
│   └── converter/
│       ├── useConversion.ts    # binds slugs/state ↔ domain convert()
│       ├── useCurrencyRates.ts # fetch + cache + stale fallback
│       ├── currencyUnits.ts    # build selectable units from a rate table
│       └── converterUrl.ts     # parse/build /pair?value=
├── domain/                     # PURE. No React. No fetch.
│   ├── units/
│   │   ├── types.ts            # Unit, LinearUnit, AffineUnit, Category
│   │   ├── registry.ts         # category index + unit/slug lookups
│   │   ├── search.ts           # *(planned)* find unit/category by name/alias
│   │   └── categories/
│   │       └── currency.ts     # registers currency (dynamic) category
│   │                           # *(planned: length, mass, area, nepal-land, …)*
│   ├── convert.ts              # convert(value, from, to, ctx)
│   ├── precision.ts            # sig-figs / rounding rules
│   └── format.ts               # number + unit formatting
├── data/
│   └── currency/
│       ├── currencies.ts       # code, name, symbol, decimals (metadata)
│       ├── rates.ts            # client fetch + cache + factor builder
│       └── types.ts            # shared RatesPayload (client + server)
├── config/
│   └── site.ts                 # name, domain, description, author
├── lib/
│   └── time.ts                 # relative-time formatting
├── styles/
│   └── index.css               # Tailwind entry
├── test/
│   └── setup.ts                # Vitest + jest-dom setup
└── vite-env.d.ts
public/
└── favicon.svg                 # *(planned: robots.txt, sitemap.xml)*
```

Tests are colocated as `*.test.ts(x)` next to the code they cover.

---

## 4. Domain model

### 4.1 Types (illustrative)

```ts
export type UnitId = string; // globally unique, e.g. "length.metre", "land.bigha"
export type CategoryId = string; // e.g. "length", "currency", "nepal-land"

/** A unit whose base-value is value * factor. */
export interface LinearUnit {
  id: UnitId;
  kind: "linear";
  name: string; // canonical display name
  symbol: string; // "m", "bigha", "रोपनी"
  aliases?: string[]; // for search: ["meter", "metre", "meters"]
  factor: number; // value_in_base = value * factor
  system?: "metric" | "imperial" | "us" | "nepali" | "other";
  defaultDecimals?: number;
  note?: string; // shown in UI, e.g. "Terai region"
  source?: string; // citation key → CONVERSION-DATA.md
}

/** Base value is affine — required for temperature. */
export interface AffineUnit {
  id: UnitId;
  kind: "affine";
  name: string;
  symbol: string;
  aliases?: string[];
  toBase(v: number): number;
  fromBase(v: number): number;
  system?: string;
  defaultDecimals?: number;
  source?: string;
}

export type Unit = LinearUnit | AffineUnit;

export interface Category {
  id: CategoryId;
  name: string; // "Length"
  baseUnitId: UnitId; // e.g. "length.metre"
  units: Unit[];
  /** currency is special: factors come from a runtime rate table. */
  dynamic?: "currency";
  defaults?: { from: UnitId; to: UnitId };
}
```

### 4.2 Conversion engine (`convert.ts`)

```ts
interface ConvertContext {
  rates?: Record<string, number>; // currency: unitId → factor to base currency
}

export function convert(
  value: number,
  from: Unit,
  to: Unit,
  ctx: ConvertContext = {},
): number {
  const toBase = resolveToBase(from, ctx);
  const fromBase = resolveFromBase(to, ctx);
  return fromBase(toBase(value));
}
```

Key rules:

1. **Everything goes through the category base unit.** `value → base → target`.
   This keeps the engine O(1) and the data O(n) instead of O(n²) pairwise factors.
2. **Linear vs affine.** Linear units are a single multiply; temperature uses
   `toBase`/`fromBase` functions because 0 °C ≠ 0 K.
3. **Currency is dynamic.** Its unit factors are supplied at call time from the rate
   table (relative to a base currency), not hardcoded. The engine is unchanged; only
   the factor source differs.
4. **Full precision internally; round only for display.** Never round mid-calculation.
5. **Same-unit shortcut** returns the input unchanged.

### 4.3 Precision & formatting (`precision.ts`, `format.ts`)

- Internally use `number` (IEEE-754 double). Document the precision limits (ADR-005).
- Display: choose decimals so the result keeps **~6–10 significant figures** without
  showing floating-point noise (avoid `0.30000000000000004`).
- Per-category defaults (e.g. currency → 2–4 dp; land → 2–4 dp; length → adaptive).
- Optional exact-fraction handling for inherently exact factors (e.g. `1 in = 0.0254 m`).
- Respect locale for separators; keep a canonical copy value unformatted.

---

## 5. Data layer

### 5.1 Static data (most categories)

Plain TypeScript tables under `domain/units/categories/*`. Type-checked at build; no
network. This is the **single source of truth** for factors, and each entry carries a
`source` key that maps to a citation in [CONVERSION-DATA.md](./CONVERSION-DATA.md).

### 5.2 Currency (dynamic)

- Provider abstraction in `data/currency/rates.ts`:
  `getRates(base) → { base, rates, fetchedAt, source }`.
- **Cache** in memory + `localStorage` with a TTL (target 1–6h).
- **Stale-while-revalidate**: show cached instantly, refresh in background.
- **Fallback chain**: primary API → secondary API (e.g. Frankfurter, which needs no
  key) → NRB daily rates (for NPR) → last cached value with a visible "as of" badge.
- **Never** fetch on every keystroke; fetch on base change / TTL expiry.

### 5.3 Where the API key lives (important) — **implemented**

The app originally hardcoded the exchangerate-api key in client code, so it shipped to
every visitor and must be treated as **compromised**. That is now fixed.

```text
Browser ──GET /api/rates?base=USD──▶ Vercel function (api/rates.ts) ──▶ provider chain
     ▲                                         │
     └── dev: server/vitePlugin.ts emulates ───┘   (holds FX_API_KEY in env)
```

- Key read from the server-side env var `FX_API_KEY`, never in the bundle.
- Client calls our own `/api/rates` (`src/data/currency/rates.ts`); responses are cached
  in `localStorage` (1h TTL) with stale fallback.
- Provider chain (`server/rates.ts`): exchangerate-api (if key set) → keyless
  `open.er-api.com` fallback. Local dev works without a key.
- `.env.example` documents variables; real values live only in Vercel/local `.env`.
- ⚠️ **Action item:** rotate the previously committed key in the provider dashboard.

---

## 6. Routing & URL scheme

| Route                 | Page     | Purpose                                           |
| --------------------- | -------- | ------------------------------------------------- |
| `/`                   | Home     | Hero, category grid, popular pairs.               |
| `/:category`          | Category | e.g. `/length`, `/currency`, `/land`.             |
| `/:category/:from-to` | Pair     | e.g. `/length/km-to-mi`, `/land/bigha-to-ropani`. |

- **Canonical pair slugs** use unit _ids_/symbols: `km-to-mi`, `usd-to-npr`,
  `bigha-to-ropani`.
- **Aliases/redirects:** `/kg-to-lbs` → `/mass/kilogram-to-pound` (301), so common
  search terms resolve to one canonical page.
- **Value in query, not path:** `?value=5` so the same page can pre-fill and be shared
  without creating infinite indexable URLs.
- Unknown category/unit → `NotFoundPage` (HTTP 404, not a soft 404).

---

## 7. State management

- **URL is the primary state** for category/pair/value → shareable, back-button correct.
- Local UI state via `useState` (input focus, dropdown open).
- Persisted state via `localStorage` (history, favourites, theme, precision pref).
- No Redux/Zustand until there's a proven need (ADR-006).
- The `useConversion` hook bridges URL ↔ domain: parse params → look up units →
  `convert()` → format.

---

## 8. Error handling

| Case                                  | Behaviour                                           |
| ------------------------------------- | --------------------------------------------------- |
| Non-numeric input                     | Inline hint; keep last valid result.                |
| Unknown unit/category                 | 404 page / "unknown unit" message.                  |
| FX fetch failure                      | Fall back to cache; show stale badge + timestamp.   |
| No rates at all (first visit offline) | Disable currency, show clear message.               |
| Divide-by-zero / overflow             | Return guarded value, never `Infinity`/`NaN` in UI. |

Central `Result`-style type (`Ok | Err`) for the data layer; UI maps errors to copy.

---

## 9. Performance

- Static categories = 0 network; only currency hits the network.
- Route-level code splitting; lazy-load category data.
- Tailwind purges unused CSS; keep the JS bundle small (target < 150 KB gzip initial).
- Debounce display formatting only; compute is cheap.
- Memoize rate lookups and unit registries.
- Budget: LCP < 2.5s, CLS < 0.1, INP < 200ms on mid-tier mobile.

---

## 10. Accessibility

- Semantic landmarks (`header`, `main`, `footer`, `nav`).
- Every input/select labelled; results in an `aria-live="polite"` region.
- Full keyboard operability; visible focus rings; `prefers-reduced-motion` respected.
- Colour contrast ≥ 4.5:1 in both themes.

---

## 11. Testing strategy

| Layer         | What                                                                           | Tool         |
| ------------- | ------------------------------------------------------------------------------ | ------------ |
| Domain        | Every category: known-value conversions, round-trips, edge cases, affine temps | Vitest       |
| Data          | FX client: cache, TTL, fallback chain (mocked fetch)                           | Vitest + msw |
| URL           | Pair parsing/building, aliases/redirects                                       | Vitest       |
| Component     | Converter shell interaction (type → result, swap)                              | RTL          |
| E2E _(later)_ | Popular pair pages render + convert                                            | Playwright   |

**Non-negotiable:** every Nepali land pair has a test asserting the exact standard
value from [CONVERSION-DATA.md](./CONVERSION-DATA.md).

---

## 12. Deployment

- **Vercel**, project root = repo root, `main` → production, PRs → preview URLs.
- Build: `vite build` (+ prerender step once ADR-004 lands).
- Env vars: `FX_API_KEY`, provider base URLs; set in Vercel dashboard.
- `robots.txt` + generated `sitemap.xml` shipped in `public/`.
- Custom domain target: `checkanything.vercel.app` (already provisioned).

---

## 13. Security & privacy

- No secrets in the client bundle (see §5.3). Rotate the leaked key now.
- Validate/whitelist URL params; never `eval` user input.
- Serverless proxy adds its own caching + basic rate limiting later.
- No third-party tracking by default; if analytics, prefer privacy-friendly and
  disclose it.
- Only store non-sensitive prefs in `localStorage`.
