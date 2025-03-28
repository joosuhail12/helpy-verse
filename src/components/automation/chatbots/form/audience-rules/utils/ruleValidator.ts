
import { QueryGroup, QueryRule, ValidationError, ValidationResult } from '@/types/queryBuilder';

// Validate a query group and its rules
export const validateQueryGroup = (group: QueryGroup): ValidationResult => {
  if (group.rules.length === 0) {
    return { isValid: true, errors: [] };
  }
  
  const errors: ValidationError[] = [];
  
  // Validate each rule in the group
  for (const rule of group.rules) {
    if ('field' in rule) {
      // This is a rule, not a group
      const ruleError = validateRule(rule);
      if (ruleError) {
        errors.push(ruleError);
      }
    } else {
      // This is a nested group
      const nestedResult = validateQueryGroup(rule);
      if (!nestedResult.isValid) {
        errors.push(...nestedResult.errors);
        return { isValid: false, errors };
      }
    }
  }
  
  if (errors.length > 0) {
    return { 
      isValid: false, 
      errors
    };
  }
  
  return { isValid: true, errors: [] };
};

// Validate a single rule
export const validateRule = (rule: QueryRule): ValidationError | null => {
  // Basic validation - requires a field and operator
  if (!rule.field) {
    return {
      message: 'Field is required',
      rule,
      path: 'field'
    };
  }
  
  if (!rule.operator) {
    return {
      message: 'Operator is required',
      rule,
      path: 'operator'
    };
  }
  
  // For operators that require a value, check if value is present
  if (!['is_empty', 'is_not_empty'].includes(rule.operator) && rule.value === undefined) {
    return {
      message: 'Value is required for this operator',
      rule,
      path: 'value'
    };
  }
  
  return null;
};

// Evaluate if a record matches the rules
export const evaluateRules = (record: any, queryGroup: QueryGroup): boolean => {
  // If there are no rules, return true (match everything)
  if (queryGroup.rules.length === 0) {
    return true;
  }
  
  // Map over each rule in the group
  const results = queryGroup.rules.map(rule => {
    if ('field' in rule) {
      // This is a rule
      return evaluateRule(record, rule);
    } else {
      // This is a nested group
      return evaluateRules(record, rule);
    }
  });
  
  // Determine if all rules should match (AND) or any rule should match (OR)
  if (queryGroup.combinator === 'and') {
    return results.every(result => result === true);
  } else {
    return results.some(result => result === true);
  }
};

// Evaluate a single rule against a record
const evaluateRule = (record: any, rule: QueryRule): boolean => {
  const { field, operator, value } = rule;
  
  // Get the field value from the record
  const fieldValue = field.split('.').reduce((obj, key) => 
    obj && obj[key] !== undefined ? obj[key] : undefined, record);
  
  // Skip evaluation if field doesn't exist
  if (fieldValue === undefined) {
    return false;
  }
  
  // Evaluate based on operator
  switch (operator) {
    case 'equals':
      return fieldValue === value;
    case 'not_equals':
      return fieldValue !== value;
    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
    case 'not_contains':
      return !String(fieldValue).toLowerCase().includes(String(value).toLowerCase());
    case 'greater_than':
      return fieldValue > value;
    case 'less_than':
      return fieldValue < value;
    case 'greater_than_or_equal':
      return fieldValue >= value;
    case 'less_than_or_equal':
      return fieldValue <= value;
    case 'starts_with':
      return String(fieldValue).toLowerCase().startsWith(String(value).toLowerCase());
    case 'ends_with':
      return String(fieldValue).toLowerCase().endsWith(String(value).toLowerCase());
    case 'is_empty':
      return !fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0);
    case 'is_not_empty':
      return fieldValue && (!Array.isArray(fieldValue) || fieldValue.length > 0);
    case 'in':
      return Array.isArray(value) && value.includes(fieldValue);
    case 'not_in':
      return Array.isArray(value) && !value.includes(fieldValue);
    default:
      return false;
  }
};

export type { ValidationError, ValidationResult };
