
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { QueryRule as QueryRuleType, QueryField, DataSource } from '@/types/queryBuilder';
import { useState, useMemo } from 'react';

interface QueryRuleProps {
  rule: QueryRuleType;
  onChange: (rule: QueryRuleType) => void;
  fields: QueryField[];
}

export const QueryRule = ({ rule, onChange, fields }: QueryRuleProps) => {
  const [selectedSource, setSelectedSource] = useState<DataSource | ''>('');
  const selectedField = fields.find((f) => f.id === rule.field);

  const availableSources = useMemo(() => {
    const sources = new Set(fields.map(field => field.source));
    return Array.from(sources);
  }, [fields]);

  const sourceFields = useMemo(() => {
    return fields.filter(field => field.source === selectedSource);
  }, [fields, selectedSource]);

  const handleSourceChange = (source: DataSource) => {
    setSelectedSource(source);
    // Clear the field selection when source changes
    onChange({ ...rule, field: '' });
  };

  const getOperatorOptions = () => {
    if (!selectedField) return [];

    const textOperators = [
      { value: 'equals', label: 'Equals' },
      { value: 'not_equals', label: 'Not Equals' },
      { value: 'contains', label: 'Contains' },
      { value: 'not_contains', label: 'Does Not Contain' },
      { value: 'starts_with', label: 'Starts With' },
      { value: 'ends_with', label: 'Ends With' },
    ];

    const numberOperators = [
      { value: 'equals', label: 'Equals' },
      { value: 'not_equals', label: 'Not Equals' },
      { value: 'greater_than', label: 'Greater Than' },
      { value: 'less_than', label: 'Less Than' },
    ];

    switch (selectedField.type) {
      case 'text':
      case 'select':
      case 'multi-select':
        return textOperators;
      case 'number':
        return numberOperators;
      case 'boolean':
        return [
          { value: 'equals', label: 'Equals' },
          { value: 'not_equals', label: 'Not Equals' },
        ];
      default:
        return textOperators;
    }
  };

  const sourceLabels: Record<DataSource, string> = {
    contacts: 'Contacts',
    companies: 'Companies',
    custom_objects: 'Custom Objects'
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedSource} onValueChange={handleSourceChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select table" />
        </SelectTrigger>
        <SelectContent>
          {availableSources.map((source) => (
            <SelectItem key={source} value={source}>
              {sourceLabels[source as DataSource]}
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

      <Select
        value={rule.operator}
        onValueChange={(value: any) => onChange({ ...rule, operator: value })}
        disabled={!rule.field}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select operator" />
        </SelectTrigger>
        <SelectContent>
          {getOperatorOptions().map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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
