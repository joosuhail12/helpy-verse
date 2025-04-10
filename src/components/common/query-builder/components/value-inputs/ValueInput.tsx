
import type { QueryRule, QueryField, QueryRuleOption } from '@/types/queryBuilder';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { BooleanInput } from './BooleanInput';
import { SelectInput } from './SelectInput';
import { MultiSelectInput } from './MultiSelectInput';
import { DateInput } from './DateInput';

interface ValueInputProps {
  rule: QueryRule;
  selectedField: QueryField | undefined;
  onChange: (rule: QueryRule) => void;
  errorMessage?: string | null;
}

type OptionType = { label: string; value: string | number | boolean };

export const ValueInput = ({ rule, selectedField, onChange, errorMessage }: ValueInputProps) => {
  if (!selectedField) return null;

  const handleValueChange = (value: any) => {
    onChange({ ...rule, value });
  };

  switch (selectedField.type) {
    case 'boolean':
      return (
        <BooleanInput
          value={Boolean(rule.value)}
          onChange={handleValueChange}
        />
      );

    case 'date':
      return (
        <DateInput
          value={rule.value as string}
          onChange={handleValueChange}
          operator={rule.operator}
        />
      );

    case 'select':
      return (
        <SelectInput
          value={rule.value as string}
          onChange={handleValueChange}
          options={selectedField.options?.map(opt => ({
            label: typeof opt === 'string' ? opt : opt.label,
            value: typeof opt === 'string' ? opt : opt.value
          })) as OptionType[] || []}
          errorMessage={errorMessage}
        />
      );

    case 'multi-select':
      return (
        <MultiSelectInput
          value={Array.isArray(rule.value) ? rule.value.map(v => String(v)) : []}
          onChange={handleValueChange}
          options={selectedField.options?.map(opt => ({
            label: typeof opt === 'string' ? opt : opt.label,
            value: typeof opt === 'string' ? opt : opt.value
          })) as OptionType[] || []}
        />
      );

    case 'number':
      return (
        <NumberInput
          value={rule.value as number}
          onChange={handleValueChange}
          errorMessage={errorMessage}
        />
      );

    default:
      return (
        <TextInput
          value={rule.value as string}
          onChange={handleValueChange}
          errorMessage={errorMessage}
        />
      );
  }
};
