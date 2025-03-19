
import React from 'react';
import { FieldType } from '@/types/queryBuilder';

export interface FieldExamplesProps {
  fieldType: FieldType;
}

export const FieldExamples: React.FC<FieldExamplesProps> = ({ fieldType }) => {
  let examples: string[] = [];
  
  switch (fieldType) {
    case 'string':
    case 'text':
    case 'email':
      examples = ['Example: "John Doe"', 'Example: "john@example.com"'];
      break;
    case 'number':
      examples = ['Example: 42', 'Example: 100.50'];
      break;
    case 'date':
      examples = ['Example: 2023-04-15', 'Format: YYYY-MM-DD'];
      break;
    case 'boolean':
      examples = ['Values: true/false'];
      break;
    default:
      examples = ['Enter value...'];
  }
  
  return (
    <div className="text-xs text-muted-foreground mt-1">
      {examples.map((example, i) => (
        <div key={i}>{example}</div>
      ))}
    </div>
  );
};
