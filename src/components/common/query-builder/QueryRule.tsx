
import { useState } from 'react';
import type { QueryRule as QueryRuleType, QueryField, DataSource } from '@/types/queryBuilder';
import type { ValidationError } from '@/components/automation/chatbots/form/audience-rules/utils/validation';
import { useSourceFields } from './hooks/useSourceFields';
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
  const ruleErrors = errors.filter(error => error.ruleId === rule.id);
  const sourceFields = useSourceFields(selectedSource, fields);

  const handleSourceChange = (source: ExtendedDataSource) => {
    setSelectedSource(source);
    onChange({ ...rule, field: '' });
  };

  const getErrorMessage = (fieldName: string) => {
    const error = ruleErrors.find(err => err.field === fieldName);
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
            rule={rule}
            selectedField={selectedField}
            onChange={onChange}
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
