
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CustomFieldType } from '@/types/customField';

interface EditFieldProps {
  type: CustomFieldType;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  options?: string[];
  isSaving?: boolean;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const EditField = ({
  type,
  value,
  onChange,
  options = [],
  isSaving = false,
  inputRef,
}: EditFieldProps) => {
  switch (type) {
    case 'boolean':
      return (
        <Switch
          checked={Boolean(value)}
          onCheckedChange={(checked) => onChange(checked)}
          disabled={isSaving}
        />
      );

    case 'select':
      return (
        <Select value={String(value)} onValueChange={(val) => onChange(val)}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );

    case 'rich-text':
      return (
        <Textarea
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[100px]"
          disabled={isSaving}
        />
      );

    case 'currency':
      return (
        <Input
          ref={inputRef}
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8"
          disabled={isSaving}
        />
      );

    default:
      return (
        <Input
          ref={inputRef}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8"
          disabled={isSaving}
        />
      );
  }
};
