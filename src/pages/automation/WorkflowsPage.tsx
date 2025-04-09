
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
import { WorkflowMetricsCard } from './components/WorkflowAnalytics';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { WorkflowFolderSelector } from './components/WorkflowFolderSelector';
import { WorkflowTagsControl } from './components/WorkflowTagsControl';

const workflows: Workflow[] = [
  {
    id: '1',
    name: 'Urgent Escalation',
    description: 'Automatically escalate urgent tickets to the relevant team members when specific criteria are met. This workflow ensures critical issues are addressed promptly by the right people.',
    status: 'Draft',
    type: 'automation',
    updatedAt: new Date('2023-10-05T08:30:00Z'),
    createdAt: new Date('2023-09-15T10:00:00Z'),
    tags: [
      { id: 'tag1', name: 'Support', color: '#F87171' },
      { id: 'tag2', name: 'Urgent', color: '#FB923C' }
    ],
    metrics: {
      totalRuns: 23,
      successRate: 0.85,
      failedRuns: 3,
      successfulRuns: 20,
      averageDuration: 5800
    },
    runs: [
      {
        id: 'run1-1',
        workflowId: '1',
        status: 'success',
        startTime: new Date('2023-10-05T08:25:00Z'),
        endTime: new Date('2023-10-05T08:25:08Z'),
        duration: 8000
      },
      {
        id: 'run1-2',
        workflowId: '1',
        status: 'failed',
        startTime: new Date('2023-10-04T19:10:00Z'),
        endTime: new Date('2023-10-04T19:10:05Z'),
        duration: 5000,
        error: 'Failed to connect to API'
      }
    ],
  },
  {
    id: '2',
    name: 'Customer Churn Save',
    description: 'Engage with customers showing churn signals before they leave by sending personalized retention offers and scheduling follow-up calls with account managers.',
    status: 'Live',
    type: 'message',
    updatedAt: new Date('2023-10-07T14:45:00Z'),
    createdAt: new Date('2023-09-20T09:30:00Z'),
    tags: [
      { id: 'tag3', name: 'Retention', color: '#A3E635' },
      { id: 'tag4', name: 'Automated', color: '#22D3EE' }
    ],
    metrics: {
      totalRuns: 45,
      successRate: 0.92,
      failedRuns: 4,
      successfulRuns: 41,
      averageDuration: 3200
    }
  },
  {
    id: '3',
    name: 'New Customer Onboarding',
    description: 'Guide new customers through their first steps with our product through a series of timed welcome emails, tutorial recommendations, and check-in messages.',
    status: 'Live',
    type: 'schedule',
    updatedAt: new Date('2023-10-09T11:20:00Z'),
    createdAt: new Date('2023-09-25T14:15:00Z'),
    tags: [
      { id: 'tag5', name: 'Onboarding', color: '#60A5FA' },
      { id: 'tag3', name: 'Retention', color: '#A3E635' }
    ],
  },
  {
    id: '4',
    name: 'Support Bot Response',
    description: 'AI-powered bot that handles common support inquiries and provides instant responses to customers using our knowledge base.',
    status: 'Draft',
    type: 'bot',
    updatedAt: new Date('2023-10-11T09:15:00Z'),
    createdAt: new Date('2023-10-01T16:45:00Z'),
    metrics: {
      totalRuns: 128,
      successRate: 0.97,
      failedRuns: 4,
      successfulRuns: 124,
      averageDuration: 1500
    }
  },
];

const initialTags: WorkflowTag[] = [
  { id: 'tag1', name: 'Support', color: '#F87171' },
  { id: 'tag2', name: 'Urgent', color: '#FB923C' },
  { id: 'tag3', name: 'Retention', color: '#A3E635' },
  { id: 'tag4', name: 'Automated', color: '#22D3EE' },
  { id: 'tag5', name: 'Onboarding', color: '#60A5FA' },
];

const initialFolders: WorkflowFolder[] = [
  { 
    id: 'folder1', 
    name: 'Customer Communication', 
    description: 'Workflows for customer messaging and communication',
    workflowIds: ['2', '3'] 
  },
  { 
    id: 'folder2', 
    name: 'Support Automations', 
    description: 'Workflows for support team automation',
    workflowIds: ['1', '4'] 
  },
];

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
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
    workflows: workflows,
    tags: initialTags,
    folders: initialFolders,
    sortOrder: 'desc',
    searchTerm: '',
    typeFilters: [],
    statusFilter: 'All',
    tagFilters: [],
    selectedFolder: null,
    dateRange: {
      from: undefined,
      to: undefined
    },
    selectedWorkflows: [],
    selectMode: false,
    isRefreshing: false,
  });
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'n') {
        setIsCreateModalOpen(true);
        event.preventDefault();
      }
      
      if (event.ctrlKey && event.key === 'f') {
        const searchInput = document.getElementById('workflow-search');
        if (searchInput) {
          searchInput.focus();
        }
        event.preventDefault();
      }
      
      if (event.key === 'Escape' && state.selectMode) {
        setState(prev => ({
          ...prev,
          selectMode: false,
          selectedWorkflows: []
        }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [state.selectMode]);
  
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleDeleteWorkflow = (id: string, name: string) => {
    setState(prev => ({
      ...prev,
      workflows: prev.workflows.filter(w => w.id !== id),
      folders: prev.folders.map(folder => ({
        ...folder,
        workflowIds: folder.workflowIds.filter(wId => wId !== id)
      }))
    }));
    
    toast.success(`Workflow "${name}" deleted successfully`);
  };

  const handleDuplicateWorkflow = (id: string, newName: string) => {
    const workflowToDuplicate = state.workflows.find(w => w.id === id);
    
    if (!workflowToDuplicate) return;
    
    const newWorkflow: Workflow = {
      ...workflowToDuplicate,
      id: `workflow-${Date.now()}`,
      name: newName,
      updatedAt: new Date(),
      createdAt: new Date(),
      metrics: {
        totalRuns: 0,
        successRate: 0,
        failedRuns: 0,
        successfulRuns: 0,
      },
      runs: []
    };
    
    setState(prev => ({
      ...prev,
      workflows: [...prev.workflows, newWorkflow]
    }));
  };

  const toggleSortOrder = () => {
    setState(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc',
      isRefreshing: true
    }));
    
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isRefreshing: false
      }));
    }, 500);
  };
  
  const toggleTypeFilter = (type: WorkflowType) => {
    setState(prev => ({
      ...prev,
      typeFilters: prev.typeFilters.includes(type)
        ? prev.typeFilters.filter(t => t !== type)
        : [...prev.typeFilters, type]
    }));
  };
  
  const toggleTagFilter = (tagId: string) => {
    setState(prev => ({
      ...prev,
      tagFilters: prev.tagFilters.includes(tagId)
        ? prev.tagFilters.filter(t => t !== tagId)
        : [...prev.tagFilters, tagId]
    }));
  };
  
  const clearFilters = () => {
    setState(prev => ({
      ...prev,
      typeFilters: [],
      statusFilter: 'All',
      tagFilters: [],
      dateRange: { from: undefined, to: undefined },
      searchTerm: '',
      selectedFolder: null
    }));
  };
  
  const toggleWorkflowSelection = (id: string) => {
    setState(prev => ({
      ...prev,
      selectedWorkflows: prev.selectedWorkflows.includes(id)
        ? prev.selectedWorkflows.filter(wId => wId !== id)
        : [...prev.selectedWorkflows, id]
    }));
  };
  
  const selectAllWorkflows = () => {
    if (state.selectedWorkflows.length === filteredWorkflows.length) {
      setState(prev => ({
        ...prev,
        selectedWorkflows: []
      }));
    } else {
      setState(prev => ({
        ...prev,
        selectedWorkflows: filteredWorkflows.map(w => w.id)
      }));
    }
  };
  
  const changeWorkflowsStatus = (status: WorkflowStatus) => {
    if (state.selectedWorkflows.length === 0) return;
    
    setState(prev => ({
      ...prev,
      workflows: prev.workflows.map(workflow => 
        prev.selectedWorkflows.includes(workflow.id)
          ? { ...workflow, status }
          : workflow
      ),
      selectedWorkflows: [],
      selectMode: false
    }));
    
    toast.success(`${state.selectedWorkflows.length} workflows updated to "${status}" status`);
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
  
  const handleMoveToFolder = (workflowId: string, folderId: string | null) => {
    setState(prev => {
      const updatedFolders = prev.folders.map(folder => ({
        ...folder,
        workflowIds: folder.workflowIds.filter(id => id !== workflowId)
      }));
      
      if (folderId) {
        const folderIndex = updatedFolders.findIndex(f => f.id === folderId);
        if (folderIndex !== -1) {
          updatedFolders[folderIndex] = {
            ...updatedFolders[folderIndex],
            workflowIds: [...updatedFolders[folderIndex].workflowIds, workflowId]
          };
        }
      }
      
      return {
        ...prev,
        folders: updatedFolders
      };
    });
  };
  
  const handleCreateFolder = (folder: WorkflowFolder) => {
    setState(prev => ({
      ...prev,
      folders: [...prev.folders, folder],
      selectedFolder: folder.id
    }));
    
    toast.success(`Created folder "${folder.name}"`);
  };
  
  const handleUpdateFolder = (updatedFolder: WorkflowFolder) => {
    setState(prev => ({
      ...prev,
      folders: prev.folders.map(folder => 
        folder.id === updatedFolder.id ? updatedFolder : folder
      )
    }));
  };
  
  const handleDeleteFolder = (folderId: string) => {
    setState(prev => {
      const folder = prev.folders.find(f => f.id === folderId);
      
      if (folder) {
        toast.success(`Deleted folder "${folder.name}"`);
      }
      
      return {
        ...prev,
        folders: prev.folders.filter(folder => folder.id !== folderId),
        selectedFolder: prev.selectedFolder === folderId ? null : prev.selectedFolder
      };
    });
  };
  
  const handleWorkflowStatusToggle = (id: string, status: WorkflowStatus) => {
    setState(prev => ({
      ...prev,
      workflows: prev.workflows.map(workflow => 
        workflow.id === id
          ? { ...workflow, status }
          : workflow
      )
    }));
    
    const workflow = state.workflows.find(w => w.id === id);
    if (workflow) {
      toast.success(`Workflow "${workflow.name}" set to ${status}`);
    }
  };

  const handleCreateTag = (newTag: WorkflowTag) => {
    setState(prev => ({
      ...prev,
      tags: [...prev.tags, newTag]
    }));
  };
  
  const openAnalyticsModal = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsAnalyticsModalOpen(true);
  };

  const filteredWorkflows = state.workflows
    .filter(workflow => {
      const matchesSearch = 
        state.searchTerm === '' || 
        workflow.name.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
        (workflow.description?.toLowerCase().includes(state.searchTerm.toLowerCase()) || false);
      
      const matchesType = state.typeFilters.length === 0 || state.typeFilters.includes(workflow.type);
      
      const matchesStatus = state.statusFilter === 'All' || workflow.status === state.statusFilter;
      
      const matchesDateRange = 
        !state.dateRange.from || !state.dateRange.to ||
        (workflow.updatedAt >= state.dateRange.from && workflow.updatedAt <= state.dateRange.to);
      
      const matchesFolder = 
        !state.selectedFolder || 
        state.folders.find(f => f.id === state.selectedFolder)?.workflowIds.includes(workflow.id);
      
      const matchesTags = 
        state.tagFilters.length === 0 || 
        (workflow.tags && workflow.tags.some(tag => state.tagFilters.includes(tag.id)));
      
      return matchesSearch && matchesType && matchesStatus && matchesDateRange && matchesFolder && matchesTags;
    })
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return state.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
  const typeCount = state.workflows.reduce((acc, workflow) => {
    acc[workflow.type] = (acc[workflow.type] || 0) + 1;
    return acc;
  }, {} as Record<WorkflowType, number>);
  
  const analyticsSummary = {
    totalWorkflows: state.workflows.length,
    activeWorkflows: state.workflows.filter(w => w.status === 'Live').length,
    draftWorkflows: state.workflows.filter(w => w.status === 'Draft').length,
    totalRuns: state.workflows.reduce((total, workflow) => total + (workflow.metrics?.totalRuns || 0), 0),
    successRate: state.workflows.length > 0 
      ? state.workflows.reduce((total, workflow) => total + (workflow.metrics?.successRate || 0), 0) / state.workflows.length
      : 0
  };

  const hasActiveFilters = 
    state.typeFilters.length > 0 || 
    state.statusFilter !== 'All' || 
    state.dateRange.from || 
    state.searchTerm || 
    state.tagFilters.length > 0 ||
    state.selectedFolder !== null;

  const showAnalyticsSummary = analyticsSummary.totalRuns > 0;

  // Get selected tags for the tag filter
  const selectedTagFilters = state.tags.filter(tag => 
    state.tagFilters.includes(tag.id)
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
        {showAnalyticsSummary && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold">{analyticsSummary.totalWorkflows}</span>
                  <span className="text-sm text-muted-foreground">Total Workflows</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-green-600">{analyticsSummary.activeWorkflows}</span>
                  <span className="text-sm text-muted-foreground">Active Workflows</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold">{analyticsSummary.totalRuns}</span>
                  <span className="text-sm text-muted-foreground">Total Executions</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-1">
                  <span className="text-3xl font-bold text-blue-600">{(analyticsSummary.successRate * 100).toFixed(1)}%</span>
                  <span className="text-sm text-muted-foreground">Success Rate</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      
        {state.workflows.length === 0 ? (
          <EmptyWorkflowState onCreateClick={handleOpenCreateModal} />
        ) : (
          <div className="space-y-5">
            {/* Folders & Filtering */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                {/* Folder Selector */}
                <WorkflowFolderSelector
                  folders={state.folders}
                  onFolderCreate={handleCreateFolder}
                  onFolderUpdate={handleUpdateFolder}
                  onFolderDelete={handleDeleteFolder}
                  selectedFolderId={state.selectedFolder}
                  onFolderSelect={(folderId) => setState(prev => ({ ...prev, selectedFolder: folderId }))}
                  className="w-full sm:w-64"
                />
                
                {/* Search Bar */}
                <div className="relative flex-1 transition-all duration-300 hover:shadow-sm focus-within:shadow-sm rounded-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="workflow-search"
                    placeholder="Search workflows..."
                    value={state.searchTerm}
                    onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="pl-10 pr-4 py-2 border-border/60 focus:border-primary/60"
                  />
                  {state.searchTerm && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setState(prev => ({ ...prev, searchTerm: '' }))}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Filters Bar */}
              <div className="flex gap-2 flex-wrap justify-end">
                {/* Type Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(
                        "shadow-sm hover:shadow h-9 text-sm transition-all duration-200 flex items-center gap-1.5",
                        state.typeFilters.length > 0 ? 'bg-primary/10 border-primary/30' : ''
                      )}
                    >
                      <ListFilter className="h-3.5 w-3.5" />
                      <span>Type</span>
                      {state.typeFilters.length > 0 && (
                        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                          {state.typeFilters.length}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Filter by type</h4>
                      <div className="grid gap-2">
                        {(['message', 'automation', 'schedule', 'bot'] as const).map((type) => (
                          <div key={type} className="flex items-center gap-2">
                            <Checkbox 
                              id={`type-${type}`}
                              checked={state.typeFilters.includes(type)}
                              onCheckedChange={() => toggleTypeFilter(type)}
                            />
                            <label 
                              htmlFor={`type-${type}`}
                              className="text-sm flex items-center justify-between w-full cursor-pointer"
                            >
                              <span className="capitalize">{type}</span>
                              <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                                {typeCount[type] || 0}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* Status Filter */}
                <Select
                  value={state.statusFilter}
                  onValueChange={(value) => setState(prev => ({ ...prev, statusFilter: value as WorkflowStatus | 'All' }))}
                >
                  <SelectTrigger 
                    className={cn(
                      "w-[110px] shadow-sm hover:shadow h-9 text-sm transition-all duration-200",
                      state.statusFilter !== 'All' ? 'bg-primary/10 border-primary/30' : ''
                    )}
                  >
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Live">Live</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Tag Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "shadow-sm hover:shadow h-9 text-sm transition-all duration-200 flex items-center gap-1.5",
                        state.tagFilters.length > 0 ? 'bg-primary/10 border-primary/30' : ''
                      )}
                    >
                      <Tag className="h-3.5 w-3.5" />
                      <span>Tags</span>
                      {state.tagFilters.length > 0 && (
                        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                          {state.tagFilters.length}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Filter by tags</h4>
                      <div className="grid gap-1 max-h-48 overflow-y-auto">
                        {state.tags.map(tag => (
                          <div 
                            key={tag.id}
                            className="flex items-center justify-between p-1.5 hover:bg-muted/50 rounded-sm cursor-pointer"
                            onClick={() => toggleTagFilter(tag.id)}
                          >
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: tag.color }}
                              />
                              <span className="text-sm">{tag.name}</span>
                            </div>
                            <Checkbox 
                              checked={state.tagFilters.includes(tag.id)}
                              className="opacity-60 group-hover:opacity-100"
                            />
                          </div>
                        ))}
                        
                        {state.tags.length === 0 && (
                          <p className="text-sm text-center text-muted-foreground py-2">
                            No tags created yet
                          </p>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                {/* Date Range Picker */}
                <DateRangePicker 
                  date={state.dateRange}
                  onDateChange={(dateRange) => setState(prev => ({ ...prev, dateRange }))}
                  align="end"
                  className={cn(
                    "h-9",
                    state.dateRange.from ? 'bg-primary/10 border-primary/30' : ''
                  )}
                />
                
                {/* Sort Order */}
                <Button 
                  variant="outline" 
                  onClick={toggleSortOrder}
                  className="flex items-center gap-1.5 shadow-sm hover:shadow transition-all duration-200 h-9"
                  size="sm"
                >
                  <span>Last Updated</span>
                  {state.sortOrder === 'asc' ? (
                    <ArrowUp className={`h-3.5 w-3.5 ${state.isRefreshing ? 'animate-pulse' : ''}`} />
                  ) : (
                    <ArrowDown className={`h-3.5 w-3.5 ${state.isRefreshing ? 'animate-pulse' : ''}`} />
                  )}
                </Button>
                
                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="h-9"
                  >
                    <X className="h-3.5 w-3.5 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
            
            {/* Active Tag Filters */}
            {selectedTagFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Filtering by:</span>
                {selectedTagFilters.map(tag => (
                  <Badge 
                    key={tag.id}
                    variant="outline"
                    className="flex items-center gap-1 px-2 py-1 text-xs"
                    style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}
                  >
                    <div 
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: tag.color }} 
                    />
                    <span>{tag.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 rounded-full ml-1 opacity-70 hover:opacity-100"
                      onClick={() => toggleTagFilter(tag.id)}
                    >
                      <X className="h-2.5 w-2.5" />
                    </Button>
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setState(prev => ({ ...prev, tagFilters: [] }))}
                >
                  Clear all
                </Button>
              </div>
            )}

            {/* Selection Controls */}
            {state.selectMode && (
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="select-all"
                    checked={state.selectedWorkflows.length > 0 && state.selectedWorkflows.length === filteredWorkflows.length}
                    onCheckedChange={selectAllWorkflows}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    {state.selectedWorkflows.length === 0 ? 'Select All' : 
                      `Selected ${state.selectedWorkflows.length} ${state.selectedWorkflows.length === 1 ? 'workflow' : 'workflows'}`}
                  </label>
                </div>
                
                <div className="flex gap-2">
                  {state.selectedWorkflows.length > 0 && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => changeWorkflowsStatus('Live')}>
                          <BellDot className="h-4 w-4 mr-2" />
                          Set Live
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeWorkflowsStatus('Draft')}>
                          <FolderOpen className="h-4 w-4 mr-2" />
                          Set Draft
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setState(prev => ({ ...prev, selectMode: false, selectedWorkflows: [] }))}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            {/* Workflow List */}
            <div className="grid grid-cols-1 gap-4 mt-4">
              {filteredWorkflows.length === 0 ? (
                <div className="bg-muted/40 rounded-lg p-8 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No workflows found</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {hasActiveFilters 
                      ? "Try adjusting your search or filters to find what you're looking for."
                      : "Get started by creating your first workflow."
                    }
                  </p>
                  {hasActiveFilters && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={clearFilters}
                    >
                      Clear all filters
                    </Button>
                  )}
                </div>
              ) : (
                filteredWorkflows.map(workflow => (
                  <WorkflowTableCard
                    key={workflow.id}
                    workflow={workflow}
                    folders={state.folders}
                    tags={state.tags}
                    isSelected={state.selectedWorkflows.includes(workflow.id)}
                    selectMode={state.selectMode}
                    onSelect={toggleWorkflowSelection}
                    onStatusToggle={handleWorkflowStatusToggle}
                    onTagsChange={(tags) => handleTagsChange(workflow.id, tags)}
                    onCreateTag={handleCreateTag}
                    onDelete={() => handleDeleteWorkflow(workflow.id, workflow.name)}
                    onDuplicate={handleDuplicateWorkflow}
                    onAnalytics={() => openAnalyticsModal(workflow)}
                    onMoveToFolder={(folderId) => handleMoveToFolder(workflow.id, folderId)}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* Create Workflow Modal */}
      {isCreateModalOpen && (
        <CreateWorkflowModal
          open={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          folders={state.folders}
          tags={state.tags}
        />
      )}
      
      {/* Analytics Modal */}
      <Dialog open={isAnalyticsModalOpen} onOpenChange={(open) => !open && setIsAnalyticsModalOpen(false)}>
        <DialogContent className="sm:max-w-3xl">
          {selectedWorkflow && (
            <WorkflowMetricsCard workflow={selectedWorkflow} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkflowsPage;
