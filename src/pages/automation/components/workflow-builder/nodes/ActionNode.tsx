
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { 
  Cog, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  Clock, 
  Tag,
  FileEdit,
  MessageSquareMore
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkflowNodeData } from '@/types/workflow-builder';

// Icon mapping for different action types
const actionIcons: Record<string, React.FC<{ className?: string }>> = {
  assign_ticket: User,
  wait: Clock,
  tag_ticket: Tag,
  update_ticket: FileEdit,
  add_note: MessageSquareMore,
  default: Cog
};

const ActionNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, isConnectable }) => {
  const { label, configured, actionType = 'default' } = data;
  
  // Get the appropriate icon for this action type
  const IconComponent = actionType && actionType in actionIcons 
    ? actionIcons[actionType]
    : actionIcons.default;
  
  // Determine background color based on action type
  let bgColorClass = "bg-gray-100";
  let textColorClass = "text-gray-600";
  
  switch (actionType) {
    case 'assign_ticket':
      bgColorClass = "bg-blue-100";
      textColorClass = "text-blue-600";
      break;
    case 'wait':
      bgColorClass = "bg-amber-100";
      textColorClass = "text-amber-600";
      break;
    case 'tag_ticket':
      bgColorClass = "bg-green-100";
      textColorClass = "text-green-600";
      break;
    case 'update_ticket':
      bgColorClass = "bg-purple-100";
      textColorClass = "text-purple-600";
      break;
    case 'add_note':
      bgColorClass = "bg-indigo-100";
      textColorClass = "text-indigo-600";
      break;
  }
  
  return (
    <div className={cn(
      "flex flex-col items-center p-3 rounded-xl border shadow-sm bg-background w-[180px]",
      configured ? "border-primary" : "border-muted"
    )}>
      <Handle
        type="target"
        position={Position.Top}
        id="a"
        className="w-3 h-3 border-2 bg-background border-muted-foreground"
        isConnectable={isConnectable}
      />
      
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full mb-2",
        bgColorClass,
        textColorClass
      )}>
        <IconComponent className="h-6 w-6" />
      </div>
      
      <div className="font-medium text-sm text-center">{label}</div>
      
      {configured ? (
        <div className="flex items-center mt-2 text-xs text-green-600">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          <span>Configured</span>
        </div>
      ) : (
        <div className="flex items-center mt-2 text-xs text-amber-600">
          <AlertCircle className="w-3 h-3 mr-1" />
          <span>Needs configuration</span>
        </div>
      )}
      
      <Handle
        type="source"
        position={Position.Bottom}
        id="b"
        className="w-3 h-3 border-2 bg-background border-muted-foreground"
        isConnectable={isConnectable}
      />
    </div>
  );
};

export default ActionNode;
