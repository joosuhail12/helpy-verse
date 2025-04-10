
import { Node as ReactFlowNode, Edge, NodeProps as ReactFlowNodeProps, Position } from '@xyflow/react';

export type NodeType = 
  | 'trigger'
  | 'message'
  | 'data_collection'
  | 'condition'
  | 'chatbot_answer'
  | 'copilot_action'
  | 'assign_ticket'
  | 'collect_reply'
  | 'reusable_workflow'
  | 'show_reply_time'
  | 'ask_csat'
  | 'tag_ticket'
  | 'update_ticket'
  | 'wait'
  | 'add_note'
  | 'end'
  | 'action';

// Define category type for NodeSelector properly as a string literal type
export type NodeCategory = 'messaging' | 'conditions' | 'tickets' | 'time' | 'data' | 'all';

export interface WorkflowTriggerConfig {
  channels: {
    chat: boolean;
    email: string[];
  };
  filters: {
    audience: any[];
    custom_fields: any[];
  };
}

export interface NodeConfig {
  // Common properties
  customId?: string;
  
  // Message node properties
  message?: string;
  quickReplies?: string[];
  
  // Condition node properties
  conditionType?: string;
  property?: string;
  operator?: string;
  value?: string;
  
  // Action node properties
  // Assign ticket
  assigneeId?: string;
  
  // Wait
  duration?: string;
  unit?: 'minutes' | 'hours' | 'days';
  
  // Tags
  tags?: string[];
  
  // Data updates
  dataUpdates?: Record<string, any>;
}

// Define the data structure for workflow nodes
export interface WorkflowNodeData {
  label: string;
  triggerId?: string;
  actionType?: string;
  configured: boolean;
  config?: NodeConfig | WorkflowTriggerConfig;
  [key: string]: unknown;
}

// Define our custom NodeProps type
export type NodeProps = Omit<ReactFlowNodeProps, 'data'> & {
  data?: WorkflowNodeData;
};

// Export WorkflowNode type
export type WorkflowNode = ReactFlowNode<WorkflowNodeData>;

export interface WorkflowTagPickerProps {
  selectedTags: { id: string; name: string; color: string }[];
  allTags: { id: string; name: string; color: string }[];
  onChange: (tags: { id: string; name: string; color: string }[]) => void;
}
