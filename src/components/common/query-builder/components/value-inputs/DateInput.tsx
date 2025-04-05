
import { Operator } from '@/types/queryBuilder';
import { CustomRangeInput } from './date/CustomRangeInput';
import { RelativeDateInput } from './date/RelativeDateInput';
import { RollingPeriodInput } from './date/RollingPeriodInput';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  operator: Operator;
}

export const DateInput = ({ value, onChange, operator }: DateInputProps) => {
  if (operator === 'between') {
    return <CustomRangeInput value={value} onChange={onChange} />;
  }

  if (operator.includes('rolling') || 
      operator === 'last_n_days' || 
      operator === 'next_n_days') {
    return <RollingPeriodInput value={value} onChange={onChange} operator={operator} />;
  }

  return <RelativeDateInput value={value} onChange={onChange} />;
};
