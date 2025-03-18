
import { useState, useCallback } from 'react';
import { QueryGroup, QueryRule } from '@/types/queryBuilder';
import { validateQueryGroup, ValidationResult } from '../utils/ruleValidator';
import { generateId } from '@/lib/utils';

export type ValidationError = {
  path: string;
  message: string;
};

export const useRuleBuilder = (initialGroup: QueryGroup = { id: generateId(), combinator: 'and', rules: [] }) => {
  const [queryGroup, setQueryGroup] = useState<QueryGroup>(initialGroup);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const validate = useCallback(() => {
    const result = validateQueryGroup(queryGroup);
    if (!result.isValid && result.error) {
      setErrors([{ path: 'root', message: result.error }]);
      return false;
    }
    setErrors([]);
    return true;
  }, [queryGroup]);

  const updateQueryGroup = useCallback((newGroup: QueryGroup) => {
    setQueryGroup(newGroup);
  }, []);

  const addRule = useCallback(() => {
    const newGroup = { ...queryGroup };
    newGroup.rules = [
      ...queryGroup.rules,
      { id: generateId(), field: '', operator: 'equals', value: '' } as QueryRule
    ];
    setQueryGroup(newGroup);
  }, [queryGroup]);

  const addGroup = useCallback(() => {
    const newGroup = { ...queryGroup };
    newGroup.rules = [
      ...queryGroup.rules,
      { id: generateId(), combinator: 'and', rules: [] } as QueryGroup
    ];
    setQueryGroup(newGroup);
  }, [queryGroup]);

  return {
    queryGroup,
    updateQueryGroup,
    addRule,
    addGroup,
    validate,
    errors,
  };
};
