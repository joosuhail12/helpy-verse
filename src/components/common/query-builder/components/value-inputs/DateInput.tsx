
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
    <Input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full ${errorMessage ? 'border-red-500' : ''}`}
    />
  );
};
