
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NumberInputProps {
  value: number | string;
  onChange: (value: number) => void;
  errorMessage?: string | null;
}

export const NumberInput = ({ value, onChange, errorMessage }: NumberInputProps) => {
  return (
    <Input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn("w-[200px]", errorMessage && "border-red-500")}
      placeholder="Enter number"
    />
  );
};
