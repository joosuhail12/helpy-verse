
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyWorkflowStateProps {
  onCreateClick: () => void;
}

export function EmptyWorkflowState({ onCreateClick }: EmptyWorkflowStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed rounded-lg border-muted-foreground/20 bg-muted/10">
      <div className="mb-4 p-3 rounded-full bg-muted/50">
        <PlusCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-medium text-xl mb-2">No workflows yet</h3>
      <p className="text-center text-muted-foreground max-w-md mb-6">
        Get started by creating your first workflow. Automate customer communication, schedule 
        actions, and build responsive support flows.
      </p>
      <Button size="lg" onClick={onCreateClick}>
        <PlusCircle className="mr-2 h-5 w-5" />
        Create your first workflow
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-3xl">
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="font-medium mb-2">Automate responses</h4>
          <p className="text-sm text-muted-foreground">
            Create workflows that automatically respond to customer inquiries based on specific triggers.
          </p>
        </div>
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="font-medium mb-2">Scheduled actions</h4>
          <p className="text-sm text-muted-foreground">
            Set up automated follow-ups, reminders, and periodic communications with your customers.
          </p>
        </div>
        <div className="p-4 bg-muted/20 rounded-lg">
          <h4 className="font-medium mb-2">Custom triggers</h4>
          <p className="text-sm text-muted-foreground">
            Define precise conditions and events that will initiate your workflow automations.
          </p>
        </div>
      </div>
    </div>
  );
}
