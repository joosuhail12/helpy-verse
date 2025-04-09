
import React from 'react';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, ClipboardList, ArrowRight, Lightbulb } from 'lucide-react';

interface EmptyWorkflowStateProps {
  onCreateClick: () => void;
}

export const EmptyWorkflowState: React.FC<EmptyWorkflowStateProps> = ({ onCreateClick }) => {
  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <Card className="w-full max-w-md text-center p-8 bg-white shadow-lg border-none transition-all duration-300 hover:shadow-xl rounded-xl overflow-hidden">
        <CardContent className="pt-6 flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl opacity-70"></div>
            <div className="mb-4 h-20 w-20 rounded-full bg-gradient-to-tr from-primary/60 to-primary/90 flex items-center justify-center shadow-lg relative z-10 animate-pulse">
              <ClipboardList className="h-10 w-10 text-white" />
            </div>
          </div>
          
          <div>
            <CardTitle className="text-2xl mb-3 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">No workflows yet</CardTitle>
            <CardDescription className="mb-6 text-base text-gray-500">
              Create your first workflow to automate support processes and save time.
            </CardDescription>
          </div>
          
          <Button onClick={onCreateClick} size="lg" className="mx-auto animate-pulse bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300 shadow-md hover:shadow-lg">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create your first workflow
          </Button>
          
          <div className="pt-6 border-t border-gray-100 mt-6 w-full">
            <h4 className="text-sm font-semibold mb-3 flex items-center justify-center gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span>Workflow suggestions</span>
            </h4>
            <ul className="space-y-3 text-sm text-left mx-auto max-w-xs">
              {[
                'Auto-assign incoming tickets to team members',
                'Send welcome messages to new customers',
                'Escalate urgent issues to managers',
                'Follow up on unresolved tickets'
              ].map((suggestion, index) => (
                <li key={index} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-200">
                  <ArrowRight className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
