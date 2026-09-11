import { useId } from "react";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { optionLabel, type Locale, type Messages } from "@/lib/i18n";

export function ChoiceField<T extends string>({
  label,
  value,
  values,
  onChange,
  locale,
}: {
  label: string;
  value: T;
  values: readonly T[];
  onChange: (value: T) => void;
  locale: Locale;
}) {
  const id = useId();
  return (
    <Field className="min-w-0">
      <FieldLabel className="text-xs text-muted-foreground" htmlFor={id}>
        {label}
      </FieldLabel>
      <Select value={value} onValueChange={(value) => onChange(value as T)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {values.map((value) => (
              <SelectItem key={value} value={value}>
                {optionLabel(value, locale)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  );
}

export function RangeField({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  const id = useId();
  return (
    <Field className="min-w-0">
      <div className="flex min-h-5 flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <FieldLabel className="text-xs text-muted-foreground" htmlFor={id}>
          {label}
        </FieldLabel>
        <output className="text-xs tabular-nums text-muted-foreground">
          {value} {unit}
        </output>
      </div>
      <Slider
        className="h-5"
        id={id}
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(value) => onChange(value[0])}
      />
    </Field>
  );
}

export function ColorField({
  label,
  color,
  onChange,
  messages,
}: {
  label: string;
  color: string;
  onChange: (value: string) => void;
  messages: Messages;
}) {
  const id = useId();
  return (
    <Field className="min-w-0 gap-2">
      <FieldLabel className="text-xs text-muted-foreground" htmlFor={id}>
        {label}
      </FieldLabel>
      <Input
        id={id}
        type="color"
        aria-label={`${label} ${messages.colorValue}`}
        title={`${label} ${color}`}
        value={color}
        onInput={(event) => onChange(event.currentTarget.value)}
        className="h-9 cursor-pointer p-1 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-0 [&::-moz-color-swatch]:rounded-md [&::-moz-color-swatch]:border-0"
      />
    </Field>
  );
}
