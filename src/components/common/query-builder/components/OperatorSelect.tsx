
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemo } from 'react';
import type { QueryField, ComparisonOperator } from '@/types/queryBuilder';

interface OperatorSelectProps {
  selectedField?: QueryField;
  value: ComparisonOperator;
  onValueChange: (value: ComparisonOperator) => void;
  disabled?: boolean;
}

export const OperatorSelect = ({ 
  selectedField, 
  value, 
  onValueChange,
  disabled
}: OperatorSelectProps) => {
  const operators = useMemo(() => {
    if (!selectedField) return [];

    // Define operator groups based on field type
    switch (selectedField.type) {
      case 'string':
      case 'text':
      case 'email':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'notEquals', label: 'Not Equals' },
          { value: 'contains', label: 'Contains' },
          { value: 'startsWith', label: 'Starts With' },
          { value: 'endsWith', label: 'Ends With' },
          { value: 'exists', label: 'Is Set' },
          { value: 'notExists', label: 'Is Not Set' },
        ];
      case 'number':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'notEquals', label: 'Not Equals' },
          { value: 'greaterThan', label: 'Greater Than' },
          { value: 'lessThan', label: 'Less Than' },
          { value: 'exists', label: 'Is Set' },
          { value: 'notExists', label: 'Is Not Set' },
        ];
      case 'boolean':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'notEquals', label: 'Not Equals' },
        ];
      case 'date':
        return [
          { value: 'equals', label: 'On' },
          { value: 'notEquals', label: 'Not On' },
          { value: 'greaterThan', label: 'After' },
          { value: 'lessThan', label: 'Before' },
          { value: 'exists', label: 'Is Set' },
          { value: 'notExists', label: 'Is Not Set' },
          { value: 'custom_range', label: 'Between' },
          { value: 'last_n_days', label: 'Last N Days' },
          { value: 'next_n_days', label: 'Next N Days' },
          { value: 'rolling_days', label: 'Rolling Period' },
        ];
      case 'select':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'notEquals', label: 'Not Equals' },
          { value: 'exists', label: 'Is Set' },
          { value: 'notExists', label: 'Is Not Set' },
        ];
      case 'multi-select':
        return [
          { value: 'in', label: 'In' },
          { value: 'notIn', label: 'Not In' },
          { value: 'exists', label: 'Is Set' },
          { value: 'notExists', label: 'Is Not Set' },
        ];
      default:
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'notEquals', label: 'Not Equals' },
          { value: 'exists', label: 'Is Set' },
          { value: 'notExists', label: 'Is Not Set' },
        ];
    }
  }, [selectedField]);

  return (
    <Select 
      value={value} 
      onValueChange={(val) => onValueChange(val as ComparisonOperator)}
      disabled={disabled}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Select operator" />
      </SelectTrigger>
      <SelectContent>
        {operators.map((operator) => (
          <SelectItem key={operator.value} value={operator.value}>
            {operator.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
