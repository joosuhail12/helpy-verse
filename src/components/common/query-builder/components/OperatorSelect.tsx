
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { QueryField } from '@/types/queryBuilder';

interface OperatorSelectProps {
  selectedField: QueryField | undefined;
  value: string;
  onValueChange: (value: any) => void;
  disabled: boolean;
}

export const OperatorSelect = ({
  selectedField,
  value,
  onValueChange,
  disabled
}: OperatorSelectProps) => {
  const getOperatorOptions = () => {
    if (!selectedField) return [];

    const baseOperators = [
      { value: 'equals', label: 'Equals' },
      { value: 'not_equals', label: 'Not Equals' },
      { value: 'is_empty', label: 'Is Empty' },
      { value: 'is_not_empty', label: 'Is Not Empty' },
    ];

    const textOperators = [
      ...baseOperators,
      { value: 'contains', label: 'Contains' },
      { value: 'not_contains', label: 'Does Not Contain' },
      { value: 'starts_with', label: 'Starts With' },
      { value: 'ends_with', label: 'Ends With' },
    ];

    const numberOperators = [
      ...baseOperators,
      { value: 'greater_than', label: 'Greater Than' },
      { value: 'less_than', label: 'Less Than' },
    ];

    const selectOperators = [
      ...baseOperators,
      { value: 'in', label: 'In List' },
      { value: 'not_in', label: 'Not In List' },
    ];

    switch (selectedField.type) {
      case 'text':
        return textOperators;
      case 'select':
      case 'multi-select':
        return selectOperators;
      case 'number':
        return numberOperators;
      case 'boolean':
        return baseOperators;
      case 'date':
        return [
          ...numberOperators,
          { value: 'in', label: 'In Range' },
          { value: 'not_in', label: 'Not In Range' },
        ];
      default:
        return textOperators;
    }
  };

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select operator" />
      </SelectTrigger>
      <SelectContent>
        {getOperatorOptions().map((op) => (
          <SelectItem key={op.value} value={op.value}>
            {op.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

