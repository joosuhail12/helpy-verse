
import type { ComparisonOperator } from '@/types/queryBuilder';
import { CustomRangeInput } from './date/CustomRangeInput';
import { RelativeDateInput } from './date/RelativeDateInput';
import { RollingPeriodInput } from './date/RollingPeriodInput';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  operator: ComparisonOperator;
}

export const DateInput = ({ value, onChange, operator }: DateInputProps) => {
  // Handle operator as string to avoid type comparison issues
  const operatorStr = operator as string;
  
  if (operatorStr === 'custom_range') {
    return <CustomRangeInput value={value} onChange={onChange} />;
  }

  if (operatorStr.includes('rolling') || 
      operatorStr === 'last_n_days' || 
      operatorStr === 'next_n_days') {
    return <RollingPeriodInput value={value} onChange={onChange} operator={operator} />;
  }

  return <RelativeDateInput value={value} onChange={onChange} />;
};
