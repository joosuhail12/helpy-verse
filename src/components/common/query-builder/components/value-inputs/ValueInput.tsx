
import React from 'react';
import { QueryRule, QueryField, ComparisonOperator } from '@/types/queryBuilder';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { DateInput } from './DateInput';
import { BooleanInput } from './BooleanInput';
import { SelectInput } from './SelectInput';
import { MultiSelectInput } from './MultiSelectInput';

interface ValueInputProps {
  rule: QueryRule;
  selectedField: QueryField | undefined;
  onChange: (rule: QueryRule) => void;
  errorMessage?: string | null;
}

export const ValueInput: React.FC<ValueInputProps> = ({
  rule,
  selectedField,
  onChange,
  errorMessage
}) => {
  // For operators that don't need value input, render nothing
  if (
    rule.operator === 'is_empty' ||
    rule.operator === 'is_not_empty'
  ) {
    return null;
  }

  // If no field is selected, render a disabled input
  if (!selectedField) {
    return (
      <TextInput
        value=""
        onChange={() => {}}
        placeholder="Select a field first"
        errorMessage={errorMessage}
      />
    );
  }

  const handleValueChange = (value: any) => {
    onChange({ ...rule, value });
  };

  // Render the appropriate input based on field type
  switch (selectedField.type) {
    case 'number':
      return (
        <NumberInput
          value={rule.value}
          onChange={handleValueChange}
          errorMessage={errorMessage}
        />
      );
    case 'date':
      return (
        <DateInput
          value={rule.value}
          onChange={handleValueChange}
          errorMessage={errorMessage}
        />
      );
    case 'boolean':
      return (
        <BooleanInput
          value={rule.value}
          onChange={handleValueChange}
          errorMessage={errorMessage}
        />
      );
    case 'select':
      return (
        <SelectInput
          value={rule.value}
          onChange={handleValueChange}
          options={selectedField.options || []}
          errorMessage={errorMessage}
        />
      );
    case 'multi-select':
      return (
        <MultiSelectInput
          value={rule.value}
          onChange={handleValueChange}
          options={selectedField.options || []}
          errorMessage={errorMessage}
        />
      );
    case 'text':
    default:
      return (
        <TextInput
          value={rule.value}
          onChange={handleValueChange}
          placeholder={selectedField.placeholder || 'Enter value'}
          errorMessage={errorMessage}
        />
      );
  }
};
