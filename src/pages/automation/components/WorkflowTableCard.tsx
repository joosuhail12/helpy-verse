
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { format, formatDistance } from 'date-fns';
import { 
  MoreVertical, 
  Play,
  PauseCircle,
  Copy,
  Trash2,
  Pencil,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface WorkflowTableCardProps {
  workflow: {
    id: string;
    name: string;
    description?: string;
    status: string;
    updatedAt: Date;
  };
  onDelete: (id: string, name: string) => void;
  onDuplicate: (id: string, name: string) => void;
}

export const WorkflowTableCard: React.FC<WorkflowTableCardProps> = ({ 
  workflow, 
  onDelete, 
  onDuplicate 
}) => {
  const [expanded, setExpanded] = useState(false);

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Live':
        return (
          <Badge variant="success" className="font-medium flex items-center gap-1">
            <Play size={12} className="animate-pulse" />
            Live
          </Badge>
        );
      case 'Draft':
        return (
          <Badge variant="secondary" className="font-medium flex items-center gap-1">
            <PauseCircle size={12} />
            Draft
          </Badge>
        );
      default:
        return <Badge variant="outline" className="font-medium">{status}</Badge>;
    }
  };
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="hover:bg-muted/20 transition-colors duration-300">
      {/* Card Main Row */}
      <div className="grid grid-cols-12 items-center p-4">
        <div className="col-span-5 md:col-span-5 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleExpand} 
            className="p-0 h-8 w-8 rounded-full hover:bg-muted"
          >
            {expanded ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </Button>
          <span className="font-medium line-clamp-1">{workflow.name}</span>
        </div>
        <div className="col-span-3 md:col-span-3">
          {renderStatusBadge(workflow.status)}
        </div>
        <div className="col-span-3 md:col-span-3 text-sm text-muted-foreground">
          <div className="flex flex-col">
            <span>{format(workflow.updatedAt, 'MMM d, yyyy')}</span>
            <span className="text-xs">{formatDistance(workflow.updatedAt, new Date(), { addSuffix: true })}</span>
          </div>
        </div>
        <div className="col-span-1 md:col-span-1 text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 p-0"
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem className="cursor-pointer flex items-center">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer flex items-center"
                onClick={() => onDuplicate(workflow.id, workflow.name)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive cursor-pointer flex items-center"
                onClick={() => onDelete(workflow.id, workflow.name)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Expandable Details */}
      {expanded && (
        <div className="p-4 pt-0 pl-12 pb-6 bg-muted/10 animate-accordion-down">
          {workflow.description && (
            <p className="text-muted-foreground mb-4 max-w-3xl">{workflow.description}</p>
          )}
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline">
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Edit
            </Button>
            <Button size="sm" variant="outline">
              <Play className="mr-1.5 h-3.5 w-3.5" />
              Run Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
