
import type { ComparisonOperator } from '@/types/queryBuilder';
import { CustomRangeInput } from './date/CustomRangeInput';
import { RelativeDateInput } from './date/RelativeDateInput';
import { RollingPeriodInput } from './date/RollingPeriodInput';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  operator?: ComparisonOperator;
  errorMessage?: string | null;
}

export const DateInput = ({ value, onChange, operator = 'equals', errorMessage }: DateInputProps) => {
  if (operator === 'custom_range' as ComparisonOperator) {
    return <CustomRangeInput value={value} onChange={onChange} />;
  }

  if (operator.includes('rolling') || 
      operator === 'last_n_days' as ComparisonOperator || 
      operator === 'next_n_days' as ComparisonOperator) {
    return <RollingPeriodInput value={value} onChange={onChange} operator={operator} />;
  }

  return <RelativeDateInput value={value} onChange={onChange} />;
};
