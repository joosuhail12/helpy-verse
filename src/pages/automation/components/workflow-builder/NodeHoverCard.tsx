
import React, { ReactNode } from 'react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { formatNodeConfig } from './utils/nodeUtils';
import { WorkflowNodeData } from '@/types/workflow-builder';

interface NodeHoverCardProps {
  children: ReactNode;
  nodeId: string;
  nodeData?: WorkflowNodeData;
  disabled?: boolean;
}

export const NodeHoverCard: React.FC<NodeHoverCardProps> = ({
  children,
  nodeId,
  nodeData,
  disabled = false,
}) => {
  if (disabled || !nodeData) {
    return <>{children}</>;
  }

  const configDetails = formatNodeConfig(nodeData);
  const hasDetails = configDetails.length > 0;

  if (!hasDetails) {
    return <>{children}</>;
  }

  return (
    <HoverCard openDelay={300} closeDelay={200}>
      <HoverCardTrigger asChild>
        <div className="relative">
          {children}
        </div>
      </HoverCardTrigger>
      <HoverCardContent 
        side="right" 
        className="w-80 p-4"
        align="start"
      >
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Node Configuration</h4>
          <div className="space-y-1">
            {configDetails.map((detail, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{detail.label}</span>
                <span className="font-medium">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
