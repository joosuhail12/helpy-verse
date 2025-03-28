
import React from 'react';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { DateInput } from './DateInput';

// Simple field type definition that avoids circular references
interface QueryField {
  id: string;
  label: string;
  type: string;
  name: string;
  options?: Array<string | { value: string; label: string }>;
}

interface ValueInputProps {
  field: QueryField;
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
          value={value || ''}
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
          value={value || ''}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      );
    
    default:
      // Fallback to text input for any unhandled types
      return (
        <TextInput
          value={value || ''}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      );
  }
};
