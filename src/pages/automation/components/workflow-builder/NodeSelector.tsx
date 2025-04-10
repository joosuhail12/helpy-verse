
import React, { useState, useMemo } from 'react';
import { useReactFlow, getOutgoers, getConnectedEdges } from '@xyflow/react';
import { 
  Plus, 
  MessageSquare, 
  GitBranch, 
  Cog,
  Database,
  Bot,
  User,
  MessageCircle,
  Share2,
  Clock,
  Star,
  Tag,
  FileEdit,
  AlertCircle,
  Square,
  Search,
  CheckCircle2,
  Clock4
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NodeType } from '@/types/workflow-builder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

interface NodeSelectorProps {
  nodeId: string;
  addNode: (type: NodeType, sourceNodeId: string) => string;
  availableNodeTypes: { type: NodeType; label: string; description: string }[];
}

type NodeCategory = 'messaging' | 'conditions' | 'tickets' | 'time' | 'data' | 'all';

interface NodeTypeWithCategory extends NodeType {
  category: NodeCategory;
}

const NODE_CATEGORIES: Record<NodeCategory, { label: string; icon: React.ReactNode }> = {
  messaging: { label: 'Messaging', icon: <MessageSquare size={16} className="text-blue-500" /> },
  conditions: { label: 'Conditions', icon: <GitBranch size={16} className="text-purple-500" /> },
  tickets: { label: 'Tickets', icon: <CheckCircle2 size={16} className="text-green-500" /> },
  time: { label: 'Time', icon: <Clock4 size={16} className="text-amber-500" /> },
  data: { label: 'Data', icon: <Database size={16} className="text-indigo-500" /> },
  all: { label: 'All', icon: <Cog size={16} /> }
};

// Map node types to categories
const NODE_TYPE_CATEGORIES: Record<NodeType, NodeCategory> = {
  message: 'messaging',
  data_collection: 'data',
  condition: 'conditions',
  chatbot_answer: 'messaging',
  copilot_action: 'messaging',
  assign_ticket: 'tickets',
  collect_reply: 'messaging',
  reusable_workflow: 'data',
  show_reply_time: 'time',
  ask_csat: 'messaging',
  tag_ticket: 'tickets',
  update_ticket: 'tickets',
  wait: 'time',
  add_note: 'data',
  end: 'conditions',
  trigger: 'conditions',
  action: 'data'
};

export const NodeSelector: React.FC<NodeSelectorProps> = ({ nodeId, addNode, availableNodeTypes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<NodeCategory>('all');
  const { getNode, getNodes, getEdges } = useReactFlow();
  const currentNode = getNode(nodeId);
  
  // Don't render if the node doesn't exist or is an end node
  if (!currentNode || currentNode.type === 'end') {
    return null;
  }
  
  // Check if this node already has outgoing connections
  const connectedEdges = getConnectedEdges([currentNode], getEdges());
  const outgoers = getOutgoers(currentNode, getNodes(), getEdges());
  
  // Condition nodes have two outputs (yes/no), other nodes have just one
  // If it's not a condition node and already has an outgoing connection, don't show selector
  if (currentNode.type !== 'condition' && outgoers.length > 0) {
    return null;
  }
  
  // For condition nodes, check if both outputs are already connected
  if (currentNode.type === 'condition') {
    const yesConnection = connectedEdges.some(edge => 
      edge.source === nodeId && edge.sourceHandle === 'yes'
    );
    const noConnection = connectedEdges.some(edge => 
      edge.source === nodeId && edge.sourceHandle === 'no'
    );
    
    if (yesConnection && noConnection) {
      return null;
    }
  }
  
  // Filter node types based on search term and category
  const filteredNodeTypes = useMemo(() => {
    let filtered = availableNodeTypes.filter(nodeType => 
      (nodeType.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nodeType.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    if (activeCategory !== 'all') {
      filtered = filtered.filter(nodeType => 
        NODE_TYPE_CATEGORIES[nodeType.type] === activeCategory
      );
    }
    
    return filtered;
  }, [availableNodeTypes, searchTerm, activeCategory]);

  // Get icon based on node type
  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={16} className="text-blue-600" />;
      case 'condition':
        return <GitBranch size={16} className="text-purple-600" />;
      case 'data_collection':
        return <Database size={16} className="text-indigo-600" />;
      case 'chatbot_answer':
        return <Bot size={16} className="text-blue-600" />;
      case 'copilot_action':
        return <Bot size={16} className="text-blue-600" />;
      case 'assign_ticket':
        return <User size={16} className="text-green-600" />;
      case 'collect_reply':
        return <MessageCircle size={16} className="text-blue-600" />;
      case 'reusable_workflow':
        return <Share2 size={16} className="text-indigo-600" />;
      case 'show_reply_time':
        return <AlertCircle size={16} className="text-amber-600" />;
      case 'ask_csat':
        return <Star size={16} className="text-blue-600" />;
      case 'tag_ticket':
        return <Tag size={16} className="text-green-600" />;
      case 'update_ticket':
        return <FileEdit size={16} className="text-green-600" />;
      case 'wait':
        return <Clock size={16} className="text-amber-600" />;
      case 'add_note':
        return <MessageCircle size={16} className="text-indigo-600" />;
      case 'end':
        return <Square size={16} className="text-red-600" />;
      default:
        return <Cog size={16} className="text-gray-600" />;
    }
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="absolute flex items-center justify-center rounded-full w-8 h-8 bg-primary text-primary-foreground shadow-md hover:shadow-lg transition-all"
          style={{
            top: currentNode.position.y + 120, // Position below the node
            left: currentNode.position.x + 75, // Center horizontally
            zIndex: 10,
            padding: 0
          }}
        >
          <Plus size={14} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="center">
        <div className="p-4 border-b">
          <h3 className="font-medium text-sm mb-2">Add Next Step</h3>
          
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search node types..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeCategory} onValueChange={(v) => setActiveCategory(v as NodeCategory)} className="w-full">
          <div className="border-b px-4 py-2">
            <TabsList className="grid grid-cols-6 h-8">
              {Object.entries(NODE_CATEGORIES).map(([key, { label, icon }]) => (
                <TabsTrigger 
                  key={key} 
                  value={key}
                  className="text-xs px-1 flex items-center"
                >
                  <span className="mr-1">{icon}</span>
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <TabsContent value={activeCategory} className="mt-0">
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredNodeTypes.length > 0 ? (
                filteredNodeTypes.map(nodeType => (
                  <Button
                    key={nodeType.type}
                    variant="ghost"
                    className="w-full justify-start text-left flex items-center gap-2 h-auto py-2 group animate-fadeSlideIn"
                    onClick={() => {
                      // Handle different connection points for condition nodes
                      if (currentNode.type === 'condition') {
                        const yesConnection = connectedEdges.some(edge => 
                          edge.source === nodeId && edge.sourceHandle === 'yes'
                        );
                        // For condition nodes, we need to add the connection manually
                        addNode(nodeType.type, nodeId);
                        // Connection is handled in addNode function
                      } else {
                        // Regular nodes have a single output
                        addNode(nodeType.type, nodeId);
                      }
                    }}
                  >
                    <span className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-md transition-colors",
                      getNodeColorClass(nodeType.type)
                    )}>
                      {getNodeIcon(nodeType.type)}
                    </span>
                    <div className="flex flex-col">
                      <span className="font-medium">{nodeType.label}</span>
                      <span className="text-xs text-muted-foreground">{nodeType.description}</span>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <div className="mb-2">No matching node types found</div>
                  <div className="text-sm">Try a different search term or category</div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

// Helper function to get background color class based on node type
function getNodeColorClass(type: NodeType): string {
  const category = NODE_TYPE_CATEGORIES[type];
  
  switch (category) {
    case 'messaging':
      return 'bg-blue-100';
    case 'conditions':
      return 'bg-purple-100';
    case 'tickets':
      return 'bg-green-100';
    case 'time':
      return 'bg-amber-100';
    case 'data':
      return 'bg-indigo-100';
    default:
      return 'bg-muted';
  }
}
