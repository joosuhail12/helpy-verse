
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { QueryField } from '@/types/queryBuilder';
import { cn } from '@/lib/utils';

interface FieldSelectProps {
  value: string;
  onChange: (value: string) => void;
  fields: QueryField[];
  disabled?: boolean;
  errorMessage?: string | null;
}

export const FieldSelect = ({ value, onChange, fields, disabled, errorMessage }: FieldSelectProps) => {
  return (
    <Select 
      value={value} 
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className={cn("w-[200px]", errorMessage && "border-red-500")}>
        <SelectValue placeholder="Select field" />
      </SelectTrigger>
      <SelectContent>
        {fields.map((field) => (
          <SelectItem key={field.id} value={field.id}>
            {field.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
