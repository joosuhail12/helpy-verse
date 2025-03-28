
export interface ValidationError {
  message: string;
  path?: string;
  rule?: {
    id: string;
  };
}

export interface QueryField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multiselect';
  dataSource?: DataSource;
  customObject?: string;
  options?: string[];
  operators?: string[];
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
  | 'notIn';

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
