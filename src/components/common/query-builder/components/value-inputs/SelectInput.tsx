
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface OptionType {
  label: string;
  value: string | number | boolean;
}

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  options: OptionType[] | string[];
  errorMessage?: string | null;
}

export const SelectInput = ({ value, onChange, options, errorMessage }: SelectInputProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-[200px]", errorMessage && "border-red-500")}>
        <SelectValue placeholder="Select value" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : String(option.value);
          const optionLabel = typeof option === 'string' ? option : option.label;
          
          return (
            <SelectItem key={optionValue} value={optionValue}>
              {optionLabel}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
