
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface MultiSelectInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
}

export const MultiSelectInput = ({ value, onChange, options }: MultiSelectInputProps) => {
  const handleOptionClick = (option: string) => {
    const newValues = value.includes(option)
      ? value.filter((v) => v !== option)
      : [...value, option];
    onChange(newValues);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <div
            key={option}
            onClick={() => handleOptionClick(option)}
            className="cursor-pointer"
          >
            <Badge variant={value.includes(option) ? "default" : "outline"}>
              {option}
              {value.includes(option) && <Check className="ml-1 h-3 w-3" />}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
};
