
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface BooleanInputProps {
  value: boolean;
  onChange: (value: boolean) => void;
  errorMessage?: string | null;
}

export const BooleanInput: React.FC<BooleanInputProps> = ({
  value,
  onChange,
  errorMessage
}) => {
  return (
    <div className={`flex items-center space-x-2 ${errorMessage ? 'text-red-500' : ''}`}>
      <Checkbox
        id="boolean-input"
        checked={!!value}
        onCheckedChange={(checked) => onChange(!!checked)}
      />
      <Label htmlFor="boolean-input" className="text-sm">{value ? 'True' : 'False'}</Label>
      
      {errorMessage && (
        <p className="text-sm text-red-500 ml-2">{errorMessage}</p>
      )}
    </div>
  );
};
