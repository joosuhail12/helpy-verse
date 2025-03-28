
import React from 'react';
import { Input } from '@/components/ui/input';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string | null;
}

export const DateInput: React.FC<DateInputProps> = ({ 
  value, 
  onChange, 
  errorMessage 
}) => {
  return (
    <div>
      <Input
        type="date"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={errorMessage ? 'border-red-500' : ''}
      />
      {errorMessage && (
        <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
      )}
    </div>
  );
};
