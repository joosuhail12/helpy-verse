
import { ValidationResult, ValidationError, QueryGroup, QueryRule, QueryField } from '@/types/queryBuilder';

export const validateRuleGroup = (
  group: QueryGroup,
  availableFields: QueryField[] = [],
  path = ''
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Check if group has rules
  if (!group.rules || group.rules.length === 0) {
    errors.push({
      message: 'Rule group cannot be empty',
      group,
      path
    });
    return { isValid: false, errors };
  }

  // Validate each rule in the group
  group.rules.forEach((rule, index) => {
    const currentPath = path ? `${path}.rules[${index}]` : `rules[${index}]`;

    if ('rules' in rule) {
      // This is a nested group
      const nestedResult = validateRuleGroup(rule, availableFields, currentPath);
      if (!nestedResult.isValid) {
        errors.push(...nestedResult.errors);
      }
    } else {
      // This is a rule
      const ruleErrors = validateRule(rule, availableFields, currentPath);
      if (ruleErrors.length > 0) {
        errors.push(...ruleErrors);
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateRule = (
  rule: QueryRule,
  availableFields: QueryField[] = [],
  path: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Check if field is selected
  if (!rule.field) {
    errors.push({
      message: 'Field is required',
      rule: { id: rule.id },
      path: `${path}.field`,
      field: 'field'
    });
  }

  // Check if operator is selected
  if (!rule.operator) {
    errors.push({
      message: 'Operator is required',
      rule: { id: rule.id },
      path: `${path}.operator`,
      field: 'operator'
    });
  }

  // For operators that require a value, check if value is provided
  const noValueOperators = ['isEmpty', 'isNotEmpty', 'is_empty', 'is_not_empty'];
  
  if (
    rule.operator &&
    !noValueOperators.includes(rule.operator) &&
    (rule.value === undefined || rule.value === null || rule.value === '')
  ) {
    errors.push({
      message: 'Value is required',
      rule: { id: rule.id },
      path: `${path}.value`,
      field: 'value'
    });
  }

  return errors;
};

// Add evaluateRules function for SampleMatchesPreview
export const evaluateRules = (group: QueryGroup, data: any): boolean => {
  if (!group.rules || group.rules.length === 0) {
    return true;
  }

  const evaluateRule = (rule: QueryRule): boolean => {
    const value = data[rule.field];
    
    switch (rule.operator) {
      case 'equals':
        return value === rule.value;
      case 'notEquals':
      case 'not_equals':
        return value !== rule.value;
      case 'contains':
        return String(value).includes(String(rule.value));
      case 'notContains':
        return !String(value).includes(String(rule.value));
      case 'greaterThan':
      case 'greater_than':
        return Number(value) > Number(rule.value);
      case 'lessThan':
      case 'less_than':
        return Number(value) < Number(rule.value);
      case 'isEmpty':
      case 'is_empty':
        return !value || value.length === 0;
      case 'isNotEmpty':
      case 'is_not_empty':
        return !!value && value.length > 0;
      default:
        return false;
    }
  };

  const evaluateGroup = (group: QueryGroup): boolean => {
    if (group.rules.length === 0) return true;

    if (group.combinator === 'and') {
      return group.rules.every(rule => {
        if ('rules' in rule) {
          return evaluateGroup(rule);
        }
        return evaluateRule(rule as QueryRule);
      });
    } else {
      return group.rules.some(rule => {
        if ('rules' in rule) {
          return evaluateGroup(rule);
        }
        return evaluateRule(rule as QueryRule);
      });
    }
  };

  return evaluateGroup(group);
};
