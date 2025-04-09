
import React from 'react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ClipboardList } from 'lucide-react';

interface EmptyWorkflowStateProps {
  onCreateClick: () => void;
}

export const EmptyWorkflowState: React.FC<EmptyWorkflowStateProps> = ({ onCreateClick }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md text-center p-6 bg-white shadow-md border-none transition-all duration-300 hover:shadow-lg">
        <CardContent className="pt-6 flex flex-col items-center">
          <div className="mb-4 h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
            <ClipboardList className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl mb-3">No workflows yet</CardTitle>
          <CardDescription className="mb-6 text-base">
            Create your first workflow to automate your support processes.
          </CardDescription>
          <Button onClick={onCreateClick} size="lg" className="mx-auto animate-pulse">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create your first workflow
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
