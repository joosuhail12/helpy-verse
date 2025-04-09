
import React from 'react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Workflow, WorkflowStatus, WorkflowTag } from '@/types/workflow';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Trash2, 
  MoreVertical, 
  Tag,
  Folder, 
  CheckCircle2,
  XCircle,
  BarChart3,
  ArrowUpRight
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { WorkflowTagPicker } from './WorkflowTagPicker';

interface WorkflowTableCardProps {
  workflow: Workflow;
  isEven?: boolean;
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
  const handleDelete = () => {
    onDelete(workflow.id, workflow.name);
  };
  
  const handleDuplicate = () => {
    const newName = `${workflow.name} (copy)`;
    onDuplicate(workflow.id, newName);
  };
  
  const handleTagsChange = (tags: WorkflowTag[]) => {
    onTagsChange(workflow.id, tags);
  };
  
  const handleStatusToggle = () => {
    if (onStatusToggle) {
      onStatusToggle(workflow.id, workflow.status === 'Live' ? 'Draft' : 'Live');
    }
  };
  
  // Extract trigger information from tags if present (for workflows created with our new format)
  const triggerTag = workflow.tags?.find(tag => tag.id.startsWith('trigger-'));
  
  return (
    <motion.div
      whileHover={{ scale: 1.005, translateX: 3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn(
        "grid grid-cols-12 py-4 px-4 border-b transition-all duration-100 group",
        isEven ? "bg-background" : "bg-background/50",
        selectMode && "hover:bg-primary/5 cursor-pointer",
        isSelected && "bg-primary/10 border-l-4 border-l-primary"
      )}
      onClick={() => selectMode && onSelect && onSelect(workflow.id)}
    >
      <div className="col-span-5 md:col-span-5">
        <div className="flex items-center space-x-3">
          {selectMode && (
            <div className={cn(
              "w-5 h-5 rounded-md border flex-shrink-0",
              isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
            )}>
              {isSelected && <CheckCircle2 className="h-5 w-5 text-white" />}
            </div>
          )}
          <div className="min-w-0">
            <div className="font-medium truncate">{workflow.name}</div>
            <div className="text-sm text-muted-foreground truncate max-w-md">
              {workflow.description || 'No description provided'}
            </div>
          </div>
        </div>
      </div>
      
      <div className="col-span-3 md:col-span-3">
        <div className="flex items-center space-x-2">
          <Badge 
            variant={workflow.status === 'Live' ? "success" : "outline"}
            className="flex items-center space-x-1 hover:cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleStatusToggle();
            }}
          >
            {workflow.status === 'Live' ? (
              <CheckCircle2 className="h-3 w-3 mr-1" />
            ) : (
              <XCircle className="h-3 w-3 mr-1" />
            )}
            {workflow.status}
          </Badge>
          
          {triggerTag && (
            <Badge variant="secondary" className="inline-flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              {triggerTag.name}
            </Badge>
          )}
        </div>
        
        <div className="mt-1.5 flex flex-wrap gap-1">
          {workflow.tags?.filter(tag => !tag.id.startsWith('trigger-')).map((tag) => (
            <div
              key={tag.id}
              className="px-2 py-0.5 rounded-full text-xs inline-flex items-center gap-1"
              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tag.color }}></span>
              {tag.name}
            </div>
          ))}
        </div>
      </div>
      
      <div className="col-span-3 md:col-span-3 flex flex-col justify-center">
        <div className="text-sm">
          {format(new Date(workflow.updatedAt), 'MMM dd, yyyy')}
        </div>
        <div className="text-xs text-muted-foreground">
          {format(new Date(workflow.updatedAt), 'h:mm a')}
        </div>
      </div>
      
      <div className="col-span-1 md:col-span-1 flex justify-end items-center">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-1">
          {workflow.metrics && workflow.metrics.totalRuns > 0 && (
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8"
              title="View Analytics"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            title="View Details"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.();
            }}
          >
            <ArrowUpRight className="h-4 w-4" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={handleStatusToggle}
              >
                {workflow.status === 'Draft' ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    <span>Set as Live</span>
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    <span>Set as Draft</span>
                  </>
                )}
              </DropdownMenuItem>
              
              <WorkflowTagPicker
                selectedTags={workflow.tags?.filter(tag => !tag.id.startsWith('trigger-')) || []}
                allTags={allTags}
                onChange={handleTagsChange}
              />
              
              <DropdownMenuItem 
                className="cursor-pointer"
                onClick={handleDuplicate}
              >
                <Copy className="mr-2 h-4 w-4" />
                <span>Duplicate</span>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="cursor-pointer text-destructive focus:text-destructive" 
                onClick={handleDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
};

