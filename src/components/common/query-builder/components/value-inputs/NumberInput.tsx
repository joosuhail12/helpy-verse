
import React from 'react';
import { Input } from '@/components/ui/input';
import { FieldExamples } from '../FieldExamples';
import { FieldType } from '@/types/queryBuilder';

interface NumberInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  errorMessage?: string | null;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  placeholder = 'Enter number',
  errorMessage
}) => {
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <Input
          value={value === undefined ? '' : value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          placeholder={placeholder}
          className={errorMessage ? 'border-red-500' : ''}
          type="number"
        />
        <FieldExamples type={'number' as FieldType} />
      </div>
      {errorMessage && (
        <p className="text-sm text-red-500 absolute">{errorMessage}</p>
      )}
    </div>
  );
};
