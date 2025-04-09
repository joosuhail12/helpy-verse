
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Square } from 'lucide-react';
import { WorkflowNodeData } from '@/types/workflow-builder';

const EndNode = ({ data, isConnectable }: NodeProps<WorkflowNodeData>) => {
  return (
    <div className="flex flex-col items-center p-3 rounded-xl border shadow-sm bg-background w-[180px] border-muted">
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
      
      <div className="font-medium text-sm text-center">{data.label || 'End Workflow'}</div>
      <div className="text-xs text-muted-foreground mt-1">Workflow execution stops here</div>
    </div>
  );
};

export default EndNode;
