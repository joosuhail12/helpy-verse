
import React from 'react';
import { Input } from '@/components/ui/input';

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
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full h-10 rounded-md border border-input px-3 py-2 ${errorMessage ? 'border-red-500' : ''}`}
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
