# Features

The full feature catalog. Priorities use **MoSCoW**:
**Must** (needed for launch), **Should** (important, soon after), **Could** (nice to
have), **Won't** (explicitly out of scope for now).

Status per feature is tracked in [ROADMAP.md](./ROADMAP.md) by phase.

---

## 1. Core conversion experience

| Feature                                 | Priority | Notes                                                     |
| --------------------------------------- | -------- | --------------------------------------------------------- |
| Type-to-convert (live, no submit)       | Must     | Already the behaviour for currency.                       |
| From/To unit selection                  | Must     | Searchable selects once a category has many units.        |
| Swap button                             | Must     | Swaps units **and** moves the result into the input.      |
| Category switcher                       | Must     | Tabs/nav driven by the unit registry.                     |
| Precision / significant-figures control | Should   | Auto default per category; user override.                 |
| Copy result to clipboard                | Should   | One tap, with confirmation.                               |
| Result formatting                       | Must     | Thousands separators, correct symbols, sensible rounding. |
| Validation & friendly errors            | Must     | Invalid input, unknown unit, offline rate.                |
| Deep-linkable state                     | Should   | `/length/km-to-mi?value=5` pre-fills everything.          |
| Share result                            | Could    | Web Share API on mobile.                                  |
| Conversion history                      | Should   | localStorage, clearable, last N conversions.              |
| Favourites / pinned pairs               | Could    | Quick access to your common conversions.                  |
| Keyboard shortcuts                      | Could    | `s` swap, `c` copy, `/` focus search.                     |
| Bulk / table conversion                 | Could    | Enter many values at once (esp. land lists).              |
| Scientific notation display             | Could    | Very large/small values.                                  |

## 2. Currency (exists — needs hardening)

| Feature                          | Priority    | Notes                                                  |
| -------------------------------- | ----------- | ------------------------------------------------------ |
| Live FX rates                    | Must        | Currently exchangerate-api; move key server-side.      |
| Base currency choice             | Should      | Convert from any base, not just USD.                   |
| Caching + stale-while-revalidate | Must        | Avoid a request per keystroke; survive rate limits.    |
| Offline fallback                 | Should      | Last-known rates with a "as of" timestamp.             |
| NRB official rates for NPR       | Should      | Nepal Rastra Bank publishes daily; adds local trust.   |
| Currency metadata                | Must        | Full name, symbol, flag/locale, decimals (e.g. JPY 0). |
| Show rate + "as of" time         | Must        | Transparency: `1 USD = 133.45 NPR · updated 5m ago`.   |
| Swap / inverse rate              | Must        | Derive inverse locally.                                |
| Crypto (optional)                | Won't (now) | Volatile and a different data problem.                 |

## 3. Category catalog

Each category is a dimension with a base unit and a set of units. "First release" marks
the initial unit set; more units can be added without UI changes.

### Length / Distance

**Must:** metre, kilometre, centimetre, millimetre, mile, yard, foot, inch, nautical mile.
**Should:** micrometre, nanometre, light-year, astronomical unit, parsec.
**Nepali customary (Phase 2):** kos (≈3.7 km), haath (1.5 ft), dand/dhanush (6 ft),
angul, vitastaa, yojan.

### Mass / Weight

**Must:** kilogram, gram, milligram, metric tonne, pound, ounce, stone, US short ton, UK long ton.
**Should:** carat, grain, slug.
**Nepali customary (Phase 2, verify):** tola (11.6638125 g), dharni, mana/pathi as weight
where grain density applies. _(See CONVERSION-DATA.md — flagged for verification.)_

### Area

**Must:** square metre, square foot, square kilometre, square mile, hectare, acre, square yard, square inch.
**Phase 2 — Nepali land:**

- Hill system: ropani, aana, paisa, daam (and khetmuri).
- Terai system: bigha, kattha, dhur (and kanwa).
- Cross-system + metric/imperial.

### Volume

**Must:** litre, millilitre, cubic metre, cubic centimetre, US gallon, US quart, US pint, US cup, fluid ounce, tablespoon, teaspoon.
**Should:** imperial/UK gallon, barrel, cubic inch, cubic foot.
**Nepali customary (Phase 2):** mana (0.568246 L), pathi (4.54596 L), muri, mutthi.

### Temperature

**Must:** Celsius, Fahrenheit, Kelvin.
**Could:** Rankine, Réaumur. _(Affine units — see the engine design.)_

### Data storage

**Must:** bit, byte, KB, MB, GB, TB (decimal) **and** KiB, MiB, GiB, TiB (binary).
**Should:** PB, PB, bit/byte rate per second.
**Note:** clearly label decimal (1000) vs binary (1024) — a common source of confusion.

### Time

**Must:** second, millisecond, microsecond, nanosecond, minute, hour, day, week.
**Should:** month (30.44 days avg), year (365.25 days), decade, century.

### Speed

**Must:** metre/second, kilometre/hour, mile/hour, knot, foot/second.

### Energy

**Must:** joule, kilojoule, calorie, kilocalorie, watt-hour, kilowatt-hour.
**Should:** electronvolt, BTU, therm, foot-pound.

### Power

**Must:** watt, kilowatt, megawatt, horsepower (mechanical). **Should:** metric hp, electrical hp.

### Pressure

**Must:** pascal, kilopascal, bar, atmosphere, psi, mmHg/torr. **Should:** inHg.

### Fuel economy

**Must:** km/L, L/100 km, mpg (US). **Should:** mpg (UK), miles/kWh (EV).

### Angle

**Must:** degree, radian, gradian, arcminute, arcsecond. **Should:** turn, mil.

### Frequency

**Must:** hertz, kilohertz, megahertz, gigahertz.

### Cooking

**Could:** cup, tablespoon, teaspoon, millilitre, fluid ounce, pint — with metric/US/UK
variants and ingredient density helpers (flour vs sugar vs water).

> **Adding a category or unit must require zero UI code** — it is data registered in
> `src/domain/units/`. That is the acceptance test for the architecture.

## 4. Discovery & navigation

| Feature                                                           | Priority   |
| ----------------------------------------------------------------- | ---------- |
| Home page with popular conversions (USD→NPR, kg→lb, bigha→ropani) | Must       |
| Global search ("20 kg in lbs")                                    | Should     |
| Category pages `/length`, `/currency`, `/land`                    | Must (SEO) |
| Pair pages `/length/km-to-mi`                                     | Must (SEO) |
| Related conversions ("people also convert")                       | Could      |
| Breadcrumbs                                                       | Should     |

## 5. Trust & transparency

| Feature                                       | Priority |
| --------------------------------------------- | -------- |
| Cite the source/standard for Nepali units     | Must     |
| Show rate timestamp and source for currency   | Must     |
| "As of" date + disclaimer for volatile data   | Should   |
| Note where customary units regionally vary    | Should   |
| Explain the metric-vs-binary data distinction | Should   |

## 6. Platform

| Feature                                      | Priority         |
| -------------------------------------------- | ---------------- |
| Mobile-first responsive UI                   | Must             |
| Dark mode                                    | Should           |
| PWA (installable, offline static categories) | Should           |
| Accessibility (WCAG 2.1 AA)                  | Must             |
| Nepali/Devanagari UI                         | Should (Phase 6) |
| Public JSON API                              | Could            |
| Embeddable widget                            | Could            |

## Non-goals

- General calculator or expression evaluator.
- Unit-aware algebraic math (dimensional analysis) in the UI.
- Trading, advice, or transactions.
- Accounts, sync, or social features.
- Ad-heavy or paywalled experience.
