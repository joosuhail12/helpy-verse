
export interface QueryRule {
  id: string;
  field: string;
  operator: ComparisonOperator;
  value: any;
}

export interface QueryGroup {
  id: string;
  combinator: 'and' | 'or';
  rules: (QueryRule | QueryGroup)[];
}

export interface QueryField {
  id: string;
  label: string;
  type: FieldType;
  options?: string[];
  description?: string;
  entity?: string;
  placeholder?: string;
}

export type ComparisonOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equal'
  | 'less_than_or_equal'
  | 'starts_with'
  | 'ends_with'
  | 'is_empty'
  | 'is_not_empty'
  | 'in'
  | 'not_in';

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'boolean' 
  | 'date' 
  | 'select' 
  | 'multi-select';

export type DataSource = 
  | 'contacts'
  | 'companies'
  | 'tickets'
  | 'conversations'
  | 'activities'
  | 'custom_objects';

export interface ValidationError {
  ruleId: string;
  field: string;
  message: string;
  path?: string;
}
