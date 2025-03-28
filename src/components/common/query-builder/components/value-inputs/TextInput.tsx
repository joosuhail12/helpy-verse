
import { Input } from '@/components/ui/input';
import { FieldExamples } from '../FieldExamples';
import { cn } from '@/lib/utils';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string | null;
  showExamples?: boolean;
}

export const TextInput = ({ value, onChange, errorMessage, showExamples = true }: TextInputProps) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn("w-[200px]", errorMessage && "border-red-500")}
        placeholder="Enter value"
      />
      {showExamples && <FieldExamples type="text" />}
    </div>
  );
};
