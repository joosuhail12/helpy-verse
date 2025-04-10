
import { ReactNode } from 'react';

export type FieldType = 
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'select'
  | 'multi-select';

export interface QueryRuleOption {
  label: string;
  value: string | number | boolean;
}

export interface QueryField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  defaultOperator?: string;
  options?: QueryRuleOption[];
  operators?: string[];
  placeholder?: string;
  validate?: (value: any) => boolean | string;
  source?: DataSource;
  customObject?: string;
}

export type QueryOperator =
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater_than'
  | 'less_than'
  | 'greater_than_or_equals'
  | 'less_than_or_equals'
  | 'is_empty'
  | 'is_not_empty'
  | 'in'
  | 'not_in'
  | 'between'
  | 'not_between'
  | 'has_none'
  | 'has_any'
  | 'has_all'
  | 'contains_any'
  | 'contains_all'
  | 'after'
  | 'before'
  | 'last_n_days'
  | 'next_n_days'
  | 'this_week'
  | 'this_month'
  | 'this_year'
  | 'last_week'
  | 'last_month'
  | 'last_year';

export type Operator = QueryOperator;

export interface QueryRule {
  id: string;
  field: string;
  operator: QueryOperator;
  value: string | number | boolean | Array<string | number | boolean> | null;
}

export interface QueryGroup {
  id: string;
  combinator: 'and' | 'or';
  rules: Array<QueryRule | QueryGroup>;
}

export type DataSource = 
  | 'contacts'
  | 'companies'
  | 'tickets'
  | 'custom_objects';

// Remove the duplicate type definition in queryBuilder.d.ts
