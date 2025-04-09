
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Calendar, 
  Clock, 
  Play,
  PauseCircle,
  Copy,
  Trash2,
  Pencil
} from 'lucide-react';

interface WorkflowCardProps {
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

export const WorkflowCard: React.FC<WorkflowCardProps> = ({ 
  workflow, 
  onDelete, 
  onDuplicate 
}) => {
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

  return (
    <Card className="overflow-hidden border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 group">
      <CardHeader className="p-5 flex flex-row justify-between items-start bg-muted/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {renderStatusBadge(workflow.status)}
          </div>
          <CardTitle className="text-xl font-bold">{workflow.name}</CardTitle>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Open menu"
            >
              <MoreVertical className="h-4 w-4" />
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
      </CardHeader>
      <CardContent className="p-5">
        {workflow.description && (
          <p className="text-muted-foreground mb-4">{workflow.description}</p>
        )}
        <div className="flex flex-col text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 mb-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Last updated: {format(workflow.updatedAt, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>{formatDistance(workflow.updatedAt, new Date(), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
