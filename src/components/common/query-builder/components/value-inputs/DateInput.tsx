
import React from 'react';
import { Input } from '@/components/ui/input';

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  operator?: string;
  errorMessage?: string | null;
}

export const DateInput = ({ value, onChange, errorMessage }: DateInputProps) => {
  return (
    <Input
      type="date"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full ${errorMessage ? 'border-red-500' : ''}`}
    />
  );
};
