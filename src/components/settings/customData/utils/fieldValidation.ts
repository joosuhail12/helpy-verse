
import { CustomField, CustomFieldType, ValidationRule } from '@/types/customData';

export const validateFieldValue = (
  value: string | number | boolean | string[],
  field: CustomField
): string[] => {
  const errors: string[] = [];
  
  // Check required
  if (field.isRequired && (value === '' || value === null || value === undefined)) {
    errors.push(`${field.name} is required.`);
    return errors;
  }
  
  // Skip further validation if empty and not required
  if (value === '' || value === null || value === undefined) {
    return errors;
  }
  
  // Type-specific validation
  const validationRules = field.validationRules || [];
  
  // Check each validation rule
  validationRules.forEach(rule => {
    switch (rule.type) {
      case 'minLength':
        if (typeof value === 'string' && value.length < Number(rule.value)) {
          errors.push(rule.message || `${field.name} must be at least ${rule.value} characters.`);
        }
        break;
      case 'maxLength':
        if (typeof value === 'string' && value.length > Number(rule.value)) {
          errors.push(rule.message || `${field.name} cannot exceed ${rule.value} characters.`);
        }
        break;
      case 'regex':
        if (typeof value === 'string' && !new RegExp(String(rule.value)).test(value)) {
          errors.push(rule.message || `${field.name} does not match the required pattern.`);
        }
        break;
      case 'min':
        if (typeof value === 'number' && value < Number(rule.value)) {
          errors.push(rule.message || `${field.name} must be at least ${rule.value}.`);
        }
        break;
      case 'max':
        if (typeof value === 'number' && value > Number(rule.value)) {
          errors.push(rule.message || `${field.name} cannot exceed ${rule.value}.`);
        }
        break;
    }
  });
  
  return errors;
};

export const validateField = (field: CustomField): string[] => {
  const errors: string[] = [];
  
  // Name is required
  if (!field.name || field.name.trim() === '') {
    errors.push('Field name is required.');
  }
  
  return errors;
};

export const validateFieldName = (name: string, existingFields: CustomField[]): string[] => {
  const errors: string[] = [];
  
  if (!name || name.trim() === '') {
    errors.push("Field name is required");
  }
  
  const nameExists = existingFields.some(field => field.name.toLowerCase() === name.toLowerCase());
  if (nameExists) {
    errors.push("A field with this name already exists");
  }
  
  return errors;
};

export const getDefaultValidationRules = (fieldType: CustomFieldType): ValidationRule[] => {
  switch (fieldType) {
    case 'text':
    case 'rich-text':
      return [];
    case 'number':
    case 'currency':
      return [];
    case 'date':
      return [];
    case 'email':
      return [
        {
          type: 'regex',
          value: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
          message: 'Please enter a valid email address'
        }
      ];
    case 'url':
      return [
        {
          type: 'regex',
          value: '^(https?:\\/\\/)?(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)$',
          message: 'Please enter a valid URL'
        }
      ];
    case 'phone':
    case 'tel':
      return [];
    default:
      return [];
  }
};
