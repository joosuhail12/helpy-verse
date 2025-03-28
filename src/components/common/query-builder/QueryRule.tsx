
import { useState } from 'react';
import { OperatorSelect } from './components/OperatorSelect';
import { FieldSelect } from './components/FieldSelect';
import { ValueInput } from './components/value-inputs/ValueInput';
import { SourceSelect } from './components/SourceSelect';

// Simplified interfaces to avoid complex type references
interface QueryField {
  id: string;
  label: string;
  type: string;
  name: string;
  dataSource?: string;
  customObject?: string;
  options?: string[];
}

interface QueryRule {
  id: string;
  field: string;
  operator: string;
  value: any;
}

interface ValidationError {
  message: string;
  path?: string;
  field?: string;
  rule?: { id: string };
}

interface QueryRuleProps {
  rule: QueryRule;
  onChange: (rule: QueryRule) => void;
  fields: QueryField[];
  errors?: ValidationError[];
}

export const QueryRule = ({ rule, onChange, fields, errors = [] }: QueryRuleProps) => {
  const [selectedSource, setSelectedSource] = useState<string>('');
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

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    onChange({ ...rule, field: '' });
  };

  const getErrorMessage = (fieldPath: string) => {
    const error = ruleErrors.find(err => err.path === fieldPath || err.field === fieldPath);
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
        </div>

        <div className="space-y-1 relative">
          {selectedField && (
            <ValueInput
              field={selectedField}
              operator={rule.operator}
              value={rule.value}
              onChange={(value) => onChange({ ...rule, value })}
              errorMessage={getErrorMessage('value')}
            />
          )}
        </div>
      </div>
    </div>
  );
};
