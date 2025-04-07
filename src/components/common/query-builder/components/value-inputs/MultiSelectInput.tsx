
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface OptionType {
  label: string;
  value: string;
}

interface MultiSelectInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: OptionType[] | string[];
}

export const MultiSelectInput = ({ value, onChange, options }: MultiSelectInputProps) => {
  const handleOptionClick = (optionValue: string, optionLabel: string) => {
    const newValues = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValues);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const optionValue = typeof option === 'string' ? option : option.value;
          const optionLabel = typeof option === 'string' ? option : option.label;
          
          return (
            <div
              key={optionValue}
              onClick={() => handleOptionClick(optionValue, optionLabel)}
              className="cursor-pointer"
            >
              <Badge variant={value.includes(optionValue) ? "default" : "outline"}>
                {optionLabel}
                {value.includes(optionValue) && <Check className="ml-1 h-3 w-3" />}
              </Badge>
            </div>
          );
        })}
      </div>
    </div>
  );
};
