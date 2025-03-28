
import React from 'react';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { DateInput } from './DateInput';
import { BooleanInput } from './BooleanInput';
import { SelectInput } from './SelectInput';
import { MultiSelectInput } from './MultiSelectInput';

interface SimpleField {
  id: string;
  label: string;
  type: string;
  name: string;
  options?: Array<string | { value: string; label: string }>;
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

  // Process options if they exist
  const processedOptions = field.options 
    ? field.options.map(opt => typeof opt === 'string' ? opt : opt.value) 
    : [];

  switch (field.type) {
    case 'text':
      return (
        <TextInput
          value={String(value || '')}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      );
    
    case 'number':
      return (
        <NumberInput
          value={value}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      );
    
    case 'date':
      return (
        <DateInput
          value={String(value || '')}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      );
      
    case 'boolean':
      return (
        <BooleanInput
          value={Boolean(value)}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      );
      
    case 'select':
      return (
        <SelectInput
          value={String(value || '')}
          onChange={onChange}
          options={processedOptions}
          errorMessage={errorMessage}
        />
      );
      
    case 'multiselect':
      return (
        <MultiSelectInput
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          options={processedOptions}
          errorMessage={errorMessage}
        />
      );
    
    default:
      // Fallback to text input for any unhandled types
      return (
        <TextInput
          value={String(value || '')}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      );
  }
};
