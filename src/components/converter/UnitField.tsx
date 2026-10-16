import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { Unit } from "@/domain/units/types";

export interface UnitFieldProps {
  label: string;
  amount: string;
  onAmountChange: (value: string) => void;
  amountDisabled?: boolean;
  units: Unit[];
  selectedUnitId: string;
  onUnitChange: (unitId: string) => void;
}

export default function UnitField({
  label,
  amount,
  onAmountChange,
  amountDisabled = false,
  units,
  selectedUnitId,
  onUnitChange,
}: UnitFieldProps) {
  return (
    <div className="flex items-end gap-3 rounded-lg border border-gray-200 px-3 py-2">
      <div className="min-w-0 flex-1">
        <Input
          label={label}
          value={amount}
          disabled={amountDisabled}
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          placeholder="0"
          onChange={(event) => onAmountChange(event.target.value)}
        />
      </div>
      <div className="w-32 shrink-0 sm:w-40">
        <Select
          label="Unit"
          value={selectedUnitId}
          onChange={(event) => onUnitChange(event.target.value)}
        >
          {units.map((unit) => (
            <option key={unit.id} value={unit.id}>
              {unit.symbol} — {unit.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
