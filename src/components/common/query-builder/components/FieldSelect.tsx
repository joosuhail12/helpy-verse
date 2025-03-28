
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface QueryField {
  id: string;
  label: string;
  type: string;
  name: string;
}

interface FieldSelectProps {
  value: string;
  onChange: (value: string) => void;
  fields: QueryField[];
  disabled?: boolean;
  errorMessage?: string | null;
}

export const FieldSelect: React.FC<FieldSelectProps> = ({
  value,
  onChange,
  fields,
  disabled,
  errorMessage,
}) => {
  // Group fields by type for better organization
  const groupedFields = fields.reduce((acc, field) => {
    const type = field.type.charAt(0).toUpperCase() + field.type.slice(1);
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(field);
    return acc;
  }, {} as Record<string, QueryField[]>);

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={`w-[200px] ${errorMessage ? 'border-red-500' : ''}`}>
        <SelectValue placeholder="Select field" />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(groupedFields).map(([type, typeFields]) => (
          <SelectGroup key={type} className="mt-2">
            {typeFields.map((field) => (
              <SelectItem key={field.id} value={field.id}>
                {field.label}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
        {fields.length === 0 && (
          <div className="p-2 text-sm text-muted-foreground">No fields available</div>
        )}
      </SelectContent>
    </Select>
  );
};
