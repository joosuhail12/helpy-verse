
import { CustomField, ValidationRule, CustomFieldType } from '@/types/customField';

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

export const validateFieldName = (name: string, existingFields: CustomField[]): string[] => {
  const errors: string[] = [];
  
  if (!name) {
    errors.push('Field name is required');
    return errors;
  }

  if (name.length < 2) {
    errors.push('Field name must be at least 2 characters long');
  }

  if (name.length > 50) {
    errors.push('Field name must not exceed 50 characters');
  }

  if (!/^[a-zA-Z][a-zA-Z0-9_\s]*$/.test(name)) {
    errors.push('Field name must start with a letter and can only contain letters, numbers, spaces and underscores');
  }

  const lowerCaseName = name.toLowerCase();
  if (existingFields.some(field => field.name.toLowerCase() === lowerCaseName)) {
    errors.push('A field with this name already exists');
  }

  return errors;
};

export const getDefaultValidationRules = (type: CustomFieldType): ValidationRule[] => {
  switch (type) {
    case 'email':
      return [{
        type: 'regex',
        value: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
        message: 'Please enter a valid email address'
      }];
    case 'phone':
      return [{
        type: 'regex',
        value: '^\\+?[1-9]\\d{1,14}$',
        message: 'Please enter a valid phone number'
      }];
    case 'url':
      return [{
        type: 'regex',
        value: '^https?:\\/\\/[\\w\\d.-]+\\.[a-zA-Z]{2,}(?:\\/.*)?$',
        message: 'Please enter a valid URL'
      }];
    default:
      return [];
  }
};

