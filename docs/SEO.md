# SEO & Discoverability

CheckAnything lives or dies by search. People don't bookmark converters — they search
"kg to lbs", "bigha to ropani", "usd to npr" and click the first trustworthy result.
This document is the plan to win those searches.

---

## 1. Goals

1. Rank for high-intent **"X to Y"** queries across every category.
2. Own the **Nepali land conversion** niche (low competition, high trust value).
3. Be fast (Core Web Vitals green) and crawlable.
4. Convert visitors: land on a pair page → convert immediately → return via brand.

**Success metrics (first 12 months):** indexed pair pages, impressions & CTR in Search
Console, Lighthouse SEO ≥ 95, LCP < 2.5s, and organic sessions per week.

---

## 2. The core problem: SPAs are hard to index

Today the app is a client-rendered Vite SPA. Search engines _may_ run JS, but it's
unreliable, slow, and bad for social previews. **We must ship real HTML for content
pages.** See **ADR-004** in [DECISIONS.md](./DECISIONS.md) for options; the working
decision is **static prerendering at build time** for `/`, `/:category`, and popular
`/:category/:pair` routes, with the interactive converter hydrating on top.

Requirements:

- Each indexable route's HTML contains the `<title>`, meta description, H1, an
  explanation, and a **working example** even before JS runs.
- Canonical URLs are absolute and self-referencing.
- One canonical URL per logical topic; synonyms redirect.

---

## 3. URL architecture

| Route           | Example                                     | Indexable                | Notes                                |
| --------------- | ------------------------------------------- | ------------------------ | ------------------------------------ |
| Home            | `/`                                         | ✅                       | Brand + "popular conversions" hub.   |
| Category        | `/length`, `/currency`, `/land`             | ✅                       | Lists units + intro content.         |
| Pair            | `/length/km-to-mi`, `/land/bigha-to-ropani` | ✅                       | The money pages.                     |
| Pair with value | `/length/km-to-mi?value=5`                  | ❌ canonical → base pair | Query params don't create new pages. |
| Alias           | `/kg-to-lb` → `/mass/kilogram-to-pound`     | 301                      | Common search spellings.             |

Rules:

- Lowercase, hyphen-separated, ASCII slugs (`bigha`, `ropani`, `sq-foot`).
- `from-to` uses the unit **slug**; ordering is canonical (define a fixed order, or
  always-normalize the canonical direction).
- Never index query-string permutations — set `?value=` pages to canonical the bare pair.
- Trailing-slash policy: pick one (no trailing slash) and redirect the other.

---

## 4. Page types & content

### 4.1 Home `/`

- H1: "Convert anything to anything".
- Category grid (links to every category).
- Popular conversions (data-driven list of top pairs).
- Short value proposition + trust signals (sourced factors, "no ads").

### 4.2 Category page `/:category`

- H1: "Length converter" / "Land area converter (Nepal)".
- Interactive converter, default from/to.
- Intro paragraph + **conversion table** (unit ⇄ base) — great for featured snippets.
- FAQ block (schema-enabled).
- Internal links to top pairs and sibling categories.

### 4.3 Pair page `/:category/:from-to` — the priority

Template contains, in order:

1. H1: "Kilometres to Miles" (`<from> to <to>`).
2. The interactive converter, pre-set to this pair.
3. **The formula** ("1 km = 0.621371 mi") and a worked example.
4. A quick reference table (1, 5, 10, 50, 100 …).
5. "What is a kilometre / mile?" short explainers.
6. Related conversions (reverse pair + neighbours).
7. FAQ with JSON-LD.
8. Trust: source citation + "as of" for currency.

> The static HTML must contain at least H1, formula, one example, and the reference
> table so it is useful without JS.

---

## 5. Metadata

For every indexable route:

```html
<title>Kilometres to Miles (km to mi) Converter — CheckAnything</title>
<meta
  name="description"
  content="Convert kilometres to miles instantly. 1 km =
0.621371 mi. Free, accurate, no ads."
/>
<link rel="canonical" href="https://checkanything.vercel.app/length/km-to-mi" />
<meta property="og:title" ... />
<meta property="og:description" ... />
<meta property="og:url" ... />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

Title formula: `{From} to {To} ({abbr}) Converter — CheckAnything` (≤60 chars where
possible). Keep description unique per pair and mention the factor.

---

## 6. Structured data (JSON-LD)

| Schema               | Where          | Purpose                                                          |
| -------------------- | -------------- | ---------------------------------------------------------------- |
| `WebApplication`     | Home           | Establish the app + `applicationCategory: UtilitiesApplication`. |
| `BreadcrumbList`     | Category, Pair | Show path in results.                                            |
| `FAQPage`            | Category, Pair | Rich results for Q&A blocks.                                     |
| `HowTo` _(optional)_ | Pair           | "How to convert km to mi" steps.                                 |

Example (pair):

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How many miles is 1 kilometre?",
      "acceptedAnswer": { "@type": "Answer", "text": "1 kilometre = 0.621371 miles." }
    }
  ]
}
```

Generate JSON-LD from the same registry data that drives the UI — never hand-maintain.

---

## 7. Crawl infrastructure

- `public/robots.txt`:
  ```text
  User-agent: *
  Allow: /
  Sitemap: https://checkanything.vercel.app/sitemap.xml
  ```
- `sitemap.xml`: generated at build from all categories + curated/top pairs.
  Include `lastmod`. Split into a sitemap index if > 50k URLs.
- Canonical + `hreflang` (once Nepali ships): `x-default`, `en`, `ne`.
- Submit sitemap in Google Search Console; request indexing on launch.
- Ensure 404s return real 404 status (handled by the prerender/deploy config).

---

## 8. Keyword strategy

**Patterns per category:**

- `X to Y` / `X in Y` (primary): "bigha to ropani", "kg to lbs", "usd to npr".
- `X to Y converter`, `convert X to Y`.
- Quantity queries: "1 bigha in square feet", "100 kg in pounds".
- Definitional: "what is a kattha", "how many aana in a ropani".

**Prioritise:**

1. **Nepali land** — low competition, high intent, our differentiator.
   (`bigha to ropani`, `ropani to square feet`, `kattha to dhur`, `aana to paisa`.)
2. **Currency with NPR** — `usd to npr`, `npr to usd`, `aud to npr`.
3. **High-volume generic** — `kg to lbs`, `cm to inches`, `km to miles`, `gb to mb`.

Build a keyword→pair map and let it drive which pair pages get content first.

---

## 9. Content strategy

- Short, factual, sourced. No fluff, no keyword stuffing.
- Every category page has a **conversion table** (snippets + dwell time).
- Land pages explain Terai vs Hill systems and cite the 1968 Act — unique, quotable.
- Answer-the-question style ("There are 16 aana in 1 ropani.").
- Internal linking: home → category → pair → related pairs (hub-and-spoke).
- Keep updating: refresh currency "as of" text and add pairs as demand appears.

---

## 10. Performance (Core Web Vitals budget)

| Metric                     | Target           |
| -------------------------- | ---------------- |
| LCP                        | < 2.5 s (mobile) |
| INP                        | < 200 ms         |
| CLS                        | < 0.1            |
| Initial JS (gzip)          | < 150 KB         |
| Total transfer (pair page) | < 300 KB         |

Tactics: prerendered HTML, route-level code splitting, lazy category data,
self-hosted/system fonts, inline critical CSS, no render-blocking third parties.

---

## 11. Analytics & monitoring

- Privacy-friendly analytics (e.g. Plausible/Umami) — no heavy tag managers.
- Google Search Console for coverage, queries, CTR.
- Track: pair → conversion rate, search → pair entry, copy/share actions.
- Alert on FX provider failures (affects currency trust).

---

## 12. Launch checklist

- [ ] Prerender/SSG wired for `/`, `/:category`, top pairs (ADR-004).
- [ ] Unique title/meta per route from registry data.
- [ ] JSON-LD (WebApplication, Breadcrumb, FAQ) emitted per page.
- [ ] `robots.txt` + generated `sitemap.xml` shipped.
- [ ] Canonical + alias redirects verified.
- [ ] Real 404s for unknown routes.
- [ ] Lighthouse SEO ≥ 95 and CWV green on a mid-tier mobile profile.
- [ ] Search Console verified, sitemap submitted.
- [ ] Nepali land content published and interlinked.
