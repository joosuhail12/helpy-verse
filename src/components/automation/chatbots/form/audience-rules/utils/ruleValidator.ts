
import { QueryGroup, QueryRule, ValidationResult, ValidationError } from '@/types/queryBuilder';

export const validateRuleGroup = (group: QueryGroup): ValidationResult => {
  // If there are no rules, the group is valid
  if (!group.rules || group.rules.length === 0) {
    return {
      isValid: true,
      errors: []
    };
  }

  const errors: ValidationError[] = [];

  // Validate each rule in the group
  for (const rule of group.rules) {
    if ('rules' in rule) {
      // This is a nested group
      const nestedResult = validateRuleGroup(rule);
      if (!nestedResult.isValid) {
        errors.push(...nestedResult.errors);
      }
    } else {
      // This is a rule
      const ruleValidation = validateRule(rule);
      if (!ruleValidation.isValid) {
        errors.push(...ruleValidation.errors);
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const validateRule = (rule: QueryRule): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate field
  if (!rule.field) {
    errors.push({
      message: 'Field is required',
      rule: { id: rule.id }
    });
  }

  // Validate operator
  if (!rule.operator) {
    errors.push({
      message: 'Operator is required',
      rule: { id: rule.id }
    });
  }

  // Validate value based on operator
  if (rule.operator !== 'isEmpty' && rule.operator !== 'isNotEmpty') {
    if (rule.value === undefined || rule.value === null || rule.value === '') {
      errors.push({
        message: 'Value is required',
        rule: { id: rule.id }
      });
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
