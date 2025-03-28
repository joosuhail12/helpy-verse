
export interface QueryField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select' | 'multi-select';
  source?: string;
  source_type?: string;
  options?: string[];
  placeholder?: string;
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  default?: any;
  customObject?: string;
}

export type DataSource = 'contacts' | 'companies' | 'deals' | 'tickets' | 'emails' | '';

export type Combinator = 'and' | 'or';

export interface QueryRule {
  id: string;
  field: string;
  operator: string;
  value: any;
}

export interface QueryGroup {
  id: string;
  combinator: Combinator;
  rules: (QueryRule | QueryGroup)[];
}

export interface ValidationError {
  ruleId: string;
  field: string;
  message: string;
  path?: string;
}

export enum FieldType {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  BOOLEAN = 'boolean',
  SELECT = 'select',
  MULTI_SELECT = 'multi-select'
}

export enum ComparisonOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  IS_EMPTY = 'is_empty',
  IS_NOT_EMPTY = 'is_not_empty',
  IN = 'in',
  NOT_IN = 'not_in',
  BETWEEN = 'between',
  WITHIN_LAST = 'within_last',
  AFTER = 'after',
  BEFORE = 'before',
  IS = 'is',
  IS_NOT = 'is_not'
}
