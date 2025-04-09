
import { User } from './content';

export type WorkflowType = 'message' | 'automation' | 'schedule' | 'bot';
export type WorkflowStatus = 'Live' | 'Draft';

export interface WorkflowTag {
  id: string;
  name: string;
  color: string;
}

export interface WorkflowFolder {
  id: string;
  name: string;
  description?: string;
  workflowIds: string[];
}

export interface WorkflowMetrics {
  totalRuns: number;
  successRate: number;
  lastRun?: Date;
  averageDuration?: number;
  failedRuns: number;
  successfulRuns: number;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'success' | 'failed' | 'running';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  triggeredBy?: User;
  error?: string;
}

export interface WorkflowDependency {
  id: string;
  sourceWorkflowId: string;
  targetWorkflowId: string;
  type: 'trigger' | 'data' | 'sequence';
  description?: string;
}

export interface WorkflowVersion {
  id: string;
  workflowId: string;
  version: number;
  createdAt: Date;
  createdBy: User;
  changes: WorkflowChange[];
}

export interface WorkflowChange {
  field: string;
  oldValue?: string | number | boolean;
  newValue?: string | number | boolean;
  type: 'update' | 'add' | 'remove';
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStatus;
  type: WorkflowType;
  updatedAt: Date;
  createdAt: Date;
  tags?: WorkflowTag[];
  folderId?: string;
  metrics?: WorkflowMetrics;
  runs?: WorkflowRun[];
  dependencies?: WorkflowDependency[];
  dependents?: WorkflowDependency[];
  versions?: WorkflowVersion[];
  version?: number;
  lastEditedBy?: User;
}
