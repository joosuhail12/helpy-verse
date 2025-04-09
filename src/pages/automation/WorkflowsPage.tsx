import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  PlusCircle, 
  ArrowUp,
  ArrowDown,
  Search,
  Filter,
  RefreshCw,
  CheckSquare,
  Calendar,
  X,
  BarChart3,
  Folder,
  Tag,
  FolderOpen,
  BellDot,
  Trash,
  Copy,
  ListFilter
} from 'lucide-react';
import { CreateWorkflowModal } from './modals/CreateWorkflowModal';
import { toast } from "sonner";
import { WorkflowTableCard } from './components/WorkflowTableCard';
import { EmptyWorkflowState } from './components/EmptyWorkflowState';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Workflow, WorkflowType, WorkflowTag, WorkflowFolder, WorkflowStatus } from '@/types/workflow';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkflowMetricsCard } from './components/WorkflowAnalytics';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { WorkflowFolderSelector } from './components/WorkflowFolderSelector';
import { WorkflowTagsControl } from './components/WorkflowTagsControl';

// Now let's create the missing WorkflowMetricsCard component
import { format, subDays } from 'date-fns';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface WorkflowsPageState {
  workflows: Workflow[];
  tags: WorkflowTag[];
  folders: WorkflowFolder[];
  sortOrder: 'asc' | 'desc';
  searchTerm: string;
  typeFilters: WorkflowType[];
  statusFilter: 'Live' | 'Draft' | 'All';
  tagFilters: string[];
  selectedFolder: string | null;
  dateRange: DateRange;
  selectedWorkflows: string[];
  selectMode: boolean;
  isRefreshing: boolean;
}

const WorkflowsPage: React.FC = () => {
  const [state, setState] = useState<WorkflowsPageState>({
    workflows: [],
    tags: [],
    folders: [],
    sortOrder: 'asc',
    searchTerm: '',
    typeFilters: [],
    statusFilter: 'All',
    tagFilters: [],
    selectedFolder: null,
    dateRange: {},
    selectedWorkflows: [],
    selectMode: false,
    isRefreshing: false,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [analyticsWorkflow, setAnalyticsWorkflow] = useState<Workflow | null>(null);

  useEffect(() => {
    // Simulate fetching workflows, tags, and folders from an API
    const fetchWorkflows = async () => {
      // Mock data for workflows
      const mockWorkflows: Workflow[] = [
        {
          id: '1',
          name: 'Welcome New Customer',
          description: 'Sends a welcome message to new customers.',
          status: 'Live',
          type: 'message',
          updatedAt: subDays(new Date(), 2),
          createdAt: subDays(new Date(), 10),
          tags: [{ id: 'tag-1', name: 'onboarding', color: '#A3E635' }],
          metrics: {
            totalRuns: 50,
            successRate: 0.95,
            failedRuns: 2,
            successfulRuns: 48,
            averageDuration: 1500,
          },
          runs: [
            { id: 'run-1', workflowId: '1', status: 'success', startTime: subDays(new Date(), 1), endTime: new Date(), duration: 1500 },
            { id: 'run-2', workflowId: '1', status: 'failed', startTime: subDays(new Date(), 2), endTime: new Date(), duration: 1200, error: 'Failed to send message' },
          ],
        },
        {
          id: '2',
          name: 'Daily Report Automation',
          description: 'Generates and sends a daily report.',
          status: 'Draft',
          type: 'schedule',
          updatedAt: subDays(new Date(), 1),
          createdAt: subDays(new Date(), 5),
          tags: [{ id: 'tag-2', name: 'reporting', color: '#60A5FA' }],
          metrics: {
            totalRuns: 30,
            successRate: 0.85,
            failedRuns: 4,
            successfulRuns: 26,
            averageDuration: 2000,
          },
          runs: [
            { id: 'run-3', workflowId: '2', status: 'success', startTime: subDays(new Date(), 1), endTime: new Date(), duration: 1800 },
            { id: 'run-4', workflowId: '2', status: 'failed', startTime: subDays(new Date(), 2), endTime: new Date(), duration: 2200, error: 'Data fetch error' },
          ],
        },
        {
          id: '3',
          name: 'Inactive Customer Follow-up',
          description: 'Follows up with customers who have been inactive for 30 days.',
          status: 'Live',
          type: 'automation',
          updatedAt: subDays(new Date(), 3),
          createdAt: subDays(new Date(), 12),
          tags: [{ id: 'tag-3', name: 'customer-retention', color: '#F472B6' }],
          metrics: {
            totalRuns: 60,
            successRate: 0.92,
            failedRuns: 5,
            successfulRuns: 55,
            averageDuration: 1800,
          },
          runs: [
            { id: 'run-5', workflowId: '3', status: 'success', startTime: subDays(new Date(), 1), endTime: new Date(), duration: 1600 },
            { id: 'run-6', workflowId: '3', status: 'failed', startTime: subDays(new Date(), 2), endTime: new Date(), duration: 2000, error: 'Customer not found' },
          ],
        },
      ];

      // Mock data for tags
      const mockTags: WorkflowTag[] = [
        { id: 'tag-1', name: 'onboarding', color: '#A3E635' },
        { id: 'tag-2', name: 'reporting', color: '#60A5FA' },
        { id: 'tag-3', name: 'customer-retention', color: '#F472B6' },
        { id: 'tag-4', name: 'urgent', color: '#F87171' },
      ];

      // Mock data for folders
      const mockFolders: WorkflowFolder[] = [
        { id: 'folder-1', name: 'Customer Engagement', workflowIds: ['1', '3'] },
        { id: 'folder-2', name: 'Reporting', workflowIds: ['2'] },
      ];

      setState(prev => ({
        ...prev,
        workflows: mockWorkflows,
        tags: mockTags,
        folders: mockFolders,
      }));
    };

    fetchWorkflows();
  }, []);

  const handleSort = () => {
    setState(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
      workflows: [...prev.workflows].sort((a, b) =>
        prev.sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      ),
    }));
  };

  const handleSearch = (term: string) => {
    setState(prev => ({
      ...prev,
      searchTerm: term,
    }));
  };

  const handleTypeFilter = (type: WorkflowType) => {
    setState(prev => ({
      ...prev,
      typeFilters: prev.typeFilters.includes(type)
        ? prev.typeFilters.filter(t => t !== type)
        : [...prev.typeFilters, type],
    }));
  };

  const handleStatusFilter = (status: 'Live' | 'Draft' | 'All') => {
    setState(prev => ({
      ...prev,
      statusFilter: status,
    }));
  };

  const handleTagFilter = (tagId: string) => {
    setState(prev => ({
      ...prev,
      tagFilters: prev.tagFilters.includes(tagId)
        ? prev.tagFilters.filter(t => t !== tagId)
        : [...prev.tagFilters, tagId],
    }));
  };

  const handleFolderSelect = (folderId: string | null) => {
    setState(prev => ({
      ...prev,
      selectedFolder: folderId,
    }));
  };

  const handleDateRangeChange = (dateRange: DateRange) => {
    setState(prev => ({
      ...prev,
      dateRange: dateRange,
    }));
  };

  const filteredWorkflows = state.workflows.filter(workflow => {
    const searchTermMatch = workflow.name.toLowerCase().includes(state.searchTerm.toLowerCase());
    const typeFilterMatch = state.typeFilters.length === 0 || state.typeFilters.includes(workflow.type);
    const statusFilterMatch = state.statusFilter === 'All' || workflow.status === state.statusFilter;
    const tagFilterMatch = state.tagFilters.length === 0 || (workflow.tags && workflow.tags.some(tag => state.tagFilters.includes(tag.id)));
    const folderFilterMatch = !state.selectedFolder || workflow.folderId === state.selectedFolder;

    return searchTermMatch && typeFilterMatch && statusFilterMatch && tagFilterMatch && folderFilterMatch;
  });

  const handleDeleteWorkflow = (id: string, name: string) => {
    setState(prev => ({
      ...prev,
      workflows: prev.workflows.filter(workflow => workflow.id !== id),
    }));
    toast.success('Workflow deleted successfully!', {
      description: `"${name}" has been removed from your workflows.`
    });
  };

  const handleDuplicateWorkflow = (id: string, newName: string) => {
    const originalWorkflow = state.workflows.find(workflow => workflow.id === id);
    if (originalWorkflow) {
      const newWorkflow: Workflow = {
        ...originalWorkflow,
        id: `duplicate-${Date.now()}`,
        name: newName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setState(prev => ({
        ...prev,
        workflows: [...prev.workflows, newWorkflow],
      }));
      toast.success('Workflow duplicated successfully!', {
        description: `"${originalWorkflow.name}" has been duplicated as "${newName}".`
      });
    }
  };

  const handleCreateWorkflow = (workflow: Workflow) => {
    setState(prev => ({
      ...prev,
      workflows: [...prev.workflows, workflow],
    }));
  };

  const handleMoveToFolder = (workflowId: string, folderId: string | null) => {
    setState(prev => ({
      ...prev,
      workflows: prev.workflows.map(workflow =>
        workflow.id === workflowId ? { ...workflow, folderId: folderId } : workflow
      ),
    }));
  };
  
  const handleTagsChange = (workflowId: string, tags: WorkflowTag[]) => {
    setState(prev => ({
      ...prev,
      workflows: prev.workflows.map(workflow => 
        workflow.id === workflowId
          ? { ...workflow, tags }
          : workflow
      )
    }));
  };

  const toggleWorkflowSelection = (id: string) => {
    setState(prev => ({
      ...prev,
      selectedWorkflows: prev.selectedWorkflows.includes(id)
        ? prev.selectedWorkflows.filter(workflowId => workflowId !== id)
        : [...prev.selectedWorkflows, id],
    }));
  };

  const toggleSelectMode = () => {
    setState(prev => ({
      ...prev,
      selectMode: !prev.selectMode,
      selectedWorkflows: [],
    }));
  };

  const handleWorkflowStatusToggle = (id: string, newStatus: 'Live' | 'Draft') => {
    setState(prev => ({
      ...prev,
      workflows: prev.workflows.map(workflow =>
        workflow.id === id ? { ...workflow, status: newStatus } : workflow
      ),
    }));
  };

  const handleCreateTag = (tag: WorkflowTag) => {
    setState(prev => ({
      ...prev,
      tags: [...prev.tags, tag],
    }));
  };

  const handleCreateFolder = (folder: WorkflowFolder) => {
    setState(prev => ({
      ...prev,
      folders: [...prev.folders, folder],
    }));
  };

  const handleUpdateFolder = (updatedFolder: WorkflowFolder) => {
    setState(prev => ({
      ...prev,
      folders: prev.folders.map(folder =>
        folder.id === updatedFolder.id ? updatedFolder : folder
      ),
    }));
  };

  const handleDeleteFolder = (folderId: string) => {
    setState(prev => ({
      ...prev,
      folders: prev.folders.filter(folder => folder.id !== folderId),
      workflows: prev.workflows.map(workflow =>
        workflow.folderId === folderId ? { ...workflow, folderId: null } : workflow
      ),
    }));
  };

  const openAnalyticsModal = (workflow: Workflow) => {
    setAnalyticsWorkflow(workflow);
  };

  const closeAnalyticsModal = () => {
    setAnalyticsWorkflow(null);
  };

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Workflows</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setState(prev => ({ ...prev, isRefreshing: true }))}>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            {state.isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="col-span-1">
          <Input
            type="search"
            placeholder="Search workflows..."
            value={state.searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="col-span-2 flex items-center space-x-4">
          {/* Type Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <ListFilter className="h-4 w-4" />
                Type <ArrowUp className="h-3 w-3" /> <ArrowDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-1">
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={state.typeFilters.includes('message')}
                    onCheckedChange={() => handleTypeFilter('message')}
                  />
                  <span>Message</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={state.typeFilters.includes('automation')}
                    onCheckedChange={() => handleTypeFilter('automation')}
                  />
                  <span>Automation</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={state.typeFilters.includes('schedule')}
                    onCheckedChange={() => handleTypeFilter('schedule')}
                  />
                  <span>Schedule</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox
                    checked={state.typeFilters.includes('bot')}
                    onCheckedChange={() => handleTypeFilter('bot')}
                  />
                  <span>Bot</span>
                </label>
              </div>
            </PopoverContent>
          </Popover>

          {/* Status Filter */}
          <Select value={state.statusFilter} onValueChange={value => handleStatusFilter(value as 'Live' | 'Draft' | 'All')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Live">Live</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          {/* Tag Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="space-y-1">
                {state.tags.map(tag => (
                  <label key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={state.tagFilters.includes(tag.id)}
                      onCheckedChange={() => handleTagFilter(tag.id)}
                    />
                    <span>{tag.name}</span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Calendar className="h-4 w-4" />
                Date Range
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <DateRangePicker onDateChange={handleDateRangeChange} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Bulk Actions */}
      {state.selectMode && (
        <Card className="mb-6">
          <CardContent className="flex items-center justify-between">
            <div>
              <Checkbox
                checked={state.selectedWorkflows.length === filteredWorkflows.length}
                onCheckedChange={() => {
                  if (state.selectedWorkflows.length === filteredWorkflows.length) {
                    setState(prev => ({ ...prev, selectedWorkflows: [] }));
                  } else {
                    setState(prev => ({ ...prev, selectedWorkflows: filteredWorkflows.map(workflow => workflow.id) }));
                  }
                }}
              />
              <span className="ml-2 text-sm text-muted-foreground">
                {state.selectedWorkflows.length} workflows selected
              </span>
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm">
                <Folder className="mr-2 h-4 w-4" />
                Move to Folder
              </Button>
              <Button variant="outline" size="sm">
                <Tag className="mr-2 h-4 w-4" />
                Add Tags
              </Button>
              <Button variant="destructive" size="sm">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleSelectMode}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 py-2 px-4 text-sm font-medium text-muted-foreground">
        <div className="col-span-5">
          Name <Button variant="ghost" size="icon" className="ml-2"><ArrowUp className="h-4 w-4" /></Button>
        </div>
        <div className="col-span-3">Status</div>
        <div className="col-span-3">Last Updated</div>
        <div className="col-span-1 text-right">
          <Button variant="outline" size="sm" onClick={toggleSelectMode}>
            {state.selectMode ? 'Exit Select Mode' : 'Select Workflows'}
          </Button>
        </div>
      </div>

      {/* Workflow List */}
      {filteredWorkflows.length > 0 ? (
        <div className="divide-y divide-border">
          {filteredWorkflows.map((workflow, index) => (
            <WorkflowTableCard
              key={workflow.id}
              workflow={workflow}
              onDelete={(id, name) => handleDeleteWorkflow(id, name)}
              onDuplicate={handleDuplicateWorkflow}
              onTagsChange={handleTagsChange}
              onMoveToFolder={(folderId) => handleMoveToFolder(workflow.id, folderId)}
              allTags={state.tags}
              tags={workflow.tags}
              folders={state.folders}
              isEven={index % 2 === 1}
              selectMode={state.selectMode}
              isSelected={state.selectedWorkflows.includes(workflow.id)}
              onSelect={toggleWorkflowSelection}
              onStatusToggle={handleWorkflowStatusToggle}
              onCreateTag={handleCreateTag}
              onAnalytics={openAnalyticsModal}
            />
          ))}
        </div>
      ) : (
        <EmptyWorkflowState onCreateClick={() => setIsCreateModalOpen(true)} />
      )}

      {/* Create Workflow Modal */}
      <CreateWorkflowModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        folders={state.folders}
        tags={state.tags}
      />

      {/* Analytics Modal */}
      <Dialog open={!!analyticsWorkflow} onOpenChange={() => closeAnalyticsModal()}>
        <DialogContent className="sm:max-w-[80%] lg:max-w-[70%] xl:max-w-[60%]">
          {analyticsWorkflow && (
            <WorkflowMetricsCard workflow={analyticsWorkflow} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowsPage;
