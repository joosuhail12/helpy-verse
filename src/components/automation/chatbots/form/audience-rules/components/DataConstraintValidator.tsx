
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAppSelector } from '@/hooks/useAppSelector';
import { QueryGroup } from '@/types/queryBuilder';

interface DataConstraintValidatorProps {
  audience: QueryGroup;
  onChange?: (audience: QueryGroup) => void;
}

interface Constraint {
  id: string;
  field: string;
  description: string;
  status: 'passed' | 'warning' | 'failed';
  recommendation?: string;
}

export const DataConstraintValidator = ({ audience, onChange }: DataConstraintValidatorProps) => {
  const [constraints, setConstraints] = useState<Constraint[]>([]);
  const contacts = useAppSelector((state) => state.contacts?.contacts) || [];
  const companies = useAppSelector((state) => state.companies?.companies) || [];

  // Analyze the audience rules for potential data constraints
  useEffect(() => {
    if (!audience || !audience.rules || audience.rules.length === 0) {
      setConstraints([
        {
          id: 'empty-rules',
          field: 'general',
          description: 'No audience rules defined',
          status: 'warning',
          recommendation: 'Add at least one rule to target your audience',
        },
      ]);
      return;
    }

    const newConstraints: Constraint[] = [];

    // Check for data availability
    if (contacts.length === 0 && companies.length === 0) {
      newConstraints.push({
        id: 'no-data',
        field: 'general',
        description: 'No contact or company data available',
        status: 'warning',
        recommendation: 'Import contacts or companies to accurately target your audience',
      });
    }

    // Process rules recursively
    const processRules = (group: QueryGroup) => {
      group.rules.forEach((rule) => {
        if ('combinator' in rule) {
          // This is a nested group
          processRules(rule);
        } else {
          // This is a single rule
          // Check for potential data constraints
          const fieldType = rule.field.split('.')[0];
          
          // Check for string operators on numeric fields
          const stringOperators = ['contains', 'startsWith', 'endsWith'];
          if (fieldType === 'number' && stringOperators.includes(rule.operator)) {
            newConstraints.push({
              id: `invalid-operator-${rule.id}`,
              field: rule.field,
              description: `String operator "${rule.operator}" used on numeric field`,
              status: 'failed',
              recommendation: 'Use numeric operators like equals, greaterThan, or lessThan',
            });
          }
        }
      });
    };

    processRules(audience);
    setConstraints(newConstraints);
  }, [audience, contacts, companies]);

  if (constraints.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Data Constraints
          </CardTitle>
          <CardDescription>No data constraints detected</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Your audience rules appear to be well-formed and should work with the available data.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Data Constraints
        </CardTitle>
        <CardDescription>
          {constraints.length} potential {constraints.length === 1 ? 'issue' : 'issues'} detected
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {constraints.map((constraint) => (
          <Alert
            key={constraint.id}
            variant={constraint.status === 'failed' ? 'destructive' : 'default'}
          >
            <AlertTitle className="flex items-center gap-2">
              {constraint.description}
              <Badge variant={constraint.status === 'failed' ? 'destructive' : 'secondary'}>
                {constraint.field}
              </Badge>
            </AlertTitle>
            {constraint.recommendation && (
              <AlertDescription>{constraint.recommendation}</AlertDescription>
            )}
          </Alert>
        ))}
      </CardContent>
    </Card>
  );
};
