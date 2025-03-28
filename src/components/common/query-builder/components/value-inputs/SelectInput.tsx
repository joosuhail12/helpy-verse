
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldExamples } from '../FieldExamples';
import { FieldType } from '@/types/queryBuilder';

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
    <div className="relative">
      <div className="flex items-center gap-2">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className={`w-[200px] ${errorMessage ? 'border-red-500' : ''}`}>
            <SelectValue placeholder="Select option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldExamples type={'select' as FieldType} />
      </div>
      {errorMessage && (
        <p className="text-sm text-red-500 absolute">{errorMessage}</p>
      )}
    </div>
  );
};
