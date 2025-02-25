
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { QueryRule, QueryField } from '@/types/queryBuilder';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldExamples } from '../FieldExamples';
import { useState } from 'react';

const relativeDateOptions = [
  { value: 'last_7_days', label: 'Last 7 days' },
  { value: 'last_30_days', label: 'Last 30 days' },
  { value: 'last_90_days', label: 'Last 90 days' },
  { value: 'this_week', label: 'This week' },
  { value: 'this_month', label: 'This month' },
  { value: 'this_year', label: 'This year' },
  { value: 'last_week', label: 'Last week' },
  { value: 'last_month', label: 'Last month' },
  { value: 'last_year', label: 'Last year' },
  { value: 'next_week', label: 'Next week' },
  { value: 'next_month', label: 'Next month' },
  { value: 'next_year', label: 'Next year' },
];

interface ValueInputProps {
  rule: QueryRule;
  selectedField: QueryField | undefined;
  onChange: (rule: QueryRule) => void;
  errorMessage?: string | null;
}

export const ValueInput = ({ rule, selectedField, onChange, errorMessage }: ValueInputProps) => {
  const [date, setDate] = useState<Date>();

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      onChange({
        ...rule,
        value: newDate.toISOString(),
      });
    }
  };

  const handleMultiSelectChange = (value: string) => {
    const currentValues = Array.isArray(rule.value) ? rule.value : [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    onChange({ ...rule, value: newValues });
  };

  const handleBooleanChange = (checked: boolean) => {
    onChange({ ...rule, value: checked });
  };

  if (!selectedField) return null;

  switch (selectedField.type) {
    case 'boolean':
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={`value-${rule.id}`}
            checked={Boolean(rule.value)}
            onCheckedChange={handleBooleanChange}
          />
          <label htmlFor={`value-${rule.id}`} className="text-sm">
            {Boolean(rule.value) ? 'True' : 'False'}
          </label>
        </div>
      );

    case 'date':
      if (rule.operator === 'custom_range') {
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      }

      if (rule.operator.includes('rolling') || 
          rule.operator === 'last_n_days' || 
          rule.operator === 'next_n_days') {
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={rule.value as string}
              onChange={(e) => onChange({ ...rule, value: e.target.value })}
              className="w-[100px]"
              placeholder="Number"
            />
            <span className="text-muted-foreground">
              {rule.operator.includes('rolling') ? 'Rolling days' : 
               rule.operator === 'last_n_days' ? 'Days ago' : 
               'Days from now'}
            </span>
          </div>
        );
      }

      return (
        <Select
          value={rule.value as string}
          onValueChange={(value) => onChange({ ...rule, value })}
        >
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            {relativeDateOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'select':
      return (
        <Select
          value={rule.value as string}
          onValueChange={(value) => onChange({ ...rule, value })}
        >
          <SelectTrigger className={cn("w-[200px]", errorMessage && "border-red-500")}>
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {selectedField.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'multi-select':
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {selectedField.options?.map((option) => (
              <div
                key={option}
                onClick={() => handleMultiSelectChange(option)}
                className="cursor-pointer"
              >
                <Badge
                  variant={
                    Array.isArray(rule.value) && rule.value.includes(option)
                      ? "default"
                      : "outline"
                  }
                >
                  {option}
                  {Array.isArray(rule.value) && rule.value.includes(option) && (
                    <Check className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      );

    case 'number':
      return (
        <Input
          type="number"
          value={rule.value as string}
          onChange={(e) => onChange({ ...rule, value: Number(e.target.value) })}
          className={cn("w-[200px]", errorMessage && "border-red-500")}
          placeholder="Enter number"
        />
      );

    default:
      return (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={rule.value as string}
            onChange={(e) => onChange({ ...rule, value: e.target.value })}
            className={cn("w-[200px]", errorMessage && "border-red-500")}
            placeholder="Enter value"
          />
          {selectedField && <FieldExamples type={selectedField.type} />}
        </div>
      );
  }
};
