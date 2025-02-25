
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
      { value: 'greater_than_equals', label: 'Greater Than or Equal' },
      { value: 'less_than_equals', label: 'Less Than or Equal' },
      { value: 'between', label: 'Between' },
      { value: 'not_between', label: 'Not Between' },
    ];

    const selectOperators = [
      ...baseOperators,
      { value: 'in', label: 'In List' },
      { value: 'not_in', label: 'Not In List' },
      { value: 'contains_any', label: 'Contains Any' },
      { value: 'contains_all', label: 'Contains All' },
    ];

    const dateOperators = [
      ...baseOperators,
      { value: 'after', label: 'After' },
      { value: 'before', label: 'Before' },
      { value: 'between', label: 'Between' },
      { value: 'not_between', label: 'Not Between' },
      { value: 'last_n_days', label: 'Last N Days' },
      { value: 'next_n_days', label: 'Next N Days' },
      { value: 'this_week', label: 'This Week' },
      { value: 'this_month', label: 'This Month' },
      { value: 'this_year', label: 'This Year' },
      { value: 'last_week', label: 'Last Week' },
      { value: 'last_month', label: 'Last Month' },
      { value: 'last_year', label: 'Last Year' },
    ];

    switch (selectedField.type) {
      case 'text':
        return textOperators;
      case 'select':
        return selectOperators;
      case 'multi-select':
        return [
          ...selectOperators,
          { value: 'has_none', label: 'Has None' },
          { value: 'has_any', label: 'Has Any' },
          { value: 'has_all', label: 'Has All' },
        ];
      case 'number':
        return numberOperators;
      case 'boolean':
        return baseOperators;
      case 'date':
        return dateOperators;
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

