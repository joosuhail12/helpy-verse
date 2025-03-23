import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import EnhancedMessageList from './message/EnhancedMessageList';
import EnhancedMessageInput from './message/EnhancedMessageInput';
import { useTypingIndicator } from '@/hooks/chat/useTypingIndicator';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import TypingIndicator from './TypingIndicator';

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
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" />
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
