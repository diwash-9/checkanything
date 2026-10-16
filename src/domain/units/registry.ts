/**
 * The unit registry: the single list of categories the app knows about.
 *
 * Adding a unit or a whole category is a data change here — no UI code required.
 */
import type { Category, CategoryId, Unit, UnitId } from "./types";
import { currencyCategory } from "./categories/currency";

export const categories: readonly Category[] = [currencyCategory];

const categoriesById = new Map<CategoryId, Category>(
  categories.map((category) => [category.id, category]),
);

export function listCategories(): readonly Category[] {
  return categories;
}

export function getCategory(id: CategoryId): Category | undefined {
  return categoriesById.get(id);
}

export function getUnit(category: Category, unitId: UnitId): Unit | undefined {
  return category.units.find((unit) => unit.id === unitId);
}

export function getBaseUnit(category: Category): Unit {
  const base = getUnit(category, category.baseUnitId);
  if (!base) {
    throw new Error(
      `Category "${category.id}" has no base unit "${category.baseUnitId}"`,
    );
  }
  return base;
}

/** URL slug for a unit: the part of the id after the dot, unless overridden. */
export function getUnitSlug(unit: Unit): string {
  if (unit.slug) return unit.slug;
  const [, ...rest] = unit.id.split(".");
  return rest.join(".");
}

export function findUnitBySlug(units: readonly Unit[], slug: string): Unit | undefined {
  const normalized = slug.toLowerCase();
  return units.find((unit) => getUnitSlug(unit) === normalized);
}
