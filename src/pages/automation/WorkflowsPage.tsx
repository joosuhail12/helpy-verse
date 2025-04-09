
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CreateWorkflowModal from './modals/CreateWorkflowModal';
import WorkflowCard from './components/WorkflowCard';
import EmptyWorkflowState from './components/EmptyWorkflowState';
import WorkflowTableCard from './components/WorkflowTableCard';
import WorkflowFolders from './components/WorkflowFolders';

/**
 * Workflows page component that displays workflow management interface
 */
const WorkflowsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>("grid");
  const [workflows] = useState<any[]>([]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">
            Manage and automate your business processes
          </p>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon size={16} />
          Create Workflow
        </Button>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Workflows</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === "grid" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setActiveView("grid")}
            >
              Grid
            </Button>
            <Button
              variant={activeView === "table" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setActiveView("table")}
            >
              Table
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-6">
          {workflows.length > 0 ? (
            <div>
              <WorkflowFolders />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {activeView === "grid" ? (
                  workflows.map((workflow) => (
                    <WorkflowCard key={workflow.id} workflow={workflow} />
                  ))
                ) : (
                  <WorkflowTableCard workflows={workflows} />
                )}
              </div>
            </div>
          ) : (
            <EmptyWorkflowState onCreateClick={() => setIsCreateModalOpen(true)} />
          )}
        </TabsContent>
        
        <TabsContent value="active">
          <EmptyWorkflowState
            title="No active workflows"
            description="You don't have any active workflows yet."
            onCreateClick={() => setIsCreateModalOpen(true)}
          />
        </TabsContent>
        
        <TabsContent value="draft">
          <EmptyWorkflowState
            title="No draft workflows"
            description="You don't have any draft workflows yet."
            onCreateClick={() => setIsCreateModalOpen(true)}
          />
        </TabsContent>
        
        <TabsContent value="archived">
          <EmptyWorkflowState
            title="No archived workflows"
            description="You don't have any archived workflows yet."
            onCreateClick={() => setIsCreateModalOpen(true)}
          />
        </TabsContent>
      </Tabs>
      
      <CreateWorkflowModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default WorkflowsPage;
