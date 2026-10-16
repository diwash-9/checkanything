# Roadmap

Phased plan from the current MVP to a "one-for-all" converter. Each phase has a goal,
deliverables, and an exit criterion ("done when…"). Status legend in
[docs/README.md](./README.md).

> **Guiding rule:** ship vertical slices. A category is only "done" when it has data,
> UI, tests, and (from Phase 4) an indexable page.

---

## Phase 0 — Foundation ✅

**Goal:** Make the codebase ready to grow without turning into spaghetti.

Deliverables

- ✅ Write the `docs/` context set (this folder).
- ✅ Migrate the app to **TypeScript** (`strict` mode, `tsc -b` clean).
- ✅ Convert hardcoded conversion logic into a **pure conversion engine** with a unit
  registry (see [ARCHITECTURE.md](./ARCHITECTURE.md)).
- ✅ Add routing (`/`, `/:category`, `/:category/:pair`) with React Router.
- ✅ Establish a small UI component kit (`Input`, `Select`, `Button`, `Card`, `Result`).
- ✅ Set up tooling: Prettier, ESLint (flat config + TS), Vitest, `@` path alias.
- ✅ Move rate fetching behind a **server-side proxy** (`/api/rates` + Vite dev
  middleware); key read from `FX_API_KEY`, never bundled (ADR-007).
- ⚠️ **Rotate the previously committed key** — pending owner action (code no longer
  contains it).
- ✅ Add `.env.example`, update root `README.md`, add `AGENTS.md`.

**Done when:** the app builds in TS, renders the existing currency converter through the
new engine and routing, and `npm test` runs green with at least the currency-path tests.

**Status:** met. `npm run build`, `npm run lint`, `npm run typecheck` and `npm test`
(33 tests) all pass; the currency converter renders through the engine + router and the
dev `/api/rates` proxy serves live rates.

---

## Phase 1 — Universal converter core 🧭

**Goal:** The app converts any supported category, not just currency.

Deliverables

- Category switcher (tabs / nav) driven by the registry.
- Core categories with local data: **Length, Mass, Volume, Temperature, Area**.
- Currency preserved and improved (caching, fallback, base-currency choice).
- Type-to-convert, swap, precision control, copy-to-clipboard, result formatting.
- Shared converter shell reused by every category.
- Unit tests: known-value assertions for every category.

**Done when:** a user can convert length, mass, volume, temperature, area, and currency
from one consistent UI, all covered by tests.

---

## Phase 2 — Nepali land & customary units 🧭

**Goal:** The feature that makes CheckAnything _the_ converter for Nepal.

Deliverables

- **Land area** category with Terai and Hill systems:
  bigha ⇄ kattha ⇄ dhur and ropani ⇄ aana ⇄ paisa ⇄ daam, plus metric/imperial
  (m², sq ft, hectare, acre).
- Cross-system conversion (bigha ⇄ ropani) using the national standard.
- **Khetmuri** (25 ropani) and **kanwa** relationships.
- Explanatory content: what each unit means, where it's used, the standard's origin.
- Customary length (**kos**, **haath**, **dand**) and volume (**mana**, **pathi**,
  **muri**, **mutthi**) as secondary units.
- Dedicated SEO pages (e.g. `/land/bigha-to-ropani`) — see [SEO.md](./SEO.md).

**Done when:** every Nepali land conversion matches the sourced table to full precision
and is verified by tests.

---

## Phase 3 — Expand the catalog 🧭

**Goal:** Cover the categories people actually search for.

Deliverables

- **Data storage** (bit/byte, KB/MB/GB/TB, binary vs decimal).
- **Time** (ms → s → min → h → day → week → month → year).
- **Speed** (m/s, km/h, mph, knot, ft/s).
- **Energy** (J, kWh, cal, kcal, BTU) and **Power** (W, kW, hp).
- **Pressure** (Pa, bar, atm, psi, mmHg).
- **Fuel economy** (km/L, L/100km, mpg US/UK).
- **Angle** (deg, rad, grad, turn) and **Frequency** (Hz → GHz).
- **Cooking** (cup, tbsp, tsp, ml, pint) and **Digital/data rate** if demand exists.
- Global search box across all units ("20 kg in lbs", "5 bigha in ropani").

**Done when:** search finds any unit in any category and converts it in one action.

---

## Phase 4 — SEO & content 🧭

**Goal:** Become findable for "X to Y" searches.

Deliverables

- **Prerender/SSG** category and pair pages (see ADR in [DECISIONS.md](./DECISIONS.md)).
- URL scheme `/category/from-to` with canonical tags and aliases/redirects.
- Per-page `<title>`, meta description, Open Graph, JSON-LD (WebApplication, FAQ,
  BreadcrumbList).
- `sitemap.xml` + `robots.txt` generated at build time.
- Content: short "what is X" explainers, conversion tables, FAQ per category.
- Analytics (privacy-friendly) + Core Web Vitals budget.

**Done when:** category and top ~200 pairs are indexable, crawlable, and pass
Lighthouse SEO ≥ 95.

---

## Phase 5 — Experience polish 🧭

**Goal:** Delight and retention.

Deliverables

- Conversion **history** and **favourites** (localStorage).
- Shareable links and result sharing; deep links with pre-filled values.
- **PWA**: installable, offline-capable for static categories.
- Dark mode, keyboard shortcuts, reduced-motion support.
- Accessibility pass (WCAG 2.1 AA): focus order, labels, ARIA live regions for results.
- Bulk/table view for land conversions.

**Done when:** app is installable, works offline for static units, and audits clean for
a11y.

---

## Phase 6 — Scale & localize 💡

**Goal:** Reach and serve more people.

Deliverables

- **Nepali (Devanagari) UI + content**, then other South-Asian languages.
- Public read-only **JSON API** (`/api/convert?from=kg&to=lb&value=10`).
- Embeddable widget for other sites.
- Server-side caching of FX rates; NRB official rate source for NPR.
- Abuse/rate-limiting, monitoring, error tracking.

**Done when:** API is documented and stable, and the UI ships in Nepali.

---

## Explicitly deferred / backlog 💡

- Accounts, cloud sync, teams.
- Scientific/engineering notation heavy modes, unit math (e.g. "kg·m/s²").
- Historical currency time series and charts.
- Native mobile apps (PWA first).
- Ads/monetization (only if unobtrusive).

## Milestones at a glance

| Phase | Theme                         | Status |
| ----- | ----------------------------- | ------ |
| 0     | Foundation                    | ✅     |
| 1     | Universal converter core      | 🧭     |
| 2     | Nepali land & customary units | 🧭     |
| 3     | Expand catalog                | 🧭     |
| 4     | SEO & content                 | 🧭     |
| 5     | Experience polish             | 🧭     |
| 6     | Scale & localize              | 💡     |
