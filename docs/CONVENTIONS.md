# Conventions

How we write, test, and ship code. Consistency beats cleverness — the goal is that any
file looks like the file next to it.

---

## 1. Language & tooling

- **TypeScript, `strict: true`.** No `any` in `domain/` or `data/` (use `unknown` +
  narrowing). Prefer `type` for unions, `interface` for object shapes.
- **Prettier** for formatting (default config unless a reason to change).
- **ESLint** (already configured) — no unused vars, hooks rules enforced.
- **Path aliases:** `@/` → `src/`. Avoid `../../..` chains.
- **Node:** current LTS. **Package manager:** npm (lockfile committed).

---

## 2. Naming

| Thing              | Convention         | Example                          |
| ------------------ | ------------------ | -------------------------------- |
| Files (components) | `PascalCase.tsx`   | `ConverterShell.tsx`             |
| Files (logic)      | `camelCase.ts`     | `convert.ts`, `useConversion.ts` |
| Hooks              | `use*`             | `useCurrencyRates.ts`            |
| Types/interfaces   | `PascalCase`       | `LinearUnit`, `Category`         |
| Constants          | `SCREAMING_SNAKE`  | `CACHE_TTL_MS`                   |
| Unit ids           | `category.slug`    | `length.metre`, `land.bigha`     |
| CSS classes        | Tailwind utilities | —                                |
| Test files         | `*.test.ts(x)`     | `convert.test.ts`                |

---

## 3. Component rules

- **Function components only**, with hooks. No class components.
- One component per file; default-export the component.
- Presentational components (`components/ui`) are **dumb**: props in, no fetching.
- Data/logic lives in `features/*` hooks or `domain/*` — not in components.
- Keep components small; extract when a JSX block has its own state or is reused.
- Props: prefix booleans with `is`/`has` (`isLoading`, `hasError`).
- Accessibility is not optional: label every control, use semantic elements.

### Example shape

```tsx
import { useId } from "react";

interface UnitSelectProps {
  label: string;
  value: string;
  units: Unit[];
  onChange: (id: string) => void;
  disabled?: boolean;
}

export default function UnitSelect({
  label,
  value,
  units,
  onChange,
  disabled,
}: UnitSelectProps) {
  const id = useId();
  // ...
}
```

---

## 4. Domain layer rules

- **Pure functions.** No React, no `fetch`, no `window`, no side effects.
- Deterministic: same input → same output. Factors are constants.
- Full precision internally; round only in `format.ts`.
- Every exported function has a matching test.
- All factors carry a `source` (see [CONVERSION-DATA.md](./CONVERSION-DATA.md)).

---

## 5. Data fetching

- Wrap `fetch` in `lib/api` with typed responses and error handling.
- Never fetch in a render body; use hooks/effects.
- Cache aggressively (see [ARCHITECTURE.md](./ARCHITECTURE.md) §5.2).
- Never hardcode secrets in the client — use env vars + the serverless proxy.
- Handle loading, error, and stale states in the UI.

---

## 6. Testing

- **Vitest** + **React Testing Library**. Tests live next to source or in `tests/`.
- Test behaviour, not implementation details.
- Required coverage:
  - Every category: known-value conversion + round-trip.
  - Affine units (temperature): negative values, freezing/boiling points.
  - Currency: cache/TTL/fallback with mocked fetch.
  - URL parsing/building + alias redirects.
- Use `expect(x).toBeCloseTo(y, n)` for floats; assert exact for exact factors.
- No network in tests (mock it).

---

## 7. Git workflow

- **Branch names:** `feat/<topic>`, `fix/<topic>`, `docs/<topic>`, `chore/<topic>`.
- **Commits:** Conventional Commits —
  `feat(land): add bigha to ropani conversion`,
  `fix(currency): cache rates to avoid rate limits`,
  `docs(arch): document conversion engine`.
  Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `style`.
- Keep commits focused; don't mix a refactor with a feature.
- **Do not commit or push without the owner's approval** (explicit project rule).
- Never commit `.env`, secrets, or the leaked API key.

### Before requesting a commit/PR

- [ ] `npm run lint` clean
- [ ] `npm test` green
- [ ] `npm run build` succeeds
- [ ] Docs updated if behaviour/data/architecture changed
- [ ] No secrets in the diff

---

## 8. Documentation rules

- Docs describe **intent**; code describes **reality**. If they differ, fix both.
- Any new conversion factor → update [CONVERSION-DATA.md](./CONVERSION-DATA.md) + a test.
- Any architectural choice → append an ADR to [DECISIONS.md](./DECISIONS.md); never edit
  past ADRs (supersede them).
- Update [ROADMAP.md](./ROADMAP.md) status when a phase item completes.
- Prefer tables and short lists over prose.

---

## 9. UI/UX conventions

- Mobile-first; design at 360px and scale up.
- One accent colour; support light/dark from the start (tokens in `styles/`).
- Numbers: right-align; use thousands separators; avoid scientific notation unless
  asked; never show FP noise.
- Feedback within 100ms; results in an `aria-live="polite"` region.
- Loading states are explicit; errors are human-readable, never raw stack traces.
- Copy tone: clear and friendly ("1 bigha ≈ 13 ropani 5 aana").

---

## 10. File header comments

Only where they add value. Prefer self-documenting names. A short module doc-comment is
welcome for `domain/` files (e.g. "Land area units — sourced from the 1968 Act").
