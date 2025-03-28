
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { DataSource } from '@/types/queryBuilder';
import { mockCustomObjects } from '@/mock/customObjects';
import { cn } from '@/lib/utils';

type ExtendedDataSource = DataSource | `custom_objects.${string}` | '';

interface SourceSelectProps {
  value: ExtendedDataSource;
  onChange: (value: ExtendedDataSource) => void;
  errorMessage?: string | null;
}

export const SourceSelect = ({ value, onChange, errorMessage }: SourceSelectProps) => {
  const availableSources = mockCustomObjects
    .filter(obj => obj.connectionType === 'customer' || obj.connectionType === 'ticket')
    .map(obj => `custom_objects.${obj.slug}` as ExtendedDataSource);

  const getSourceLabel = (source: ExtendedDataSource) => {
    if (source === 'contacts') return 'Contact Information';
    if (source === 'companies') return 'Company Information';
    if (source === 'general') return 'General Information';
    if (source.startsWith('custom_objects.')) {
      const slug = source.split('.')[1];
      const customObject = mockCustomObjects.find(obj => obj.slug === slug);
      return customObject?.name || slug;
    }
    return source;
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-[200px]", errorMessage && "border-red-500")}>
        <SelectValue placeholder="Select data source" />
      </SelectTrigger>
      <SelectContent>
        {[...['contacts', 'companies', 'general'] as ExtendedDataSource[], ...availableSources].map((source) => (
          <SelectItem key={source} value={source}>
            {getSourceLabel(source)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
