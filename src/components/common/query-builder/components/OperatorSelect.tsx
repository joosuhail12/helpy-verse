
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipProvider } from '@/components/ui/tooltip-provider';
import type { QueryField } from '@/types/queryBuilder';

interface OperatorSelectProps {
  selectedField: QueryField | undefined;
  value: string;
  onValueChange: (value: any) => void;
  disabled: boolean;
}

export const getOperatorLabel = (operator: string): string => {
  const operatorLabels: Record<string, string> = {
    equals: 'Equals',
    not_equals: 'Not Equals',
    contains: 'Contains',
    not_contains: 'Does Not Contain',
    starts_with: 'Starts With',
    ends_with: 'Ends With',
    greater_than: 'Greater Than',
    less_than: 'Less Than',
    greater_than_equals: 'Greater Than or Equal',
    less_than_equals: 'Less Than or Equal',
    in: 'In List',
    not_in: 'Not In List',
    is_empty: 'Is Empty',
    is_not_empty: 'Is Not Empty',
    between: 'Between',
    not_between: 'Not Between',
    contains_any: 'Contains Any',
    contains_all: 'Contains All',
    has_none: 'Has None',
    has_any: 'Has Any',
    has_all: 'Has All',
    after: 'After',
    before: 'Before',
    last_n_days: 'Last N Days',
    next_n_days: 'Next N Days',
    this_week: 'This Week',
    this_month: 'This Month',
    this_year: 'This Year',
    last_week: 'Last Week',
    last_month: 'Last Month',
    last_year: 'Last Year',
  };
  return operatorLabels[operator] || operator;
};

const getOperatorDescription = (operator: string): string => {
  const descriptions: Record<string, string> = {
    equals: 'Exact match with the specified value',
    not_equals: 'Does not match the specified value',
    contains: 'Contains the specified text',
    not_contains: 'Does not contain the specified text',
    starts_with: 'Begins with the specified text',
    ends_with: 'Ends with the specified text',
    greater_than: 'Greater than the specified number',
    less_than: 'Less than the specified number',
    greater_than_equals: 'Greater than or equal to the specified number',
    less_than_equals: 'Less than or equal to the specified number',
    in: 'Matches any value in the specified list',
    not_in: 'Does not match any value in the specified list',
    is_empty: 'Has no value set',
    is_not_empty: 'Has any value set',
    between: 'Falls between two specified values',
    not_between: 'Does not fall between two specified values',
    contains_any: 'Contains at least one of the specified values',
    contains_all: 'Contains all of the specified values',
    has_none: 'Has none of the specified values',
    has_any: 'Has at least one of the specified values',
    has_all: 'Has all of the specified values',
    after: 'Date is after the specified date',
    before: 'Date is before the specified date',
    last_n_days: 'Within the last N days',
    next_n_days: 'Within the next N days',
    this_week: 'Within the current week',
    this_month: 'Within the current month',
    this_year: 'Within the current year',
    last_week: 'Within the previous week',
    last_month: 'Within the previous month',
    last_year: 'Within the previous year',
  };
  return descriptions[operator] || '';
};

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
    <TooltipProvider>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select operator" />
        </SelectTrigger>
        <SelectContent>
          {getOperatorOptions().map((op) => (
            <Tooltip key={op.value}>
              <TooltipTrigger asChild>
                <SelectItem value={op.value}>
                  {op.label}
                </SelectItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getOperatorDescription(op.value)}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </SelectContent>
      </Select>
    </TooltipProvider>
  );
};
