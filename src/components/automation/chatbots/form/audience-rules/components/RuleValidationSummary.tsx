
import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ValidationError } from '../utils/validation';

interface RuleValidationSummaryProps {
  errors: ValidationError[];
}

export const RuleValidationSummary: React.FC<RuleValidationSummaryProps> = ({ errors }) => {
  if (!errors.length) return null;
  
  return (
    <Alert variant="destructive">
      <AlertTitle>Validation Errors</AlertTitle>
      <AlertDescription>
        <ul className="list-disc pl-5 mt-2">
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
