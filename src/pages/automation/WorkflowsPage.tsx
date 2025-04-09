
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
import { PlusCircle, MoreVertical, ClipboardList, Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format, formatDistance } from 'date-fns';
import { CreateWorkflowModal } from './modals/CreateWorkflowModal';

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

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Live':
        return <Badge variant="success" className="font-medium">Live</Badge>;
      case 'Draft':
        return <Badge variant="secondary" className="font-medium">Draft</Badge>;
      default:
        return <Badge variant="outline" className="font-medium">{status}</Badge>;
    }
  };

  const renderEmptyState = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md text-center p-6 bg-white/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ClipboardList className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-xl mb-2">No workflows yet</CardTitle>
          <CardDescription className="mb-6">
            Create your first workflow to automate your support processes.
          </CardDescription>
          <Button onClick={handleOpenCreateModal} className="mx-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create a workflow
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Workflows</h1>
          <p className="text-muted-foreground mt-1">
            Automate your support with triggers, conditions, and actions.
          </p>
        </div>
        <Button onClick={handleOpenCreateModal} className="shrink-0">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Workflow
        </Button>
      </header>

      <main>
        {workflows.length === 0 ? (
          renderEmptyState()
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Name</TableHead>
                    <TableHead className="w-[20%]">Status</TableHead>
                    <TableHead className="w-[30%]">Last Edited</TableHead>
                    <TableHead className="w-[10%]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workflows.map((workflow) => (
                    <TableRow key={workflow.id} className="group hover:bg-muted/40">
                      <TableCell className="font-medium">{workflow.name}</TableCell>
                      <TableCell>{renderStatusBadge(workflow.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="text-sm flex items-center">
                            <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                            {format(workflow.updatedAt, 'MMM d, yyyy')}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {formatDistance(workflow.updatedAt, new Date(), { addSuffix: true })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100"
                              aria-label="Open menu"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
