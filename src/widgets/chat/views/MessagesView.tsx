
import React, { useEffect } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ChatHeader from '@/components/chat-widget/components/header/ChatHeader';
import MessageInput from '@/components/chat-widget/components/conversation/MessageInput';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User, Clock, ArrowRight } from 'lucide-react';

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
  const { conversations, selectConversation, getMessages } = useChat();
  const { labels, colors } = useThemeContext();

  // Load conversations data when component mounts
  useEffect(() => {
    // This would typically fetch conversations from an API
    // For now we're using the mock data from the useChat hook
  }, []);

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
    <div className="flex flex-col h-full" style={{ backgroundColor: colors.background }}>
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
            
            {/* Input to start a new conversation when there are no existing ones */}
            <div className="w-full max-w-md mx-auto mt-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium mb-2">Start a new conversation</h3>
                <MessageInput 
                  onSendMessage={handleSendMessage}
                  disabled={false}
                  placeholder={labels?.placeholder || "Type a message..."}
                />
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="flex-1 overflow-y-auto divide-y"
            style={{ borderColor: colors.border }}
          >
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
                    <h3 className="font-medium truncate" style={{ color: colors.foreground }}>
                      {conversation.title || "New Conversation"}
                    </h3>
                    <span className="text-xs text-gray-400 flex items-center ml-2 whitespace-nowrap">
                      <Clock size={12} className="mr-1" />
                      {formatTimestamp(conversation.lastMessageTimestamp)}
                    </span>
                  </div>
                  <p className="text-sm truncate mt-1" style={{ color: 'rgb(107 114 128)' }}>
                    {conversation.lastMessage || labels?.noMessagesText || "No messages yet"}
                  </p>
                  <div className="mt-1 flex justify-between items-center">
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5">
                        {conversation.unreadCount}
                      </span>
                    )}
                    <span className="text-primary text-xs flex items-center ml-auto">
                      View conversation <ArrowRight size={12} className="ml-1" />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
        
        {/* Input at the bottom to start a new conversation when there are existing ones */}
        {conversations.length > 0 && (
          <div className="p-3 border-t" style={{ borderColor: colors.border }}>
            <MessageInput 
              onSendMessage={handleSendMessage}
              disabled={false}
              placeholder={labels?.placeholder || "Start a new conversation..."}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;
