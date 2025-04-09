
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  PlusCircle, 
  MoreVertical, 
  ClipboardList, 
  Calendar, 
  Clock, 
  Play,
  PauseCircle,
  Copy,
  Trash2,
  Pencil
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, formatDistance } from 'date-fns';
import { CreateWorkflowModal } from './modals/CreateWorkflowModal';
import { toast } from "sonner";
import { WorkflowCard } from './components/WorkflowCard';
import { EmptyWorkflowState } from './components/EmptyWorkflowState';

// Mock data for workflows
const workflows = [
  {
    id: '1',
    name: 'Urgent Escalation',
    description: 'Automatically escalate urgent tickets to the relevant team members',
    status: 'Draft',
    updatedAt: new Date('2023-10-05T08:30:00Z'),
  },
  {
    id: '2',
    name: 'Customer Churn Save',
    description: 'Engage with customers showing churn signals before they leave',
    status: 'Live',
    updatedAt: new Date('2023-10-07T14:45:00Z'),
  },
  {
    id: '3',
    name: 'New Customer Onboarding',
    description: 'Guide new customers through their first steps with our product',
    status: 'Live',
    updatedAt: new Date('2023-10-09T11:20:00Z'),
  },
];

const WorkflowsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleDeleteWorkflow = (id: string, name: string) => {
    // Here you would typically delete the workflow via API
    console.log(`Deleting workflow ${id}`);
    toast.success(`Workflow "${name}" deleted successfully`);
  };

  const handleDuplicateWorkflow = (id: string, name: string) => {
    // Here you would typically duplicate the workflow via API
    console.log(`Duplicating workflow ${id}`);
    toast.success(`Workflow "${name}" duplicated successfully`);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 max-w-6xl animate-fadeSlideIn">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Workflows
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Automate your support with triggers, conditions, and actions.
          </p>
        </div>
        <Button 
          onClick={handleOpenCreateModal} 
          size="lg"
          className="shrink-0 shadow-md hover:shadow-lg transition-all duration-300"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          New Workflow
        </Button>
      </header>

      <main>
        {workflows.length === 0 ? (
          <EmptyWorkflowState onCreateClick={handleOpenCreateModal} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflows.map((workflow) => (
              <WorkflowCard 
                key={workflow.id}
                workflow={workflow}
                onDelete={handleDeleteWorkflow}
                onDuplicate={handleDuplicateWorkflow}
              />
            ))}
          </div>
        )}
      </main>

      {/* Create Workflow Modal */}
      <CreateWorkflowModal 
        open={isCreateModalOpen} 
        onOpenChange={setIsCreateModalOpen} 
        onClose={handleCloseCreateModal} 
      />
    </div>
  );
};

export default WorkflowsPage;
