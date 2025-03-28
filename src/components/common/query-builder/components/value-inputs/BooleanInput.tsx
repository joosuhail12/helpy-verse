
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface BooleanInputProps {
  value: boolean | string;
  onChange: (value: boolean) => void;
  errorMessage?: string | null;
}

export const BooleanInput = ({ value, onChange, errorMessage }: BooleanInputProps) => {
  const boolValue = typeof value === 'string' 
    ? value === 'true' 
    : Boolean(value);

  return (
    <Select 
      value={boolValue.toString()} 
      onValueChange={(val) => onChange(val === 'true')}
    >
      <SelectTrigger className={`w-full ${errorMessage ? 'border-red-500' : ''}`}>
        <SelectValue placeholder="Select value" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">True</SelectItem>
        <SelectItem value="false">False</SelectItem>
      </SelectContent>
    </Select>
  );
};
