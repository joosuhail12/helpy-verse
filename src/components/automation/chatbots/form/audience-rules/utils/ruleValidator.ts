
<<<<<<< HEAD
import { QueryGroup, QueryRule } from "@/types/queryBuilder";

export type ValidationResult = {
  isValid: boolean;
  error?: string;
};

export type ValidationError = {
  message: string;
  path?: string;
  ruleId?: string;
  field?: string;
};

type ComparisonOperator = 
  | "equals" 
  | "not_equals" 
  | "contains" 
  | "not_contains" 
  | "starts_with" 
  | "ends_with"
  | "greater_than" 
  | "less_than" 
  | "between" 
  | "in" 
  | "not_in"
  | "exists"
  | "not_exists";

export const validateQueryGroup = (group: QueryGroup): ValidationResult => {
  // Check if group has rules or groups
  if (!group.rules || group.rules.length === 0) {
    return { isValid: false, error: 'Group must contain at least one rule' };
  }

  // Validate each rule in the group
  for (const rule of group.rules) {
    if ('rules' in rule) {
      // This is a nested group
      const nestedResult = validateQueryGroup(rule as QueryGroup);
      if (!nestedResult.isValid) {
        return nestedResult;
      }
    } else {
      // This is a rule
      const ruleResult = validateQueryRule(rule as QueryRule);
      if (!ruleResult.isValid) {
        return ruleResult;
      }
    }
  }

  return { isValid: true };
};

export const validateQueryRule = (rule: QueryRule): ValidationResult => {
  // Check if field is selected
  if (!rule.field) {
    return { isValid: false, error: 'Field is required' };
  }

  // Check if operator is selected
  if (!rule.operator) {
    return { isValid: false, error: 'Operator is required' };
  }

  // Validate value based on operator
  if (
    rule.operator !== ("exists" as ComparisonOperator) && 
    rule.operator !== ("not_exists" as ComparisonOperator) &&
    rule.value === undefined
  ) {
    return { isValid: false, error: 'Value is required for this operator' };
  }

  // Validate "between" operator
  if (rule.operator === "between" && Array.isArray(rule.value) && (rule.value.length !== 2 || rule.value[0] > rule.value[1])) {
    return { isValid: false, error: 'Between operator requires two values in ascending order' };
  }

  // Validate "in" and "not_in" operators
  if ((rule.operator === "in" || rule.operator === "not_in") && (!Array.isArray(rule.value) || rule.value.length === 0)) {
    return { isValid: false, error: 'List operators require at least one value' };
  }

  return { isValid: true };
};

export const ruleHasValue = (rule: QueryRule): boolean => {
  if (rule.operator === ("exists" as ComparisonOperator) || rule.operator === ("not_exists" as ComparisonOperator)) {
    return true;
  }
  
  if (rule.value === undefined || rule.value === null || rule.value === '') {
    return false;
  }
  
  if (Array.isArray(rule.value) && rule.value.length === 0) {
    return false;
  }
  
  return true;
};

export const countRules = (group: QueryGroup): number => {
  let count = 0;
  
  for (const rule of group.rules) {
    if ('rules' in rule) {
      // This is a nested group
      count += countRules(rule as QueryGroup);
    } else {
      // This is a rule
      count += 1;
    }
  }
  
  return count;
};

export const findRuleByField = (group: QueryGroup, fieldName: string): QueryRule | null => {
  for (const rule of group.rules) {
    if ('rules' in rule) {
      // This is a nested group
      const found = findRuleByField(rule as QueryGroup, fieldName);
      if (found) return found;
    } else {
      // This is a rule
      if ((rule as QueryRule).field === fieldName) {
        return rule as QueryRule;
      }
    }
  }
  
  return null;
=======
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
>>>>>>> c756439 (Update frontend code)
};
