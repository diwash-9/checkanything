# Conversion Data

The unit catalog and the **sourced** conversion factors. This is the accuracy contract
of the app: if a number is here, it has a citation; if it has no citation, it does not
ship.

> **Rule:** every factor in `src/domain/units/` must carry a `source` key that maps to a
> citation in §5 below. Tests must assert the values in this file.

---

## 1. Data strategy

| Kind                                                     | Source                                     | Lives in         | Freshness     |
| -------------------------------------------------------- | ------------------------------------------ | ---------------- | ------------- |
| Physical/customary units (length, mass, area, volume, …) | Fixed definitions (SI, Nepal Standard Act) | Static TS tables | Never changes |
| Nepali land units                                        | Standard Measurement and Weight Act, 1968  | Static TS tables | Fixed         |
| Currency rates                                           | Live FX API (+ NRB for NPR)                | Runtime provider | TTL 1–6h      |

Units are **relative to a category base unit** (see [ARCHITECTURE.md](./ARCHITECTURE.md)
§4.2): `value_in_base = value × factor`. Only currency uses runtime factors.

---

## 2. Nepali land area units (verified)

Nepal uses two regional systems:

- **Terai (plains):** bigha → kattha → dhur (→ kanwa)
- **Hills/mountains:** ropani → aana → paisa → daam, plus khetmuri

The metric system has been the official standard since the **Standard Measurement and
Weight Act, 1968** (2068/2025 B.S.). The factors below are the national-standard values.

**Base unit: square metre (m²).**

| Unit         | Nepali    | Factor → m²  | Exact in sq ft | Notes                 |
| ------------ | --------- | ------------ | -------------- | --------------------- |
| khetmuri     | खेतमुरी   | 12718.42618  | 136900         | = 25 ropani           |
| bigha        | बिघा      | 6772.631616  | 72900          | Terai; = 20 kattha    |
| kattha       | कठ्ठा     | 338.6315808  | 3645           | = 20 dhur             |
| dhur         | धुर       | 16.93157904  | 182.25         | = 16 kanwa            |
| ropani       | रोपनी     | 508.737047   | 5476           | Hill; = 74 ft × 74 ft |
| aana         | आना       | 31.79606544  | 342.25         | = 1/16 ropani         |
| paisa        | पैसा      | 7.94901636   | 85.5625        | = 1/4 aana            |
| daam (dam)   | दाम       | 1.98725409   | 21.390625      | = 1/4 paisa           |
| square foot  | वर्ग फिट  | 0.09290304   | 1              | exact (0.3048²)       |
| square metre | वर्ग मिटर | 1            | 10.76391042    | base                  |
| hectare      | हेक्टर    | 10000        | —              | = 10,000 m²           |
| acre         | एकड       | 4046.8564224 | —              | = 4840 sq yd          |

### 2.1 Intra-system relationships

**Hill system**

- 1 ropani = **16 aana** = **64 paisa** = **256 daam**
- 1 aana = **4 paisa** = **16 daam**
- 1 paisa = **4 daam**
- 1 khetmuri = **25 ropani**
- 1 ropani ≈ 74 ft × 74 ft

**Terai system**

- 1 bigha = **20 kattha** = **400 dhur**
- 1 kattha = **20 dhur**
- 1 dhur = **16 kanwa**

### 2.2 Cross-system (the one everybody asks for)

| Conversion         | Value                                                |
| ------------------ | ---------------------------------------------------- |
| 1 bigha → ropani   | **13.31263696 ropani** (= 13 ropani 5 aana, approx.) |
| 1 bigha → aana     | 213.0021914 aana                                     |
| 1 bigha → kattha   | 20 kattha                                            |
| 1 kattha → ropani  | 0.665631848 ropani (≈ 10 aana 2.6 paisa)             |
| 1 kattha → aana    | 10.65010957 aana                                     |
| 1 dhur → ropani    | 0.033281592 ropani                                   |
| 1 ropani → kattha  | 1.502331962 kattha                                   |
| 1 ropani → dhur    | 30.04663923 dhur                                     |
| 1 bigha → khetmuri | 0.532505478 khetmuri                                 |
| 1 hectare → bigha  | 1.4765309... bigha (10000 ÷ 6772.631616)             |
| 1 acre → bigha     | 0.5975309... bigha (4046.8564224 ÷ 6772.631616)      |

> **UI copy:** show friendly approximations ("1 bigha ≈ 13 ropani 5 aana") _and_ the
> precise value on demand. Mark values as based on the national standard, and note that
> local practice can differ slightly.

---

## 3. Other Nepali customary units

These are secondary units (shown when relevant), also from the same customary-units
record. Treat with the same sourcing discipline.

### 3.1 Length / distance

**Base: metre.**

| Unit             | Nepali    | Factor → m                   | Notes                                        |
| ---------------- | --------- | ---------------------------- | -------------------------------------------- |
| kos (kosh/krosh) | कोस       | 3657.6 (12000 ft, ≈2.273 mi) | 2000 dand; traditionally "≈2.25 mi / 3.7 km" |
| haath            | हात       | 0.4572 (1.5 ft)              | cubit-like                                   |
| dand / dhanush   | दन्ड/धनुष | 1.8288 (6 ft)                | = 4 haath                                    |
| vitastaa (span)  | वितस्ता   | 0.2286 (9 in)                | = 12 angul                                   |
| angul            | अंगुल     | 0.01905 (0.75 in)            | finger; 4 angul = 3 in                       |
| yojan            | योजन      | 14630.4 (4 kos, ≈9.09 mi)    | traditionally "≈9 mi / 14.48 km"             |

### 3.2 Volume (grain) — dry measure

**Base: litre.**

| Unit             | Nepali | Factor → L         | Notes              |
| ---------------- | ------ | ------------------ | ------------------ |
| mutthi (fistful) | मुट्ठी | 0.0568245 (approx) | 10 mutthi = 1 mana |
| mana             | माना   | 0.568245           | = 1/8 pathi        |
| pathi            | पाथी   | 4.54596            | = 8 mana           |
| muri             | मुरी   | 90.9192            | = 20 pathi         |

### 3.3 Mass (traditional) — ⚠️ needs verification before shipping

**Base: kilogram.**

| Unit   | Nepali | Factor → kg    | Status                                                            |
| ------ | ------ | -------------- | ----------------------------------------------------------------- |
| tola   | तोला   | 0.0116638125   | ✅ well-established (0.375 troy oz); 1 tola = 12 masha = 96 ratti |
| dharni | धार्नी | _TBD_          | ⚠️ verify against a Nepali weights source before adding           |
| masha  | माशा   | 0.000971984375 | derived from tola (1/12)                                          |
| ratti  | रत्ती  | 0.000121498047 | derived from tola (1/96)                                          |

> **Do not ship** any row marked ⚠️ until a proper citation is added in §5. Guessing
> traditional weights is exactly the kind of error this project exists to avoid.

---

## 4. Standard (non-Nepali) factor conventions

Use these canonical, exact-or-definitive factors. Keep them as constants so tests can
reference the same numbers.

| Quantity                 | Exact relation                     |
| ------------------------ | ---------------------------------- |
| inch                     | 1 in = 0.0254 m (exact)            |
| foot                     | 1 ft = 0.3048 m (exact)            |
| yard                     | 1 yd = 0.9144 m (exact)            |
| mile                     | 1 mi = 1609.344 m (exact)          |
| nautical mile            | 1 nmi = 1852 m (exact)             |
| pound                    | 1 lb = 0.45359237 kg (exact)       |
| ounce                    | 1 oz = 1/16 lb = 0.028349523125 kg |
| stone                    | 1 st = 14 lb                       |
| short ton (US)           | 2000 lb                            |
| long ton (UK)            | 2240 lb                            |
| acre                     | 4046.8564224 m²                    |
| hectare                  | 10000 m²                           |
| US gallon                | 3.785411784 L (exact)              |
| imperial gallon          | 4.54609 L (exact)                  |
| litre                    | 0.001 m³                           |
| calorie (thermochemical) | 4.184 J (exact)                    |
| kilocalorie              | 4184 J                             |
| watt-hour                | 3600 J                             |
| BTU (IT)                 | 1055.05585262 J                    |
| psi                      | 6894.757293168 Pa                  |
| atmosphere               | 101325 Pa (exact)                  |
| bar                      | 100000 Pa (exact)                  |
| mmHg (conventional)      | 133.322387415 Pa                   |
| horsepower (mechanical)  | 745.6998715822702 W                |
| knot                     | 1852/3600 m/s                      |
| degree                   | π/180 rad                          |
| hertz                    | s⁻¹                                |

**Temperature (affine — not a factor):**

- Base: **kelvin**.
- °C → K: `K = C + 273.15`
- °F → K: `K = (F + 459.67) × 5/9`
- Rankine: `K = R × 5/9`
- Réaumur: `K = °Ré × 5/4 + 273.15`

**Data storage:** label decimal (1000) vs binary (1024) explicitly.

- 1 byte = 8 bits
- decimal: kB=10³, MB=10⁶, GB=10⁹, TB=10¹²
- binary: KiB=2¹⁰, MiB=2²⁰, GiB=2³⁰, TiB=2⁴⁰

**Time:** conventional averages for display — 1 year = 365.25 days (Julian),
1 month = 30.436875 days (year/12). Document the assumption.

---

## 5. Sources

| Key                     | Source                                                                                                                 | Used for                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| `nepal-act-1968`        | Government of Nepal, **Standard Measurement and Weight Act, 1968 (2025 B.S.)** — Nepal Bureau of Standards & Metrology | Nepali land + customary units |
| `wikipedia-nepal-units` | "Nepalese customary units of measurement" (summarises the Act with the full conversion table)                          | Cross-check for Nepali units  |
| `si-brochure`           | BIPM, _SI Brochure_ (9th ed.)                                                                                          | SI definitions and prefixes   |
| `nist-sp811`            | NIST _Special Publication 811_                                                                                         | US customary ↔ SI factors     |
| `nrb-fx`                | Nepal Rastra Bank daily FX rates                                                                                       | NPR currency rates            |
| `iso-80000`             | ISO 80000 quantities and units                                                                                         | naming/symbol conventions     |

### Citations in code

Each unit's `source` field references a key above, e.g.:

```ts
{ id: "land.bigha", name: "Bigha (Terai)", symbol: "bigha",
  factor: 6772.631616, system: "nepali", source: "nepal-act-1968" }
```

---

## 6. Adding a new unit — checklist

1. Find a **citation** (official standard, NIST/BIPM, or a reputable source).
2. Express it as an exact factor to the category base unit (or `toBase`/`fromBase`).
3. Add the entry to `domain/units/categories/<category>.ts` with `source`.
4. Add the citation row to §5 if it's a new source.
5. Add a **test** asserting a known value (and its round-trip).
6. Update the relevant table in this file.
7. If it's a customary/regional unit, add a `note` and a UI caveat.

## 7. Data integrity rules

- ❌ No unsourced factors.
- ❌ No rounding in stored factors — store full precision; round only for display.
- ✅ Prefer exact definitions (e.g. `0.0254`) over approximations when they exist.
- ✅ One base unit per category; never store pairwise factors.
- ✅ Tests are the regression guard for every value in this document.
- ⚠️ Flag regional/era variation explicitly in the UI (customary units vary).
