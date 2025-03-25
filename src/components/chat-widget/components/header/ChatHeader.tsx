
import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import AgentAvatarGroup from './AgentAvatarGroup';
import { useAgentPresence } from '@/hooks/chat/useAgentPresence';

export interface ChatHeaderProps {
  title: string;
  onBackClick?: () => void;
  onClose?: () => void;
  workspaceId?: string;
  conversationId?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  title, 
  onBackClick, 
  onClose,
  workspaceId,
  conversationId 
}) => {
  const { colors } = useThemeContext();
  
  // Only fetch agent presence if we have workspace and conversation IDs
  const shouldFetchPresence = !!(workspaceId && conversationId);
  const { agents } = shouldFetchPresence 
    ? useAgentPresence(workspaceId, conversationId)
    : { agents: [] };

  return (
    <div 
      className="p-4 border-b flex items-center space-x-3" 
      style={{ borderColor: colors.border, backgroundColor: colors.background, color: colors.foreground }}
    >
      {onBackClick && (
        <button 
          onClick={onBackClick}
          className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          style={{ color: colors.foreground }}
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      
      <div className="flex-1 flex items-center space-x-3">
        <h2 className="font-medium truncate">{title}</h2>
        
        {/* Show agent avatars only if we have presence data */}
        {shouldFetchPresence && agents.length > 0 && (
          <AgentAvatarGroup agents={agents} />
        )}
      </div>
      
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          style={{ color: colors.foreground }}
          aria-label="Close chat"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default ChatHeader;
