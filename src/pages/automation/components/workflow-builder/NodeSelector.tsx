
import React, { useState, useCallback, useMemo } from 'react';
import { useReactFlow, Position } from '@xyflow/react';
import { Plus } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NodeType, NodeCategory } from '@/types/workflow-builder';
import { cn } from '@/lib/utils';

interface NodeSelectorProps {
  nodeId: string;
  addNode: (type: NodeType, sourceNodeId: string) => string;
  availableNodeTypes: { type: NodeType; label: string; description: string }[];
  position?: 'bottom' | 'inline';
  offsetX?: number;
  offsetY?: number;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const NodeSelector: React.FC<NodeSelectorProps> = ({ 
  nodeId, 
  addNode, 
  availableNodeTypes,
  position = 'bottom',
  offsetX = 0,
  offsetY = 0,
  isOpen,
  onOpenChange
}) => {
  const [open, setOpen] = useState(isOpen || false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<NodeCategory>('all');
  
  const reactFlowInstance = useReactFlow();
  
  const sourceNode = useMemo(() => {
    const nodes = reactFlowInstance.getNodes();
    return nodes.find((n) => n.id === nodeId);
  }, [nodeId, reactFlowInstance]);
  
  // This function merges internal and external state
  const handleOpenChange = (newOpenState: boolean) => {
    console.log(`NodeSelector open state changing to: ${newOpenState}`);
    setOpen(newOpenState);
    if (onOpenChange) onOpenChange(newOpenState);
  };
  
  // Create a memoized map of node types by category
  const nodesByCategory = useMemo(() => {
    const categorizedNodes = {
      'all': availableNodeTypes,
      'messaging': availableNodeTypes.filter(node => 
        ['message', 'data_collection', 'chatbot_answer', 'collect_reply', 'show_reply_time', 'ask_csat'].includes(node.type)),
      'conditions': availableNodeTypes.filter(node => 
        ['condition'].includes(node.type)),
      'tickets': availableNodeTypes.filter(node => 
        ['assign_ticket', 'tag_ticket', 'update_ticket', 'add_note'].includes(node.type)),
      'time': availableNodeTypes.filter(node => 
        ['wait'].includes(node.type)),
      'data': availableNodeTypes.filter(node => 
        ['reusable_workflow', 'copilot_action'].includes(node.type)),
    } as Record<NodeCategory, { type: NodeType; label: string; description: string }[]>;
    
    return categorizedNodes;
  }, [availableNodeTypes]);

  // Apply search filter consistently
  const filteredNodes = useMemo(() => {
    if (!searchQuery) {
      return nodesByCategory[activeCategory] || [];
    }
    
    const query = searchQuery.toLowerCase().trim();
    const nodesToSearch = activeCategory === 'all' 
      ? availableNodeTypes 
      : nodesByCategory[activeCategory] || [];
      
    return nodesToSearch.filter(node => 
      node.label.toLowerCase().includes(query) || 
      node.description.toLowerCase().includes(query)
    );
  }, [searchQuery, activeCategory, nodesByCategory, availableNodeTypes]);
  
  // Using explicit type for the handleNodeSelect parameter
  const handleNodeSelect = useCallback((type: NodeType) => {
    if (sourceNode) {
      console.log(`Selected node type: ${type} for source node: ${sourceNode.id}`);
      addNode(type, sourceNode.id);
      handleOpenChange(false);
    }
  }, [sourceNode, addNode]);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);
  
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category as NodeCategory);
  }, []);
  
  // Only render if we have a source node
  if (!sourceNode) return null;

  // Use controlled popover component
  return (
    <div className="node-selector">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverContent 
          className="w-80 p-0 z-50" 
          align="start"
          sideOffset={5}
        >
          <div className="p-4 border-b">
            <h3 className="font-medium mb-1">Add next node</h3>
            <Input 
              placeholder="Search node types..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="mt-2"
            />
          </div>
          
          <Tabs 
            defaultValue="all" 
            value={activeCategory}
            onValueChange={handleCategoryChange}
            className="w-full"
          >
            <div className="px-4 pt-2">
              <TabsList className="w-full grid grid-cols-6 h-auto gap-1 bg-transparent">
                <TabsTrigger value="all" className="text-xs py-1 h-auto">All</TabsTrigger>
                <TabsTrigger value="messaging" className="text-xs py-1 h-auto">Messages</TabsTrigger>
                <TabsTrigger value="conditions" className="text-xs py-1 h-auto">Logic</TabsTrigger>
                <TabsTrigger value="tickets" className="text-xs py-1 h-auto">Tickets</TabsTrigger>
                <TabsTrigger value="time" className="text-xs py-1 h-auto">Time</TabsTrigger>
                <TabsTrigger value="data" className="text-xs py-1 h-auto">Data</TabsTrigger>
              </TabsList>
            </div>
            
            <ScrollArea className="h-[300px] py-2">
              <div className="p-2">
                {filteredNodes.length === 0 ? (
                  <div className="text-center py-4 text-sm text-muted-foreground">
                    No node types found for "{searchQuery}"
                  </div>
                ) : (
                  filteredNodes.map((node) => (
                    <button
                      key={node.type}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors mb-1",
                        "focus:outline-none focus:ring-2 focus:ring-muted-foreground"
                      )}
                      onClick={() => handleNodeSelect(node.type)}
                    >
                      <div className="font-medium text-sm">{node.label}</div>
                      <div className="text-xs text-muted-foreground">{node.description}</div>
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </Tabs>
        </PopoverContent>
      </Popover>
    </div>
  );
};
