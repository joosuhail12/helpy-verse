
// Common type definitions for the query builder

export interface QueryField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  dataSource?: string;
  customObject?: string;
  options?: Array<{ label: string; value: string; }>;
  placeholder?: string;
  defaultValue?: any;
  validation?: ValidationRule[];
}

export type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'select' | 'multi-select';

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
  | 'next_n_days';

export interface QueryRule {
  id: string;
  field: string;
  operator: ComparisonOperator;
  value: any;
}

export interface QueryGroup {
  id: string;
  combinator: 'and' | 'or';
  rules: Array<QueryRule | QueryGroup>;
}

export interface ValidationRule {
  type: 'required' | 'regex' | 'min' | 'max';
  value?: string | number;
  message: string;
}

export interface ValidationError {
  message: string;
  rule?: QueryRule;
  group?: QueryGroup;
  path?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
