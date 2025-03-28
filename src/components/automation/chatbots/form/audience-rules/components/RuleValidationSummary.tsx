
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { ValidationError } from '../utils/ruleValidator';

interface RuleValidationSummaryProps {
  errors: ValidationError[];
}

export const RuleValidationSummary: React.FC<RuleValidationSummaryProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Validation Issues</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          {errors.map((error, index) => (
            <li key={index} className="text-sm">
              {error.message}
            </li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};
