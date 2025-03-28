
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { Gauge, Users, User } from 'lucide-react';
import { QueryGroup } from '@/types/queryBuilder';
import { useAudienceFields } from '../hooks/useAudienceFields';

interface AudienceSizeEstimatorProps {
  queryGroup: QueryGroup;
}

export const AudienceSizeEstimator = ({ queryGroup }: AudienceSizeEstimatorProps) => {
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [targetEntityType, setTargetEntityType] = useState<'contacts' | 'companies'>('contacts');
  const { contacts } = useAppSelector(state => state.contacts);
  const companies = useAppSelector(state => state.companies.companies);

  // Determine the entity type based on the rules
  useEffect(() => {
    if (queryGroup.rules.length > 0) {
      // Check the first rule to determine entity type
      // This is a simple heuristic - could be improved
      for (const rule of queryGroup.rules) {
        if ('field' in rule && rule.field) {
          const fieldId = rule.field;
          if (fieldId.startsWith('company.')) {
            setTargetEntityType('companies');
            break;
          } else {
            setTargetEntityType('contacts');
            break;
          }
        }
      }
    }
  }, [queryGroup]);

  useEffect(() => {
    const estimateAudienceSize = async () => {
      if (queryGroup.rules.length === 0) {
        setEstimatedSize(0);
        return;
      }

      setIsLoading(true);
      try {
        // For this demo, we'll use the mock data already in Redux
        // In a real app, you would call your API endpoint with the query rules
        
        // Simple matching algorithm based on the query rules
        const entities = targetEntityType === 'contacts' ? contacts : companies;
        
        // If no rules, return total count
        if (queryGroup.rules.length === 0) {
          setEstimatedSize(entities.length);
          return;
        }
        
        // Simple filtering logic (this is a simplified version)
        // In a real app, you'd send the rules to the backend for proper SQL querying
        const matches = entities.filter(entity => {
          // This is a very basic implementation - in a real app, this would be handled by the backend
          return matchesQueryGroup(entity, queryGroup);
        });
        
        setEstimatedSize(matches.length);
      } catch (error) {
        console.error('Error estimating audience size:', error);
        setEstimatedSize(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the estimation to prevent too many calculations while the user is still defining rules
    const timeoutId = setTimeout(() => {
      estimateAudienceSize();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [queryGroup, contacts, companies, targetEntityType]);

  // Very simplified matching logic - in a real app this would be done server-side
  const matchesQueryGroup = (entity: any, group: QueryGroup): boolean => {
    if (group.rules.length === 0) return true;
    
    const results = group.rules.map(rule => {
      if ('combinator' in rule) {
        return matchesQueryGroup(entity, rule);
      } else if ('field' in rule) {
        const fieldPath = rule.field.split('.');
        let value = entity;
        
        // Navigate through nested object properties
        for (const key of fieldPath) {
          if (value && typeof value === 'object' && key in value) {
            value = value[key];
          } else {
            value = undefined;
            break;
          }
        }
        
        // Very basic operator implementation
        if (value === undefined) return false;
        
        switch (rule.operator) {
          case 'equals':
            return value === rule.value;
          case 'not_equals':
            return value !== rule.value;
          case 'contains':
            return typeof value === 'string' && value.includes(String(rule.value));
          case 'starts_with':
            return typeof value === 'string' && value.startsWith(String(rule.value));
          case 'greater_than':
            return typeof value === 'number' && value > Number(rule.value);
          case 'less_than':
            return typeof value === 'number' && value < Number(rule.value);
          default:
            return false;
        }
      }
      return false;
    });
    
    // Apply the combinator (AND/OR)
    if (group.combinator === 'and') {
      return results.every(Boolean);
    } else {
      return results.some(Boolean);
    }
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
      <div className="flex items-center gap-2">
        <Gauge className="h-5 w-5 text-blue-500" />
        <h3 className="font-medium">Audience Size Estimate</h3>
      </div>
      
      <div className="flex items-center gap-3">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-blue-500 rounded-full border-t-transparent"></div>
            <span>Calculating...</span>
          </div>
        ) : (
          <>
            {targetEntityType === 'contacts' ? (
              <User className="h-5 w-5 text-gray-500" />
            ) : (
              <Users className="h-5 w-5 text-gray-500" />
            )}
            <span className="font-semibold text-lg">{estimatedSize !== null ? estimatedSize.toLocaleString() : 'Unknown'}</span>
            <span className="text-gray-500">{targetEntityType === 'contacts' ? 'contacts' : 'companies'} match these rules</span>
          </>
        )}
      </div>
      
      {estimatedSize === 0 && queryGroup.rules.length > 0 && (
        <div className="text-amber-600 text-sm flex items-center gap-1">
          <span>⚠️</span>
          <span>No matches found. Consider revising your rules.</span>
        </div>
      )}
    </div>
  );
};
