
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<string | { label: string; value: string }>;
  errorMessage?: string | null;
}

export const SelectInput: React.FC<SelectInputProps> = ({ 
  value, 
  onChange, 
  options,
  errorMessage 
}) => {
  return (
    <div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`w-full ${errorMessage ? 'border-red-500' : ''}`}>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => {
            const optionValue = typeof option === 'string' ? option : option.value;
            const optionLabel = typeof option === 'string' ? option : option.label;
            
            return (
              <SelectItem key={optionValue} value={optionValue}>
                {optionLabel}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
