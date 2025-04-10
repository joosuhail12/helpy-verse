
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
}

export const NodeSelector: React.FC<NodeSelectorProps> = ({ 
  nodeId, 
  addNode, 
  availableNodeTypes,
  position = 'bottom',
  offsetX = 0,
  offsetY = 0
}) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<NodeCategory>('all');
  
  const reactFlowInstance = useReactFlow();
  
  const sourceNode = useMemo(() => {
    const nodes = reactFlowInstance.getNodes();
    return nodes.find((n) => n.id === nodeId);
  }, [nodeId, reactFlowInstance]);
  
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
    };
    
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
  
  const handleNodeSelect = useCallback((type: NodeType) => {
    if (sourceNode) {
      addNode(type, sourceNode.id);
      setOpen(false);
    }
  }, [sourceNode, addNode, setOpen]);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);
  
  const handleCategoryChange = useCallback((category: string) => {
    setActiveCategory(category as NodeCategory);
  }, []);
  
  // Only render if we have a source node
  if (!sourceNode) return null;

  const getPositionStyles = () => {
    if (position === 'inline') {
      return {
        left: offsetX,
        top: offsetY,
        transform: 'none',
        zIndex: 5
      };
    }
    
    // Default 'bottom' position
    return {
      left: sourceNode.position.x + (sourceNode.width || 150) / 2,
      top: sourceNode.position.y + (sourceNode.height || 50),
      transform: 'translateX(-50%)',
      zIndex: 5
    };
  };
  
  return (
    <div 
      className="absolute"
      style={getPositionStyles()}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            size="sm" 
            variant="secondary" 
            className="rounded-full h-8 w-8 p-0 shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add next node</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 p-0" 
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
