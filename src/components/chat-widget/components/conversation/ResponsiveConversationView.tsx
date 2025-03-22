import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import useConnectionState from '@/hooks/chat/useConnectionState';
import useMessages from '@/hooks/chat/useMessages';
import useMessageSubscription from '@/hooks/chat/useMessageSubscription';
import useOfflineMessaging from '@/hooks/chat/useOfflineMessaging';
import EnhancedMessageList from './message/EnhancedMessageList';
import OfflineAwareMessageInput from './message/OfflineAwareMessageInput';
import ConnectionStatus from '../ConnectionStatus';
import { selectConnectionState } from '@/store/slices/chat/selectors';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveConversationViewProps {
  conversationId: string;
  onBack: () => void;
  workspaceId?: string;
}

/**
 * Responsive conversation view component with offline support
 */
const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({
  conversationId,
  onBack,
  workspaceId
}) => {
  const connectionState = useSelector(selectConnectionState);
  const { isOnline, queuedMessages, queueMessage, syncMessages, retryFailedMessages } = 
    useOfflineMessaging(conversationId);
  const isMobile = useIsMobile();
  
  // Initialize connection
  useConnectionState(conversationId);
  
  // Get messages
  const { 
    messages, 
    newMessage, 
    setNewMessage,
    loading, 
    sending,
    handleSendMessage,
    loadMoreMessages
  } = useMessages(conversationId);
  
  // Set up message subscription
  useMessageSubscription(conversationId, connectionState);
  
  // Handle sending a message
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // If offline, queue the message
    if (!isOnline) {
      queueMessage(newMessage, 'user-id', 'User');
      setNewMessage('');
      return;
    }
    
    // Otherwise send normally
    await handleSendMessage(e);
  };
  
  // Get connection status for UI display
  const getDisplayConnectionState = () => {
    if (!isOnline) return 'offline';
    return connectionState;
  };
  
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-3 md:p-4 border-b border-gray-100 flex items-center shadow-sm">
        <button 
          onClick={onBack}
          className="mr-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h3 className={`font-medium ${isMobile ? 'text-base' : 'text-lg'}`}>Conversation</h3>
          <p className="text-xs text-gray-500 -mt-0.5">
            {isOnline ? (
              connectionState === 'connected' ? 'Connected' : 'Connecting...'
            ) : (
              'Offline mode'
            )}
          </p>
        </div>
      </div>
      
      {/* Message list */}
      <div className="flex-1 overflow-y-auto">
        <EnhancedMessageList 
          messages={[...messages, ...queuedMessages.map(msg => ({
            id: msg.id,
            text: msg.text,
            sender: msg.sender.type === 'agent' ? 'agent' : 'user',
            timestamp: msg.timestamp,
            status: msg.status
          }))]}
          loading={loading}
          hasMore={false}
          loadMore={loadMoreMessages}
          currentUserId="user-id"
        />
      </div>
      
      {/* Connection status indicator */}
      <ConnectionStatus 
        connectionState={getDisplayConnectionState()}
        hasQueuedMessages={queuedMessages.length > 0}
        onRetry={isOnline ? syncMessages : retryFailedMessages}
      />
      
      {/* Message input */}
      <OfflineAwareMessageInput
        onSendMessage={handleMessageSubmit}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sending={sending}
        isConnected={connectionState === 'connected'}
        isOnline={isOnline}
        queuedMessageCount={queuedMessages.length}
      />
    </div>
  );
};

export default ResponsiveConversationView;
