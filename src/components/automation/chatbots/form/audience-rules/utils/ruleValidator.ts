
import { QueryGroup, QueryRule } from '@/types/queryBuilder';

export interface ValidationError {
  ruleId: string;
  field: string;
  message: string;
}

// The main validation function to be used by components
export const validateQueryGroup = (group: QueryGroup, fields: any[] = []): ValidationError[] => {
  return [...validateRules(group), ...detectRuleConflicts(group)];
};

export const validateRules = (group: QueryGroup): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Check rules in the current group
  group.rules.forEach(rule => {
    if ('field' in rule) {
      // This is a QueryRule
      // Check for empty fields
      if (!rule.field) {
        errors.push({
          ruleId: rule.id,
          field: 'field',
          message: 'Field is required'
        });
      }
      
      // Check for empty operators
      if (!rule.operator) {
        errors.push({
          ruleId: rule.id,
          field: 'operator',
          message: 'Operator is required'
        });
      }
      
      // Check for empty values (except for 'exists' and 'not_exists' operators)
      if (
        rule.value === undefined || 
        rule.value === null || 
        rule.value === '' || 
        (Array.isArray(rule.value) && rule.value.length === 0)
      ) {
        if (
          rule.operator !== 'exists' && 
          rule.operator !== 'not_exists' && 
          rule.operator !== 'is_empty' && 
          rule.operator !== 'is_not_empty'
        ) {
          errors.push({
            ruleId: rule.id,
            field: 'value',
            message: 'Value is required'
          });
        }
      }
    } else if ('combinator' in rule) {
      // This is a nested QueryGroup
      errors.push(...validateRules(rule));
    }
  });
  
  return errors;
};

export const detectRuleConflicts = (group: QueryGroup): ValidationError[] => {
  const errors: ValidationError[] = [];
  const fieldsWithOperators: Record<string, string[]> = {};
  
  // Helper function to check conflicts in a rule set
  const checkConflictsInRules = (rules: QueryRule[]) => {
    rules.forEach(rule => {
      if (!rule.field) return;
      
      if (!fieldsWithOperators[rule.field]) {
        fieldsWithOperators[rule.field] = [];
      }
      
      // Check for conflicting operators on the same field
      if (fieldsWithOperators[rule.field].includes(rule.operator)) {
        errors.push({
          ruleId: rule.id,
          field: 'operator',
          message: `Duplicate operator "${rule.operator}" for field "${rule.field}"`
        });
      } else {
        fieldsWithOperators[rule.field].push(rule.operator);
      }
      
      // Check for logical conflicts
      if (
        fieldsWithOperators[rule.field].includes('equals') &&
        fieldsWithOperators[rule.field].includes('not_equals')
      ) {
        errors.push({
          ruleId: rule.id,
          field: 'operator',
          message: `Conflicting operators for field "${rule.field}": equals and not_equals`
        });
      }
    });
  };
  
  // Filter rules to get only QueryRule types
  const queryRules = group.rules.filter((rule): rule is QueryRule => 'field' in rule);
  
  // Check current group's rules
  checkConflictsInRules(queryRules);
  
  // Recursively check nested groups
  group.rules.forEach(rule => {
    if ('combinator' in rule) {
      errors.push(...detectRuleConflicts(rule));
    }
  });
  
  return errors;
};
