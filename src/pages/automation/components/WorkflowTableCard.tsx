import * as React from 'react';
import { useState } from 'react';
import { format } from 'date-fns';
import { MoreHorizontal, ChevronDown, ChevronUp, Folder, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Workflow, WorkflowStatus, WorkflowTag } from '@/types/workflow';
import { cn } from '@/lib/utils';
import { WorkflowTagPicker } from './WorkflowTagPicker';

interface WorkflowTableCardProps {
  workflow: Workflow;
  isEven: boolean;
  onDelete: (id: string, name: string) => void;
  onDuplicate: (id: string, newName: string) => void;
  onTagsChange: (workflowId: string, tags: WorkflowTag[]) => void;
  onMoveToFolder: (workflowId: string, folderId: string | null) => void;
  allTags: WorkflowTag[];
  isSelected?: boolean;
  selectMode?: boolean;
  onSelect?: (id: string) => void;
  onStatusToggle?: (id: string, status: WorkflowStatus) => void;
  onViewDetails?: () => void;
}

export const WorkflowTableCard: React.FC<WorkflowTableCardProps> = ({
  workflow,
  isEven,
  onDelete,
  onDuplicate,
  onTagsChange,
  onMoveToFolder,
  allTags,
  isSelected = false,
  selectMode = false,
  onSelect,
  onStatusToggle,
  onViewDetails
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [movingFolderId, setMovingFolderId] = useState<string | null>(null);

  const handleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const confirmDelete = () => {
    onDelete(workflow.id, workflow.name);
  };

  const handleDuplicate = () => {
    const newName = `${workflow.name} (Copy)`;
    onDuplicate(workflow.id, newName);
  };

  const handleTagChange = (tags: WorkflowTag[]) => {
    onTagsChange(workflow.id, tags);
    setShowTagPicker(false);
  };

  const handleMoveToFolderClick = () => {
    setIsMoving(true);
  };

  const handleMoveToFolder = (folderId: string | null) => {
    setMovingFolderId(folderId);
    onMoveToFolder(workflow.id, folderId);
    setIsMoving(false);
  };

  const handleStatusToggle = () => {
    const newStatus: WorkflowStatus = workflow.status === 'Live' ? 'Draft' : 'Live';
    onStatusToggle?.(workflow.id, newStatus);
  };

  const handleSelectCard = () => {
    onSelect?.(workflow.id);
  };

  return (
    <motion.div
      layout
      className={cn(
        "grid grid-cols-12 py-3 px-4 items-center gap-4 border-b transition-colors duration-200",
        isEven ? "bg-muted/50" : "bg-transparent",
        selectMode && isSelected ? "bg-primary/10" : "hover:bg-muted/20"
      )}
    >
      <div className="col-span-5 md:col-span-5 flex items-center gap-4">
        {selectMode && (
          <Checkbox
            checked={isSelected}
            onCheckedChange={handleSelectCard}
            aria-label={`Select workflow ${workflow.name}`}
          />
        )}
        <div className="flex flex-col">
          <div className="font-medium">{workflow.name}</div>
          <p className="text-sm text-muted-foreground line-clamp-1">{workflow.description}</p>
          {workflow.tags && workflow.tags.length > 0 && (
            <div className="flex items-center gap-1 mt-1">
              {workflow.tags.map(tag => (
                <Badge key={tag.id} className="text-[10px] py-0.5 px-2 rounded-md" style={{ backgroundColor: tag.color }}>
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="col-span-3 md:col-span-3">
        <Badge variant={workflow.status === 'Live' ? 'success' : 'secondary'}>
          {workflow.status}
        </Badge>
      </div>
      <div className="col-span-3 md:col-span-3 text-muted-foreground text-sm">
        {format(new Date(workflow.updatedAt), 'MMM dd, yyyy - HH:mm')}
      </div>
      <div className="col-span-1 md:col-span-1 text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreHorizontal className="h-4 w-4 opacity-70 hover:opacity-100 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" forceMount>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={onViewDetails}>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={handleDuplicate}>Duplicate</DropdownMenuItem>
            <DropdownMenuItem onClick={handleMoveToFolderClick}>Move to Folder</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowTagPicker(true)}>Edit Tags</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={confirmDelete}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {showTagPicker && (
        <Popover open={showTagPicker} onOpenChange={setShowTagPicker}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Tag className="h-4 w-4 mr-2" />
              Edit Tags
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <WorkflowTagPicker
              tags={allTags}
              selectedTags={workflow.tags || []}
              onChange={handleTagChange}
            />
          </PopoverContent>
        </Popover>
      )}
    </motion.div>
  );
};
