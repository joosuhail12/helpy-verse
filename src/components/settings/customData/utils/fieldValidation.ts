
import { ValidationRule, CustomField, CustomFieldType } from "@/types/customData";

export const validateField = (field: CustomField): string[] => {
  const errors: string[] = [];

  if (!field.name.trim()) {
    errors.push("Field name is required");
  }

  if (field.name.length > 50) {
    errors.push("Field name must be less than 50 characters");
  }

  // Check for special characters except spaces, hyphens, and underscores
  if (/[^a-zA-Z0-9 \-_]/.test(field.name)) {
    errors.push("Field name can only contain letters, numbers, spaces, hyphens, and underscores");
  }

  return errors;
};

export const validateFieldName = (name: string, existingFields: CustomField[]): string[] => {
  const errors: string[] = [];

  if (!name.trim()) {
    errors.push("Field name is required");
  }

  if (name.length > 50) {
    errors.push("Field name must be less than 50 characters");
  }

  // Check for special characters except spaces, hyphens, and underscores
  if (/[^a-zA-Z0-9 \-_]/.test(name)) {
    errors.push("Field name can only contain letters, numbers, spaces, hyphens, and underscores");
  }

  // Check for duplicate field names
  if (existingFields.some(field => field.name.toLowerCase() === name.toLowerCase())) {
    errors.push("A field with this name already exists");
  }

  return errors;
};

export const validateFieldValue = (value: any, field: CustomField): string[] => {
  const errors: string[] = [];
  const fieldType = field.fieldType || field.type;
  const isRequired = field.isRequired !== undefined ? field.isRequired : field.required;

  // Check required
  if (isRequired && (value === undefined || value === null || value === '')) {
    errors.push("This field is required");
    return errors; // Return early if required field is empty
  }

  // Skip further validation if value is empty and not required
  if (value === undefined || value === null || value === '') {
    return errors;
  }

  // Check validation rules if they exist
  const validationRules = field.validationRules || [];
  
  validationRules.forEach(rule => {
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
      case 'min':
        if (fieldType === 'number' && Number(value) < Number(rule.value)) {
          errors.push(rule.message || `Minimum value is ${rule.value}`);
        }
        break;
      case 'max':
        if (fieldType === 'number' && Number(value) > Number(rule.value)) {
          errors.push(rule.message || `Maximum value is ${rule.value}`);
        }
        break;
      case 'regex':
        if (typeof value === 'string' && !new RegExp(rule.value as string).test(value)) {
          errors.push(rule.message || `Invalid format`);
        }
        break;
    }
  });

  // Type-specific validations
  switch (fieldType) {
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push("Invalid email address");
      }
      break;
    case 'url':
      try {
        new URL(value);
      } catch {
        errors.push("Invalid URL");
      }
      break;
    case 'currency':
      if (isNaN(Number(value)) || Number(value) < 0) {
        errors.push("Currency must be a positive number");
      }
      break;
    case 'phone':
      if (!/^[\d\+\-\(\) ]{7,20}$/.test(value)) {
        errors.push("Invalid phone number format");
      }
      break;
  }

  return errors;
};

export const getDefaultValidationRules = (fieldType: CustomFieldType): ValidationRule[] => {
  const rules: ValidationRule[] = [];

  switch (fieldType) {
    case 'text':
      rules.push({
        type: 'maxLength',
        value: 255,
        message: 'Text cannot exceed 255 characters'
      });
      break;
    case 'rich-text':
      rules.push({
        type: 'maxLength',
        value: 5000,
        message: 'Rich text cannot exceed 5000 characters'
      });
      break;
    case 'email':
      rules.push({
        type: 'regex',
        value: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        message: 'Must be a valid email address'
      });
      break;
    case 'url':
      rules.push({
        type: 'regex',
        value: '^(https?:\\/\\/)?[\\w.-]+\\.[\\w]{2,}([\\/\\w .-]*)*\\/?$',
        message: 'Must be a valid URL'
      });
      break;
    case 'phone':
      rules.push({
        type: 'regex',
        value: '^[\\d\\+\\-\\(\\) ]{7,20}$',
        message: 'Must be a valid phone number'
      });
      break;
    case 'number':
      rules.push({
        type: 'max',
        value: 999999999,
        message: 'Number cannot exceed 999,999,999'
      });
      break;
    case 'currency':
      rules.push({
        type: 'min',
        value: 0,
        message: 'Currency cannot be negative'
      });
      rules.push({
        type: 'max',
        value: 999999999,
        message: 'Currency cannot exceed 999,999,999'
      });
      break;
  }

  return rules;
};
