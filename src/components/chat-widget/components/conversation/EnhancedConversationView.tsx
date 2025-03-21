
import React, { useState } from 'react';
import ConversationHeader from './ConversationHeader';
import EnhancedMessageInput from './message/EnhancedMessageInput';
import EnhancedMessageList from './message/EnhancedMessageList';
import TypingIndicator from './TypingIndicator';
import useEnhancedConversation from './hooks/useEnhancedConversation';

interface EnhancedConversationViewProps {
  conversationId: string;
  onBack: () => void;
  workspaceId?: string;
}

/**
 * Enhanced conversation detail view component with additional features
 */
const EnhancedConversationView: React.FC<EnhancedConversationViewProps> = ({ 
  conversationId,
  onBack,
  workspaceId
}) => {
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [page, setPage] = useState(1);
  const messagesPerPage = 20;
  
  const {
    messages,
    newMessage,
    setNewMessage,
    loading,
    sending,
    handleSendMessage,
    formatTimestamp,
    totalMessages
  } = useEnhancedConversation(conversationId, workspaceId, page, messagesPerPage);

  // Simulate agent typing after user sends a message
  const handleSendWithTypingIndicator = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(e);
    
    // Show typing indicator for 2 seconds
    setIsAgentTyping(true);
    setTimeout(() => {
      setIsAgentTyping(false);
    }, 2000);
  };
  
  const loadMoreMessages = () => {
    if (page * messagesPerPage < totalMessages) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Conversation header */}
      <ConversationHeader conversationId={conversationId} onBack={onBack} />
      
      {/* Messages container */}
      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
        {page * messagesPerPage < totalMessages && (
          <div className="flex justify-center mb-4">
            <button 
              onClick={loadMoreMessages} 
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm"
            >
              Load earlier messages
            </button>
          </div>
        )}
        
        <EnhancedMessageList 
          messages={messages} 
          loading={loading} 
          formatTimestamp={formatTimestamp} 
        />
        
        {isAgentTyping && <TypingIndicator agentName="Support Agent" />}
      </div>
      
      {/* Message input */}
      <EnhancedMessageInput
        onSendMessage={handleSendWithTypingIndicator}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sending={sending}
      />
    </div>
  );
};

export default EnhancedConversationView;
