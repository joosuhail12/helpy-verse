
import { CustomField, ValidationRule } from '@/types/customField';

export const validateFieldValue = (value: any, field: CustomField): string[] => {
  const errors: string[] = [];
  
  if (field.required && !value) {
    errors.push('This field is required');
  }

  if (field.validationRules) {
    field.validationRules.forEach((rule: ValidationRule) => {
      switch (rule.type) {
        case 'minLength':
          if (typeof value === 'string' && value.length < Number(rule.value)) {
            errors.push(rule.message || `Minimum length is ${rule.value} characters`);
          }
          break;
        case 'maxLength':
          if (typeof value === 'string' && value.length > Number(rule.value)) {
            errors.push(rule.message || `Maximum length is ${rule.value} characters`);
          }
          break;
        case 'regex':
          if (typeof value === 'string' && !new RegExp(rule.value.toString()).test(value)) {
            errors.push(rule.message || 'Invalid format');
          }
          break;
        case 'min':
          if (typeof value === 'number' && value < Number(rule.value)) {
            errors.push(rule.message || `Minimum value is ${rule.value}`);
          }
          break;
        case 'max':
          if (typeof value === 'number' && value > Number(rule.value)) {
            errors.push(rule.message || `Maximum value is ${rule.value}`);
          }
          break;
      }
    });
  }
  
  return errors;
};
