
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface EmptyWorkflowStateProps {
  onCreateClick: () => void;
}

export const EmptyWorkflowState: React.FC<EmptyWorkflowStateProps> = ({ onCreateClick }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border rounded-lg text-center">
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <PlusCircle className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-2">No workflows yet</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Create your first workflow to automate tasks, send messages, or trigger actions based on events.
      </p>
      <Button onClick={onCreateClick} size="lg">
        <PlusCircle className="mr-2 h-5 w-5" />
        Create your first workflow
      </Button>
    </div>
  );
};
