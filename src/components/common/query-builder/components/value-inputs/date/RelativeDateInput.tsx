
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RelativeDateInputProps {
  value: string;
  onChange: (value: string) => void;
}

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

export const RelativeDateInput = ({ value, onChange }: RelativeDateInputProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
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
};
