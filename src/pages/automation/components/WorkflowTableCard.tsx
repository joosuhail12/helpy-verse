
import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  MoreHorizontal, 
  Trash2, 
  Copy, 
  Edit, 
  ExternalLink, 
  BellDot,
  FolderClosed,
  Tag as TagIcon
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Workflow, WorkflowFolder, WorkflowTag } from '@/types/workflow';
import { cn } from '@/lib/utils';
import { WorkflowTagsControl } from './WorkflowTagsControl';

interface WorkflowTableCardProps {
  workflow: Workflow;
  onDelete: (id: string, name: string) => void;
  onDuplicate: (id: string, newName: string) => void;
  onTagsChange: (workflowId: string, tags: WorkflowTag[]) => void;
  onMoveToFolder: (workflowId: string, folderId: string | null) => void;
  allTags: WorkflowTag[];
  isEven: boolean;
  selectMode?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onStatusToggle?: (id: string, status: 'Live' | 'Draft') => void;
}

export function WorkflowTableCard({
  workflow,
  onDelete,
  onDuplicate,
  onTagsChange,
  onMoveToFolder,
  allTags,
  isEven,
  selectMode = false,
  isSelected = false,
  onSelect,
  onStatusToggle
}: WorkflowTableCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [newName, setNewName] = useState(`${workflow.name} (Copy)`);
  
  const handleStatusToggle = () => {
    const newStatus = workflow.status === 'Live' ? 'Draft' : 'Live';
    onStatusToggle?.(workflow.id, newStatus);
  };
  
  const handleDelete = () => {
    onDelete(workflow.id, workflow.name);
    setIsDeleteDialogOpen(false);
  };
  
  const handleDuplicate = () => {
    if (newName.trim()) {
      onDuplicate(workflow.id, newName.trim());
      setIsDuplicateDialogOpen(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'e' && e.shiftKey) {
      setIsExpanded(!isExpanded);
      e.preventDefault();
    } else if (e.key === 't' && e.shiftKey && onStatusToggle) {
      handleStatusToggle();
      e.preventDefault();
    } else if (e.key === 'd' && e.shiftKey) {
      setIsDuplicateDialogOpen(true);
      e.preventDefault();
    }
  };
  
  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy • h:mm a');
  };
  
  const maxTags = 2;
  const displayTags = workflow.tags?.slice(0, maxTags) || [];
  const hiddenTagsCount = workflow.tags ? workflow.tags.length - maxTags : 0;

  return (
    <div 
      className={cn(
        "grid grid-cols-12 p-4 items-center",
        isEven ? 'bg-muted/20' : 'bg-background',
        isExpanded && 'border-l-4 border-l-primary',
        isSelected && 'bg-muted'
      )}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Name & Description */}
      <div className="col-span-5 md:col-span-5 overflow-hidden">
        <div className="flex items-center gap-3">
          {selectMode ? (
            <Checkbox 
              checked={isSelected} 
              onCheckedChange={() => onSelect?.(workflow.id)} 
              className="ml-2"
            />
          ) : (
            <span 
              className={`w-2 h-2 rounded-full ${workflow.status === 'Live' ? 'bg-green-500' : 'bg-amber-500'}`}
            />
          )}
          <div className="overflow-hidden">
            <h3 className="font-medium truncate pr-4">{workflow.name}</h3>
            
            {isExpanded && workflow.description && (
              <p className="text-muted-foreground text-sm mt-1">{workflow.description}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <Badge variant="outline" className="text-xs font-normal capitalize">
                {workflow.type}
              </Badge>
              
              {displayTags.map(tag => (
                <Badge 
                  key={tag.id}
                  variant="outline"
                  className="text-xs font-normal px-1"
                  style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}
                >
                  <div 
                    className="h-1.5 w-1.5 rounded-full mr-1"
                    style={{ backgroundColor: tag.color }} 
                  />
                  {tag.name}
                </Badge>
              ))}
              
              {hiddenTagsCount > 0 && (
                <Badge variant="outline" className="text-xs font-normal">
                  +{hiddenTagsCount} more
                </Badge>
              )}
              
              {isExpanded && (
                <div className="w-full mt-2">
                  <WorkflowTagsControl
                    tags={allTags}
                    selectedTags={workflow.tags || []}
                    onTagsChange={(tags) => onTagsChange(workflow.id, tags)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Toggle */}
      <div className="col-span-3 md:col-span-3">
        <div className="flex items-center gap-2">
          <Switch 
            checked={workflow.status === 'Live'}
            onCheckedChange={handleStatusToggle}
            className="data-[state=checked]:bg-green-600"
          />
          <span className={`text-sm ${workflow.status === 'Live' ? 'text-green-600' : ''}`}>
            {workflow.status}
          </span>
        </div>
      </div>
      
      {/* Last Updated */}
      <div className="col-span-3 md:col-span-3 overflow-hidden">
        <div className="text-sm text-muted-foreground truncate">
          {formatDate(new Date(workflow.updatedAt))}
        </div>
        
        {isExpanded && workflow.metrics && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span>Total runs:</span>
              <span className="font-medium">{workflow.metrics.totalRuns}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>Success rate:</span>
              <span className="font-medium">{(workflow.metrics.successRate * 100).toFixed(1)}%</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="col-span-1 md:col-span-1 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setIsExpanded(!isExpanded)}>
              <Edit className="mr-2 h-4 w-4" />
              {isExpanded ? 'Collapse' : 'Expand'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsDuplicateDialogOpen(true)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Editor
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleStatusToggle}>
              <BellDot className="mr-2 h-4 w-4" />
              {workflow.status === 'Live' ? 'Set to Draft' : 'Set to Live'}
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Workflow</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete <span className="font-medium">{workflow.name}</span>?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Duplicate Dialog */}
      <Dialog open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicate Workflow</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="new-name">New workflow name</Label>
            <Input
              id="new-name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="mt-2"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDuplicateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleDuplicate}
              disabled={!newName.trim()}
            >
              Duplicate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
