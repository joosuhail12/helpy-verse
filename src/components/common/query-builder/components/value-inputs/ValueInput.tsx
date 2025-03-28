
import React from 'react';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { DateInput } from './DateInput';
import { BooleanInput } from './BooleanInput';
import { SelectInput } from './SelectInput';
import { MultiSelectInput } from './MultiSelectInput';

interface SimpleField {
  id: string;
  type: string;
  options?: Array<string | { label: string; value: string }>;
}

interface ValueInputProps {
  field: SimpleField;
  operator: string;
  value: any;
  onChange: (value: any) => void;
  errorMessage?: string | null;
}

export const ValueInput: React.FC<ValueInputProps> = ({
  field,
  operator,
  value,
  onChange,
  errorMessage
}) => {
  // List of operators that don't require a value input
  const noValueOperators = [
    'isEmpty', 'isNotEmpty', 'is_empty', 'is_not_empty'
  ];
  
  if (noValueOperators.includes(operator)) {
    return null;
  }

  switch (field.type) {
    case 'text':
      return (
        <TextInput
          value={value === null || value === undefined ? '' : String(value)}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      );
    
    case 'number':
      return (
        <NumberInput
          value={value === null || value === undefined ? '' : value}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      );
    
    case 'date':
      return (
        <DateInput
          value={value === null || value === undefined ? '' : String(value)}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      );
    
    case 'boolean':
      return (
        <BooleanInput
          value={!!value}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      );
      
    case 'select':
      return (
        <SelectInput
          value={value === null || value === undefined ? '' : String(value)}
          onChange={onChange}
          options={field.options || []}
          errorMessage={errorMessage}
        />
      );
      
    case 'multiselect':
    case 'multi-select':
      return (
        <MultiSelectInput
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          options={field.options || []}
          errorMessage={errorMessage}
        />
      );

    default:
      // Fallback to text input for any unhandled types
      return (
        <TextInput
          value={value === null || value === undefined ? '' : String(value)}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      );
  }
};
