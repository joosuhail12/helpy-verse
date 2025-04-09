
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
  ChevronRight,
  File,
  Bot,
  MessageCircle,
  Calendar
} from 'lucide-react';

interface WorkflowTableCardProps {
  workflow: {
    id: string;
    name: string;
    description?: string;
    status: string;
    updatedAt: Date;
    type?: 'message' | 'automation' | 'schedule' | 'bot'; // Added type for icons
  };
  onDelete: (id: string, name: string) => void;
  onDuplicate: (id: string, name: string) => void;
  isEven?: boolean;
}

export const WorkflowTableCard: React.FC<WorkflowTableCardProps> = ({ 
  workflow, 
  onDelete, 
  onDuplicate,
  isEven = false
}) => {
  const [expanded, setExpanded] = useState(false);

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

  return (
    <div className={`border-b border-border/40 group transition-all duration-300 ${isEven ? 'bg-muted/10' : 'bg-white'} ${expanded ? 'bg-muted/30' : ''}`}>
      {/* Card Main Row */}
      <div className="grid grid-cols-12 items-center p-4 relative">
        <div className="col-span-5 md:col-span-5 flex items-center gap-2.5">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleExpand} 
            className={`p-0 h-9 w-9 rounded-full hover:bg-primary/15 hover:text-primary transition-all duration-300 ${expanded ? 'bg-primary/15 text-primary' : ''}`}
          >
            <ChevronRight className={`h-5 w-5 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
          </Button>
          
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-muted/70 rounded-md shadow-sm">
              {getWorkflowIcon()}
            </div>
            <span className="font-semibold text-base tracking-tight text-gray-800 group-hover:text-primary/90 transition-colors duration-300 line-clamp-1">{workflow.name}</span>
          </div>
        </div>
        
        <div className="col-span-3 md:col-span-3">
          {renderStatusBadge(workflow.status)}
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
            <DropdownMenuContent align="end" className="w-48 shadow-md">
              <DropdownMenuItem className="cursor-pointer flex items-center hover:text-primary focus:text-primary transition-colors duration-200">
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer flex items-center hover:text-primary focus:text-primary transition-colors duration-200"
                onClick={() => onDuplicate(workflow.id, workflow.name)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
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
        </div>
      )}
    </div>
  );
};
