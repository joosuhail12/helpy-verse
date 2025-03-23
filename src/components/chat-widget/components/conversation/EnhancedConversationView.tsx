
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import EnhancedMessageList from './message/EnhancedMessageList';
import EnhancedMessageInput from './message/EnhancedMessageInput';
import TypingIndicator from './TypingIndicator';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';

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
  
  const chatHook = useRealtimeChat(conversationId, {
    userId: getUserId(),
    userName: 'Customer'
  });
  
  // Handle connection status changes
  useEffect(() => {
    console.log(`Chat connection status: ${chatHook.connectionState.connectionState}`);
  }, [chatHook.connectionState]);
  
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
      <div className="flex items-center justify-between p-4 border-b">
        <button 
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          ← Back
        </button>
        <div className="text-sm">
          {chatHook.connectionState.connectionState === 'attached' ? (
            <span className="text-green-500">Connected</span>
          ) : (
            <span className="text-amber-500">Connecting...</span>
          )}
        </div>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
        {chatHook.hasMoreMessages && (
          <div className="flex justify-center mb-4">
            <button 
              onClick={chatHook.loadMoreMessages} 
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 bg-white border border-gray-200 rounded-full shadow-sm transition-colors"
              disabled={chatHook.loading}
            >
              {chatHook.loading ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" />
                  Loading...
                </span>
              ) : 'Load earlier messages'}
            </button>
          </div>
        )}
        
        <EnhancedMessageList 
          messages={chatHook.messages.map(msg => ({
            id: msg.id,
            text: msg.content,
            sender: msg.sender.id === getUserId() ? 'user' : 'agent',
            timestamp: new Date(msg.timestamp).toISOString(),
            status: msg.status
          }))} 
          loading={chatHook.loading}
          hasMore={chatHook.hasMoreMessages}
          loadMore={chatHook.loadMoreMessages}
          currentUserId={getUserId()}
          onReact={handleReaction}
        />
        
        {chatHook.typingUsers.length > 0 && (
          <TypingIndicator agentName={chatHook.typingUsers.join(', ')} />
        )}
      </div>
      
      {/* Message input */}
      <EnhancedMessageInput
        onSendMessage={chatHook.handleSendMessage}
        newMessage={chatHook.newMessage}
        setNewMessage={chatHook.setNewMessage}
        sending={chatHook.sending}
        onTyping={chatHook.handleTyping}
        isConnected={chatHook.connectionState.connectionState === 'attached'}
        onFileSelect={handleFileSelect}
      />
    </div>
  );
};

export default EnhancedConversationView;
