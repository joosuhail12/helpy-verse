import React, { useState } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ChatHeader from '../components/header/ChatHeader';

interface MessagesViewProps {
  workspaceId: string;
  onClose: () => void;
  setActiveView: (view: 'home' | 'messages' | 'conversation') => void;
  onStartConversation?: (message: string) => Promise<void>;
}

const MessagesView: React.FC<MessagesViewProps> = ({ 
  workspaceId, 
  onClose, 
  setActiveView,
  onStartConversation
}) => {
  const { conversations, currentConversation, selectConversation } = useChat();
  const { labels, colors } = useThemeContext();

  const handleConversationSelect = (conversationId: string) => {
    selectConversation(conversationId);
    setActiveView('conversation');
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title={labels.recentMessagesTitle} 
        onClose={onClose} 
        onBackClick={() => setActiveView('home')}
      />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-gray-500">{labels.noMessagesText}</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100" style={{ borderColor: colors.border }}>
            {conversations.map(conversation => (
              <button
                key={conversation.id}
                className="w-full px-4 py-3 flex items-start hover:bg-gray-50 transition-colors text-left"
                onClick={() => handleConversationSelect(conversation.id)}
                style={{ 
                  backgroundColor: colors.background, 
                  color: colors.foreground,
                  borderColor: colors.border 
                }}
              >
                <div>
                  <h3 className="font-medium">{conversation.title}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {/* Conversation preview would go here */}
                    {labels.noMessagesText}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;
