
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { FieldExamples } from '../FieldExamples';
import { FieldType } from '@/types/queryBuilder';

interface MultiSelectInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: string[];
  errorMessage?: string | null;
}

export const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  value = [],
  onChange,
  options,
  errorMessage
}) => {
  const handleAddValue = (newValue: string) => {
    if (!value.includes(newValue)) {
      onChange([...value, newValue]);
    }
  };

  const handleRemoveValue = (valueToRemove: string) => {
    onChange(value.filter(v => v !== valueToRemove));
  };

  return (
    <div className="relative">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Select onValueChange={handleAddValue}>
            <SelectTrigger className={`w-[200px] ${errorMessage ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Add option" />
            </SelectTrigger>
            <SelectContent>
              {options
                .filter(option => !value.includes(option))
                .map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <FieldExamples type={'multi-select' as FieldType} />
        </div>

        {value && value.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {value.map((item, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {item}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => handleRemoveValue(item)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="text-sm text-red-500 absolute">{errorMessage}</p>
      )}
    </div>
  );
};
