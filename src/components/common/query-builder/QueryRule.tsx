
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import type { QueryRule as QueryRuleType, QueryField, ComparisonOperator } from '@/types/queryBuilder';

interface QueryRuleProps {
  rule: QueryRuleType;
  onChange: (rule: QueryRuleType) => void;
  onDelete: () => void;
  fields: QueryField[];
}

const getOperatorsForType = (type: string): { value: ComparisonOperator; label: string }[] => {
  const commonOperators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not_equals', label: 'Does not equal' },
    { value: 'is_empty', label: 'Is empty' },
    { value: 'is_not_empty', label: 'Is not empty' },
  ];

  switch (type) {
    case 'text':
      return [
        ...commonOperators,
        { value: 'contains', label: 'Contains' },
        { value: 'not_contains', label: 'Does not contain' },
        { value: 'starts_with', label: 'Starts with' },
        { value: 'ends_with', label: 'Ends with' },
      ];
    case 'number':
      return [
        ...commonOperators,
        { value: 'greater_than', label: 'Greater than' },
        { value: 'less_than', label: 'Less than' },
      ];
    case 'select':
      return [
        { value: 'equals', label: 'Is' },
        { value: 'not_equals', label: 'Is not' },
        { value: 'in', label: 'Is any of' },
        { value: 'not_in', label: 'Is none of' },
      ];
    default:
      return commonOperators;
  }
};

export const QueryRule = ({
  rule,
  onChange,
  onDelete,
  fields,
}: QueryRuleProps) => {
  const selectedField = fields.find(f => f.id === rule.field);
  const operators = selectedField ? getOperatorsForType(selectedField.type) : [];

  return (
    <div className="flex items-center gap-2">
      <Select
        value={rule.field}
        onValueChange={(value) => onChange({ ...rule, field: value, value: '' })}
      >
        <SelectTrigger className="w-[200px]">
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

      <Select
        value={rule.operator}
        onValueChange={(value) => onChange({ ...rule, operator: value as ComparisonOperator })}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select operator" />
        </SelectTrigger>
        <SelectContent>
          {operators.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedField && !['is_empty', 'is_not_empty'].includes(rule.operator) && (
        selectedField.type === 'select' ? (
          <Select
            value={String(rule.value)}
            onValueChange={(value) => onChange({ ...rule, value })}
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
            type={selectedField.type === 'number' ? 'number' : 'text'}
            value={String(rule.value)}
            onChange={(e) => onChange({ 
              ...rule, 
              value: selectedField.type === 'number' ? Number(e.target.value) : e.target.value 
            })}
            className="w-[200px]"
          />
        )
      )}

      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};
