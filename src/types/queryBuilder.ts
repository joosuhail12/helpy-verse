
export type ComparisonOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_equals'
  | 'less_than_equals'
  | 'in'
  | 'not_in'
  | 'is_empty'
  | 'is_not_empty'
  | 'between'
  | 'not_between'
  | 'contains_any'
  | 'contains_all'
  | 'has_none'
  | 'has_any'
  | 'has_all'
  | 'after'
  | 'before'
  | 'last_n_days'
  | 'next_n_days'
  | 'this_week'
  | 'this_month'
  | 'this_year'
  | 'last_week'
  | 'last_month'
  | 'last_year'
  | 'next_week'
  | 'next_month'
  | 'next_year'
  | 'rolling_days'
  | 'rolling_months'
  | 'rolling_years'
  | 'custom_range';

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
