
import React from 'react';
import { Input } from '@/components/ui/input';
import { FieldExamples } from '../FieldExamples';
import { FieldType } from '@/types/queryBuilder';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  errorMessage?: string | null;
}

export const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter value',
  errorMessage
}) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Input
          value={value === undefined ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={errorMessage ? 'border-red-500' : ''}
          type="text"
        />
        <FieldExamples type={'text' as FieldType} />
      </div>
      {errorMessage && (
        <p className="text-sm text-red-500 absolute">{errorMessage}</p>
      )}
    </div>
  );
};
