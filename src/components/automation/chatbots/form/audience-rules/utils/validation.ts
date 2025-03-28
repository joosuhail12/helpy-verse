
import { QueryGroup, QueryRule, ValidationError } from '@/types/queryBuilder';

// Re-export the ValidationError type to match the type in queryBuilder.ts
export type { ValidationError } from '@/types/queryBuilder';

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Validates a query group recursively
export const validateQueryGroup = (queryGroup: QueryGroup): ValidationResult => {
  const errors: ValidationError[] = [];
  
  // Check if the group has rules
  if (!queryGroup.rules || queryGroup.rules.length === 0) {
    errors.push({
      message: 'Group must contain at least one rule',
      group: queryGroup,
      path: 'rules'
    });
    return { isValid: errors.length ===, errors };
  }
  
  // Validate each rule/group
  queryGroup.rules.forEach((item, index) => {
    if ('combinator' in item) {
      // It's a group
      const result = validateQueryGroup(item);
      if (!result.isValid) {
        errors.push(...result.errors.map(error => ({
          ...error,
          path: `rules[${index}].${error.path}`
        })));
      }
    } else {
      // It's a rule
      const rule = item as QueryRule;
      
      // Validate rule fields
      if (!rule.field) {
        errors.push({
          message: 'Field is required',
          rule,
          path: `rules[${index}].field`
        });
      }
      
      if (!rule.operator) {
        errors.push({
          message: 'Operator is required',
          rule,
          path: `rules[${index}].operator`
        });
      }
      
      // Some operators don't need values
      const noValueOperators = ['is_empty', 'is_not_empty'];
      if (!noValueOperators.includes(rule.operator) && rule.value === undefined) {
        errors.push({
          message: 'Value is required',
          rule,
          path: `rules[${index}].value`
        });
      }
    }
  });
  
  return { isValid: errors.length === 0, errors };
};
