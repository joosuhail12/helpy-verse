
import React from 'react';
import { QueryGroupComponent } from './QueryGroupComponent';
import type { QueryGroup, QueryField, ValidationError } from '@/types/queryBuilder';

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
