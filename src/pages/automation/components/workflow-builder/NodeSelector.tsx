
import React, { useState } from 'react';
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
  Square
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NodeType } from '@/types/workflow-builder';

interface NodeSelectorProps {
  nodeId: string;
  addNode: (type: NodeType, sourceNodeId: string) => string;
  availableNodeTypes: { type: NodeType; label: string; description: string }[];
}

export const NodeSelector: React.FC<NodeSelectorProps> = ({ nodeId, addNode, availableNodeTypes }) => {
  const [searchTerm, setSearchTerm] = useState('');
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
  
  // Filter node types based on search term
  const filteredNodeTypes = availableNodeTypes.filter(nodeType => 
    nodeType.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    nodeType.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get icon based on node type
  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'message':
        return <MessageSquare size={16} />;
      case 'condition':
        return <GitBranch size={16} />;
      case 'data_collection':
        return <Database size={16} />;
      case 'chatbot_answer':
        return <Bot size={16} />;
      case 'copilot_action':
        return <Bot size={16} />;
      case 'assign_ticket':
        return <User size={16} />;
      case 'collect_reply':
        return <MessageCircle size={16} />;
      case 'reusable_workflow':
        return <Share2 size={16} />;
      case 'show_reply_time':
        return <AlertCircle size={16} />;
      case 'ask_csat':
        return <Star size={16} />;
      case 'tag_ticket':
        return <Tag size={16} />;
      case 'update_ticket':
        return <FileEdit size={16} />;
      case 'wait':
        return <Clock size={16} />;
      case 'add_note':
        return <MessageCircle size={16} />;
      case 'end':
        return <Square size={16} />;
      default:
        return <Cog size={16} />;
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
      <PopoverContent className="w-80 p-4" align="center">
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Add Next Step</h3>
          
          <Input
            placeholder="Search node types..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="mb-2"
          />
          
          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {filteredNodeTypes.map(nodeType => (
              <Button
                key={nodeType.type}
                variant="ghost"
                className="w-full justify-start text-left flex items-center gap-2 h-auto py-2"
                onClick={() => {
                  // Handle different connection points for condition nodes
                  if (currentNode.type === 'condition') {
                    const yesConnection = connectedEdges.some(edge => 
                      edge.source === nodeId && edge.sourceHandle === 'yes'
                    );
                    const sourceHandle = !yesConnection ? 'yes' : 'no';
                    // For condition nodes, we need to add the connection manually
                    const newNodeId = addNode(nodeType.type, nodeId);
                    // Connection is handled in addNode function
                  } else {
                    // Regular nodes have a single output
                    addNode(nodeType.type, nodeId);
                  }
                }}
              >
                <span className="flex items-center justify-center w-8 h-8 bg-muted rounded-md">
                  {getNodeIcon(nodeType.type)}
                </span>
                <div className="flex flex-col">
                  <span>{nodeType.label}</span>
                  <span className="text-xs text-muted-foreground">{nodeType.description}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
