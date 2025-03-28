
import React from 'react';
import { Input } from '@/components/ui/input';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string | null;
}

export const TextInput: React.FC<TextInputProps> = ({ 
  value, 
  onChange, 
  errorMessage 
}) => {
  return (
    <div>
      <Input
        type="text"
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
