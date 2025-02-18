
import type { CustomAction } from '@/types/action';
import { toast } from '@/hooks/use-toast';

export const validateParameterValue = (
  parameter: CustomAction['parameters'][0],
  testValue: string,
  onUpdate: (updatedParam: CustomAction['parameters'][0]) => void
): { error: string | null } => {
  try {
    if (parameter.required && !testValue) {
      throw new Error('This parameter is required');
    }

    let validatedValue: string;
    
    switch (parameter.type) {
      case 'number':
        if (isNaN(Number(testValue))) {
          throw new Error('Value must be a valid number');
        }
        validatedValue = String(Number(testValue));
        break;
      case 'boolean':
        if (testValue.toLowerCase() !== 'true' && testValue.toLowerCase() !== 'false') {
          throw new Error('Value must be either true or false');
        }
        validatedValue = testValue.toLowerCase();
        break;
      case 'object':
      case 'array':
        try {
          JSON.parse(testValue);
          validatedValue = testValue;
        } catch {
          throw new Error('Value must be valid JSON');
        }
        break;
      default:
        validatedValue = testValue;
    }

    onUpdate({
      ...parameter,
      defaultValue: validatedValue
    });

    toast({
      title: "Parameter validation passed",
      description: `Value "${testValue}" is valid for parameter type ${parameter.type}`,
    });

    return { error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid value';
    toast({
      title: "Parameter validation failed",
      description: errorMessage,
      variant: "destructive"
    });
    return { error: errorMessage };
  }
};

export const getValidationRules = (parameter: CustomAction['parameters'][0]): string[] => {
  const rules = [];
  if (parameter.required) rules.push('Required field');
  switch (parameter.type) {
    case 'number':
      rules.push('Must be a valid number');
      break;
    case 'boolean':
      rules.push('Must be true or false');
      break;
    case 'object':
    case 'array':
      rules.push('Must be valid JSON');
      break;
  }
  return rules;
};

