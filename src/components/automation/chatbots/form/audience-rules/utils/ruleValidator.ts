
import { QueryGroup, QueryRule, QueryField } from '@/types/queryBuilder';
import type { ValidationError } from './validation';

export const validateQueryGroup = (group: QueryGroup, fields: QueryField[]): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Validate each rule in the group
  group.rules.forEach((rule) => {
    if ('field' in rule) {
      // This is a rule
      validateRule(rule, fields, errors);
    } else {
      // This is a nested group
      errors.push(...validateQueryGroup(rule, fields));
    }
  });

  return errors;
};

const validateRule = (rule: QueryRule, fields: QueryField[], errors: ValidationError[]) => {
  // Check if field is selected
  if (!rule.field) {
    errors.push({
      ruleId: rule.id,
      field: 'field',
      message: 'Field is required',
    });
    return; // Don't validate further if no field is selected
  }

  // Check if the field exists in the list of available fields
  const fieldConfig = fields.find((f) => f.id === rule.field);
  if (!fieldConfig) {
    errors.push({
      ruleId: rule.id,
      field: 'field',
      message: 'Selected field is not valid',
    });
    return; // Don't validate further if the field is not found
  }

  // Skip value validation for these operators
  const noValueOperators = ['is_empty', 'is_not_empty', 'this_week', 'this_month', 'this_year', 
                           'last_week', 'last_month', 'last_year', 'next_week', 'next_month', 'next_year'];
  
  if (!noValueOperators.includes(rule.operator) && rule.value === undefined) {
    errors.push({
      ruleId: rule.id,
      field: 'value',
      message: 'Value is required for this operator',
    });
  }

  // Type-specific validations
  if (!noValueOperators.includes(rule.operator)) {
    switch (fieldConfig.type) {
      case 'number':
        if (rule.value !== undefined && isNaN(Number(rule.value))) {
          errors.push({
            ruleId: rule.id,
            field: 'value',
            message: 'Value must be a number',
          });
        }
        break;
      case 'date':
        // For date fields with specific date values
        if (rule.value && typeof rule.value === 'string' && 
            !noValueOperators.includes(rule.value) && 
            !['last_n_days', 'next_n_days', 'rolling_days', 'rolling_months', 'rolling_years', 'custom_range'].includes(rule.operator) &&
            isNaN(Date.parse(rule.value))) {
          errors.push({
            ruleId: rule.id,
            field: 'value',
            message: 'Invalid date format',
          });
        }
        break;
      case 'select':
        // For select fields with predefined options
        if (fieldConfig.options && rule.value !== undefined && 
            !fieldConfig.options.includes(rule.value as string)) {
          errors.push({
            ruleId: rule.id,
            field: 'value',
            message: 'Value must be one of the available options',
          });
        }
        break;
    }
  }

  // Operator-specific validations
  switch (rule.operator) {
    case 'between':
    case 'not_between':
      // These operators should have an array of two values
      if (!Array.isArray(rule.value) || rule.value.length !== 2) {
        errors.push({
          ruleId: rule.id,
          field: 'value',
          message: 'This operator requires two values',
        });
      }
      break;
    case 'in':
    case 'not_in':
    case 'contains_any':
    case 'contains_all':
    case 'has_any':
    case 'has_all':
    case 'has_none':
      // These operators should have an array of values
      if (!Array.isArray(rule.value)) {
        errors.push({
          ruleId: rule.id,
          field: 'value',
          message: 'This operator requires an array of values',
        });
      }
      break;
  }
};
