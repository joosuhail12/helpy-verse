
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
  Clock,
  X,
  BarChart3,
  FolderClosed,
  Tag
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import { CreateWorkflowModal } from './modals/CreateWorkflowModal';
import { toast } from "sonner";
import { WorkflowTableCard } from './components/WorkflowTableCard';
import { EmptyWorkflowState } from './components/EmptyWorkflowState';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Workflow, WorkflowType, WorkflowTag, WorkflowFolder, WorkflowStatus, WorkflowChange, WorkflowVersion, WorkflowDependency } from '@/types/workflow';
import { WorkflowFolders } from './components/WorkflowFolders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkflowMetricsCard } from './components/WorkflowAnalytics';
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
} from '@/components/ui/resizable';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { WorkflowTagPicker } from './components/WorkflowTagPicker';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import WorkflowDetailModal from './components/WorkflowDetailModal';

const currentUser = {
  id: 'user1',
  name: 'John Doe',
  avatar: 'https://api.dicebear.com/7.x/avatars/svg?seed=John'
};

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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
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
  
  const openAnalyticsModal = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsAnalyticsModalOpen(true);
  };

  const handleOpenDetailModal = (workflow: Workflow) => {
    setSelectedWorkflow(workflow);
    setIsDetailModalOpen(true);
  };

  const handleUpdateDependencies = (updatedWorkflow: Workflow) => {
    setState(prev => ({
      ...prev,
      workflows: prev.workflows.map(w => 
        w.id === updatedWorkflow.id ? updatedWorkflow : w
      )
    }));
    
    if (updatedWorkflow.dependencies) {
      const targetWorkflowIds = new Set(updatedWorkflow.dependencies.map(d => d.targetWorkflowId));
      
      setState(prev => ({
        ...prev,
        workflows: prev.workflows.map(w => {
          if (targetWorkflowIds.has(w.id)) {
            return {
              ...w,
              dependents: [
                ...(w.dependents || []).filter(d => d.sourceWorkflowId !== updatedWorkflow.id),
                ...updatedWorkflow.dependencies!
                  .filter(d => d.targetWorkflowId === w.id)
                  .map(d => ({
                    ...d,
                    sourceWorkflowId: updatedWorkflow.id,
                    targetWorkflowId: w.id
                  }))
              ]
            };
          }
          return w;
        })
      }));
    }
  };

  const handleRestoreVersion = (workflow: Workflow, versionId: string) => {
    const version = workflow.versions?.find(v => v.id === versionId);
    if (!version) return;
    
    const restorationChange: WorkflowChange = {
      field: 'version',
      oldValue: `${workflow.version || 1}`,
      newValue: `${version.version} (restored)`,
      type: 'update'
    };
    
    const newVersion: WorkflowVersion = {
      id: `v${Date.now()}`,
      workflowId: workflow.id,
      version: (workflow.version || 1) + 1,
      createdAt: new Date(),
      createdBy: currentUser,
      changes: [restorationChange]
    };
    
    setState(prev => ({
      ...prev,
      workflows: prev.workflows.map(w => 
        w.id === workflow.id 
          ? { 
              ...w, 
              version: (w.version || 1) + 1,
              lastEditedBy: currentUser,
              updatedAt: new Date(),
              versions: [...(w.versions || []), newVersion]
            } 
          : w
      )
    }));
    
    setIsDetailModalOpen(false);
    setSelectedWorkflow(null);
    
    toast.success(`Workflow restored to version ${version.version}`);
  };

  const handleWorkflowCreated = (workflow: Workflow) => {
    const initialVersion: WorkflowVersion = {
      id: `v${Date.now()}`,
      workflowId: workflow.id,
      version: 1,
      createdAt: workflow.createdAt,
      createdBy: currentUser,
      changes: [
        { field: 'name', newValue: workflow.name, type: 'add' },
        { field: 'status', newValue: workflow.status, type: 'add' },
        { field: 'type', newValue: workflow.type, type: 'add' },
        ...(workflow.description ? [{ field: 'description', newValue: workflow.description, type: 'add' }] : [])
      ]
    };
    
    const workflowWithVersion = {
      ...workflow,
      version: 1,
      lastEditedBy: currentUser,
      versions: [initialVersion]
    };
    
    setState(prev => ({
      ...prev,
      workflows: [...prev.workflows, workflowWithVersion]
    }));
    
    toast.success(`Workflow "${workflow.name}" created successfully`);
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

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-8rem)]">
      <ResizablePanel defaultSize={20} minSize={15} maxSize={25}>
        <div className="h-full p-4 border-r overflow-auto">
          <WorkflowFolders
            folders={state.folders}
            onFolderCreate={handleCreateFolder}
            onFolderUpdate={handleUpdateFolder}
            onFolderDelete={handleDeleteFolder}
            selectedFolderId={state.selectedFolder}
            onFolderSelect={(folderId) => setState(prev => ({ ...prev, selectedFolder: folderId }))}
            className="mb-6"
          />
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Filter by Tag</h3>
            <div className="space-y-1">
              {state.tags.map(tag => (
                <div
                  key={tag.id}
                  className={cn(
                    "flex items-center justify-between px-2 py-1.5 rounded-md cursor-pointer group",
                    state.tagFilters.includes(tag.id) ? "bg-muted" : "hover:bg-muted/50"
                  )}
                  onClick={() => toggleTagFilter(tag.id)}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="h-2.5 w-2.5 rounded-full" 
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
                <p className="text-sm text-center text-muted-foreground py-2">No tags created</p>
              )}
            </div>
          </div>
          
          <div className="border-t border-border/40 pt-4 mt-4">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Keyboard Shortcuts</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">New workflow</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+N</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Search</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl+F</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Expand workflow</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift+E</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Toggle status</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift+T</kbd>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Duplicate workflow</span>
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Shift+D</kbd>
              </div>
            </div>
          </div>
        </div>
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={80}>
        <div className="container mx-auto p-4 space-y-8">
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4">
                  <div className="relative w-full md:w-80 transition-all duration-300 hover:shadow-md focus-within:shadow-md rounded-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="workflow-search"
                      placeholder="Search workflows..."
                      value={state.searchTerm}
                      onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
                      className="pl-10 pr-4 py-2 border-border/60 focus:border-primary/60 transition-all duration-300"
                    />
                  </div>
                  
                  <div className="flex gap-2 flex-wrap">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className={`shadow-sm hover:shadow h-9 text-sm transition-all duration-200 flex items-center gap-1.5 ${state.typeFilters.length > 0 ? 'bg-primary/10 border-primary/30' : ''}`}
                        >
                          <Filter className="h-3.5 w-3.5" />
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
                    
                    <Select
                      value={state.statusFilter}
                      onValueChange={(value) => setState(prev => ({ ...prev, statusFilter: value as WorkflowStatus | 'All' }))}
                    >
                      <SelectTrigger 
                        className={`w-[110px] shadow-sm hover:shadow h-9 text-sm transition-all duration-200 ${state.statusFilter !== 'All' ? 'bg-primary/10 border-primary/30' : ''}`}
                      >
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Status</SelectItem>
                        <SelectItem value="Live">Live</SelectItem>
                        <SelectItem value="Draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <DateRangePicker 
                      date={state.dateRange}
                      onDateChange={(dateRange) => setState(prev => ({ ...prev, dateRange }))}
                      align="end"
                    />

                    {hasActiveFilters && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={clearFilters}
                        className="h-9"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear Filters
                      </Button>
                    )}
                  </div>
                </div>

                {filteredWorkflows.length === 0 ? (
                  <div className="text-center py-12 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No workflows match the current filters.</p>
                    <Button 
                      variant="link" 
                      onClick={clearFilters}
                      className="mt-2"
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-12 py-3 px-4 font-medium text-sm text-muted-foreground border-b mb-1">
                      <div className="col-span-5 md:col-span-5">Name</div>
                      <div className="col-span-3 md:col-span-3">Status</div>
                      <div className="col-span-3 md:col-span-3">Last Updated</div>
                      <div className="col-span-1 md:col-span-1 text-right">Actions</div>
                    </div>
                                        
                    {filteredWorkflows.map((workflow, index) => (
                      <WorkflowTableCard
                        key={workflow.id}
                        workflow={workflow}
                        isEven={index % 2 === 0}
                        onDelete={handleDeleteWorkflow}
                        onDuplicate={handleDuplicateWorkflow}
                        onTagsChange={handleTagsChange}
                        onMoveToFolder={handleMoveToFolder}
                        allTags={state.tags}
                        isSelected={state.selectedWorkflows.includes(workflow.id)}
                        selectMode={state.selectMode}
                        onSelect={toggleWorkflowSelection}
                        onStatusToggle={handleWorkflowStatusToggle}
                        onViewDetails={() => handleOpenDetailModal(workflow)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </ResizablePanel>
      
      {isCreateModalOpen && (
        <CreateWorkflowModal 
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          onWorkflowCreated={handleWorkflowCreated}
        />
      )}
      
      {isDetailModalOpen && selectedWorkflow && (
        <WorkflowDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedWorkflow(null);
          }}
          workflow={selectedWorkflow}
          onDependenciesUpdate={handleUpdateDependencies}
          onRestoreVersion={handleRestoreVersion}
          allWorkflows={state.workflows}
        />
      )}
    </ResizablePanelGroup>
  );
};

export default WorkflowsPage;

