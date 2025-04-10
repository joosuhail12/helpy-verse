
import React from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { NodeConfig, NodeType, WorkflowNodeData, WorkflowTriggerConfig } from '@/types/workflow-builder';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { formatNodeConfig } from './utils/nodeUtils';

interface NodeHoverCardProps {
  nodeId: string;
  children: React.ReactNode;
  nodeData?: WorkflowNodeData;
}

export const NodeHoverCard: React.FC<NodeHoverCardProps> = ({ 
  nodeId, 
  children,
  nodeData
}) => {
  if (!nodeData) {
    return <>{children}</>;
  }

  const isConfigured = nodeData.configured;
  const config = nodeData.config as NodeConfig | WorkflowTriggerConfig | undefined;
  
  // Format the configuration details based on node type
  const configDetails = formatNodeConfig(nodeData);

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        <div>{children}</div>
      </HoverCardTrigger>
      <HoverCardContent 
        className="w-80 p-4 animate-fadeSlideIn" 
        side="right" 
        align="start"
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{nodeData.label}</h4>
            {isConfigured ? (
              <span className="flex items-center text-xs text-green-600">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                <span>Configured</span>
              </span>
            ) : (
              <span className="flex items-center text-xs text-amber-600">
                <AlertCircle className="w-3 h-3 mr-1" />
                <span>Not configured</span>
              </span>
            )}
          </div>
          
          <div className="text-xs">
            <div className="text-muted-foreground mb-1">Node ID: {nodeId}</div>
            
            {configDetails.length > 0 ? (
              <div className="border rounded-md p-2 bg-muted/30">
                {configDetails.map((detail, index) => (
                  <div key={index} className="flex justify-between py-0.5">
                    <span className="font-medium">{detail.label}:</span>
                    <span className="text-muted-foreground truncate max-w-[180px]">{detail.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground italic">No configuration details available</div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
