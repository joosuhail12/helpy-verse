
import { QueryGroup, QueryField } from '@/types/queryBuilder';
import { QueryGroupComponent } from './QueryGroupComponent';
import type { ValidationError } from '@/components/automation/chatbots/form/audience-rules/utils/validation';

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
      onChange={onChange}
      fields={fields}
      depth={0}
      maxDepth={3}
      errors={errors}
    />
  );
};
