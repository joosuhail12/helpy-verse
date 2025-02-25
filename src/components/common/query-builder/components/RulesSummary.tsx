
import { QueryGroup, QueryRule, QueryField } from '@/types/queryBuilder';
import { getOperatorLabel } from '../components/OperatorSelect';

const getFieldLabel = (fieldId: string, fields: QueryField[]): string => {
  const field = fields.find(f => f.id === fieldId);
  return field?.label || fieldId;
};

const getRuleDescription = (rule: QueryRule, fields: QueryField[]): string => {
  const fieldLabel = getFieldLabel(rule.field, fields);
  const operatorLabel = getOperatorLabel(rule.operator);
  
  if (['is_empty', 'is_not_empty'].includes(rule.operator)) {
    return `${fieldLabel} ${operatorLabel}`;
  }

  return `${fieldLabel} ${operatorLabel} ${Array.isArray(rule.value) ? rule.value.join(', ') : rule.value}`;
};

const getGroupDescription = (group: QueryGroup, fields: QueryField[]): string => {
  const descriptions = group.rules.map(rule => {
    if ('field' in rule) {
      return getRuleDescription(rule, fields);
    }
    return `(${getGroupDescription(rule, fields)})`;
  });

  return descriptions.join(` ${group.combinator.toUpperCase()} `);
};

interface RulesSummaryProps {
  group: QueryGroup;
  fields: QueryField[];
}

export const RulesSummary = ({ group, fields }: RulesSummaryProps) => {
  if (group.rules.length === 0) {
    return <p className="text-sm text-muted-foreground italic">No rules defined yet</p>;
  }

  return (
    <div className="bg-slate-50 p-4 rounded-lg border text-sm">
      <p className="font-medium mb-1">Rules Summary:</p>
      <p className="text-muted-foreground">{getGroupDescription(group, fields)}</p>
    </div>
  );
};

