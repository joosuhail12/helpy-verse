
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SelectInputProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  errorMessage?: string | null;
}

export const SelectInput: React.FC<SelectInputProps> = ({ 
  value, 
  onChange, 
  options,
  errorMessage 
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-full ${errorMessage ? 'border-red-500' : ''}`}>
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
