
import React from 'react';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { DateInput } from './DateInput';
import { SelectInput } from './SelectInput';
import { MultiSelectInput } from './MultiSelectInput';
import { BooleanInput } from './BooleanInput';
import { QueryField, Operator } from '@/types/queryBuilder';

interface ValueInputProps {
  field: QueryField;
  operator: Operator;
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
  const noValueOperators: Operator[] = [
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
          value={value}
          onChange={onChange}
          operator={operator}
          errorMessage={errorMessage}
        />
      );
    
    case 'boolean':
      return (
        <BooleanInput
          value={value}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      );
    
    case 'select':
      return (
        <SelectInput
          value={value}
          onChange={onChange}
          options={field.options?.map(opt => typeof opt === 'string' ? opt : opt.value) || []}
          errorMessage={errorMessage}
        />
      );
    
    case 'multiselect':
      return (
        <MultiSelectInput
          value={value || []}
          onChange={onChange}
          options={field.options?.map(opt => typeof opt === 'string' ? opt : opt.value) || []}
          errorMessage={errorMessage}
        />
      );
    
    default:
      return (
        <TextInput
          value={value || ''}
          onChange={onChange}
          errorMessage={errorMessage}
        />
      );
  }
};
