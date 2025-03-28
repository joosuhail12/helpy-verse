
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface AgentAvatarGroupProps {
  agents: string[];
  maxShown?: number;
}

const AgentAvatarGroup: React.FC<AgentAvatarGroupProps> = ({ 
  agents,
  maxShown = 3 
}) => {
  // Only show up to maxShown avatars
  const visibleAgents = agents.slice(0, maxShown);
  const extraCount = Math.max(0, agents.length - maxShown);

  return (
    <div className="flex -space-x-2">
      {visibleAgents.map((agentId, index) => (
        <Avatar key={agentId} className="h-6 w-6 border-2 border-white">
          <AvatarImage 
            src={`https://avatar.vercel.sh/${agentId}.png`} 
            alt={`Agent ${index + 1}`} 
          />
          <AvatarFallback className="text-[10px]">
            {`A${index + 1}`}
          </AvatarFallback>
        </Avatar>
      ))}
      
      {extraCount > 0 && (
        <Avatar className="h-6 w-6 border-2 border-white bg-primary">
          <AvatarFallback className="text-[10px] text-white">
            +{extraCount}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default AgentAvatarGroup;
