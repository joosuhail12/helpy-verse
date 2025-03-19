
import React from 'react';
import { Input } from '@/components/ui/input';
import { FieldExamples } from '../FieldExamples';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string | null;
}

export const TextInput: React.FC<TextInputProps> = ({ value, onChange, errorMessage }) => {
  return (
    <div className="space-y-1">
      <Input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={errorMessage ? "border-red-500" : ""}
        placeholder="Enter value"
      />
      <FieldExamples fieldType="string" />
    </div>
  );
};
