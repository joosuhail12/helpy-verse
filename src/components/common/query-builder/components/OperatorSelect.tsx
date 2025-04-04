
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { QueryField, Operator } from '@/types/queryBuilder';

interface OperatorSelectProps {
  value: Operator;
  onValueChange: (value: string) => void;
  selectedField?: QueryField;
  disabled?: boolean;
}

export const OperatorSelect = ({
  value,
  onValueChange,
  selectedField,
  disabled,
}: OperatorSelectProps) => {
  // Default operators for any field type
  const defaultOperators = [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
    { value: 'isEmpty', label: 'Is Empty' },
    { value: 'isNotEmpty', label: 'Is Not Empty' },
  ];

  // Get field-specific operators based on field type
  const getFieldOperators = (field?: QueryField) => {
    if (!field) return defaultOperators;

    switch (field.type) {
      case 'text':
        return [
          ...defaultOperators,
          { value: 'contains', label: 'Contains' },
          { value: 'notContains', label: 'Does Not Contain' },
          { value: 'startsWith', label: 'Starts With' },
          { value: 'endsWith', label: 'Ends With' },
        ];
      case 'number':
        return [
          ...defaultOperators,
          { value: 'greaterThan', label: 'Greater Than' },
          { value: 'lessThan', label: 'Less Than' },
          { value: 'inRange', label: 'In Range' },
          { value: 'notInRange', label: 'Not In Range' },
        ];
      case 'date':
        return [
          ...defaultOperators,
          { value: 'greaterThan', label: 'After' },
          { value: 'lessThan', label: 'Before' },
          { value: 'inRange', label: 'Between' },
        ];
      case 'select':
      case 'multiselect':
        return [
          ...defaultOperators,
          { value: 'in', label: 'In' },
          { value: 'notIn', label: 'Not In' },
        ];
      default:
        return defaultOperators;
    }
  };

  const operators = getFieldOperators(selectedField);

  // If the field provides custom operators, use those instead
  const finalOperators = selectedField?.operators 
    ? selectedField.operators.map(op => {
        const match = operators.find(o => o.value === op);
        return match ? match : { value: op, label: op };
      })
    : operators;

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-[140px]">
        <SelectValue placeholder="Select operator" />
      </SelectTrigger>
      <SelectContent>
        {finalOperators.map((op) => (
          <SelectItem key={op.value} value={op.value}>
            {op.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
