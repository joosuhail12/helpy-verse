
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import type { QueryRule as QueryRuleType, QueryField, DataSource } from '@/types/queryBuilder';
import { useState } from 'react';
import { mockCustomObjects } from '@/mock/customObjects';
import { useSourceFields } from './hooks/useSourceFields';
import { OperatorSelect } from './components/OperatorSelect';
import { FieldExamples } from './components/FieldExamples';
import type { ValidationError } from '@/components/automation/chatbots/form/audience-rules/utils/validation';

interface QueryRuleProps {
  rule: QueryRuleType;
  onChange: (rule: QueryRuleType) => void;
  fields: QueryField[];
  errors?: ValidationError[];
}

type ExtendedDataSource = DataSource | `custom_objects.${string}` | '';

export const QueryRule = ({ rule, onChange, fields, errors = [] }: QueryRuleProps) => {
  const [selectedSource, setSelectedSource] = useState<ExtendedDataSource>('');
  const selectedField = fields.find((f) => f.id === rule.field);
  
  const ruleErrors = errors.filter(error => error.ruleId === rule.id);
  
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

  const getErrorMessage = (fieldName: string) => {
    const error = ruleErrors.find(err => err.field === fieldName);
    return error ? error.message : null;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="space-y-1">
          <Select value={selectedSource} onValueChange={handleSourceChange}>
            <SelectTrigger className={`w-[200px] ${getErrorMessage('field') ? 'border-red-500' : ''}`}>
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
          {getErrorMessage('field') && (
            <p className="text-sm text-red-500">{getErrorMessage('field')}</p>
          )}
        </div>

        <div className="space-y-1">
          <Select 
            value={rule.field} 
            onValueChange={(value) => onChange({ ...rule, field: value })}
            disabled={!selectedSource}
          >
            <SelectTrigger className={`w-[200px] ${getErrorMessage('field') ? 'border-red-500' : ''}`}>
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
        </div>

        <div className="space-y-1">
          <OperatorSelect
            selectedField={selectedField}
            value={rule.operator}
            onValueChange={(value) => onChange({ ...rule, operator: value })}
            disabled={!rule.field}
          />
          {getErrorMessage('operator') && (
            <p className="text-sm text-red-500">{getErrorMessage('operator')}</p>
          )}
        </div>

        <div className="space-y-1 relative">
          {selectedField?.type === 'select' ? (
            <Select
              value={rule.value as string}
              onValueChange={(value) => onChange({ ...rule, value })}
              disabled={!rule.operator}
            >
              <SelectTrigger className={`w-[200px] ${getErrorMessage('value') ? 'border-red-500' : ''}`}>
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
            <div className="flex items-center gap-2">
              <Input
                type={selectedField?.type === 'number' ? 'number' : 'text'}
                value={rule.value as string}
                onChange={(e) =>
                  onChange({
                    ...rule,
                    value: selectedField?.type === 'number' ? Number(e.target.value) : e.target.value,
                  })
                }
                className={`w-[200px] ${getErrorMessage('value') ? 'border-red-500' : ''}`}
                placeholder="Enter value"
                disabled={!rule.operator}
              />
              {selectedField && <FieldExamples type={selectedField.type} />}
            </div>
          )}
          {getErrorMessage('value') && (
            <p className="text-sm text-red-500">{getErrorMessage('value')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

