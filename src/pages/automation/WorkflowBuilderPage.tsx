
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  XYPosition,
  useReactFlow,
  NodeTypes,
  ConnectionMode,
  Panel,
  Node,
  ReactFlowProvider,
  Viewport,
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
import { NodeSelector } from './components/workflow-builder/NodeSelector';
import { WorkspaceControls } from './components/workflow-builder/WorkspaceControls';

import {
  WorkflowNodeData,
  NodeType,
  NodeConfig,
  WorkflowTriggerConfig,
  WorkflowNode
} from '@/types/workflow-builder';

import './components/workflow-builder/styles/workflow-builder.css';

const nodeTypes = {
  trigger: TriggerNode,
  message: MessageNode,
  condition: ConditionNode,
  action: ActionNode,
  end: EndNode
} as NodeTypes;

const availableNodeTypes: { type: NodeType; label: string; description: string }[] = [
  { type: 'message', label: 'Message', description: 'Send a message to the customer' },
  { type: 'data_collection', label: 'Data Collection', description: 'Collect data from the customer' },
  { type: 'condition', label: 'Condition', description: 'Branch based on conditions' },
  { type: 'chatbot_answer', label: 'Let Chatbot Answer', description: 'Let the chatbot handle the response' },
  { type: 'copilot_action', label: 'Let AI copilot handle the next steps', description: 'Let AI copilot handle the next steps' },
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

const WorkflowBuilder: React.FC = () => {
  const { workflowId } = useParams<{ workflowId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const reactFlowInstance = useReactFlow();
  
  const triggerId = location.state?.triggerId;
  
  const [workflowName, setWorkflowName] = useState<string>('Untitled Workflow');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isPublished, setIsPublished] = useState<boolean>(false);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(true);
  const [snapGrid, setSnapGrid] = useState<[number, number]>([15, 15]);
  const [currentZoom, setCurrentZoom] = useState<number>(1);
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<WorkflowNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  const [triggerDrawerOpen, setTriggerDrawerOpen] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<Node<WorkflowNodeData> | null>(null);
  
  const onConnect = useCallback(
    (connection: Connection) => {
      let edgeType = "edge-standard";
      if (connection.sourceHandle === 'yes') {
        edgeType = "edge-success";
      } else if (connection.sourceHandle === 'no') {
        edgeType = "edge-failure";
      }

      setEdges((eds) => addEdge({
        ...connection,
        type: 'smoothstep',
        animated: connection.sourceHandle === 'yes' ? false : connection.sourceHandle === 'no' ? false : true,
        style: { strokeWidth: 2 },
        className: connection.sourceHandle === 'yes' ? 'edge-success' : 
                  connection.sourceHandle === 'no' ? 'edge-failure' : 
                  'edge-standard edge-animated'
      }, eds));
    },
    [setEdges]
  );
  
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node<WorkflowNodeData>) => {
    // Only set selectedNode and open drawer if it's a trigger node
    if (node.type === 'trigger') {
      setSelectedNode(node);
      setTriggerDrawerOpen(true);
    } else {
      // For other node types, just mark them as selected but don't open any drawer
      setSelectedNode(node);
      console.log(`Selected ${node.type} node with ID: ${node.id}`);
      
      // Simple placeholder for future in-node configuration
      if (!node.data.configured) {
        // Quick example of direct node configuration for demonstration
        // In the future this would be replaced with in-node configuration
        setNodes(nodes => 
          nodes.map(n => 
            n.id === node.id
              ? { 
                  ...n, 
                  data: { 
                    ...n.data, 
                    configured: true
                  } 
                }
              : n
          )
        );
        toast.info(`Node "${node.data.label}" will be configured directly in the node in future updates.`);
      }
    }
  }, [setNodes]);
  
  const addNode = useCallback((type: NodeType, sourceNodeId: string, position?: XYPosition) => {
    const id = uuidv4();
    let nodeLabel = availableNodeTypes.find(nt => nt.type === type)?.label || type;
    
    const newNodeData: WorkflowNodeData = {
      label: nodeLabel,
      configured: false
    };
    
    let nodeType: string = type;
    if (['assign_ticket', 'tag_ticket', 'update_ticket', 'wait', 'add_note'].includes(type)) {
      nodeType = 'action';
      newNodeData.actionType = type;
    }
    
    const newNode: Node<WorkflowNodeData> = {
      id,
      type: nodeType,
      position: position || {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      },
      data: newNodeData
    };
    
    setNodes(nodes => [...nodes, newNode]);
    
    if (sourceNodeId) {
      const sourceNode = nodes.find(n => n.id === sourceNodeId);
      let sourceHandle: string | undefined = undefined;
      let edgeClass = "edge-standard edge-animated";
      
      if (sourceNode?.type === 'condition') {
        const yesConnection = edges.some(e => 
          e.source === sourceNodeId && e.sourceHandle === 'yes'
        );
        sourceHandle = !yesConnection ? 'yes' : 'no';
        edgeClass = !yesConnection ? 'edge-success' : 'edge-failure';
      }
      
      setEdges(edges => [
        ...edges,
        {
          id: `e${sourceNodeId}-${id}`,
          source: sourceNodeId,
          target: id,
          sourceHandle,
          type: 'smoothstep',
          animated: sourceHandle !== 'yes' && sourceHandle !== 'no',
          style: { strokeWidth: 2 },
          className: edgeClass
        }
      ]);
    }
    
    return id;
  }, [setNodes, setEdges, nodes, edges]);
  
  useEffect(() => {
    console.log('WorkflowBuilder rendering with workflowId:', workflowId);
    console.log('Trigger ID from location state:', triggerId);
    
    if (!workflowId) {
      console.error('No workflow ID provided');
      return;
    }
    
    if (triggerId) {
      const triggerNodeId = uuidv4();
      const triggerNode: Node<WorkflowNodeData> = {
        id: triggerNodeId,
        type: 'trigger',
        position: getNodePosition(),
        data: {
          label: `Trigger: ${triggerId ? triggerId.replace(/_/g, ' ') : 'Unknown'}`,
          triggerId,
          configured: false
        }
      };
      
      setNodes([triggerNode]);
      setSelectedNode(triggerNode);
      setTriggerDrawerOpen(true);
    }
  }, [workflowId, triggerId, setNodes]);
  
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
  
  const saveWorkflow = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Workflow saved successfully');
    setIsSaving(false);
  };
  
  const publishWorkflow = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsPublished(true);
    toast.success('Workflow published successfully');
    setIsSaving(false);
  };

  const handleFitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.2 });
  }, [reactFlowInstance]);
  
  const onViewportChange = useCallback((viewport: Viewport) => {
    setCurrentZoom(Math.round(viewport.zoom * 100) / 100);
  }, []);

  const handleSnapToGridToggle = useCallback((value: boolean) => {
    setSnapToGrid(value);
  }, []);

  const updateSnapGrid = useCallback((size: number) => {
    setSnapGrid([size, size]);
  }, []);

  // Auto layout functionality
  const handleAutoLayout = useCallback(() => {
    if (!nodes.length) return;
    
    const nodesByType = {
      trigger: nodes.filter(node => node.type === 'trigger'),
      regular: nodes.filter(node => node.type !== 'trigger' && node.type !== 'end'),
      end: nodes.filter(node => node.type === 'end')
    };
    
    // Start with identifying the root node(s) (typically trigger nodes)
    const rootNodes = nodesByType.trigger.length > 0 
      ? nodesByType.trigger 
      : [nodes[0]]; // If no trigger node, use the first node
      
    // Create a map of node connections (which node connects to which)
    const nodeConnections = new Map();
    edges.forEach(edge => {
      if (!nodeConnections.has(edge.source)) {
        nodeConnections.set(edge.source, []);
      }
      nodeConnections.get(edge.source).push(edge.target);
    });
    
    // Function to get all connected nodes in order (breadth-first traversal)
    const getConnectedNodesInOrder = (startNodeIds: string[]) => {
      const visited = new Set();
      const result: string[] = [];
      const queue = [...startNodeIds];
      
      while (queue.length > 0) {
        const currentId = queue.shift();
        if (!currentId || visited.has(currentId)) continue;
        
        visited.add(currentId);
        result.push(currentId);
        
        const connections = nodeConnections.get(currentId) || [];
        for (const targetId of connections) {
          if (!visited.has(targetId)) {
            queue.push(targetId);
          }
        }
      }
      
      return result;
    };
    
    // Get nodes in traversal order
    const orderedNodeIds = getConnectedNodesInOrder(rootNodes.map(n => n.id));
    
    // Calculate positions for each node
    const HORIZONTAL_SPACING = 250;
    const VERTICAL_SPACING = 150;
    const MAX_NODES_PER_LEVEL = 3;
    
    // Group nodes into levels based on their distance from root
    const nodeLevels: Record<number, string[]> = {};
    const nodeDistances = new Map();
    
    // Calculate distance from root for each node
    orderedNodeIds.forEach((nodeId, index) => {
      const level = Math.floor(index / MAX_NODES_PER_LEVEL);
      if (!nodeLevels[level]) {
        nodeLevels[level] = [];
      }
      nodeLevels[level].push(nodeId);
      nodeDistances.set(nodeId, level);
    });
    
    // Position nodes based on their level
    const newNodes = nodes.map(node => {
      const level = nodeDistances.get(node.id) || 0;
      const levelNodes = nodeLevels[level] || [];
      const indexInLevel = levelNodes.indexOf(node.id);
      
      if (indexInLevel === -1) {
        return node; // Keep original position if node wasn't in our traversal
      }
      
      // Calculate new position
      const x = 100 + (level * HORIZONTAL_SPACING);
      const y = 100 + (indexInLevel * VERTICAL_SPACING);
      
      return {
        ...node,
        position: { x, y }
      };
    });
    
    setNodes(newNodes);
    setTimeout(() => reactFlowInstance.fitView({ padding: 0.2 }), 50);
    toast.success('Workflow auto-arranged');
  }, [nodes, edges, reactFlowInstance, setNodes]);

  return (
    <div className="flex flex-col h-screen w-full">
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
          snapToGrid={snapToGrid}
          snapGrid={snapGrid}
          fitView
          className={`workflow-builder ${snapToGrid ? 'snap-active' : ''}`}
          onViewportChange={onViewportChange}
        >
          <Background gap={snapGrid[0]} size={1} />
          <Controls showInteractive={false} />
          <WorkspaceControls 
            snapToGrid={snapToGrid}
            setSnapToGrid={handleSnapToGridToggle}
            onFitView={handleFitView}
            gridSize={String(snapGrid[0])}
            setGridSize={(size) => updateSnapGrid(parseInt(size))}
            onAutoLayout={handleAutoLayout}
          />
        </ReactFlow>
      </div>
      
      {/* Only show drawer for trigger nodes */}
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
          
        </DrawerContent>
      </Drawer>
      
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

const WorkflowBuilderPage: React.FC = () => {
  console.log('Rendering WorkflowBuilderPage with ReactFlowProvider');
  
  return (
    <ReactFlowProvider>
      <WorkflowBuilder />
    </ReactFlowProvider>
  );
};

export default WorkflowBuilderPage;
