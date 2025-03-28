
import { ValidationResult, ValidationError, QueryGroup, QueryRule } from '@/types/queryBuilder';

export const validateRuleGroup = (
  group: QueryGroup,
  availableFields: any[],
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
      const ruleValidation = validateRule(rule, availableFields, currentPath);
      if (!ruleValidation.isValid) {
        errors.push(...ruleValidation.errors);
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
  availableFields: any[],
  path: string
): ValidationResult => {
  const errors: ValidationError[] = [];

  // Check if field is selected
  if (!rule.field) {
    errors.push({
      message: 'Field is required',
      rule,
      path: `${path}.field`
    });
  } else {
    // Check if field exists in available fields
    const fieldExists = availableFields.some((field) => field.id === rule.field);
    if (!fieldExists) {
      errors.push({
        message: `Field '${rule.field}' does not exist`,
        rule,
        path: `${path}.field`
      });
    }
  }

  // Check if operator is selected
  if (!rule.operator) {
    errors.push({
      message: 'Operator is required',
      rule,
      path: `${path}.operator`
    });
  }

  // For operators that require a value, check if value is provided
  if (
    rule.operator &&
    rule.operator !== 'is_empty' &&
    rule.operator !== 'is_not_empty'
  ) {
    if (rule.value === undefined || rule.value === null || rule.value === '') {
      errors.push({
        message: 'Value is required',
        rule,
        path: `${path}.value`
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
