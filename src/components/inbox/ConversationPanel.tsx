
import React from 'react';
import type { ConversationPanelProps } from './types';
import ConversationHeader from './ConversationHeader';
import MessageInput from './MessageInput';
import MessageList from './components/MessageList';
import { useConversation } from './hooks/useConversation';

const ConversationPanel = ({ ticket, onClose }: ConversationPanelProps) => {
  const {
    messages,
    newMessage,
    setNewMessage,
    typingUsers,
    activeUsers,
    handleSendMessage,
    handleTyping
  } = useConversation(ticket);

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      handleTyping();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <ConversationHeader 
        ticket={ticket} 
        onClose={onClose} 
        activeUsers={activeUsers}
      />
      
      <MessageList
        messages={messages}
        typingUsers={typingUsers}
        ticket={ticket}
        onReply={setNewMessage}
      />

      <MessageInput
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onKeyPress={handleKeyPress}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ConversationPanel;
