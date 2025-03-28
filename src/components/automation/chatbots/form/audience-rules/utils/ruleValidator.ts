
import { QueryGroup, QueryRule, ValidationError } from '@/types/queryBuilder';

// Validate a query group and its rules
export const validateQueryGroup = (group: QueryGroup): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Validate each rule in the group
  group.rules.forEach(rule => {
    if ('field' in rule) {
      // This is a rule, not a group
      const ruleErrors = validateRule(rule);
      if (ruleErrors) {
        errors.push(ruleErrors);
      }
    } else {
      // This is a nested group
      const nestedErrors = validateQueryGroup(rule);
      errors.push(...nestedErrors);
    }
  });
  
  return errors;
};

// Validate a single rule
const validateRule = (rule: QueryRule): ValidationError | null => {
  // Basic validation - requires a field and operator
  if (!rule.field) {
    return {
      ruleId: rule.id,
      field: 'field',
      message: 'Field is required'
    };
  }
  
  if (!rule.operator) {
    return {
      ruleId: rule.id,
      field: 'operator',
      message: 'Operator is required'
    };
  }
  
  // For operators that require a value, check if value is present
  if (!['is_empty', 'is_not_empty'].includes(rule.operator) && rule.value === undefined) {
    return {
      ruleId: rule.id,
      field: 'value',
      message: 'Value is required for this operator'
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
