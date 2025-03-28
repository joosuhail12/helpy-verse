
import React from 'react';

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
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    onChange(selectedOptions);
  };

  return (
    <select
      multiple
      value={value}
      onChange={handleChange}
      className={`w-full h-24 rounded-md border border-input px-3 py-2 ${errorMessage ? 'border-red-500' : ''}`}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
