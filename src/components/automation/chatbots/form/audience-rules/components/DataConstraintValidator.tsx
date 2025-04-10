
import { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, AlertTriangle } from 'lucide-react';
import { QueryGroup, QueryRule, QueryField, QueryOperator } from '@/types/queryBuilder';
import { useAudienceFields } from '../hooks/useAudienceFields';

interface DataConstraintValidatorProps {
  queryGroup: QueryGroup;
}

interface ConstraintIssue {
  ruleId: string;
  field: string;
  message: string;
  severity: 'warning' | 'error';
}

export const DataConstraintValidator = ({ queryGroup }: DataConstraintValidatorProps) => {
  const [issues, setIssues] = useState<ConstraintIssue[]>([]);
  const fields = useAudienceFields();

  useEffect(() => {
    // Validate rules against data constraints
    const validateConstraints = async () => {
      const newIssues: ConstraintIssue[] = [];
      
      // Skip if there are no rules
      if (!queryGroup.rules || queryGroup.rules.length === 0) {
        setIssues([]);
        return;
      }
      
      // Extract all the rules (flatten nested groups)
      const allRules = extractAllRules(queryGroup);
      
      // Check each rule against known data constraints
      for (const rule of allRules) {
        const field = fields.find(f => f.id === rule.field);
        
        if (!field) continue;
        
        // Check for type mismatches
        if (fieldTypeConstraintViolated(rule, field)) {
          newIssues.push({
            ruleId: rule.id,
            field: rule.field,
            message: `The value for "${field.label}" doesn't match the expected type (${field.type}).`,
            severity: 'error'
          });
        }
        
        // Check for empty values in non-empty fields
        if (rule.operator !== 'is_empty' && rule.operator !== 'is_not_empty' && 
            (rule.value === '' || rule.value === undefined || rule.value === null)) {
          newIssues.push({
            ruleId: rule.id,
            field: rule.field,
            message: `"${field.label}" requires a value for the selected operator.`,
            severity: 'error'
          });
        }
        
        // Check for selection from available options
        if (field.type === 'select' && field.options && 
            !field.options.some(opt => opt.value === rule.value) && 
            rule.operator !== 'is_empty' && rule.operator !== 'is_not_empty') {
          newIssues.push({
            ruleId: rule.id,
            field: rule.field,
            message: `"${rule.value}" is not a valid option for "${field.label}".`,
            severity: 'error'
          });
        }
        
        // Warning for potential data quality issues
        if (rule.operator === 'equals' && typeof rule.value === 'string' && 
            rule.value.includes('*') && field.type === 'text') {
          newIssues.push({
            ruleId: rule.id,
            field: rule.field,
            message: `Wildcards (*) don't work with the "equals" operator. Use "contains" instead.`,
            severity: 'warning'
          });
        }
      }
      
      setIssues(newIssues);
    };
    
    validateConstraints();
  }, [queryGroup, fields]);

  // Function to extract all rules from nested groups
  const extractAllRules = (group: QueryGroup): QueryRule[] => {
    let rules: QueryRule[] = [];
    
    for (const rule of group.rules) {
      if ('field' in rule) {
        rules.push(rule);
      } else if ('combinator' in rule) {
        rules = [...rules, ...extractAllRules(rule)];
      }
    }
    
    return rules;
  };

  // Function to check if rule value violates field type constraints
  const fieldTypeConstraintViolated = (rule: QueryRule, field: QueryField): boolean => {
    // Skip empty/not-empty operators as they don't need a value
    if (rule.operator === 'is_empty' || rule.operator === 'is_not_empty') {
      return false;
    }
    
    switch (field.type) {
      case 'number':
        return isNaN(Number(rule.value));
      case 'boolean':
        return typeof rule.value !== 'boolean' && rule.value !== 'true' && rule.value !== 'false';
      case 'date':
        // Basic date validation - could be improved
        if (typeof rule.value === 'string' && rule.value.length === 0) return false;
        return typeof rule.value === 'string' && isNaN(Date.parse(rule.value)) && 
          !['this_week', 'this_month', 'this_year', 'last_week', 'last_month', 'last_year', 
            'next_week', 'next_month', 'next_year'].includes(rule.value);
      default:
        return false;
    }
  };

  if (issues.length === 0) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <ShieldCheck className="h-4 w-4 text-green-600" />
        <AlertTitle>All rules are valid</AlertTitle>
        <AlertDescription>
          Your audience rules pass all data constraint validations.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-3">
      {issues.map((issue, index) => (
        <Alert 
          key={index} 
          variant={issue.severity === 'error' ? 'destructive' : 'default'}
          className={issue.severity === 'warning' ? "bg-amber-50 border-amber-200" : undefined}
        >
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>
            {issue.severity === 'error' ? 'Validation Error' : 'Warning'}
          </AlertTitle>
          <AlertDescription>
            {issue.message}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
