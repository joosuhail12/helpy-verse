
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Info, 
  BarChart3, 
  History, 
  Link,
  Calendar,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import { formatDistance, format } from 'date-fns';
import { Workflow, WorkflowDependency } from '@/types/workflow';
import { WorkflowMetricsCard } from './WorkflowAnalytics';
import { WorkflowVersionHistory } from './WorkflowVersionHistory';
import { WorkflowDependencies } from './WorkflowDependencies';
import { toast } from 'sonner';

interface WorkflowDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflow: Workflow | null;
  allWorkflows: Workflow[];
  onUpdateDependencies?: (workflow: Workflow) => void;
  onRestoreVersion?: (workflow: Workflow, versionId: string) => void;
}

const WorkflowDetailModal: React.FC<WorkflowDetailModalProps> = ({
  open,
  onOpenChange,
  workflow,
  allWorkflows,
  onUpdateDependencies,
  onRestoreVersion
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!workflow) {
    return null;
  }

  const handleAddDependency = (dependency: Omit<WorkflowDependency, 'id'>) => {
    if (!workflow || !onUpdateDependencies) return;
    
    const updatedWorkflow = {
      ...workflow,
      dependencies: [
        ...(workflow.dependencies || []),
        {
          id: `dep-${Date.now()}`,
          sourceWorkflowId: dependency.sourceWorkflowId,
          targetWorkflowId: dependency.targetWorkflowId,
          type: dependency.type,
          description: dependency.description
        }
      ]
    };
    
    onUpdateDependencies(updatedWorkflow);
    toast.success('Dependency added successfully');
  };

  const handleRemoveDependency = (dependencyId: string) => {
    if (!workflow || !onUpdateDependencies) return;
    
    const updatedWorkflow = {
      ...workflow,
      dependencies: (workflow.dependencies || []).filter(d => d.id !== dependencyId)
    };
    
    onUpdateDependencies(updatedWorkflow);
    toast.success('Dependency removed successfully');
  };

  const handleRestoreVersion = (versionId: string) => {
    if (!workflow || !onRestoreVersion) return;
    onRestoreVersion(workflow, versionId);
    toast.success('Workflow version restored successfully');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center gap-3 mb-1">
            <DialogTitle className="text-2xl">{workflow.name}</DialogTitle>
            <Badge variant={workflow.status === 'Live' ? 'success' : 'secondary'}>
              {workflow.status}
            </Badge>
          </div>
          <DialogDescription className="text-base">
            {workflow.description || 'No description provided'}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          defaultValue="overview" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="border-b px-6">
            <TabsList className="mt-2 mb-0">
              <TabsTrigger value="overview" className="flex items-center gap-1">
                <Info className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="metrics" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                Metrics
              </TabsTrigger>
              <TabsTrigger value="dependencies" className="flex items-center gap-1">
                <Link className="h-4 w-4" />
                Dependencies
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-1">
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-auto">
            <TabsContent value="overview" className="p-6 min-h-[40vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Details</h3>
                  <dl className="space-y-4 text-sm">
                    <div className="flex flex-row gap-x-3">
                      <dt className="flex-none text-muted-foreground w-28">Type:</dt>
                      <dd className="capitalize">{workflow.type}</dd>
                    </div>
                    <div className="flex flex-row gap-x-3">
                      <dt className="flex-none text-muted-foreground w-28">Created:</dt>
                      <dd>{format(new Date(workflow.createdAt), 'PPP')}</dd>
                    </div>
                    <div className="flex flex-row gap-x-3">
                      <dt className="flex-none text-muted-foreground w-28">Last Updated:</dt>
                      <dd>{format(new Date(workflow.updatedAt), 'PPP')}</dd>
                    </div>
                    <div className="flex flex-row gap-x-3">
                      <dt className="flex-none text-muted-foreground w-28">Last Edited By:</dt>
                      <dd>{workflow.lastEditedBy?.name || 'Unknown'}</dd>
                    </div>
                    <div className="flex flex-row gap-x-3">
                      <dt className="flex-none text-muted-foreground w-28">Version:</dt>
                      <dd>v{workflow.version || 1}</dd>
                    </div>
                    {workflow.tags && workflow.tags.length > 0 && (
                      <div className="flex flex-row gap-x-3">
                        <dt className="flex-none text-muted-foreground w-28 pt-0.5">Tags:</dt>
                        <dd className="flex flex-wrap gap-2">
                          {workflow.tags.map((tag) => (
                            <Badge 
                              key={tag.id} 
                              variant="outline" 
                              style={{ borderColor: tag.color, color: tag.color }}
                            >
                              {tag.name}
                            </Badge>
                          ))}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Execution Stats</h3>
                  {workflow.metrics ? (
                    <dl className="space-y-4 text-sm">
                      <div className="flex flex-row gap-x-3">
                        <dt className="flex-none text-muted-foreground w-28">Total Runs:</dt>
                        <dd className="font-medium">{workflow.metrics.totalRuns}</dd>
                      </div>
                      <div className="flex flex-row gap-x-3">
                        <dt className="flex-none text-muted-foreground w-28">Success Rate:</dt>
                        <dd className="font-medium">{(workflow.metrics.successRate * 100).toFixed(1)}%</dd>
                      </div>
                      <div className="flex flex-row gap-x-3">
                        <dt className="flex-none text-muted-foreground w-28">Successful:</dt>
                        <dd className="flex items-center gap-1">
                          <Check className="h-3.5 w-3.5 text-green-600" />
                          {workflow.metrics.successfulRuns}
                        </dd>
                      </div>
                      <div className="flex flex-row gap-x-3">
                        <dt className="flex-none text-muted-foreground w-28">Failed:</dt>
                        <dd className="flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                          {workflow.metrics.failedRuns}
                        </dd>
                      </div>
                      {workflow.metrics.lastRun && (
                        <div className="flex flex-row gap-x-3">
                          <dt className="flex-none text-muted-foreground w-28">Last Run:</dt>
                          <dd className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {formatDistance(new Date(workflow.metrics.lastRun), new Date(), {
                              addSuffix: true,
                            })}
                          </dd>
                        </div>
                      )}
                      {workflow.metrics.averageDuration && (
                        <div className="flex flex-row gap-x-3">
                          <dt className="flex-none text-muted-foreground w-28">Avg Duration:</dt>
                          <dd className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                            {(workflow.metrics.averageDuration / 1000).toFixed(1)}s
                          </dd>
                        </div>
                      )}
                    </dl>
                  ) : (
                    <div className="text-muted-foreground py-4">No execution data available</div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="p-6 min-h-[40vh]">
              {workflow.metrics ? (
                <WorkflowMetricsCard
                  metrics={workflow.metrics}
                  runs={workflow.runs}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mb-4 opacity-30" />
                  <p>No metrics data available for this workflow</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="dependencies" className="p-6 min-h-[40vh]">
              <WorkflowDependencies
                workflow={workflow}
                allWorkflows={allWorkflows}
                onAddDependency={handleAddDependency}
                onRemoveDependency={handleRemoveDependency}
              />
            </TabsContent>
            
            <TabsContent value="history" className="p-6 min-h-[40vh]">
              {workflow.versions && workflow.versions.length > 0 ? (
                <WorkflowVersionHistory
                  versions={workflow.versions}
                  onRestoreVersion={handleRestoreVersion}
                />
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <History className="h-12 w-12 mb-4 opacity-30" />
                  <p>No version history available for this workflow</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowDetailModal;
