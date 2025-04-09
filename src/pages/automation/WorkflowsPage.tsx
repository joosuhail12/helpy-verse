
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

// Mock data for workflows
const workflows = [
  {
    id: '1',
    name: 'Urgent Escalation',
    status: 'Draft',
    updatedAt: new Date('2023-10-05T08:30:00Z'),
  },
  {
    id: '2',
    name: 'Customer Churn Save',
    status: 'Live',
    updatedAt: new Date('2023-10-07T14:45:00Z'),
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

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Live':
        return (
          <Badge variant="success" className="font-medium flex items-center gap-1">
            <Play size={12} className="animate-pulse" />
            Live
          </Badge>
        );
      case 'Draft':
        return (
          <Badge variant="secondary" className="font-medium flex items-center gap-1">
            <PauseCircle size={12} />
            Draft
          </Badge>
        );
      default:
        return <Badge variant="outline" className="font-medium">{status}</Badge>;
    }
  };

  const renderEmptyState = () => (
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
          <Button onClick={handleOpenCreateModal} size="lg" className="mx-auto animate-pulse">
            <PlusCircle className="mr-2 h-5 w-5" />
            Create your first workflow
          </Button>
        </CardContent>
      </Card>
    </div>
  );

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
          renderEmptyState()
        ) : (
          <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-[40%] font-semibold text-base">Name</TableHead>
                    <TableHead className="w-[20%] font-semibold text-base">Status</TableHead>
                    <TableHead className="w-[30%] font-semibold text-base">Last Edited</TableHead>
                    <TableHead className="w-[10%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflows.map((workflow) => (
                    <TableRow 
                      key={workflow.id} 
                      className="group hover:bg-muted/40 cursor-pointer transition-colors duration-200"
                    >
                      <TableCell className="font-medium text-base py-4">{workflow.name}</TableCell>
                      <TableCell className="py-4">{renderStatusBadge(workflow.status)}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-col">
                          <span className="text-sm flex items-center">
                            <Calendar className="mr-1.5 h-3.5 w-3.5 text-muted-foreground" />
                            {format(workflow.updatedAt, 'MMM d, yyyy')}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center mt-1">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDistance(workflow.updatedAt, new Date(), { addSuffix: true })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Open menu"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="cursor-pointer flex items-center">
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer flex items-center"
                              onClick={() => handleDuplicateWorkflow(workflow.id, workflow.name)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive cursor-pointer flex items-center"
                              onClick={() => handleDeleteWorkflow(workflow.id, workflow.name)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
