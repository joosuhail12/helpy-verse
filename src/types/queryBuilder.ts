
export interface ValidationError {
  message: string;
  path?: string;
  rule?: {
    id: string;
  };
  group?: QueryGroup;
  field?: string;
}

export interface QueryField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  dataSource?: DataSource;
  customObject?: string;
  options?: Array<{ label: string; value: string; } | string>;
  operators?: string[];
  placeholder?: string;
  defaultValue?: any;
}

export type Operator = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'notContains' 
  | 'startsWith' 
  | 'endsWith' 
  | 'greaterThan' 
  | 'lessThan' 
  | 'inRange' 
  | 'notInRange' 
  | 'isEmpty' 
  | 'isNotEmpty' 
  | 'in' 
  | 'notIn'
  | 'is_empty'
  | 'is_not_empty'
  | 'not_equals'
  | 'greater_than'
  | 'less_than';

export type DataSource = 
  | 'contact' 
  | 'company' 
  | 'conversation' 
  | 'ticket' 
  | 'event'
  | '';

export interface QueryRule {
  id: string;
  field: string;
  operator: Operator;
  value: any;
}

export interface QueryGroup {
  id: string;
  combinator: 'and' | 'or';
  rules: (QueryRule | QueryGroup)[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}
