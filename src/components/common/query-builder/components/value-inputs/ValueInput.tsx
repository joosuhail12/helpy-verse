
import React from 'react';
import { TextInput } from './TextInput';
import { NumberInput } from './NumberInput';
import { DateInput } from './DateInput';
import { SelectInput } from './SelectInput';
import { MultiSelectInput } from './MultiSelectInput';
import { BooleanInput } from './BooleanInput';
import { FieldType, ComparisonOperator, QueryField } from '@/types/queryBuilder';

interface ValueInputProps {
  field: QueryField;
  operator: ComparisonOperator;
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
  const noValueOperators: ComparisonOperator[] = ['is_empty', 'is_not_empty'];
  
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
          options={field.options || []}
          errorMessage={errorMessage}
        />
      );
    
    case 'multi-select':
      return (
        <MultiSelectInput
          value={value || []}
          onChange={onChange}
          options={field.options || []}
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
