
import React, { useState } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ChatHeader from '../components/header/ChatHeader';
import MessageInput from '../components/conversation/MessageInput';

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
  const { conversations, selectConversation } = useChat();
  const { labels, colors } = useThemeContext();
  const [newMessageContent, setNewMessageContent] = useState('');

  const handleSendMessage = async (content: string) => {
    if (!onStartConversation) return;
    
    setNewMessageContent('');
    await onStartConversation(content);
    
    // Set active view to conversation (will be handled by the parent)
    setActiveView('conversation');
  };

  const handleConversationSelect = (conversationId: string) => {
    selectConversation(conversationId);
    setActiveView('conversation');
  };

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title={labels.recentMessagesTitle || 'Recent messages'} 
        onClose={onClose} 
        onBackClick={() => setActiveView('home')}
      />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-gray-500 mb-4">{labels.noMessagesText || 'No messages yet. Start a conversation!'}</p>
            
            {/* Input to start a conversation */}
            <div className="w-full max-w-md mt-4">
              <MessageInput 
                onSendMessage={handleSendMessage}
                placeholder={labels.messagePlaceholder || "Type a message to start..."}
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
                <div>
                  <h3 className="font-medium">{conversation.title}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {conversation.lastMessage || (labels.noMessagesText || "No messages yet")}
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
