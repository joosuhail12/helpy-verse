
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  errorMessage?: string | null;
}

export const SelectInput = ({ value, onChange, options, errorMessage }: SelectInputProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-full ${errorMessage ? 'border-red-500' : ''}`}>
        <SelectValue placeholder="Select value" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
        {options.length === 0 && (
          <div className="p-2 text-sm text-muted-foreground">No options available</div>
        )}
      </SelectContent>
    </Select>
  );
};
