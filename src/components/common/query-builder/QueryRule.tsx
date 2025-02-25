
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { QueryRule as QueryRuleType, QueryField, DataSource } from '@/types/queryBuilder';
import { useState } from 'react';
import { mockCustomObjects } from '@/mock/customObjects';
import { useSourceFields } from './hooks/useSourceFields';
import { OperatorSelect } from './components/OperatorSelect';

interface QueryRuleProps {
  rule: QueryRuleType;
  onChange: (rule: QueryRuleType) => void;
  fields: QueryField[];
}

type ExtendedDataSource = DataSource | `custom_objects.${string}` | '';

export const QueryRule = ({ rule, onChange, fields }: QueryRuleProps) => {
  const [selectedSource, setSelectedSource] = useState<ExtendedDataSource>('');
  const selectedField = fields.find((f) => f.id === rule.field);
  
  const availableSources = mockCustomObjects
    .filter(obj => obj.connectionType === 'customer' || obj.connectionType === 'ticket')
    .map(obj => `custom_objects.${obj.slug}` as ExtendedDataSource);

  const sourceFields = useSourceFields(selectedSource, fields);

  const handleSourceChange = (source: ExtendedDataSource) => {
    setSelectedSource(source);
    onChange({ ...rule, field: '' });
  };

  const getSourceLabel = (source: ExtendedDataSource) => {
    if (source === 'contacts') return 'Contact Information';
    if (source === 'companies') return 'Company Information';
    if (source.startsWith('custom_objects.')) {
      const slug = source.split('.')[1];
      const customObject = mockCustomObjects.find(obj => obj.slug === slug);
      return customObject?.name || slug;
    }
    return source;
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedSource} onValueChange={handleSourceChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select data source" />
        </SelectTrigger>
        <SelectContent>
          {[...['contacts', 'companies'], ...availableSources].map((source) => (
            <SelectItem key={source} value={source}>
              {getSourceLabel(source as ExtendedDataSource)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={rule.field} 
        onValueChange={(value) => onChange({ ...rule, field: value })}
        disabled={!selectedSource}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select field" />
        </SelectTrigger>
        <SelectContent>
          {sourceFields.map((field) => (
            <SelectItem key={field.id} value={field.id}>
              {field.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <OperatorSelect
        selectedField={selectedField}
        value={rule.operator}
        onValueChange={(value) => onChange({ ...rule, operator: value })}
        disabled={!rule.field}
      />

      {selectedField?.type === 'select' ? (
        <Select
          value={rule.value as string}
          onValueChange={(value) => onChange({ ...rule, value })}
          disabled={!rule.operator}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {selectedField.options?.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type={selectedField?.type === 'number' ? 'number' : 'text'}
          value={rule.value as string}
          onChange={(e) =>
            onChange({
              ...rule,
              value: selectedField?.type === 'number' ? Number(e.target.value) : e.target.value,
            })
          }
          className="w-[200px]"
          placeholder="Enter value"
          disabled={!rule.operator}
        />
      )}
    </div>
  );
};
