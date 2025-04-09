
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { NodeType } from '@/types/workflow-builder';
import { PlusCircle } from 'lucide-react';

interface NodeSelectorProps {
  nodeId: string;
  addNode: (type: NodeType, sourceNodeId: string, position?: any) => string;
  availableNodeTypes: { type: NodeType; label: string; description: string }[];
}

export const NodeSelector: React.FC<NodeSelectorProps> = ({
  nodeId,
  addNode,
  availableNodeTypes
}) => {
  const [open, setOpen] = useState(false);

  const handleSelectNode = (type: NodeType) => {
    addNode(type, nodeId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div 
          className="absolute z-50 -translate-x-1/2 translate-y-4"
          style={{
            // Position this selector below each node handle
            left: 'var(--node-selector-left, 50%)',
            top: 'var(--node-selector-top, 100%)'
          }}
        >
          <Button 
            variant="outline" 
            size="sm" 
            className="rounded-full h-8 w-8 p-0 opacity-70 hover:opacity-100"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only">Add step</span>
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0" align="center">
        <div className="p-2">
          <h3 className="text-sm font-medium py-1.5 px-2">Add next step</h3>
          <div className="mt-2 max-h-60 overflow-y-auto">
            {availableNodeTypes.map((nodeType) => (
              <button
                key={nodeType.type}
                className="w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-muted flex flex-col"
                onClick={() => handleSelectNode(nodeType.type)}
              >
                <span className="font-medium">{nodeType.label}</span>
                <span className="text-xs text-muted-foreground">{nodeType.description}</span>
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
