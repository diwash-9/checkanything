# CheckAnything

> **Convert anything to anything.** A fast, accurate, universal unit converter —
> currencies, length, mass, area, temperature, data, time, speed, energy, and the
> Nepali land units (bigha, kattha, ropani, aana, paisa, daam) other sites get wrong.

**Live:** https://checkanything.vercel.app

---

## What is this?

CheckAnything started as a small React currency converter (USD ⇄ NPR) built for
learning. It is being expanded into a general-purpose converter where any quantity can
be turned into any equivalent measure — with Nepali customary units as a first-class,
sourced feature.

Two things set it apart:

1. **Local-first relevance** — official Nepal land units (Terai: bigha/kattha/dhur;
   Hills: ropani/aana/paisa/daam) are core features, sourced from the
   _Standard Measurement and Weight Act, 1968_.
2. **One consistent home** for currency, science, cooking, real estate, and digital
   units — fast and ad-light instead of a dozen cluttered single-purpose sites.

## Status

**Phase 0 (Foundation) complete.** The app is TypeScript (strict), routed with React
Router, and driven by a pure, data-driven conversion engine. Currency is the first
registered category; Phase 1 adds length, mass, volume, temperature and area.
See the [roadmap](./docs/ROADMAP.md).

## Tech stack

- **React 19** + **Vite 6**
- **TypeScript** (strict)
- **Tailwind CSS v4**
- **React Router** (routing)
- **Vitest** + Testing Library (tests)
- **Vercel** (hosting + serverless `/api/rates`)

## Getting started

```bash
npm install
npm run dev          # start the dev server (includes the /api/rates dev proxy)
npm run build        # typecheck + production build
npm run preview      # preview the production build
npm run test         # run the test suite
npm run typecheck    # tsc -b
npm run lint         # eslint
npm run format       # prettier
```

> **Currency API:** rate fetching goes through a server-side proxy. The provider key must
> live in a server-side env var (`FX_API_KEY`), **not** in client code — see
> [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) §5.3 and
> [docs/DECISIONS.md](./docs/DECISIONS.md) ADR-007. Without a key, local dev falls back to
> the keyless `open.er-api.com` provider.

## Documentation

All project context lives in [`docs/`](./docs/README.md):

| Doc                                          | Contents                                       |
| -------------------------------------------- | ---------------------------------------------- |
| [Context](./docs/CONTEXT.md)                 | Vision, audience, principles, scope, glossary  |
| [Roadmap](./docs/ROADMAP.md)                 | Phased plan from foundation to scale           |
| [Features](./docs/FEATURES.md)               | Full feature catalog with priorities           |
| [Architecture](./docs/ARCHITECTURE.md)       | Stack, structure, conversion engine, data flow |
| [Conversion data](./docs/CONVERSION-DATA.md) | Sourced unit catalog + Nepali factors          |
| [SEO](./docs/SEO.md)                         | Rendering, URLs, structured data, keywords     |
| [Conventions](./docs/CONVENTIONS.md)         | Code style, git workflow, testing              |
| [Decisions](./docs/DECISIONS.md)             | Architecture Decision Records (ADRs)           |

Contributing (human or AI): read [`AGENTS.md`](./AGENTS.md) first.

## Project layout

```
api/             # Vercel serverless function (GET /api/rates)
server/          # server-side FX provider chain + dev middleware
src/
├── app/         # route tree + React root
├── pages/       # route-level screens
├── components/  # ui kit, layout, converter components
├── features/    # feature hooks (converter, currency rates)
├── domain/      # PURE conversion engine + unit registry
├── data/        # currency metadata + rate client/cache
├── lib/         # small helpers
└── config/      # site constants
docs/            # project context (start here)
```

## License & attribution

© Devraj Khatiwada. All rights reserved.
