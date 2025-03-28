
import React from 'react';
import { Input } from '@/components/ui/input';

interface NumberInputProps {
  value: number | string;
  onChange: (value: number) => void;
  errorMessage?: string | null;
}

export const NumberInput: React.FC<NumberInputProps> = ({ 
  value, 
  onChange, 
  errorMessage 
}) => {
  return (
    <div>
      <Input
        type="number"
        value={value === undefined || value === null ? '' : value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={errorMessage ? 'border-red-500' : ''}
      />
      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
