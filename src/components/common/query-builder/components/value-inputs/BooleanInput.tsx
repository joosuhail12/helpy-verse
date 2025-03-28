
import { Checkbox } from '@/components/ui/checkbox';

interface BooleanInputProps {
  value: boolean;
  onChange: (value: boolean) => void;
  errorMessage?: string | null;
}

export const BooleanInput = ({ value, onChange, errorMessage }: BooleanInputProps) => {
  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="value-checkbox"
          checked={value}
          onCheckedChange={onChange}
          className={errorMessage ? 'border-red-500' : ''}
        />
        <label htmlFor="value-checkbox" className="text-sm">
          {value ? 'True' : 'False'}
        </label>
      </div>
      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
