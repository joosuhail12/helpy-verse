
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface MultiSelectInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: Array<string | { label: string; value: string }>;
  errorMessage?: string | null;
}

export const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  value = [],
  onChange,
  options,
  errorMessage
}) => {
  const handleToggleOption = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(item => item !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  return (
    <div className={`space-y-2 ${errorMessage ? 'border-red-500 border rounded p-2' : ''}`}>
      {options.map((option) => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const optionLabel = typeof option === 'string' ? option : option.label;
        
        return (
          <div key={optionValue} className="flex items-center space-x-2">
            <Checkbox
              id={`option-${optionValue}`}
              checked={value.includes(optionValue)}
              onCheckedChange={() => handleToggleOption(optionValue)}
            />
            <Label htmlFor={`option-${optionValue}`} className="text-sm">{optionLabel}</Label>
          </div>
        );
      })}
      
      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
