
import React from 'react';
import { QueryGroupComponent } from './QueryGroupComponent';

// Simple interfaces to avoid circular references
interface QueryRule {
  id: string;
  field: string;
  operator: string;
  value: any;
}

interface QueryGroup {
  id: string;
  combinator: 'and' | 'or';
  rules: Array<QueryRule | QueryGroup>;
}

interface QueryField {
  id: string;
  label: string;
  type: string;
  name: string;
  dataSource?: string;
  customObject?: string;
  options?: Array<string | { value: string; label: string }>;
}

interface ValidationError {
  path?: string;
  message: string;
  rule?: QueryRule;
  field?: string;
}

interface QueryBuilderProps {
  value: QueryGroup;
  onChange: (group: QueryGroup) => void;
  fields: QueryField[];
  errors?: ValidationError[];
}

export const QueryBuilder: React.FC<QueryBuilderProps> = ({ 
  value, 
  onChange, 
  fields, 
  errors = [] 
}) => {
  return (
    <QueryGroupComponent
      group={value}
      fields={fields}
      onChange={onChange}
      depth={0}
      maxDepth={3}
      errors={errors}
    />
  );
};
