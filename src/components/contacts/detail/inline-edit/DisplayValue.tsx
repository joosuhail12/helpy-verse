
import { Badge } from '@/components/ui/badge';
import { CustomFieldType } from '@/types/customField';

interface DisplayValueProps {
  type?: CustomFieldType;
  value: string | number | boolean | string[];
}

export const DisplayValue = ({ type = 'text', value }: DisplayValueProps) => {
  // Handle empty values
  if (value === null || value === undefined || value === '') {
    return <span className="text-muted-foreground italic">Not set</span>;
  }

  // Handle boolean values
  if (type === 'boolean' || typeof value === 'boolean') {
    return <span>{value === true || value === 'true' ? 'Yes' : 'No'}</span>;
  }

  // Handle array values (for multi-select)
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((item, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {item}
          </Badge>
        ))}
      </div>
    );
  }

  // Default text display
  return <span className="text-sm">{String(value)}</span>;
};
