
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { 
  Workflow as WorkflowIcon,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NodeProps } from '@/types/workflow-builder';
import '../styles/workflow-builder.css';
import { NodeHoverCard } from '../NodeHoverCard';
import { NodeAddButton } from '../NodeAddButton';

// Add availableNodeTypes to the expected props
interface TriggerNodeProps extends NodeProps {
  addNode?: (type: any, sourceNodeId: string) => string;
  availableNodeTypes?: { type: any; label: string; description: string }[];
}

const TriggerNode = ({ id, data, isConnectable, addNode, availableNodeTypes }: TriggerNodeProps) => {
  // Access data safely with default values
  const label = data?.label || 'Trigger';
  const configured = data?.configured || false;
  
  return (
    <NodeHoverCard nodeId={id} nodeData={data}>
      <div className={cn(
        "flex flex-col items-center p-3 rounded-xl border shadow-sm bg-background w-[180px]",
        "node-trigger",
        configured ? "node-configured" : "node-unconfigured"
      )}>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-2">
          <WorkflowIcon className="h-6 w-6" />
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
        
        {addNode && availableNodeTypes && (
          <div className="absolute" style={{ bottom: -20, left: '50%', transform: 'translateX(-50%)' }}>
            <NodeAddButton 
              nodeId={id} 
              addNode={addNode} 
              availableNodeTypes={availableNodeTypes}
            />
          </div>
        )}
      </div>
    </NodeHoverCard>
  );
};

export default TriggerNode;
