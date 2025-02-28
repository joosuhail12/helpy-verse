
import { QueryGroup, QueryRule } from '@/types/queryBuilder';

export interface ValidationError {
  ruleId: string;
  field: string;
  message: string;
}

export const validateRules = (group: QueryGroup): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Recursively check all nested groups
  group.groups.forEach(nestedGroup => {
    errors.push(...validateRules(nestedGroup));
  });
  
  // Check rules in the current group
  group.rules.forEach(rule => {
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
  
  // Check current group's rules
  checkConflictsInRules(group.rules);
  
  // Recursively check nested groups if combinator is the same
  group.groups.forEach(nestedGroup => {
    if (nestedGroup.combinator === group.combinator) {
      // Only check conflicts if the combinators match (e.g., both are 'and')
      // For 'or' combinators, rules can be contradictory without being a conflict
      checkConflictsInRules(nestedGroup.rules);
    }
    
    // Always recursively check deeper nested groups
    errors.push(...detectRuleConflicts(nestedGroup));
  });
  
  return errors;
};
