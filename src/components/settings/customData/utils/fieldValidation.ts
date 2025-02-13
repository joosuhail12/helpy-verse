
import type { CustomField, CustomFieldType, ValidationRule } from "@/types/customField";

export const validateFieldName = (name: string, existingFields: CustomField[]): string[] => {
  const errors: string[] = [];
  
  if (name.length < 2) {
    errors.push("Field name must be at least 2 characters long");
  }
  
  if (name.length > 50) {
    errors.push("Field name must not exceed 50 characters");
  }
  
  if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
    errors.push("Field name must start with a letter and contain only letters, numbers, and underscores");
  }
  
  if (existingFields.some(field => field.name.toLowerCase() === name.toLowerCase())) {
    errors.push("A field with this name already exists");
  }
  
  return errors;
};

export const getDefaultValidationRules = (fieldType: CustomFieldType): ValidationRule[] => {
  switch (fieldType) {
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
        value: '^https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$',
        message: 'Please enter a valid URL'
      }];
    case 'currency':
      return [
        {
          type: 'regex',
          value: '^\\d+(\\.\\d{1,2})?$',
          message: 'Please enter a valid currency amount'
        },
        {
          type: 'min',
          value: '0',
          message: 'Amount must be greater than or equal to 0'
        }
      ];
    default:
      return [];
  }
};
