# CheckAnything — Documentation

This folder is the **single source of truth for project context**. It exists so that
any contributor — human or AI agent — can understand what we are building, why, and
how, without reverse-engineering the code.

> **Product:** CheckAnything
> **Domain:** https://checkanything.vercel.app
> **Tagline:** Convert anything to anything.

## Start here

If you are new to the project, read in this order:

| #   | File                                       | What it answers                          |
| --- | ------------------------------------------ | ---------------------------------------- |
| 1   | [CONTEXT.md](./CONTEXT.md)                 | What are we building, for whom, and why? |
| 2   | [ROADMAP.md](./ROADMAP.md)                 | What order do we build it in?            |
| 3   | [FEATURES.md](./FEATURES.md)               | What exactly can the app do?             |
| 4   | [ARCHITECTURE.md](./ARCHITECTURE.md)       | How is the code structured?              |
| 5   | [CONVERSION-DATA.md](./CONVERSION-DATA.md) | Where do conversion factors come from?   |
| 6   | [SEO.md](./SEO.md)                         | How do we get found on search engines?   |
| 7   | [CONVENTIONS.md](./CONVENTIONS.md)         | How do we write and ship code?           |
| 8   | [DECISIONS.md](./DECISIONS.md)             | Why did we choose X over Y?              |

## What each file is for

- **CONTEXT.md** — vision, audience, principles, scope boundaries, branding, glossary.
  Changes rarely. The "north star".
- **ROADMAP.md** — phased plan from foundation to scale. Update phase status as we go.
- **FEATURES.md** — the full feature catalog, grouped by category, with priorities
  (MoSCoW: Must / Should / Could / Won't).
- **ARCHITECTURE.md** — stack, folder layout, conversion engine, data flow, routing,
  performance, security, testing, deployment.
- **CONVERSION-DATA.md** — the unit catalog and the **sourced, verified** conversion
  factors, including Nepali customary land units. Accuracy rules live here.
- **SEO.md** — rendering strategy, URL scheme, structured data, keyword/content plan.
- **CONVENTIONS.md** — code style, naming, git workflow, testing, doc maintenance.
- **DECISIONS.md** — Architecture Decision Records (ADRs): context, decision,
  consequences. Append-only.

## Ground rules for these docs

1. **Docs describe intent, code describes reality.** If they disagree, one of them is
   a bug — fix it in the same change.
2. **Numbers must be sourced.** Any conversion factor added to the docs or code needs a
   citation in [CONVERSION-DATA.md](./CONVERSION-DATA.md). No "I think it's about…".
3. **Keep it short enough to read.** Prefer tables and lists over prose walls.
4. **Update the roadmap** whenever a phase item is completed or re-scoped.
5. **ADRs are append-only.** Never edit a past decision; supersede it with a new one.

## Status legend

- ✅ Done · 🚧 In progress · 🧭 Planned · 💡 Idea / unprioritized · ❌ Explicitly out of scope

## Repo

- **Code:** `src/`
- **Docs:** `docs/` (this folder)
- **Root readme:** [../README.md](../README.md)
- **Agent context:** [../AGENTS.md](../AGENTS.md)
