
import { Input } from '@/components/ui/input';

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
      className={`w-full ${errorMessage ? 'border-red-500' : ''}`}
    />
  );
};
