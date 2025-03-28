
// Common type definitions for the query builder

export type DataSource = 'contacts' | 'companies' | 'general';

export type ComparisonOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'starts_with' 
  | 'ends_with' 
  | 'greater_than' 
  | 'less_than' 
  | 'greater_than_or_equal' 
  | 'less_than_or_equal'
  | 'is_empty'
  | 'is_not_empty'
  | 'in'
  | 'not_in'
  | 'between'
  | 'custom_range'
  | 'last_n_days'
  | 'next_n_days'
  | 'exists'
  | 'not_exists';

export type CombinatorType = 'and' | 'or';

export interface QueryRule {
  id: string;
  field: string;
  operator: ComparisonOperator;
  value?: any;
}

export interface QueryGroup {
  id: string;
  combinator: CombinatorType;
  rules: Array<QueryRule | QueryGroup>;
}

export type FieldType = 
  | 'text' 
  | 'number' 
  | 'boolean' 
  | 'date' 
  | 'select' 
  | 'multi-select'
  | 'string'
  | 'enum'
  | 'email'
  | 'phone'
  | 'url';

export interface QueryField {
  id: string;
  name?: string;
  label: string;
  type: FieldType;
  dataSource?: DataSource;
  customObject?: string;
  options?: Array<{ label: string; value: string; }>;
  placeholder?: string;
  defaultValue?: any;
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'regex' | 'minLength' | 'maxLength' | 'min' | 'max';
  value?: string | number;
  message: string;
}

export interface ValidationError {
  message: string;
  rule?: QueryRule;
  group?: QueryGroup;
  path?: string;
  field?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
