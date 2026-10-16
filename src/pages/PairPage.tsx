import { useParams, useSearchParams } from "react-router-dom";
import Container from "@/components/layout/Container";
import { Converter } from "@/components/converter";
import Card from "@/components/ui/Card";
import { getCategory, getUnitSlug } from "@/domain/units/registry";
import { parsePairSlug, parseValueParam } from "@/features/converter/converterUrl";
import NotFoundPage from "./NotFoundPage";

export default function PairPage() {
  const { categoryId, pairSlug } = useParams();
  const [searchParams] = useSearchParams();

  const category = categoryId ? getCategory(categoryId) : undefined;
  const pair = pairSlug ? parsePairSlug(pairSlug) : null;

  if (!category || !pair) {
    return <NotFoundPage />;
  }

  // Prefer metadata-seeded units for the heading; the converter resolves against
  // whatever units are actually available (e.g. live currency rates).
  const knownFrom = category.units.find((unit) => getUnitSlug(unit) === pair.from);
  const knownTo = category.units.find((unit) => getUnitSlug(unit) === pair.to);
  const fromLabel = (knownFrom?.symbol ?? pair.from).toUpperCase();
  const toLabel = (knownTo?.symbol ?? pair.to).toUpperCase();

  const initialValue = parseValueParam(searchParams.get("value"));

  return (
    <Container className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">
          {fromLabel} to {toLabel} converter
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Convert {knownFrom?.name ?? fromLabel} to {knownTo?.name ?? toLabel}.
        </p>
      </header>

      <Converter
        category={category}
        initialFromSlug={pair.from}
        initialToSlug={pair.to}
        initialValue={initialValue}
      />

      <Card className="text-sm text-gray-600">
        <p>
          Enter an amount above to convert it live. This page converts{" "}
          <span className="font-medium text-gray-900">{fromLabel}</span> to{" "}
          <span className="font-medium text-gray-900">{toLabel}</span>.
        </p>
      </Card>
    </Container>
  );
}
