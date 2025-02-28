
export interface ValidationError {
  ruleId: string;
  field: string;
  message: string;
}

export interface RuleConflict {
  ruleIds: string[];
  type: 'exclusive' | 'redundant' | 'contradicting';
  message: string;
}

export interface ConstraintIssue {
  ruleId: string;
  field: string;
  message: string;
  severity: 'warning' | 'error';
}
