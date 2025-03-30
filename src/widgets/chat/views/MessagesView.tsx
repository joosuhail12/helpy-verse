
import React, { useState } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ChatHeader from '../components/header/ChatHeader';
import EnhancedConversationView from '../components/conversation/EnhancedConversationView';

interface MessagesViewProps {
  onClose: () => void;
  onSelectConversation: () => void;
  onStartConversation: (message: string) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({
  onClose,
  onSelectConversation,
  onStartConversation
}) => {
  const { conversations, selectConversation } = useChat();
  const { labels, colors } = useThemeContext();
  const [newMessageText, setNewMessageText] = useState('');

  const handleSendMessage = async (content: string) => {
    if (content.trim()) {
      await onStartConversation(content);
      // After starting a conversation, we should move to the conversation view
      onSelectConversation();
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    selectConversation(conversationId);
    onSelectConversation();
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title={labels?.recentMessagesTitle || "Recent Messages"} 
        onClose={onClose} 
        onBackClick={() => onClose()} 
      />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-gray-500 mb-4">{labels?.noMessagesText || "You don't have any messages yet"}</p>
            <div className="w-full">
              <EnhancedConversationView
                messages={[]}
                onSendMessage={handleSendMessage}
                disabled={false}
                hasActiveConversation={false}
              />
            </div>
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
                <div className="w-full">
                  <h3 className="font-medium truncate">{conversation.title || "New Conversation"}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage || labels?.noMessagesText || "No messages yet"}
                  </p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-400">
                      {conversation.lastMessageTimestamp ? new Date(conversation.lastMessageTimestamp).toLocaleString() : ""}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
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
