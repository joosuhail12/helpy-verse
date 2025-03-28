
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QueryGroup, QueryRule, ValidationResult, ValidationError } from '@/types/queryBuilder';
import { validateRuleGroup } from '../utils/validation';
import { useAudienceFields } from './useAudienceFields';

export const useRuleBuilder = (initialRules?: QueryGroup) => {
  const [queryGroup, setQueryGroup] = useState<QueryGroup>(initialRules || {
    id: uuidv4(),
    combinator: 'and',
    rules: []
  });
  
  const availableFields = useAudienceFields();

  const validate = useCallback((): boolean => {
    const result = validateRuleGroup(queryGroup, availableFields);
    return result.isValid;
  }, [queryGroup, availableFields]);

  const validateRules = useCallback((): ValidationResult => {
    const result = validateRuleGroup(queryGroup, availableFields);
    if (!result.isValid) {
      const contextualErrors: ValidationError[] = result.errors.map(error => ({
        ...error,
        message: `${error.message} ${error.rule ? `for rule with field ${error.rule.field}` : ''}`
      }));
      return { isValid: false, errors: contextualErrors };
    }
    return { isValid: true, errors: [] };
  }, [queryGroup, availableFields]);

  // Store validation errors
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const updateQueryGroup = useCallback((newGroup: QueryGroup) => {
    setQueryGroup(newGroup);
    const result = validateRuleGroup(newGroup, availableFields);
    setErrors(result.errors);
  }, [availableFields]);

  const addRule = useCallback(() => {
    setQueryGroup(prev => ({
      ...prev,
      rules: [
        ...prev.rules,
        {
          id: uuidv4(),
          field: availableFields.length > 0 ? availableFields[0].id : '',
          operator: 'equals',
          value: ''
        }
      ]
    }));
  }, [availableFields]);

  const addGroup = useCallback(() => {
    setQueryGroup(prev => ({
      ...prev,
      rules: [
        ...prev.rules,
        {
          id: uuidv4(),
          combinator: 'and',
          rules: []
        }
      ]
    }));
  }, []);

  const updateRule = useCallback((id: string, updates: Partial<QueryRule>) => {
    const updateRuleInGroup = (group: QueryGroup): QueryGroup => {
      return {
        ...group,
        rules: group.rules.map(rule => {
          if ('rules' in rule) {
            // This is a nested group
            return updateRuleInGroup(rule);
          } else if (rule.id === id) {
            // This is the rule to update
            return { ...rule, ...updates };
          }
          return rule;
        })
      };
    };

    const updatedGroup = updateRuleInGroup(queryGroup);
    setQueryGroup(updatedGroup);
    const validationResult = validateRuleGroup(updatedGroup, availableFields);
    setErrors(validationResult.errors);
  }, [queryGroup, availableFields]);

  const removeRule = useCallback((id: string) => {
    const removeRuleFromGroup = (group: QueryGroup): QueryGroup => {
      return {
        ...group,
        rules: group.rules
          .filter(rule => !('id' in rule) || rule.id !== id)
          .map(rule => {
            if ('rules' in rule) {
              // This is a nested group
              return removeRuleFromGroup(rule);
            }
            return rule;
          })
      };
    };

    setQueryGroup(prev => removeRuleFromGroup(prev));
  }, []);

  const updateCombinator = useCallback((id: string, combinator: 'and' | 'or') => {
    const updateCombinatorInGroup = (group: QueryGroup): QueryGroup => {
      if (group.id === id) {
        return { ...group, combinator };
      }
      
      return {
        ...group,
        rules: group.rules.map(rule => {
          if ('rules' in rule) {
            // This is a nested group
            return updateCombinatorInGroup(rule);
          }
          return rule;
        })
      };
    };

    setQueryGroup(prev => updateCombinatorInGroup(prev));
  }, []);

  return {
    queryGroup,
    setQueryGroup,
    updateQueryGroup,
    validateRules,
    validate,
    errors,
    addRule,
    addGroup,
    updateRule,
    removeRule,
    updateCombinator,
  };
};
