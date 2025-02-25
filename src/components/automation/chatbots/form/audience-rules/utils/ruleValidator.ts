
import { QueryGroup, QueryRule, QueryField, FieldType } from '@/types/queryBuilder';

export interface ValidationError {
  ruleId: string;
  field: string;
  message: string;
}

const validateFieldValue = (value: any, fieldType: FieldType): boolean => {
  switch (fieldType) {
    case 'number':
      return !isNaN(Number(value));
    case 'date':
      return !isNaN(Date.parse(value));
    case 'boolean':
      return typeof value === 'boolean';
    case 'select':
    case 'multi-select':
      return Array.isArray(value) ? value.every(v => typeof v === 'string') : typeof value === 'string';
    default:
      return typeof value === 'string';
  }
};

const validateRule = (rule: QueryRule, fields: QueryField[]): ValidationError[] => {
  const errors: ValidationError[] = [];
  const field = fields.find(f => f.id === rule.field);

  if (!rule.field) {
    errors.push({
      ruleId: rule.id,
      field: 'field',
      message: 'Field is required',
    });
  }

  if (!rule.operator) {
    errors.push({
      ruleId: rule.id,
      field: 'operator',
      message: 'Operator is required',
    });
  }

  if (field && rule.value !== undefined && rule.value !== '') {
    if (!validateFieldValue(rule.value, field.type)) {
      errors.push({
        ruleId: rule.id,
        field: 'value',
        message: `Invalid value for field type ${field.type}`,
      });
    }
  }

  const operatorsNotRequiringValue = ['is_empty', 'is_not_empty'];
  if (!operatorsNotRequiringValue.includes(rule.operator) && rule.value === '') {
    errors.push({
      ruleId: rule.id,
      field: 'value',
      message: 'Value is required for this operator',
    });
  }

  return errors;
};

export const validateQueryGroup = (group: QueryGroup, fields: QueryField[]): ValidationError[] => {
  let errors: ValidationError[] = [];

  group.rules.forEach((rule) => {
    if ('field' in rule) {
      errors = [...errors, ...validateRule(rule, fields)];
    } else {
      errors = [...errors, ...validateQueryGroup(rule, fields)];
    }
  });

  return errors;
};
