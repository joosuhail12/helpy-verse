
// If this file doesn't exist, we'll create it with the necessary types

export type WorkflowType = 'message' | 'automation' | 'schedule' | 'bot';
export type WorkflowStatus = 'Live' | 'Draft';
export type WorkflowChangeType = 'add' | 'update' | 'remove';

export interface WorkflowTag {
  id: string;
  name: string;
  color: string;
}

export interface WorkflowDependency {
  id: string;
  sourceWorkflowId: string;
  targetWorkflowId: string;
  type: 'trigger' | 'data' | 'condition' | 'sequence';
  description?: string;
}

export interface WorkflowChange {
  field: string;
  oldValue?: string;
  newValue?: string;
  type: WorkflowChangeType;
}

export interface WorkflowVersion {
  id: string;
  workflowId: string;
  version: number;
  createdAt: Date;
  createdBy: {
    id: string;
    name: string;
    avatar?: string;
  };
  changes: WorkflowChange[];
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'success' | 'failed' | 'running';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface WorkflowMetrics {
  totalRuns: number;
  successfulRuns?: number;
  failedRuns?: number;
  successRate: number;
  averageDuration?: number;
  lastRun?: Date;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  type: WorkflowType;
  createdAt: Date;
  updatedAt: Date;
  tags?: WorkflowTag[];
  metrics?: WorkflowMetrics;
  runs?: WorkflowRun[];
  dependencies?: WorkflowDependency[];
  dependents?: WorkflowDependency[];
  version?: number;
  versions?: WorkflowVersion[];
  lastEditedBy?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface WorkflowFolder {
  id: string;
  name: string;
  description?: string;
  workflowIds: string[];
}
