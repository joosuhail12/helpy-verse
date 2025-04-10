
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Square } from 'lucide-react';
import { NodeProps } from '@/types/workflow-builder';
import '../styles/workflow-builder.css';
import { cn } from '@/lib/utils';
import { NodeHoverCard } from '../NodeHoverCard';

const EndNode = ({ id, data, isConnectable }: NodeProps) => {
  // Access data safely, with default value as fallback
  const label = data?.label || 'End Workflow';

  return (
    <NodeHoverCard nodeId={id} nodeData={data}>
      <div className={cn(
        "flex flex-col items-center p-3 rounded-xl border shadow-sm bg-background w-[180px]",
        "node-end",
        "node-configured" // End nodes are always configured
      )}>
        <Handle
          type="target"
          position={Position.Top}
          id="a"
          className="w-3 h-3 border-2 bg-background border-muted-foreground"
          isConnectable={isConnectable}
        />
        
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 mb-2">
          <Square className="h-6 w-6" />
        </div>
        
        <div className="font-medium text-sm text-center">{label}</div>
        <div className="text-xs text-muted-foreground mt-1">Workflow execution stops here</div>
      </div>
    </NodeHoverCard>
  );
};

export default EndNode;
