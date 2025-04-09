
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { CreateWorkflowModal } from './modals/CreateWorkflowModal';
import { toast } from "sonner";
import { WorkflowTableCard } from './components/WorkflowTableCard';
import { EmptyWorkflowState } from './components/EmptyWorkflowState';
import { Input } from '@/components/ui/input';

// Enhanced mock data with workflow types
const workflows = [
  {
    id: '1',
    name: 'Urgent Escalation',
    description: 'Automatically escalate urgent tickets to the relevant team members when specific criteria are met. This workflow ensures critical issues are addressed promptly by the right people.',
    status: 'Draft',
    type: 'automation',
    updatedAt: new Date('2023-10-05T08:30:00Z'),
  },
  {
    id: '2',
    name: 'Customer Churn Save',
    description: 'Engage with customers showing churn signals before they leave by sending personalized retention offers and scheduling follow-up calls with account managers.',
    status: 'Live',
    type: 'message',
    updatedAt: new Date('2023-10-07T14:45:00Z'),
  },
  {
    id: '3',
    name: 'New Customer Onboarding',
    description: 'Guide new customers through their first steps with our product through a series of timed welcome emails, tutorial recommendations, and check-in messages.',
    status: 'Live',
    type: 'schedule',
    updatedAt: new Date('2023-10-09T11:20:00Z'),
  },
];

const WorkflowsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
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

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    // Add refresh animation when sort changes
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Filter and sort workflows
  const filteredWorkflows = workflows
    .filter(workflow => 
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

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
          className="shrink-0 shadow-md hover:shadow-lg transition-all duration-300 group"
        >
          <PlusCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          New Workflow
        </Button>
      </header>

      <main>
        {workflows.length === 0 ? (
          <EmptyWorkflowState onCreateClick={handleOpenCreateModal} />
        ) : (
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4">
              <div className="relative w-full md:w-80 transition-all duration-300 hover:shadow-md focus-within:shadow-md rounded-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workflows..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border-border/60 focus:border-primary/60 transition-all duration-300"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="shadow-sm hover:shadow transition-all duration-200 flex items-center gap-1.5"
                >
                  <Filter className="h-3.5 w-3.5" />
                  <span>Filter</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={toggleSortOrder}
                  className="flex items-center gap-1.5 shadow-sm hover:shadow transition-all duration-200"
                  size="sm"
                >
                  <span>Last Updated</span>
                  {sortOrder === 'asc' ? (
                    <ArrowUp className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-pulse' : ''}`} />
                  ) : (
                    <ArrowDown className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-pulse' : ''}`} />
                  )}
                </Button>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300">
              {/* Table Header - With Gradient Background */}
              <div className="grid grid-cols-12 bg-gradient-to-r from-muted/80 to-muted/40 text-sm font-medium text-muted-foreground p-4 border-b border-border/60">
                <div className="col-span-5 md:col-span-5 flex items-center gap-1.5">
                  <span>Name</span>
                  {sortOrder === 'asc' ? (
                    <ArrowUp className="h-3 w-3 opacity-60" />
                  ) : (
                    <ArrowDown className="h-3 w-3 opacity-60" />
                  )}
                </div>
                <div className="col-span-3 md:col-span-3">Status</div>
                <div className="col-span-3 md:col-span-3 flex items-center gap-1.5">
                  <span>Last Updated</span>
                  <RefreshCw className={`h-3 w-3 transition-all duration-300 ${isRefreshing ? 'rotate-180' : ''}`} />
                </div>
                <div className="col-span-1 md:col-span-1 text-right">Actions</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border/40">
                {filteredWorkflows.map((workflow, index) => (
                  <WorkflowTableCard 
                    key={workflow.id}
                    workflow={workflow}
                    onDelete={handleDeleteWorkflow}
                    onDuplicate={handleDuplicateWorkflow}
                    isEven={index % 2 === 0}
                  />
                ))}
              </div>
            </div>

            {filteredWorkflows.length === 0 && searchTerm && (
              <div className="text-center py-10 bg-muted/10 rounded-xl border border-border/40 shadow-sm">
                <p className="text-muted-foreground">No workflows found matching "{searchTerm}"</p>
                <Button
                  variant="link"
                  onClick={() => setSearchTerm('')}
                  className="mt-2"
                >
                  Clear search
                </Button>
              </div>
            )}
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
