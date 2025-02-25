
export type ComparisonOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'in'
  | 'not_in'
  | 'is_empty'
  | 'is_not_empty';

export type DataSource = 'contacts' | 'companies' | 'custom_objects';

export type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'select' | 'multi-select';

export interface QueryField {
  id: string;
  label: string;
  type: FieldType;
  source: DataSource;
  options?: string[];
  customObject?: string;
}

export interface QueryRule {
  id: string;
  field: string;
  operator: ComparisonOperator;
  value: string | number | boolean | string[];
}

export interface QueryGroup {
  id: string;
  combinator: 'and' | 'or';
  rules: (QueryRule | QueryGroup)[];
}
