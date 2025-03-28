
import React from 'react';

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
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-gray-300"
      />
      <label className="text-sm">{value ? 'True' : 'False'}</label>
    </div>
  );
};
