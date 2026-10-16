# Project Context

## One-liner

**CheckAnything** is a fast, accurate, universal unit converter that turns any quantity
into any equivalent — currencies, length, mass, area, temperature, data, time, speed,
energy, and real-life local measures used in the Nepali market (bigha, kattha, ropani,
aana, paisa, daam).

**Domain:** https://checkanything.vercel.app
**Tagline:** _Convert anything to anything._

## What this project is

It started as a learning project: a small React currency converter (USD ⇄ NPR) built
with Vite and the exchangerate-api. It is now being expanded into a **general-purpose
"convert anything" utility** — a tool people reach for by default when they need a
number translated into different units.

Two things make it different from the hundreds of generic converters out there:

1. **Local-first relevance.** Official Nepal land units (bigha–kattha–dhur and
   ropani–aana–paisa–daam) and other customary measures used in the Nepali market are
   first-class citizens, not an afterthought. Getting these _right_ is a core promise.
2. **Everything in one place.** Currency, science, cooking, real estate, digital
   storage — one consistent, fast, mobile-friendly experience instead of a dozen ad-
   heavy single-purpose sites.

## Why it exists (problem statement)

- Unit conversion online is fragmented across dozens of cluttered, ad-heavy,
  mobile-hostile sites.
- Nepali land measurement is confusing and inconsistently documented online; people
  buying, selling, or inheriting land need a **trustworthy** converter.
- Most currency converters are either slow, blocked behind apps, or don't handle NPR
  well.

## Target audience

| Audience                    | Need                                                                   |
| --------------------------- | ---------------------------------------------------------------------- |
| Nepali general public       | Land units (bigha/kattha/ropani/aana), currency, everyday conversions  |
| Students & learners         | Length, mass, temperature, area, data, energy — homework and curiosity |
| NRB / diaspora              | USD/GBP/AUD ⇄ NPR, remittance context                                  |
| Real-estate buyers & agents | Land area across Terai (bigha) and Hill (ropani) systems               |
| Cooks & home users          | Volume/weight, recipe conversions                                      |
| Travellers & shoppers       | Distance, fuel economy, temperature, currency                          |
| Developers & tinkerers      | Digital storage, data rates, angle, frequency                          |

## Product principles

1. **Accuracy above all.** A wrong conversion on land or currency has real financial
   consequences. All factors are sourced and unit-tested against known values.
2. **Fast and frictionless.** Convert as you type. No submit button. No login. Works on
   a low-end phone on a slow connection.
3. **Honest about uncertainty.** Where customary units vary by region or era, we say so
   and default to the legal/national standard.
4. **One mental model everywhere.** Every category looks and behaves the same way.
5. **Discoverable.** Every category and popular pair is a real, indexable page.
6. **Local-first.** Nepali units and Nepali-language support are priority features, not
   localizations bolted on later.
7. **No dark patterns.** Free, no forced sign-up, no intrusive ads. If we ever
   monetize, it stays unobtrusive.

## Value proposition

> "Anything you need to convert, in one fast page — including the land units that other
> sites get wrong."

## Scope

### In scope

- Unit conversion across many categories (see [FEATURES.md](./FEATURES.md)).
- Live currency rates with offline fallback and caching.
- Nepali customary units (land, length, volume) with sourced national-standard factors.
- Great SEO: indexable pages per category and popular pair.
- Mobile-first, accessible, installable (PWA).

### Out of scope (for now)

- Being a full calculator / spreadsheet / equation solver.
- Financial advice, trading, or transactions.
- User accounts, cloud sync, social features.
- Serving legal metrology certification. (We surface the standard; we don't certify.)

## Branding

- **Name:** CheckAnything
- **Domain:** checkanything.vercel.app
- **Voice:** Clear, precise, friendly, jargon-light. Say "1 bigha = 13.31 ropani",
  not "the conversion factor is 13.31263696".
- **Visual direction:** clean, high-contrast, generous whitespace, one accent color,
  works in light and dark. Nepali numerals/Devanagari as a future option.
- **Footer attribution:** Devraj Khatiwada.

## Current state

Phase 0 (Foundation) is complete. The app is now:

- **TypeScript** (strict) on React 19 + Vite 6 + Tailwind CSS v4.
- A **data-driven conversion engine** (`src/domain/`) with a unit registry; currency is
  the first registered category (dynamic rates), and adding more is a data change.
- **Routed** with React Router: `/`, `/:category`, `/:category/:from-to`.
- FX rates fetched through a **server-side proxy** (`/api/rates` + dev middleware); the
  key lives in `FX_API_KEY` and is never bundled. The old committed key still needs
  rotating in the provider dashboard (ADR-007).
- Covered by Vitest (33 tests across the engine, formatting, URL helpers, and the
  currency UI path).
- Single currency converter screen remains the only live category until Phase 1.

## Glossary

| Term                             | Meaning                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| **Category**                     | A dimension of measurement, e.g. Length, Mass, Currency.                              |
| **Unit**                         | A specific measure within a category, e.g. metre, bigha, USD.                         |
| **Base unit**                    | The canonical unit a category converts through internally (e.g. metre for length).    |
| **Factor**                       | Multiplier from a unit to the category base unit.                                     |
| **Pair**                         | A specific from → to conversion, e.g. `kg → lbs`. SEO pages are built per pair.       |
| **Ropani / Aana / Paisa / Daam** | Hill-region land area units (16 aana = 1 ropani; 4 paisa = 1 aana; 4 daam = 1 paisa). |
| **Bigha / Kattha / Dhur**        | Terai-region land area units (20 kattha = 1 bigha; 20 dhur = 1 kattha).               |
| **NRB**                          | Nepal Rastra Bank, the central bank that publishes official NPR FX rates.             |
| **SSG / prerender**              | Generating static HTML at build time so search engines see content.                   |

See [CONVERSION-DATA.md](./CONVERSION-DATA.md) for the exact factor values.
