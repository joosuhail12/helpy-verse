
import { useState, useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { QueryGroup, QueryRule } from '@/types/queryBuilder';
import { useAudienceFields } from '../hooks/useAudienceFields';

export interface DataConstraintValidatorProps {
  queryGroup: QueryGroup;
}

export const DataConstraintValidator = ({ queryGroup }: DataConstraintValidatorProps) => {
  const [constraints, setConstraints] = useState<{message: string, severity: 'info' | 'warning' | 'error'}[]>([]);
  const fields = useAudienceFields();

  useEffect(() => {
    // Detect data constraints in the rules
    const detectConstraints = () => {
      const newConstraints: {message: string, severity: 'info' | 'warning' | 'error'}[] = [];
      
      // Skip if there are no rules
      if (!queryGroup.rules || queryGroup.rules.length === 0) {
        setConstraints([]);
        return;
      }
      
      // Extract all the rules (flatten nested groups)
      const allRules = extractAllRules(queryGroup);
      
      // Check data type constraints
      checkDataTypeConstraints(allRules, newConstraints);
      
      // Check field usage constraints
      checkFieldUsageConstraints(allRules, newConstraints);
      
      setConstraints(newConstraints);
    };
    
    detectConstraints();
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

  // Check for data type constraints
  const checkDataTypeConstraints = (
    rules: QueryRule[], 
    constraints: {message: string, severity: 'info' | 'warning' | 'error'}[]
  ) => {
    for (const rule of rules) {
      const field = fields.find(f => f.id === rule.field);
      
      if (!field) continue;
      
      // Check for date field constraints
      if (field.type === 'date') {
        if (rule.operator === 'contains' || rule.operator === 'startsWith' || rule.operator === 'endsWith') {
          constraints.push({
            message: `The operator "${rule.operator}" may not work as expected with date fields like "${field.label}".`,
            severity: 'warning'
          });
        }
      }
      
      // Check for string constraints on number fields
      if (field.type === 'number' && typeof rule.value === 'string' && rule.value !== '') {
        if (isNaN(Number(rule.value))) {
          constraints.push({
            message: `Non-numeric value used with number field "${field.label}".`,
            severity: 'error'
          });
        }
      }
      
      // Check for numeric operators on text fields
      if (field.type === 'string' || field.type === 'email' || field.type === 'phone') {
        if (rule.operator === 'greaterThan' || rule.operator === 'lessThan') {
          constraints.push({
            message: `The operator "${rule.operator}" may not be appropriate for text field "${field.label}".`,
            severity: 'warning'
          });
        }
      }
    }
  };

  // Check for field usage constraints
  const checkFieldUsageConstraints = (
    rules: QueryRule[], 
    constraints: {message: string, severity: 'info' | 'warning' | 'error'}[]
  ) => {
    // Check for mixing contact and company fields in the same query
    const contactFields = rules.filter(rule => 
      fields.find(f => f.id === rule.field)?.source === 'contacts'
    );
    
    const companyFields = rules.filter(rule => 
      fields.find(f => f.id === rule.field)?.source === 'companies'
    );
    
    if (contactFields.length > 0 && companyFields.length > 0 && queryGroup.combinator === 'and') {
      constraints.push({
        message: 'Mixing contact and company fields with AND condition may return no results.',
        severity: 'warning'
      });
    }
  };

  if (constraints.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {constraints.map((constraint, index) => (
        <Alert key={index} variant={constraint.severity === 'error' ? 'destructive' : 'default'}>
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Data Constraint</AlertTitle>
          <AlertDescription>
            {constraint.message}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
