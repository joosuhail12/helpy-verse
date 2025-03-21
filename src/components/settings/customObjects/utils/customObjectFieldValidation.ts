import { CustomObjectField } from "@/types/customObject";

export const validateFieldName = (name: string, existingFields: CustomObjectField[]): string[] => {
  const errors: string[] = [];
  
  if (!name || name.trim() === '') {
    errors.push("Field name is required");
  }
  
  const nameExists = existingFields.some(field => field.name.toLowerCase() === name.toLowerCase());
  if (nameExists) {
    errors.push("A field with this name already exists");
  }
  
  // More validation rules can be added here
  
  return errors;
};

export const getDefaultValidationRules = (fieldType: string) => {
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
      return [];
    case 'url':
      return [];
    case 'phone':
    case 'tel':
      return [];
    default:
      return [];
  }
};
