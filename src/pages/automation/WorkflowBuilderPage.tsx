
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  XYPosition,
  useReactFlow,
  NodeTypes,
  ConnectionMode,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from '@/components/ui/drawer';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

import TriggerNode from './components/workflow-builder/nodes/TriggerNode';
import MessageNode from './components/workflow-builder/nodes/MessageNode';
import ConditionNode from './components/workflow-builder/nodes/ConditionNode';
import ActionNode from './components/workflow-builder/nodes/ActionNode';
import EndNode from './components/workflow-builder/nodes/EndNode';
import { TriggerDrawer } from './components/workflow-builder/drawers/TriggerDrawer';
import { NodeConfigurator } from './components/workflow-builder/NodeConfigurator';
import { NodeSelector } from './components/workflow-builder/NodeSelector';

import {
  WorkflowNode,
  WorkflowTriggerConfig,
  NodeType,
  NodeConfig
} from '@/types/workflow-builder';

// Node types mapping for ReactFlow
const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  message: MessageNode,
  condition: ConditionNode,
  action: ActionNode,
  end: EndNode
};

// List of available node types for the node selector
const availableNodeTypes: { type: NodeType; label: string; description: string }[] = [
  { type: 'message', label: 'Message', description: 'Send a message to the customer' },
  { type: 'data_collection', label: 'Data Collection', description: 'Collect data from the customer' },
  { type: 'condition', label: 'Condition', description: 'Branch based on conditions' },
  { type: 'chatbot_answer', label: 'Let Chatbot Answer', description: 'Let the chatbot handle the response' },
  { type: 'copilot_action', label: 'Let Copilot Take Action', description: 'Let AI copilot handle the next steps' },
  { type: 'assign_ticket', label: 'Assign Ticket', description: 'Assign the ticket to a teammate' },
  { type: 'collect_reply', label: 'Collect Customer Reply', description: 'Wait for customer to reply' },
  { type: 'reusable_workflow', label: 'Pass to Reusable Workflow', description: 'Use another workflow' },
  { type: 'show_reply_time', label: 'Show Expected Reply Time', description: 'Display expected reply time' },
  { type: 'ask_csat', label: 'Ask for CSAT', description: 'Request customer satisfaction rating' },
  { type: 'tag_ticket', label: 'Tag Ticket', description: 'Add tags to the ticket' },
  { type: 'update_ticket', label: 'Update Ticket Data', description: 'Update ticket information' },
  { type: 'wait', label: 'Wait', description: 'Pause the workflow for some time' },
  { type: 'add_note', label: 'Add Note', description: 'Add an internal note' },
  { type: 'end', label: 'End Workflow', description: 'End the workflow execution' }
];

const getNodePosition = (): XYPosition => ({
  x: window.innerWidth / 2 - 75,
  y: window.innerHeight / 3
});

const WorkflowBuilderPage: React.FC = () => {
  const { triggerId } = useParams<{ triggerId: string }>();
  const navigate = useNavigate();
  const reactFlowInstance = useReactFlow();
  
  const [workflowName, setWorkflowName] = useState<string>('Untitled Workflow');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  
  // Node and edge states for ReactFlow
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // Drawers and configuration states
  const [triggerDrawerOpen, setTriggerDrawerOpen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);
  const [selectedNodeConfig, setSelectedNodeConfig] = useState<NodeConfig | null>(null);
  
  // Add connection handler for ReactFlow
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({
        ...connection,
        type: 'smoothstep',
        animated: false,
        style: { strokeWidth: 2 }
      }, eds));
    },
    [setEdges]
  );
  
  // Handle node click to open configuration drawer
  const onNodeClick = useCallback((_, node: Node) => {
    setSelectedNode(node as WorkflowNode);
    if (node.type === 'trigger') {
      setTriggerDrawerOpen(true);
    }
  }, []);
  
  // Add new node to the flow
  const addNode = useCallback((type: NodeType, sourceNodeId: string, position?: XYPosition) => {
    const id = uuidv4();
    const newNode: WorkflowNode = {
      id,
      type: type as string,
      position: position || {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      },
      data: {
        label: availableNodeTypes.find(nt => nt.type === type)?.label || type,
        configured: false
      }
    };
    
    setNodes(nodes => [...nodes, newNode]);
    
    // Create connection from source node to new node
    if (sourceNodeId) {
      setEdges(edges => [
        ...edges,
        {
          id: `e${sourceNodeId}-${id}`,
          source: sourceNodeId,
          target: id,
          type: 'smoothstep',
          animated: false,
          style: { strokeWidth: 2 }
        }
      ]);
    }
    
    return id;
  }, [setNodes, setEdges]);
  
  // Configure the trigger node when page loads
  useEffect(() => {
    if (!triggerId) return;
    
    // Add trigger node to the flow
    const triggerNodeId = uuidv4();
    const triggerNode: WorkflowNode = {
      id: triggerNodeId,
      type: 'trigger',
      position: getNodePosition(),
      data: {
        label: `Trigger: ${triggerId.replace(/_/g, ' ')}`,
        triggerId,
        configured: false
      }
    };
    
    setNodes([triggerNode]);
    setSelectedNode(triggerNode);
    setTriggerDrawerOpen(true);
  }, [triggerId, setNodes]);
  
  // Save trigger configuration
  const saveTriggerConfig = (config: WorkflowTriggerConfig) => {
    if (!selectedNode) return;
    
    setNodes(nodes => 
      nodes.map(node => 
        node.id === selectedNode.id
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                configured: true, 
                config 
              } 
            }
          : node
      )
    );
    
    setTriggerDrawerOpen(false);
    toast.success('Trigger configured successfully');
  };
  
  // Save node configuration
  const saveNodeConfig = (nodeId: string, config: NodeConfig) => {
    setNodes(nodes => 
      nodes.map(node => 
        node.id === nodeId
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                configured: true, 
                config 
              } 
            }
          : node
      )
    );
    
    setSelectedNode(null);
    toast.success('Node configured successfully');
  };
  
  // Save workflow
  const saveWorkflow = async () => {
    setIsSaving(true);
    // Mock API call to save workflow
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Workflow saved successfully');
    setIsSaving(false);
  };
  
  // Publish workflow
  const publishWorkflow = async () => {
    setIsSaving(true);
    // Mock API call to publish workflow
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsPublished(true);
    toast.success('Workflow published successfully');
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Top bar */}
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/home/automation/workflows')}
          >
            ← Back
          </Button>
          <Input
            className="w-64 h-9"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            placeholder="Workflow Name"
          />
          <Badge 
            variant={isPublished ? "success" : "secondary"}
            className={isPublished ? "bg-green-100 text-green-800" : ""}
          >
            {isPublished ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            disabled={isSaving} 
            onClick={saveWorkflow}
          >
            Save
          </Button>
          <Button 
            disabled={isSaving} 
            onClick={publishWorkflow}
          >
            Publish
          </Button>
        </div>
      </div>
      
      {/* Main canvas */}
      <div className="flex-grow">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.2}
          maxZoom={1.5}
          snapToGrid
          snapGrid={[15, 15]}
          fitView
        >
          <Background gap={16} size={1} />
          <Controls />
          <Panel position="bottom-right" className="bg-transparent">
            <Button 
              variant="outline" 
              className="shadow-md"
              onClick={() => reactFlowInstance.fitView()}
            >
              Fit View
            </Button>
          </Panel>
        </ReactFlow>
      </div>
      
      {/* Trigger configuration drawer */}
      <Drawer open={triggerDrawerOpen} onOpenChange={setTriggerDrawerOpen}>
        <DrawerContent className="h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Configure Trigger: {triggerId?.replace(/_/g, ' ')}</DrawerTitle>
            <DrawerDescription>
              Set up how this workflow gets triggered
            </DrawerDescription>
          </DrawerHeader>
          
          <TriggerDrawer 
            triggerId={triggerId || ''}
            onSave={saveTriggerConfig}
          />
          
          <DrawerFooter>
            <Button onClick={() => setTriggerDrawerOpen(false)}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      {/* Node configuration */}
      {selectedNode && selectedNode.type !== 'trigger' && (
        <NodeConfigurator
          node={selectedNode}
          onSave={saveNodeConfig}
          onCancel={() => setSelectedNode(null)}
        />
      )}
      
      {/* Node selector for adding new nodes */}
      {nodes.map(node => (
        <NodeSelector
          key={`selector-${node.id}`}
          nodeId={node.id}
          addNode={addNode}
          availableNodeTypes={availableNodeTypes}
        />
      ))}
    </div>
  );
};

export default WorkflowBuilderPage;
