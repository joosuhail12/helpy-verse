
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { format, formatDistance } from 'date-fns';
import { 
  MoreVertical, 
  Play,
  PauseCircle,
  Copy,
  Trash2,
  Pencil,
  ChevronRight,
  File,
  Bot,
  MessageCircle,
  Calendar,
  BarChart3,
  Folders,
  Tag
} from 'lucide-react';
import type { Workflow, WorkflowTag } from '@/types/workflow';
import { WorkflowTagPicker } from './WorkflowTagPicker';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WorkflowTableCardProps {
  workflow: Workflow;
  onDelete: (id: string, name: string) => void;
  onDuplicate: (id: string, name: string) => void;
  onTagsChange?: (id: string, tags: WorkflowTag[]) => void;
  onMoveToFolder?: (id: string, folderId: string | null) => void;
  allTags: WorkflowTag[];
  isEven?: boolean;
  selectMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onStatusToggle?: (id: string, status: 'Live' | 'Draft') => void;
}

export const WorkflowTableCard: React.FC<WorkflowTableCardProps> = ({ 
  workflow, 
  onDelete, 
  onDuplicate,
  onTagsChange,
  onMoveToFolder,
  allTags,
  isEven = false,
  selectMode = false,
  isSelected = false,
  onSelect,
  onStatusToggle
}) => {
  const [expanded, setExpanded] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [duplicateName, setDuplicateName] = useState(`${workflow.name} (Copy)`);

  // Set up keyboard shortcut for toggle expanded
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only apply shortcuts when this card is focused or expanded
      if (!expanded) return;
      
      // Shift+E to expand/collapse
      if (event.shiftKey && event.key === 'E') {
        setExpanded(!expanded);
        event.preventDefault();
      }
      
      // Shift+T to toggle status
      if (event.shiftKey && event.key === 'T' && onStatusToggle) {
        onStatusToggle(workflow.id, workflow.status === 'Live' ? 'Draft' : 'Live');
        event.preventDefault();
      }
      
      // Shift+D to duplicate
      if (event.shiftKey && event.key === 'D') {
        setIsDuplicating(true);
        event.preventDefault();
      }
    };

    if (expanded) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [expanded, workflow.id, workflow.status, onStatusToggle]);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Live':
        return (
          <Badge variant="success" className="font-medium flex items-center gap-1.5 shadow-sm transition-all duration-300 hover:shadow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live
          </Badge>
        );
      case 'Draft':
        return (
          <Badge variant="secondary" className="font-medium flex items-center gap-1.5 bg-amber-100 text-amber-700 border border-amber-200 hover:bg-amber-100 shadow-sm transition-all duration-300 hover:shadow">
            <PauseCircle size={12} />
            Draft
          </Badge>
        );
      default:
        return <Badge variant="outline" className="font-medium shadow-sm transition-all duration-300 hover:shadow">{status}</Badge>;
    }
  };

  const getWorkflowIcon = () => {
    switch (workflow.type) {
      case 'message':
        return <MessageCircle size={18} className="text-blue-500" />;
      case 'automation':
        return <Play size={18} className="text-purple-500" />;
      case 'schedule':
        return <Calendar size={18} className="text-orange-500" />;
      case 'bot':
        return <Bot size={18} className="text-emerald-500" />;
      default:
        return <File size={18} className="text-gray-500" />;
    }
  };
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleStatusToggle = () => {
    if (onStatusToggle) {
      onStatusToggle(workflow.id, workflow.status === 'Live' ? 'Draft' : 'Live');
    }
  };

  const handleDuplicate = () => {
    if (duplicateName.trim()) {
      onDuplicate(workflow.id, duplicateName.trim());
      setIsDuplicating(false);
      setDuplicateName('');
      toast.success(`Workflow duplicated as "${duplicateName}"`);
    }
  };

  const hasMetrics = workflow.metrics?.totalRuns && workflow.metrics?.totalRuns > 0;

  return (
    <div className={cn(
      "border-b border-border/40 group transition-all duration-300", 
      isEven ? 'bg-muted/10' : 'bg-white',
      expanded ? 'bg-muted/30' : ''
    )}>
      {/* Card Main Row */}
      <div className="grid grid-cols-12 items-center p-4 relative">
        <div className="col-span-5 md:col-span-5 flex items-center gap-2.5">
          {selectMode ? (
            <Checkbox 
              checked={isSelected} 
              onCheckedChange={() => onSelect && onSelect(workflow.id)}
              className="ml-2"
            />
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleExpand} 
              className={`p-0 h-9 w-9 rounded-full hover:bg-primary/15 hover:text-primary transition-all duration-300 ${expanded ? 'bg-primary/15 text-primary' : ''}`}
            >
              <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
            </Button>
          )}
          
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-muted/70 rounded-md shadow-sm">
              {getWorkflowIcon()}
            </div>
            <span className="font-semibold text-base tracking-tight text-gray-800 group-hover:text-primary/90 transition-colors duration-300 line-clamp-1">{workflow.name}</span>
            
            {/* Tags */}
            {workflow.tags && workflow.tags.length > 0 && (
              <div className="hidden sm:flex gap-1.5 ml-1">
                {workflow.tags.slice(0, 2).map(tag => (
                  <div 
                    key={tag.id}
                    className="px-1.5 py-0.5 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: `${tag.color}20`,
                      color: tag.color
                    }}
                  >
                    {tag.name}
                  </div>
                ))}
                {workflow.tags.length > 2 && (
                  <div className="px-1.5 py-0.5 rounded-full text-xs bg-muted/70 font-medium">
                    +{workflow.tags.length - 2}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="col-span-3 md:col-span-3 flex items-center">
          {onStatusToggle ? (
            <div className="flex items-center gap-3">
              <Switch 
                checked={workflow.status === 'Live'}
                onCheckedChange={handleStatusToggle}
                aria-label="Toggle workflow status"
              />
              {renderStatusBadge(workflow.status)}
            </div>
          ) : (
            renderStatusBadge(workflow.status)
          )}
        </div>
        
        <div className="col-span-3 md:col-span-3 text-sm text-muted-foreground">
          <div className="flex flex-col">
            <span className="font-medium">{format(workflow.updatedAt, 'MMM d, yyyy')}</span>
            <span className="text-xs opacity-80">{formatDistance(workflow.updatedAt, new Date(), { addSuffix: true })}</span>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-1 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 p-0 opacity-80 hover:opacity-100 hover:bg-primary/10 hover:text-primary transition-all duration-200"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 shadow-md">
              <DropdownMenuItem className="cursor-pointer flex items-center hover:text-primary focus:text-primary transition-colors duration-200">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
                <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Shift+E</kbd>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer flex items-center hover:text-primary focus:text-primary transition-colors duration-200"
                onClick={() => setIsDuplicating(true)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
                <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Shift+D</kbd>
              </DropdownMenuItem>
              
              {hasMetrics && (
                <DropdownMenuItem 
                  className="cursor-pointer flex items-center hover:text-primary focus:text-primary transition-colors duration-200"
                  onClick={() => setShowAnalytics(true)}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </DropdownMenuItem>
              )}
              
              {onStatusToggle && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer flex items-center hover:text-primary focus:text-primary transition-colors duration-200"
                    onClick={handleStatusToggle}
                  >
                    {workflow.status === 'Draft' ? (
                      <>
                        <Play className="mr-2 h-4 w-4 text-green-600" />
                        Set as Live
                      </>
                    ) : (
                      <>
                        <PauseCircle className="mr-2 h-4 w-4 text-amber-600" />
                        Set as Draft
                      </>
                    )}
                    <kbd className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded">Shift+T</kbd>
                  </DropdownMenuItem>
                </>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive cursor-pointer flex items-center focus:text-destructive transition-colors duration-200"
                onClick={() => onDelete(workflow.id, workflow.name)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="p-7 pt-1 pl-16 pb-7 bg-muted/20 animate-accordion-down border-t border-border/30 shadow-inner transition-all duration-300">
          {workflow.description && (
            <p className="text-muted-foreground mb-5 max-w-3xl leading-relaxed">{workflow.description}</p>
          )}
          
          <div className="flex flex-wrap gap-3 mb-5">
            {/* Tags */}
            {onTagsChange && (
              <WorkflowTagPicker 
                tags={allTags}
                selectedTags={workflow.tags || []}
                onTagsChange={(tags) => onTagsChange(workflow.id, tags)}
                variant="compact"
              />
            )}
            
            {/* Run stats */}
            {hasMetrics && (
              <Button 
                size="sm" 
                variant="outline" 
                className="shadow-sm hover:shadow hover:bg-primary/5 transition-all duration-300"
                onClick={() => setShowAnalytics(true)}
              >
                <BarChart3 className="mr-2 h-3.5 w-3.5" />
                Analytics
              </Button>
            )}
          </div>
          
          <div className="flex gap-3 mt-3">
            <Button size="sm" variant="outline" className="shadow-sm hover:shadow hover:bg-primary/5 transition-all duration-300">
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit
            </Button>
            <Button size="sm" variant="outline" className="shadow-sm hover:shadow hover:bg-primary/5 transition-all duration-300">
              <Play className="mr-2 h-3.5 w-3.5" />
              Run Now
            </Button>
          </div>
          
          <div className="mt-3 text-xs text-muted-foreground">
            <p>
              <kbd className="bg-muted px-1.5 py-0.5 rounded mr-1">Shift+E</kbd> to expand/collapse
              <kbd className="bg-muted px-1.5 py-0.5 rounded mx-1">Shift+T</kbd> to toggle status
              <kbd className="bg-muted px-1.5 py-0.5 rounded mx-1">Shift+D</kbd> to duplicate
            </p>
          </div>
        </div>
      )}
      
      {/* Duplicate Dialog */}
      <Dialog open={isDuplicating} onOpenChange={setIsDuplicating}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Duplicate Workflow</h2>
            <p className="text-sm text-muted-foreground">
              Create a copy of this workflow with a new name.
            </p>
            <div className="space-y-2">
              <label htmlFor="duplicate-name" className="text-sm font-medium">
                Name for the duplicate
              </label>
              <input
                id="duplicate-name"
                type="text"
                value={duplicateName}
                onChange={(e) => setDuplicateName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 pt-3">
              <Button variant="outline" onClick={() => setIsDuplicating(false)}>
                Cancel
              </Button>
              <Button onClick={handleDuplicate} disabled={!duplicateName.trim()}>
                Duplicate
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
