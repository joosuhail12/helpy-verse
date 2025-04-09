
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
  X
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
import {
  DateRangePicker
} from "@/components/ui/date-range-picker";

// Enhanced mock data with workflow types
const workflows = [
  {
    id: '1',
    name: 'Urgent Escalation',
    description: 'Automatically escalate urgent tickets to the relevant team members when specific criteria are met. This workflow ensures critical issues are addressed promptly by the right people.',
    status: 'Draft',
    type: 'automation' as const,
    updatedAt: new Date('2023-10-05T08:30:00Z'),
  },
  {
    id: '2',
    name: 'Customer Churn Save',
    description: 'Engage with customers showing churn signals before they leave by sending personalized retention offers and scheduling follow-up calls with account managers.',
    status: 'Live',
    type: 'message' as const,
    updatedAt: new Date('2023-10-07T14:45:00Z'),
  },
  {
    id: '3',
    name: 'New Customer Onboarding',
    description: 'Guide new customers through their first steps with our product through a series of timed welcome emails, tutorial recommendations, and check-in messages.',
    status: 'Live',
    type: 'schedule' as const,
    updatedAt: new Date('2023-10-09T11:20:00Z'),
  },
  {
    id: '4',
    name: 'Support Bot Response',
    description: 'AI-powered bot that handles common support inquiries and provides instant responses to customers using our knowledge base.',
    status: 'Draft',
    type: 'bot' as const,
    updatedAt: new Date('2023-10-11T09:15:00Z'),
  },
];

// Define type for our filters state
type WorkflowType = 'message' | 'automation' | 'schedule' | 'bot';
type WorkflowStatus = 'Live' | 'Draft' | 'All';

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

const WorkflowsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // New state for filters
  const [typeFilters, setTypeFilters] = useState<WorkflowType[]>([]);
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus>('All');
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined
  });
  
  // State for selected workflows (for batch operations)
  const [selectedWorkflows, setSelectedWorkflows] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState(false);
  
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
  
  // Toggle type filter handler
  const toggleTypeFilter = (type: WorkflowType) => {
    setTypeFilters(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };
  
  // Clear all filters
  const clearFilters = () => {
    setTypeFilters([]);
    setStatusFilter('All');
    setDateRange({ from: undefined, to: undefined });
    setSearchTerm('');
  };
  
  // Toggle workflow selection
  const toggleWorkflowSelection = (id: string) => {
    setSelectedWorkflows(prev => 
      prev.includes(id) 
        ? prev.filter(wId => wId !== id) 
        : [...prev, id]
    );
  };
  
  // Select all workflows
  const selectAllWorkflows = () => {
    if (selectedWorkflows.length === filteredWorkflows.length) {
      setSelectedWorkflows([]);
    } else {
      setSelectedWorkflows(filteredWorkflows.map(w => w.id));
    }
  };
  
  // Batch status change
  const changeWorkflowsStatus = (status: 'Live' | 'Draft') => {
    if (selectedWorkflows.length === 0) return;
    
    // Here you would typically update workflows via API
    console.log(`Changing status to ${status} for workflows: ${selectedWorkflows.join(', ')}`);
    
    toast.success(`${selectedWorkflows.length} workflows updated to "${status}" status`);
    setSelectedWorkflows([]);
    setSelectMode(false);
  };

  // Filter workflows
  const filteredWorkflows = workflows
    .filter(workflow => {
      // Filter by search term
      const matchesSearch = 
        searchTerm === '' || 
        workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (workflow.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      
      // Filter by workflow type
      const matchesType = typeFilters.length === 0 || typeFilters.includes(workflow.type);
      
      // Filter by status
      const matchesStatus = statusFilter === 'All' || workflow.status === statusFilter;
      
      // Filter by date range
      const matchesDateRange = 
        !dateRange.from || !dateRange.to ||
        (workflow.updatedAt >= dateRange.from && workflow.updatedAt <= dateRange.to);
      
      return matchesSearch && matchesType && matchesStatus && matchesDateRange;
    })
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
  // Count workflows by type for filter badges
  const typeCount = workflows.reduce((acc, workflow) => {
    acc[workflow.type] = (acc[workflow.type] || 0) + 1;
    return acc;
  }, {} as Record<WorkflowType, number>);

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
              
              <div className="flex gap-2 flex-wrap">
                {/* Type filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`shadow-sm hover:shadow transition-all duration-200 flex items-center gap-1.5 ${typeFilters.length > 0 ? 'bg-primary/10 border-primary/30' : ''}`}
                    >
                      <Filter className="h-3.5 w-3.5" />
                      <span>Type</span>
                      {typeFilters.length > 0 && (
                        <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                          {typeFilters.length}
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
                              checked={typeFilters.includes(type)}
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
                
                {/* Status filter */}
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as WorkflowStatus)}
                >
                  <SelectTrigger 
                    className={`w-[110px] shadow-sm hover:shadow h-9 text-sm transition-all duration-200 ${statusFilter !== 'All' ? 'bg-primary/10 border-primary/30' : ''}`}
                  >
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Status</SelectItem>
                    <SelectItem value="Live">Live</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Date range filter */}
                <DateRangePicker 
                  date={dateRange}
                  onDateChange={setDateRange}
                  align="end"
                  className={`h-9 ${dateRange.from ? 'bg-primary/10 border-primary/30' : ''}`}
                />
                
                {/* Clear filters button - only show if filters are applied */}
                {(typeFilters.length > 0 || statusFilter !== 'All' || dateRange.from || searchTerm) && (
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
                
                {/* Sort button */}
                <Button 
                  variant="outline" 
                  onClick={toggleSortOrder}
                  className="flex items-center gap-1.5 shadow-sm hover:shadow transition-all duration-200 h-9"
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

            {/* Selection mode controls */}
            {selectMode && (
              <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg shadow-sm">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="select-all"
                    checked={selectedWorkflows.length > 0 && selectedWorkflows.length === filteredWorkflows.length}
                    onCheckedChange={selectAllWorkflows}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium">
                    {selectedWorkflows.length === 0 ? 'Select All' : 
                      `Selected ${selectedWorkflows.length} ${selectedWorkflows.length === 1 ? 'workflow' : 'workflows'}`}
                  </label>
                </div>
                
                <div className="flex gap-2">
                  {selectedWorkflows.length > 0 && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => changeWorkflowsStatus('Live')}
                      >
                        Set Live
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => changeWorkflowsStatus('Draft')}
                      >
                        Set Draft
                      </Button>
                    </>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      setSelectMode(false);
                      setSelectedWorkflows([]);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300">
              {/* Table Header - With Gradient Background */}
              <div className="grid grid-cols-12 bg-gradient-to-r from-muted/80 to-muted/40 text-sm font-medium text-muted-foreground p-4 border-b border-border/60">
                {!selectMode ? (
                  <div className="col-span-5 md:col-span-5 flex items-center gap-2.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 rounded-full"
                      onClick={() => setSelectMode(true)}
                    >
                      <CheckSquare className="h-4 w-4" />
                      <span className="sr-only">Select workflows</span>
                    </Button>
                    <span>Name</span>
                    {sortOrder === 'asc' ? (
                      <ArrowUp className="h-3 w-3 opacity-60" />
                    ) : (
                      <ArrowDown className="h-3 w-3 opacity-60" />
                    )}
                  </div>
                ) : (
                  <div className="col-span-5 md:col-span-5 flex items-center gap-2.5">
                    <Checkbox 
                      checked={selectedWorkflows.length > 0 && selectedWorkflows.length === filteredWorkflows.length}
                      onCheckedChange={selectAllWorkflows}
                      className="ml-2"
                    />
                    <span>Name</span>
                  </div>
                )}
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
                    isSelected={selectedWorkflows.includes(workflow.id)}
                    onSelect={toggleWorkflowSelection}
                    selectMode={selectMode}
                    onStatusToggle={(newStatus) => {
                      console.log(`Changing ${workflow.name} status to ${newStatus}`);
                      toast.success(`Workflow "${workflow.name}" set to ${newStatus}`);
                    }}
                  />
                ))}
              </div>
            </div>

            {filteredWorkflows.length === 0 && (
              <div className="text-center py-10 bg-muted/10 rounded-xl border border-border/40 shadow-sm">
                <p className="text-muted-foreground mb-2">No workflows found with the current filters</p>
                <Button
                  variant="link"
                  onClick={clearFilters}
                  className="mt-2"
                >
                  Clear all filters
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
