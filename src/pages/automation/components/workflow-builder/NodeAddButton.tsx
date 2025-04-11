
import React, { useState } from 'react';
import { useReactFlow } from '@xyflow/react';
import { NodeSelector } from './NodeSelector';
import { NodeType } from '@/types/workflow-builder';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);
  const node = reactFlowInstance.getNode(nodeId);
  
  if (!node) return null;

  // For condition nodes, we don't add a button since they have dedicated yes/no paths
  if (node.type === 'condition') return null;
  
  // For end nodes, we don't need to add more steps
  if (node.type === 'end') return null;
  
  const yPosition = (node.height || 0) + offsetY;
  
  // Debug output for this button
  console.log(`NodeAddButton for ${nodeId}:`, {
    height: node.height,
    offsetY,
    yPosition,
    type: node.type,
    openState: selectorOpen
  });
  
  const handleOpenSelector = () => {
    console.log(`Opening selector for node ${nodeId}`);
    setSelectorOpen(true);
  };
  
  const handleCloseSelector = () => {
    console.log(`Closing selector for node ${nodeId}`);
    setSelectorOpen(false);
  };

  return (
    <div className="node-add-button">
      <Button 
        size="sm" 
        variant="secondary" 
        className="rounded-full h-8 w-8 p-0 shadow-md"
        onClick={handleOpenSelector}
      >
        <Plus className="h-4 w-4" />
        <span className="sr-only">Add next node</span>
      </Button>
      
      {selectorOpen && (
        <NodeSelector
          nodeId={nodeId}
          addNode={(type, sourceId) => {
            const newNodeId = addNode(type, sourceId);
            handleCloseSelector();
            return newNodeId;
          }}
          availableNodeTypes={availableNodeTypes}
          position="inline"
          offsetX={0}
          offsetY={yPosition}
          isOpen={selectorOpen}
          onOpenChange={setSelectorOpen}
        />
      )}
    </div>
  );
};
