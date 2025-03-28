
import { Input } from '@/components/ui/input';
import { Operator } from '@/types/queryBuilder';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  operator: Operator;
  errorMessage?: string | null;
}

export const DateInput = ({ value, onChange, operator, errorMessage }: DateInputProps) => {
  return (
    <Input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full ${errorMessage ? 'border-red-500' : ''}`}
    />
  );
};
