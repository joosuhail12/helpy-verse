
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
import AnimatedContainer from '../../animations/AnimatedContainer';
import { Message } from './types';

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  
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
    
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    
    // If offline, queue the message
    if (!isOnline) {
      queueMessage(newMessage, 'user-id', 'User');
      setNewMessage('');
      return;
    }
    
    // Handle file uploads if any
    let attachments: Array<{url: string, type: string, name: string, size?: number}> = [];
    
    if (selectedFiles.length > 0) {
      setUploadingFiles(true);
      try {
        // This would be replaced with actual file upload logic
        // For now, simulate file upload with a short delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create placeholder URLs for demo purposes
        attachments = selectedFiles.map(file => ({
          url: URL.createObjectURL(file),
          type: file.type,
          name: file.name,
          size: file.size
        }));
        
        setSelectedFiles([]);
      } catch (error) {
        console.error('Error uploading files:', error);
      } finally {
        setUploadingFiles(false);
      }
    }
    
    // Otherwise send normally
    await handleSendMessage(e, attachments);
  };
  
  // Handle file selection
  const handleFileSelect = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  };
  
  // Handle message reactions
  const handleReaction = (messageId: string, emoji: string) => {
    console.log(`React to message ${messageId} with ${emoji}`);
    // This would be implemented with actual reaction handling
    // For now, it's just a placeholder
  };
  
  // Get connection status for UI display
  const getDisplayConnectionState = () => {
    if (!isOnline) return 'offline';
    return connectionState === 'initializing' ? 'connecting' : connectionState;
  };

  // Convert queued messages to the correct format expected by EnhancedMessageList
  const convertedQueuedMessages: Message[] = queuedMessages.map(msg => ({
    id: msg.id,
    text: msg.text,
    sender: msg.sender.type === 'agent' ? 'agent' : 'user',
    timestamp: msg.timestamp,
    status: msg.status
  }));
  
  // Combine regular messages with queued messages
  const allMessages = [...messages, ...convertedQueuedMessages];
  
  return (
    <AnimatedContainer animation="fadeIn" className="flex flex-col h-full overflow-hidden">
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
          messages={allMessages}
          loading={loading}
          hasMore={false}
          loadMore={loadMoreMessages}
          currentUserId="user-id"
          onReact={handleReaction}
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
        sending={sending || uploadingFiles}
        isConnected={connectionState === 'connected'}
        isOnline={isOnline}
        queuedMessageCount={queuedMessages.length}
        onFileSelect={handleFileSelect}
      />
    </AnimatedContainer>
  );
};

export default ResponsiveConversationView;
