
import { QueryGroup, QueryField, ValidationError } from '@/types/queryBuilder';
import { QueryGroupComponent } from './QueryGroupComponent';

interface QueryBuilderProps {
  value: QueryGroup;
  onChange: (group: QueryGroup) => void;
  fields: QueryField[];
  errors?: ValidationError[];
}

export const QueryBuilder = ({ value, onChange, fields, errors = [] }: QueryBuilderProps) => {
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
