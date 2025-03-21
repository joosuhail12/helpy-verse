
import React from 'react';
import ConversationHeader from './ConversationHeader';
import MessageList from './message/MessageList';
import MessageInput from './message/MessageInput';
import { useConversation } from './hooks/useConversation';

interface ConversationViewProps {
  conversationId: string;
  onBack: () => void;
  workspaceId?: string;
}

/**
 * Conversation detail view component
 */
const ConversationView: React.FC<ConversationViewProps> = ({ 
  conversationId,
  onBack,
  workspaceId
}) => {
  const {
    messages,
    newMessage,
    setNewMessage,
    loading,
    sending,
    handleSendMessage,
    formatTimestamp
  } = useConversation(conversationId, workspaceId);

  return (
    <div className="flex flex-col h-full">
      {/* Conversation header */}
      <ConversationHeader conversationId={conversationId} onBack={onBack} />
      
      {/* Messages container */}
      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
        <MessageList 
          messages={messages} 
          loading={loading} 
          formatTimestamp={formatTimestamp} 
        />
      </div>
      
      {/* Message input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sending={sending}
      />
    </div>
  );
};

export default ConversationView;
