
import { ReactNode } from 'react';

export type WorkflowType = 'automation' | 'message' | 'schedule' | 'bot';
export type WorkflowStatus = 'Live' | 'Draft';
export type WorkflowChangeType = 'add' | 'update' | 'remove';

export interface WorkflowUser {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
}

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

export interface WorkflowRun {
  id: string;
  workflowId: string;
  status: 'success' | 'failed' | 'running';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  error?: string;
  data?: Record<string, any>;
}

export interface WorkflowMetrics {
  totalRuns: number;
  successRate: number;
  failedRuns: number;
  successfulRuns: number;
  averageDuration?: number;
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
  createdBy: WorkflowUser;
  changes: WorkflowChange[];
}

export interface WorkflowDependency {
  id: string;
  sourceWorkflowId: string;
  targetWorkflowId: string;
  type: 'trigger' | 'action' | 'data';
  description?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  type: WorkflowType;
  status: WorkflowStatus;
  createdAt: Date;
  updatedAt: Date;
  tags?: WorkflowTag[];
  metrics?: WorkflowMetrics;
  runs?: WorkflowRun[];
  version?: number;
  lastEditedBy?: WorkflowUser;
  dependencies?: WorkflowDependency[];
  dependents?: WorkflowDependency[];
  versions?: WorkflowVersion[];
}
