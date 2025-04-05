
export type Operator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains' 
  | 'starts_with' 
  | 'ends_with'
  | 'greater_than' 
  | 'less_than' 
  | 'greater_than_equal' 
  | 'less_than_equal'
  | 'is_set' 
  | 'is_not_set' 
  | 'in' 
  | 'not_in';

export interface QueryRule {
  id: string;
  field: string;
  operator: Operator;
  value: any;
}

export interface QueryGroup {
  id: string;
  combinator: 'and' | 'or';
  rules: Array<QueryRule | QueryGroup>;
}
