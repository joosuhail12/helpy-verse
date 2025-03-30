
import React, { useState, useEffect } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ChatHeader from '@/components/chat-widget/components/header/ChatHeader';
import EnhancedConversationView from '@/components/chat-widget/components/conversation/EnhancedConversationView';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User, Clock } from 'lucide-react';

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

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: string | Date | undefined) => {
    if (!timestamp) return '';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title={labels?.recentMessagesTitle || "Recent Conversations"} 
        onClose={onClose} 
        onBackClick={() => onClose()} 
      />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="mb-4 p-3 bg-primary/10 rounded-full">
              <MessageSquare size={24} className="text-primary" />
            </div>
            <p className="text-gray-500 mb-4">{labels?.noMessagesText || "You don't have any conversations yet"}</p>
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
                <div className="flex-shrink-0 mr-3 mt-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User size={18} className="text-primary" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium truncate">
                      {conversation.title || "New Conversation"}
                    </h3>
                    <span className="text-xs text-gray-400 flex items-center ml-2 whitespace-nowrap">
                      <Clock size={12} className="mr-1" />
                      {formatTimestamp(conversation.lastMessageTimestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {conversation.lastMessage || labels?.noMessagesText || "No messages yet"}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <div className="mt-1 flex justify-end">
                      <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
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
