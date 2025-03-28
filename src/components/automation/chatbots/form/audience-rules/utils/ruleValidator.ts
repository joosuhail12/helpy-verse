
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

// Add the missing evaluateRules function
export const evaluateRules = (data: any, ruleGroup: QueryGroup): boolean => {
  // Base case: no rules
  if (!ruleGroup.rules || ruleGroup.rules.length === 0) {
    return true;
  }

  // Check each rule in the group
  const evaluatedRules = ruleGroup.rules.map(rule => {
    if ('rules' in rule) {
      // This is a nested group
      return evaluateRules(data, rule as QueryGroup);
    } else {
      // This is a rule
      return evaluateRule(data, rule as QueryRule);
    }
  });

  // Combine results based on the combinator
  if (ruleGroup.combinator === 'and') {
    return evaluatedRules.every(result => result);
  } else {
    return evaluatedRules.some(result => result);
  }
};

const evaluateRule = (data: any, rule: QueryRule): boolean => {
  const fieldValue = data[rule.field];
  
  switch (rule.operator) {
    case 'equals':
      return fieldValue === rule.value;
    case 'not_equals':
      return fieldValue !== rule.value;
    case 'contains':
      return typeof fieldValue === 'string' && fieldValue.includes(rule.value);
    case 'not_contains':
      return typeof fieldValue === 'string' && !fieldValue.includes(rule.value);
    case 'starts_with':
      return typeof fieldValue === 'string' && fieldValue.startsWith(rule.value);
    case 'ends_with':
      return typeof fieldValue === 'string' && fieldValue.endsWith(rule.value);
    case 'greater_than':
      return Number(fieldValue) > Number(rule.value);
    case 'less_than':
      return Number(fieldValue) < Number(rule.value);
    case 'between':
      return Array.isArray(rule.value) && 
        Number(fieldValue) >= Number(rule.value[0]) && 
        Number(fieldValue) <= Number(rule.value[1]);
    case 'in':
      return Array.isArray(rule.value) && rule.value.includes(fieldValue);
    case 'not_in':
      return Array.isArray(rule.value) && !rule.value.includes(fieldValue);
    case 'exists':
      return fieldValue !== undefined && fieldValue !== null && fieldValue !== '';
    case 'not_exists':
      return fieldValue === undefined || fieldValue === null || fieldValue === '';
    default:
      return false;
  }
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
};
