
import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { NodeSelector } from './NodeSelector';
import { NodeType } from '@/types/workflow-builder';

interface NodeAddButtonProps {
  nodeId: string;
  addNode: (type: NodeType, sourceNodeId: string) => string;
  availableNodeTypes: { type: NodeType; label: string; description: string }[];
  offsetY?: number;
}

export const NodeAddButton: React.FC<NodeAddButtonProps> = ({ 
  nodeId, 
  addNode, 
  availableNodeTypes,
  offsetY = 0
}) => {
  const reactFlowInstance = useReactFlow();
  const node = reactFlowInstance.getNode(nodeId);
  
  if (!node) return null;

  // For condition nodes, we don't add a button since they have dedicated yes/no paths
  if (node.type === 'condition') return null;
  
  // For end nodes, we don't need to add more steps
  if (node.type === 'end') return null;
  
  const yPosition = (node.height || 0) + offsetY;
  
  // Add console.log to debug node dimensions and positioning
  console.log(`NodeAddButton for ${nodeId}:`, {
    height: node.height,
    offsetY,
    yPosition,
    type: node.type
  });
  
  return (
    <NodeSelector
      nodeId={nodeId}
      addNode={addNode}
      availableNodeTypes={availableNodeTypes}
      position="inline"
      offsetX={0}
      offsetY={yPosition}
    />
  );
};
