
export interface ValidationError {
  ruleId: string;
  field: string;
  message: string;
  path: string;
}

export const validateField = (value: any, fieldName: string): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!value && fieldName === 'field') {
    errors.push({
      ruleId: 'unknown',
      field: 'field',
      message: 'Field is required',
      path: 'field'
    });
  }
  
  return errors;
};
