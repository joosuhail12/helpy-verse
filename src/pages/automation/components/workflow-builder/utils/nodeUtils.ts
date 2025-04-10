
import { WorkflowNodeData } from '@/types/workflow-builder';

// Format node config details for the hover card
export function formatNodeConfig(nodeData: WorkflowNodeData): { label: string; value: string }[] {
  const details: { label: string; value: string }[] = [];
  const config = nodeData.config;
  
  if (!config) return details;
  
  // Handle trigger nodes
  if (nodeData.triggerId) {
    const triggerConfig = config as any;
    
    if (triggerConfig.channels) {
      if (triggerConfig.channels.chat !== undefined) {
        details.push({ 
          label: 'Chat', 
          value: triggerConfig.channels.chat ? 'Enabled' : 'Disabled' 
        });
      }
      
      if (triggerConfig.channels.email && triggerConfig.channels.email.length) {
        details.push({ 
          label: 'Email channels', 
          value: `${triggerConfig.channels.email.length} configured` 
        });
      }
    }
    
    return details;
  }
  
  // Handle different node types
  switch (nodeData.actionType || nodeData.type) {
    case 'message':
      if (config.message) {
        details.push({ 
          label: 'Message', 
          value: config.message.substring(0, 30) + (config.message.length > 30 ? '...' : '') 
        });
      }
      if (config.quickReplies?.length) {
        details.push({ 
          label: 'Quick replies', 
          value: `${config.quickReplies.length} options` 
        });
      }
      break;
      
    case 'condition':
      if (config.conditionType) {
        details.push({ label: 'Type', value: config.conditionType });
      }
      if (config.property) {
        details.push({ label: 'Property', value: config.property });
      }
      if (config.operator && config.value) {
        details.push({ 
          label: 'Condition', 
          value: `${config.operator} ${config.value}` 
        });
      }
      break;
      
    case 'assign_ticket':
      if (config.assigneeId) {
        details.push({ label: 'Assignee', value: config.assigneeId });
      }
      break;
      
    case 'tag_ticket':
      if (config.tags?.length) {
        details.push({ 
          label: 'Tags', 
          value: config.tags.join(', ').substring(0, 30) + (config.tags.join(', ').length > 30 ? '...' : '') 
        });
      }
      break;
      
    case 'wait':
      if (config.duration && config.unit) {
        details.push({ 
          label: 'Duration', 
          value: `${config.duration} ${config.unit}` 
        });
      }
      break;
  }
  
  if (config.customId) {
    details.push({ label: 'Custom ID', value: config.customId });
  }
  
  return details;
}
