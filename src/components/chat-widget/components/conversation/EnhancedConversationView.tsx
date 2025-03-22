
import React, { useState, useEffect } from 'react';
import ConversationHeader from './ConversationHeader';
import EnhancedMessageInput from './message/EnhancedMessageInput';
import EnhancedMessageList from './message/EnhancedMessageList';
import TypingIndicator from './TypingIndicator';
import useRealtimeChat from '@/hooks/useRealtimeChat';

interface EnhancedConversationViewProps {
  conversationId: string;
  onBack: () => void;
  workspaceId?: string;
}

/**
 * Enhanced conversation detail view component with real-time features
 */
const EnhancedConversationView: React.FC<EnhancedConversationViewProps> = ({ 
  conversationId,
  onBack,
  workspaceId
}) => {
  // Get user ID from localStorage or generate one if not exists
  const getUserId = () => {
    let userId = localStorage.getItem('chat-widget-user-id');
    if (!userId) {
      userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chat-widget-user-id', userId);
    }
    return userId;
  };
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const {
    messages,
    newMessage,
    setNewMessage,
    loading,
    sending,
    typingUsers,
    connectionState,
    handleSendMessage,
    handleTyping,
    loadMoreMessages,
    hasMoreMessages,
    totalMessages,
    formatTimestamp
  } = useRealtimeChat(conversationId, {
    userId: getUserId(),
    userName: 'Customer'
  });
  
  // Handle connection status changes
  useEffect(() => {
    console.log(`Chat connection status: ${connectionState}`);
  }, [connectionState]);
  
  // Handle file selection
  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
    // TODO: Implement file upload and send with message
  };
  
  // Handle message reactions
  const handleReaction = (messageId: string, emoji: string) => {
    console.log(`React to message ${messageId} with ${emoji}`);
    // TODO: Implement reaction handling
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Conversation header */}
      <ConversationHeader 
        conversationId={conversationId} 
        onBack={onBack} 
        isConnected={connectionState === 'connected'} 
      />
      
      {/* Messages container */}
      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
        {hasMoreMessages && (
          <div className="flex justify-center mb-4">
            <button 
              onClick={loadMoreMessages} 
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm transition-colors"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : 'Load earlier messages'}
            </button>
          </div>
        )}
        
        <EnhancedMessageList 
          messages={messages} 
          loading={loading}
          hasMore={hasMoreMessages}
          loadMore={loadMoreMessages}
          currentUserId="user-id"
          onReact={handleReaction}
        />
        
        {typingUsers.length > 0 && (
          <TypingIndicator agentName={typingUsers.join(', ')} />
        )}
      </div>
      
      {/* Message input */}
      <EnhancedMessageInput
        onSendMessage={handleSendMessage}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sending={sending}
        onTyping={handleTyping}
        isConnected={connectionState === 'connected'}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
};

export default EnhancedConversationView;
