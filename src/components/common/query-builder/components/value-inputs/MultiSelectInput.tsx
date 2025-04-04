
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface MultiSelectInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  errorMessage?: string | null;
}

export const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  value = [],
  onChange,
  options,
  errorMessage
}) => {
  const handleToggleOption = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(item => item !== option));
    } else {
      onChange([...value, option]);
    }
  };

  return (
    <div className={`space-y-2 ${errorMessage ? 'border-red-500 border rounded p-2' : ''}`}>
      {options.map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Checkbox
            id={`option-${option}`}
            checked={value.includes(option)}
            onCheckedChange={() => handleToggleOption(option)}
          />
          <Label htmlFor={`option-${option}`} className="text-sm">{option}</Label>
        </div>
      ))}
    </div>
  );
};
