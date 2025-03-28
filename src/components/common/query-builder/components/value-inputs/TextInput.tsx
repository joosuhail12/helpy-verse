
import { Input } from '@/components/ui/input';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string | null;
}

export const TextInput = ({ value, onChange, errorMessage }: TextInputProps) => {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full ${errorMessage ? 'border-red-500' : ''}`}
    />
  );
};
