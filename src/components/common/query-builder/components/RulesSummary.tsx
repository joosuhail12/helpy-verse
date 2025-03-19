
import React from 'react';
import { QueryGroup, QueryField, QueryRule } from '@/types/queryBuilder';

// Helper function to get operator display label
const getOperatorLabel = (operator: string): string => {
  const operatorMap: Record<string, string> = {
    'equals': 'equals',
    'notEquals': 'not equals',
    'contains': 'contains',
    'startsWith': 'starts with',
    'endsWith': 'ends with',
    'greaterThan': 'greater than',
    'lessThan': 'less than',
    'in': 'in',
    'notIn': 'not in',
    'exists': 'is set',
    'notExists': 'is not set',
    'custom_range': 'between',
    'last_n_days': 'last n days',
    'next_n_days': 'next n days',
    'rolling_days': 'rolling days',
    'not_equals': 'not equals',
    'starts_with': 'starts with',
    'greater_than': 'greater than',
    'less_than': 'less than',
    'between': 'between',
    'not_in': 'not in'
  };
  
  return operatorMap[operator] || operator;
};

interface RulesSummaryProps {
  group: QueryGroup;
  fields: QueryField[];
}

export const RulesSummary: React.FC<RulesSummaryProps> = ({ group, fields }) => {
  const renderValue = (rule: QueryRule): string => {
    if (rule.operator === 'exists' || rule.operator === 'notExists') {
      return '';
    }
    
    if (Array.isArray(rule.value)) {
      return rule.value.join(', ');
    }
    
    return String(rule.value || '');
  };

  const renderRule = (rule: QueryRule): string => {
    const field = fields.find(f => f.id === rule.field);
    if (!field) return 'Invalid field';
    
    return `${field.label} ${getOperatorLabel(rule.operator)} ${renderValue(rule)}`;
  };

  const renderGroup = (group: QueryGroup, depth = 0): JSX.Element => {
    if (group.rules.length === 0) {
      return <div className="text-muted-foreground">No rules defined</div>;
    }
    
    return (
      <div className={depth > 0 ? "ml-4" : ""}>
        {group.rules.map((rule, index) => {
          const isNotFirst = index > 0;
          
          return (
            <div key={rule.id}>
              {isNotFirst && (
                <div className="text-sm font-medium my-1 text-muted-foreground">
                  {group.combinator.toUpperCase()}
                </div>
              )}
              
              {'field' in rule ? (
                <div className="text-sm">{renderRule(rule as QueryRule)}</div>
              ) : (
                <div className="border-l-2 border-gray-200 pl-2 my-2">
                  {renderGroup(rule as QueryGroup, depth + 1)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg border">
      <h3 className="text-sm font-medium mb-3">Rule Summary</h3>
      {renderGroup(group)}
    </div>
  );
};
