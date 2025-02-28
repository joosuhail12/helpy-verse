
import { useState } from 'react';
import { QueryGroup, QueryField } from '@/types/queryBuilder';
import { validateQueryGroup, ValidationError } from '../utils/ruleValidator';
import { useToast } from '@/hooks/use-toast';

export const useRuleBuilder = (initialGroup: QueryGroup, fields: QueryField[]) => {
  const [queryGroup, setQueryGroup] = useState<QueryGroup>(initialGroup);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const { toast } = useToast();

  const handleRuleChange = (newGroup: QueryGroup) => {
    setQueryGroup(newGroup);
    setErrors([]);
  };

  const validateRules = () => {
    const validationErrors = validateQueryGroup(queryGroup, fields);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in your audience rules before continuing.',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  return {
    queryGroup,
    errors,
    handleRuleChange,
    validateRules,
  };
};
