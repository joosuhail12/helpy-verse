
import { Checkbox } from '@/components/ui/checkbox';

interface BooleanInputProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export const BooleanInput = ({ value, onChange }: BooleanInputProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="value-checkbox"
        checked={value}
        onCheckedChange={onChange}
      />
      <label htmlFor="value-checkbox" className="text-sm">
        {value ? 'True' : 'False'}
      </label>
    </div>
  );
};
