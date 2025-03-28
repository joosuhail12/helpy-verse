
import { useState } from 'react';
import type { QueryRule as QueryRuleType, QueryField, DataSource, ValidationError } from '@/types/queryBuilder';
import { OperatorSelect } from './components/OperatorSelect';
import { SourceSelect } from './components/SourceSelect';
import { FieldSelect } from './components/FieldSelect';
import { ValueInput } from './components/value-inputs/ValueInput';

type ExtendedDataSource = DataSource | `custom_objects.${string}` | '';

interface QueryRuleProps {
  rule: QueryRuleType;
  onChange: (rule: QueryRuleType) => void;
  fields: QueryField[];
  errors?: ValidationError[];
}

export const QueryRule = ({ rule, onChange, fields, errors = [] }: QueryRuleProps) => {
  const [selectedSource, setSelectedSource] = useState<ExtendedDataSource>('');
  const selectedField = fields.find((f) => f.id === rule.field);
  const ruleErrors = errors.filter(error => error.rule?.id === rule.id);
  
  // Filter fields by source
  const sourceFields = fields.filter(field => {
    if (!selectedSource) return true;
    if (selectedSource.startsWith('custom_objects.')) {
      const customObjectId = selectedSource.split('.')[1];
      return field.customObject === customObjectId;
    }
    return field.dataSource === selectedSource;
  });

  const handleSourceChange = (source: ExtendedDataSource) => {
    setSelectedSource(source);
    onChange({ ...rule, field: '' });
  };

  const getErrorMessage = (fieldPath: string) => {
    const error = ruleErrors.find(err => err.path === fieldPath);
    return error ? error.message : null;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="space-y-1">
          <SourceSelect 
            value={selectedSource}
            onChange={handleSourceChange}
            errorMessage={getErrorMessage('field')}
          />
          {getErrorMessage('field') && (
            <p className="text-sm text-red-500">{getErrorMessage('field')}</p>
          )}
        </div>

        <div className="space-y-1">
          <FieldSelect
            value={rule.field}
            onChange={(value) => onChange({ ...rule, field: value })}
            fields={sourceFields}
            disabled={!selectedSource}
            errorMessage={getErrorMessage('field')}
          />
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
          <ValueInput
            field={selectedField || { id: '', label: '', type: 'text', name: '' }}
            operator={rule.operator}
            value={rule.value}
            onChange={(value) => onChange({ ...rule, value })}
            errorMessage={getErrorMessage('value')}
          />
          {getErrorMessage('value') && (
            <p className="text-sm text-red-500">{getErrorMessage('value')}</p>
          )}
        </div>
      </div>
    </div>
  );
};
