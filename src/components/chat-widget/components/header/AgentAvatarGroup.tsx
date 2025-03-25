
import React from 'react';
import UserAvatar from '../user/UserAvatar';
import { AgentPresence } from '@/hooks/chat/useAgentPresence';

interface AgentAvatarGroupProps {
  agents: AgentPresence[];
  maxDisplayed?: number;
}

const AgentAvatarGroup: React.FC<AgentAvatarGroupProps> = ({ 
  agents, 
  maxDisplayed = 3 
}) => {
  // Sort agents by status (online first)
  const sortedAgents = [...agents].sort((a, b) => {
    if (a.status === 'available' && b.status !== 'available') return -1;
    if (a.status !== 'available' && b.status === 'available') return 1;
    return 0;
  });

  // Display only the first few agents
  const displayedAgents = sortedAgents.slice(0, maxDisplayed);
  const remainingCount = Math.max(0, sortedAgents.length - maxDisplayed);

  return (
    <div className="flex -space-x-2 overflow-hidden">
      {displayedAgents.map((agent) => (
        <div key={agent.clientId} className="relative">
          <UserAvatar 
            name={agent.username || 'Agent'} 
            avatarUrl={agent.avatarUrl}
            status={agent.status} 
            size="sm"
          />
        </div>
      ))}
      
      {/* Show remaining count if needed */}
      {remainingCount > 0 && (
        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-200 text-sm font-medium text-gray-700 border-2 border-white">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default AgentAvatarGroup;
