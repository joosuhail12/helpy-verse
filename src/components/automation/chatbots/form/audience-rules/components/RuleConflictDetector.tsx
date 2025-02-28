
import { useEffect, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { QueryGroup, QueryRule } from '@/types/queryBuilder';
import { useAudienceFields } from '../hooks/useAudienceFields';

interface RuleConflictDetectorProps {
  queryGroup: QueryGroup;
}

interface Conflict {
  type: 'exclusive' | 'redundant' | 'contradict';
  message: string;
  ruleIds: string[];
}

export const RuleConflictDetector = ({ queryGroup }: RuleConflictDetectorProps) => {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const fields = useAudienceFields();

  useEffect(() => {
    // Detect conflicts in the rules
    const detectConflicts = () => {
      const newConflicts: Conflict[] = [];
      
      // Skip if there are no rules or only one rule
      if (!queryGroup.rules || queryGroup.rules.length < 2) {
        setConflicts([]);
        return;
      }
      
      // Extract all the rules (flatten nested groups)
      const allRules = extractAllRules(queryGroup);
      
      // Check for conflicts between each pair of rules
      for (let i = 0; i < allRules.length; i++) {
        for (let j = i + 1; j < allRules.length; j++) {
          const rule1 = allRules[i];
          const rule2 = allRules[j];
          
          // Only check rules with the same field
          if (rule1.field === rule2.field) {
            const field = fields.find(f => f.id === rule1.field);
            
            // Check for mutually exclusive conditions
            if (rulesAreExclusive(rule1, rule2)) {
              newConflicts.push({
                type: 'exclusive',
                message: `Rules on field "${field?.label || rule1.field}" have mutually exclusive conditions.`,
                ruleIds: [rule1.id, rule2.id]
              });
            }
            
            // Check for redundant conditions
            if (rulesAreRedundant(rule1, rule2)) {
              newConflicts.push({
                type: 'redundant',
                message: `Rules on field "${field?.label || rule1.field}" may be redundant.`,
                ruleIds: [rule1.id, rule2.id]
              });
            }
            
            // Check for contradicting conditions in AND groups
            if (queryGroup.combinator === 'and' && rulesAreContradicting(rule1, rule2)) {
              newConflicts.push({
                type: 'contradict',
                message: `Rules on field "${field?.label || rule1.field}" create a contradiction in an AND group.`,
                ruleIds: [rule1.id, rule2.id]
              });
            }
          }
        }
      }
      
      setConflicts(newConflicts);
    };
    
    detectConflicts();
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

  // Function to determine if two rules are mutually exclusive
  const rulesAreExclusive = (rule1: QueryRule, rule2: QueryRule): boolean => {
    // Examples of exclusive conditions:
    // 1. equals 'A' vs equals 'B'
    // 2. greater_than 10 vs less_than 5
    
    if (rule1.operator === 'equals' && rule2.operator === 'equals' && rule1.value !== rule2.value) {
      return true;
    }
    
    if (rule1.operator === 'equals' && rule2.operator === 'not_equals' && rule1.value === rule2.value) {
      return true;
    }
    
    if (rule1.operator === 'greater_than' && rule2.operator === 'less_than') {
      return Number(rule1.value) >= Number(rule2.value);
    }
    
    if (rule1.operator === 'less_than' && rule2.operator === 'greater_than') {
      return Number(rule2.value) >= Number(rule1.value);
    }
    
    return false;
  };

  // Function to determine if rules are redundant
  const rulesAreRedundant = (rule1: QueryRule, rule2: QueryRule): boolean => {
    // Examples of redundant conditions:
    // 1. equals 'A' with equals 'A'
    // 2. greater_than 5 with greater_than 3 (the second is redundant)
    
    if (rule1.operator === rule2.operator && JSON.stringify(rule1.value) === JSON.stringify(rule2.value)) {
      return true;
    }
    
    if (rule1.operator === 'greater_than' && rule2.operator === 'greater_than') {
      return true; // They're potentially redundant, one subsumes the other
    }
    
    if (rule1.operator === 'less_than' && rule2.operator === 'less_than') {
      return true; // They're potentially redundant, one subsumes the other
    }
    
    return false;
  };

  // Function to determine if rules are contradicting in an AND context
  const rulesAreContradicting = (rule1: QueryRule, rule2: QueryRule): boolean => {
    // Examples of contradicting conditions in AND:
    // 1. equals 'A' AND not_equals 'A'
    // 2. greater_than 10 AND less_than 5
    
    if (rule1.operator === 'equals' && rule2.operator === 'not_equals' && rule1.value === rule2.value) {
      return true;
    }
    
    if (rule1.operator === 'not_equals' && rule2.operator === 'equals' && rule1.value === rule2.value) {
      return true;
    }
    
    if (rule1.operator === 'greater_than' && rule2.operator === 'less_than') {
      return Number(rule1.value) >= Number(rule2.value);
    }
    
    if (rule1.operator === 'less_than' && rule2.operator === 'greater_than') {
      return Number(rule2.value) >= Number(rule1.value);
    }
    
    return false;
  };

  if (conflicts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {conflicts.map((conflict, index) => (
        <Alert key={index} variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="flex items-center gap-2">
            {conflict.type === 'exclusive' && 'Mutually Exclusive Rules'}
            {conflict.type === 'redundant' && 'Potentially Redundant Rules'}
            {conflict.type === 'contradict' && 'Contradicting Rules'}
          </AlertTitle>
          <AlertDescription>
            {conflict.message}
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};
