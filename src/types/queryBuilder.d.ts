
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

export interface QueryRule {
  id: string;
  field: string;
  operator: ComparisonOperator;
  value?: string | number | boolean | string[] | number[];
}

export interface QueryGroup {
  id: string;
  combinator: CombinatorType;
  rules: (QueryRule | QueryGroup)[];
}

export type FieldType = 
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'enum'
  | 'email'
  | 'phone'
  | 'url';

export interface QueryField {
  id: string;
  label: string;
  type: FieldType;
  options?: { label: string; value: string }[];
  dataSource?: DataSource;
}
