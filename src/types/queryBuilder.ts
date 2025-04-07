
export type Operator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'starts_with' 
  | 'ends_with'
  | 'greater_than' 
  | 'less_than' 
  | 'greater_than_equal' 
  | 'less_than_equal'
  | 'is_set' 
  | 'is_not_set' 
  | 'in' 
  | 'not_in'
  | 'is_empty'
  | 'is_not_empty'
  | 'between'
  | 'last_n_days'
  | 'next_n_days'
  | 'rolling_days'
  | 'this_week'
  | 'this_month'
  | 'this_year'
  | 'last_week'
  | 'last_month'
  | 'last_year';

export interface QueryRule {
  id: string;
  field: string;
  operator: Operator;
  value: any;
}

export interface QueryGroup {
  id: string;
  combinator: 'and' | 'or';
  rules: Array<QueryRule | QueryGroup>;
}

export type DataSource = 'contacts' | 'companies';

export type ComparisonOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'starts_with' 
  | 'ends_with'
  | 'greater_than' 
  | 'less_than' 
  | 'between' 
  | 'in' 
  | 'not_in'
  | 'exists'
  | 'not_exists';

export type CombinatorType = 'and' | 'or';

export type FieldType = 
  | 'string'
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'enum'
  | 'email'
  | 'phone'
  | 'url'
  | 'select'
  | 'multi-select';

export interface QueryField {
  id: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  dataSource?: DataSource;
  source?: DataSource | 'custom_objects';
  customObject?: string;
}
