
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SourceSelectProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string | null;
}

export const SourceSelect: React.FC<SourceSelectProps> = ({ value, onChange, errorMessage }) => {
  // Simple source options
  const sources = [
    { label: 'Contact', value: 'contact' },
    { label: 'Company', value: 'company' },
    { label: 'Conversation', value: 'conversation' }
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`w-[130px] ${errorMessage ? 'border-red-500' : ''}`}>
        <SelectValue placeholder="Data source" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Data Sources</SelectLabel>
          {sources.map((source) => (
            <SelectItem key={source.value} value={source.value}>
              {source.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
