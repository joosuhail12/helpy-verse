import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRightCircle, PlusCircle, AlertTriangle, Link, Link2Off } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Workflow, WorkflowDependency } from '@/types/workflow';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface WorkflowDependenciesProps {
  workflow: Workflow;
  allWorkflows: Workflow[];
  onAddDependency?: (dependency: Omit<WorkflowDependency, 'id'>) => void;
  onRemoveDependency?: (dependencyId: string) => void;
  className?: string;
}

export const WorkflowDependencies: React.FC<WorkflowDependenciesProps> = ({
  workflow,
  allWorkflows,
  onAddDependency,
  onRemoveDependency,
  className,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [dependencyType, setDependencyType] = useState<WorkflowDependency['type']>('trigger');
  const [targetWorkflowId, setTargetWorkflowId] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const availableTargetWorkflows = allWorkflows.filter(w => w.id !== workflow.id);
  
  const dependencies = workflow.dependencies || [];
  const dependents = workflow.dependents || [];

  const handleAddDependency = () => {
    if (!targetWorkflowId) {
      toast.error('Please select a target workflow');
      return;
    }

    if (onAddDependency) {
      onAddDependency({
        sourceWorkflowId: workflow.id,
        targetWorkflowId,
        type: dependencyType,
        description: description.trim() || undefined,
      });
    }

    setIsAddDialogOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setDependencyType('trigger');
    setTargetWorkflowId('');
    setDescription('');
  };

  const getDependencyTypeDisplay = (type: WorkflowDependency['type']) => {
    switch (type) {
      case 'trigger':
        return <Badge variant="info">Triggers</Badge>;
      case 'data':
        return <Badge variant="warning">Data</Badge>;
      case 'sequence':
        return <Badge variant="secondary">Sequence</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getWorkflowById = (id: string) => {
    return allWorkflows.find(w => w.id === id);
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg font-semibold">
            <div className="flex items-center gap-2">
              Dependencies
              {dependencies.length > 0 && (
                <Badge variant="outline" className="ml-2 font-mono text-xs">
                  {dependencies.length}
                </Badge>
              )}
            </div>
            {onAddDependency && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddDialogOpen(true)}
                className="h-8"
              >
                <PlusCircle className="mr-1 h-3.5 w-3.5" />
                Add
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dependencies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Link className="h-10 w-10 text-muted-foreground/60 mb-3" />
              <p className="text-sm text-muted-foreground">This workflow doesn't depend on any other workflows</p>
              {onAddDependency && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add dependency
                </Button>
              )}
            </div>
          ) : (
            <ul className="space-y-3">
              {dependencies.map((dependency) => {
                const targetWorkflow = getWorkflowById(dependency.targetWorkflowId);
                return (
                  <li key={dependency.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getDependencyTypeDisplay(dependency.type)}
                      </div>
                      <div>
                        <p className="font-medium">{targetWorkflow?.name || 'Unknown workflow'}</p>
                        {dependency.description && (
                          <p className="text-xs text-muted-foreground mt-1">{dependency.description}</p>
                        )}
                      </div>
                    </div>
                    {onRemoveDependency && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveDependency(dependency.id)}
                        className="h-7 w-7 p-0 rounded-full"
                      >
                        <Link2Off className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="sr-only">Remove dependency</span>
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold flex items-center">
            <span>Used By</span>
            {dependents.length > 0 && (
              <Badge variant="outline" className="ml-2 font-mono text-xs">
                {dependents.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dependents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Link2Off className="h-10 w-10 text-muted-foreground/60 mb-3" />
              <p className="text-sm text-muted-foreground">No other workflows depend on this workflow</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {dependents.map((dependent) => {
                const sourceWorkflow = getWorkflowById(dependent.sourceWorkflowId);
                return (
                  <li key={dependent.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {getDependencyTypeDisplay(dependent.type)}
                      </div>
                      <div>
                        <p className="font-medium">{sourceWorkflow?.name || 'Unknown workflow'}</p>
                        {dependent.description && (
                          <p className="text-xs text-muted-foreground mt-1">{dependent.description}</p>
                        )}
                      </div>
                    </div>
                    <ArrowRightCircle className="h-4 w-4 text-muted-foreground" />
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Dependency</DialogTitle>
            <DialogDescription>
              Define how this workflow depends on another workflow
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="target">Target Workflow</Label>
              <Select 
                value={targetWorkflowId} 
                onValueChange={setTargetWorkflowId}
              >
                <SelectTrigger id="target">
                  <SelectValue placeholder="Select a workflow" />
                </SelectTrigger>
                <SelectContent>
                  {availableTargetWorkflows.length === 0 ? (
                    <div className="p-2 text-sm text-muted-foreground">
                      No other workflows available
                    </div>
                  ) : (
                    availableTargetWorkflows.map((w) => (
                      <SelectItem key={w.id} value={w.id}>
                        {w.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {availableTargetWorkflows.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Create other workflows first to establish dependencies
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Dependency Type</Label>
              <Select 
                value={dependencyType} 
                onValueChange={(value) => setDependencyType(value as WorkflowDependency['type'])}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trigger">Trigger</SelectItem>
                  <SelectItem value="data">Data</SelectItem>
                  <SelectItem value="sequence">Sequence</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {dependencyType === 'trigger' && "This workflow is triggered by the target workflow"}
                {dependencyType === 'data' && "This workflow uses data produced by the target workflow"}
                {dependencyType === 'sequence' && "This workflow runs after the target workflow completes"}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Explain how this workflow depends on the target..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDependency} disabled={!targetWorkflowId}>Add Dependency</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
