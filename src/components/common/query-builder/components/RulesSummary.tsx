
import React from 'react';
import { QueryGroup, QueryRule } from '@/types/queryBuilder';
import { getOperatorLabel } from './utils';

interface RulesSummaryProps {
  queryGroup: QueryGroup;
  depth?: number;
}

export const getOperatorLabel = (operator: string): string => {
  const operatorMap: Record<string, string> = {
    equals: 'equals',
    notEquals: 'does not equal',
    contains: 'contains',
    not_contains: 'does not contain',
    startsWith: 'starts with',
    starts_with: 'starts with',
    endsWith: 'ends with',
    ends_with: 'ends with',
    greaterThan: 'is greater than',
    greater_than: 'is greater than',
    lessThan: 'is less than',
    less_than: 'is less than',
    between: 'is between',
    in: 'is in list',
    notIn: 'is not in list',
    not_in: 'is not in list',
    exists: 'exists',
    notExists: 'does not exist',
    custom_range: 'is in range',
    last_n_days: 'is in last',
    next_n_days: 'is in next',
    rolling_days: 'is in rolling period',
  };

  return operatorMap[operator] || operator;
};

export const RulesSummary: React.FC<RulesSummaryProps> = ({ queryGroup, depth = 0 }) => {
  const indent = depth * 20;

  return (
    <div className="space-y-2 text-sm">
      {queryGroup.rules.length === 0 ? (
        <p className="text-muted-foreground italic">No rules defined</p>
      ) : (
        <>
          {queryGroup.rules.map((rule, index) => {
            if ('field' in rule) {
              // This is a QueryRule
              return (
                <div key={rule.id} style={{ marginLeft: `${indent}px` }}>
                  <span>
                    {index > 0 && <span className="font-semibold mx-1">{queryGroup.combinator.toUpperCase()}</span>}
                    <span className="font-medium">{rule.field}</span>{' '}
                    <span>{getOperatorLabel(rule.operator)}</span>{' '}
                    <span className="font-medium">{JSON.stringify(rule.value)}</span>
                  </span>
                </div>
              );
            } else {
              // This is a nested QueryGroup
              return (
                <div key={rule.id}>
                  {index > 0 && (
                    <div style={{ marginLeft: `${indent}px` }} className="my-1 font-semibold">
                      {queryGroup.combinator.toUpperCase()}
                    </div>
                  )}
                  <div className="border-l-2 border-gray-300 dark:border-gray-700 pl-2">
                    <RulesSummary queryGroup={rule} depth={depth + 1} />
                  </div>
                </div>
              );
            }
          })}
        </>
      )}
    </div>
  );
};
