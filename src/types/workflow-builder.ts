
import { Node, Edge, NodeProps, Position } from '@xyflow/react';

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
  | 'action'; // Adding 'action' as a valid node type

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

export interface WorkflowNodeData {
  label: string;
  triggerId?: string;
  actionType?: string;
  configured: boolean;
  config?: NodeConfig | WorkflowTriggerConfig;
  [key: string]: unknown; // Add index signature to satisfy Record<string, unknown>
}

// We define our custom node as a standard Node with our specific data type
export type WorkflowNode = Node<WorkflowNodeData>;

export interface WorkflowTagPickerProps {
  selectedTags: { id: string; name: string; color: string }[];
  allTags: { id: string; name: string; color: string }[];
  onChange: (tags: { id: string; name: string; color: string }[]) => void;
}
