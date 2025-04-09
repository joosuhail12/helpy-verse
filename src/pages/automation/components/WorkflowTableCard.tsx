import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Tag,
  FolderClosed,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Workflow, WorkflowStatus, WorkflowTag } from '@/types/workflow';
import { WorkflowTagPicker } from './WorkflowTagPicker';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface WorkflowTableCardProps {
  workflow: Workflow;
  isEven?: boolean;
  onDelete?: (id: string, name: string) => void;
  onDuplicate?: (id: string, name: string) => void;
  onTagsChange?: (workflowId: string, tags: WorkflowTag[]) => void;
  onMoveToFolder?: (workflowId: string, folderId: string | null) => void;
  allTags?: WorkflowTag[];
  isSelected?: boolean;
  selectMode?: boolean;
  onSelect?: (id: string) => void;
  onStatusToggle?: (id: string, status: WorkflowStatus) => void;
  onViewDetails?: () => void;
}

export const WorkflowTableCard: React.FC<WorkflowTableCardProps> = ({
  workflow,
  isEven = false,
  onDelete,
  onDuplicate,
  onTagsChange,
  onMoveToFolder,
  allTags = [],
  isSelected = false,
  selectMode = false,
  onSelect,
  onStatusToggle,
  onViewDetails
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [isTagPickerOpen, setIsTagPickerOpen] = useState(false);
  const [newName, setNewName] = useState(`${workflow.name} (Copy)`);
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete(workflow.id, workflow.name);
    }
    setIsDeleteDialogOpen(false);
  };
  
  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate(workflow.id, newName);
    }
    setIsDuplicateDialogOpen(false);
  };
  
  const handleStatusToggle = () => {
    if (onStatusToggle) {
      onStatusToggle(workflow.id, workflow.status === 'Live' ? 'Draft' : 'Live');
    }
  };
  
  const handleTagsChange = (tags: WorkflowTag[]) => {
    if (onTagsChange) {
      onTagsChange(workflow.id, tags);
    }
    setIsTagPickerOpen(false);
    
    toast.success(`Tags updated for "${workflow.name}"`);
  };
  
  return (
    <div className={cn(
      "grid grid-cols-12 py-4 px-4 group",
      isEven ? "bg-muted/10" : "bg-card"
    )}>
      {!selectMode ? (
        <div className="col-span-5 md:col-span-5 flex items-center gap-2.5 min-w-0">
          <div
            className={cn(
              "w-2 h-2 rounded-full flex-shrink-0",
              workflow.status === 'Live' ? "bg-green-500" : "bg-gray-300"
            )}
          />
          <div className="truncate">
            <div 
              className="font-medium truncate"
              onClick={onViewDetails}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onViewDetails && onViewDetails()}
              aria-label={`View details of ${workflow.name}`}
            >
              {workflow.name}
            </div>
            {workflow.description && (
              <div className="text-xs text-muted-foreground truncate mt-1">{workflow.description}</div>
            )}
            {workflow.tags && workflow.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {workflow.tags.map((tag) => (
                  <Badge 
                    key={tag.id} 
                    variant="outline" 
                    className="text-xs px-1.5 py-0"
                    style={{
                      borderColor: tag.color,
                      color: tag.color
                    }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="col-span-5 md:col-span-5 flex items-center gap-2.5 min-w-0">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={() => onSelect && onSelect(workflow.id)}
            className="ml-2"
          />
          <div className="truncate">
            <div className="font-medium truncate">
              {workflow.name}
            </div>
          </div>
        </div>
      )}
      
      <div className="col-span-3 md:col-span-3 flex items-center">
        <Switch 
          checked={workflow.status === 'Live'} 
          onCheckedChange={handleStatusToggle} 
          className="mr-2" 
          disabled={selectMode}
        />
        <span className={workflow.status === 'Live' ? "text-green-600" : "text-muted-foreground"}>
          {workflow.status}
        </span>
      </div>
      
      <div className="col-span-3 md:col-span-3 flex items-center text-muted-foreground">
        {formatDistanceToNow(new Date(workflow.updatedAt), { addSuffix: true })}
        {workflow.lastEditedBy && (
          <span className="ml-1 text-xs">
            by {workflow.lastEditedBy.name}
          </span>
        )}
      </div>
      
      <div className="col-span-1 md:col-span-1 flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0 opacity-70 group-hover:opacity-100"
              disabled={selectMode}
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            
            <DropdownMenuItem onClick={onViewDetails}>
              <ExternalLink className="mr-2 h-4 w-4" />
              View details
            </DropdownMenuItem>
            
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit workflow
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => setIsTagPickerOpen(true)}>
              <Tag className="mr-2 h-4 w-4" />
              Manage tags
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => setIsDuplicateDialogOpen(true)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="text-red-600 focus:bg-red-50 focus:text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Workflow</DialogTitle>
            <DialogDescription>
              This will permanently delete <span className="font-medium">"{workflow.name}"</span>. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-start">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Workflow
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Duplicate Dialog */}
      <Dialog open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Duplicate Workflow</DialogTitle>
            <DialogDescription>
              Create a copy of <span className="font-medium">"{workflow.name}"</span> with a new name.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-name">New workflow name</Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDuplicateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button"
              onClick={handleDuplicate}
              disabled={!newName.trim()}
            >
              Duplicate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Tag Picker Dialog */}
      <Dialog open={isTagPickerOpen} onOpenChange={setIsTagPickerOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Tags</DialogTitle>
            <DialogDescription>
              Add or remove tags for <span className="font-medium">"{workflow.name}"</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <WorkflowTagPicker 
              selectedTags={workflow.tags || []}
              allTags={allTags}
              onChange={handleTagsChange}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
