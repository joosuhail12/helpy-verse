
import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { GitBranch, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkflowNodeData } from '@/types/workflow-builder';

const ConditionNode: React.FC<NodeProps<WorkflowNodeData>> = ({ data, isConnectable }) => {
  const { label, configured } = data;
  
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
      
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 mb-2">
        <GitBranch className="h-6 w-6" />
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
      
      <div className="flex justify-between w-full mt-3">
        <div className="flex flex-col items-center">
          <div className="text-xs text-muted-foreground">Yes</div>
          <Handle
            type="source"
            position={Position.Bottom}
            id="yes"
            className="w-3 h-3 border-2 bg-background border-green-500"
            isConnectable={isConnectable}
            style={{ left: '30%' }}
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="text-xs text-muted-foreground">No</div>
          <Handle
            type="source"
            position={Position.Bottom}
            id="no"
            className="w-3 h-3 border-2 bg-background border-red-500"
            isConnectable={isConnectable}
            style={{ left: '70%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ConditionNode;
