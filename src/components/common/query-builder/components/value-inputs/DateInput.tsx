
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ComparisonOperator } from '@/types/queryBuilder';
import { CustomRangeInput } from './date/CustomRangeInput';
import { RelativeDateInput } from './date/RelativeDateInput';
import { RollingPeriodInput } from './date/RollingPeriodInput';

export interface DateInputProps {
  value: any;
  onChange: (value: any) => void;
  operator: ComparisonOperator;
  errorMessage?: string | null;
}

export const DateInput: React.FC<DateInputProps> = ({ value, onChange, operator, errorMessage }) => {
  const [open, setOpen] = useState(false);

  // Handle different date input based on operator
  if (operator === 'custom_range' as ComparisonOperator) {
    return <CustomRangeInput value={value} onChange={onChange} />;
  }

  if (operator === 'last_n_days' as ComparisonOperator || 
      operator === 'next_n_days' as ComparisonOperator) {
    return <RollingPeriodInput value={value} onChange={onChange} operator={operator} />;
  }

  if (['is_empty', 'is_not_empty'].includes(operator)) {
    return null;
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={`justify-start text-left font-normal ${
              errorMessage ? 'border-red-500' : ''
            }`}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(new Date(value), 'PPP') : <span>Select a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => {
              onChange(date?.toISOString() || '');
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {errorMessage && <p className="text-sm text-red-500 mt-1">{errorMessage}</p>}
    </div>
  );
};
