import Card from "@/components/ui/Card";
import { useConversion } from "@/features/converter/useConversion";
import type { Category } from "@/domain/units/types";
import RateHint from "./RateHint";
import SwapButton from "./SwapButton";
import UnitField from "./UnitField";

export interface ConverterProps {
  category: Category;
  initialFromSlug?: string;
  initialToSlug?: string;
  initialValue?: number | null;
}

export default function Converter({
  category,
  initialFromSlug,
  initialToSlug,
  initialValue,
}: ConverterProps) {
  const conversion = useConversion({
    category,
    initialFromSlug,
    initialToSlug,
    initialValue,
  });

  const { units, fromUnit, toUnit, result, resultText, currency } = conversion;

  const isCurrency = category.dynamic === "currency";
  const awaitingRates = isCurrency && units.length === 0;

  if (awaitingRates) {
    return (
      <Card>
        <p className="text-sm text-gray-500" role="status" aria-live="polite">
          {currency?.status === "error"
            ? "Currency rates are unavailable right now. Please try again later."
            : "Loading exchange rates…"}
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-3">
      <UnitField
        label="From"
        amount={conversion.amountInput}
        onAmountChange={conversion.setAmountInput}
        units={units}
        selectedUnitId={fromUnit?.id ?? ""}
        onUnitChange={conversion.selectFrom}
      />

      <SwapButton onClick={conversion.swap} />

      <UnitField
        label="To"
        amount={resultText}
        onAmountChange={() => undefined}
        amountDisabled
        units={units}
        selectedUnitId={toUnit?.id ?? ""}
        onUnitChange={conversion.selectTo}
      />

      {isCurrency && (
        <RateHint
          rate={conversion.rateHint}
          fetchedAt={currency?.fetchedAt ?? null}
          source={currency?.source ?? null}
          cached={currency?.cached ?? false}
        />
      )}

      <p className="sr-only" aria-live="polite">
        {result !== null && toUnit
          ? `${conversion.amountInput} ${fromUnit?.name ?? ""} equals ${resultText} ${toUnit.name}`
          : ""}
      </p>
    </Card>
  );
}
