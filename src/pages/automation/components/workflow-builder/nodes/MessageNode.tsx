
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NodeProps, NodeConfig } from '@/types/workflow-builder';

const MessageNode = ({ data, isConnectable }: NodeProps) => {
  // Access data safely with default values
  const label = data?.label || 'Message';
  const configured = data?.configured || false;
  const config = data?.config as NodeConfig | undefined;
  
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
      
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mb-2">
        <MessageSquare className="h-6 w-6" />
      </div>
      
      <div className="font-medium text-sm text-center">{label}</div>
      
      {config?.message && (
        <div className="mt-2 text-xs text-muted-foreground line-clamp-2 text-center">
          {config.message.substring(0, 50)}
          {config.message.length > 50 ? '...' : ''}
        </div>
      )}
      
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

export default MessageNode;
