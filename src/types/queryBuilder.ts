
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

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'select' | 'multi-select' | 'email' | 'phone' | 'text';
export type ComparisonOperator = 
  'equals' | 'notEquals' | 'contains' | 'startsWith' | 'endsWith' | 
  'greaterThan' | 'lessThan' | 'in' | 'notIn' | 'exists' | 'notExists' |
  'custom_range' | 'last_n_days' | 'next_n_days' | 'rolling_days';
export type DataSource = 'contacts' | 'companies' | 'tickets' | 'custom_objects' | 'conversations';

export interface QueryField {
  id: string;
  label: string;
  type: FieldType;
  source: DataSource;
  customObject?: string;
  options?: string[];
}
