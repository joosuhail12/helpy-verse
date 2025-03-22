
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useConnectionState from '@/hooks/chat/useConnectionState';
import useMessages from '@/hooks/chat/useMessages';
import useMessageSubscription from '@/hooks/chat/useMessageSubscription';
import { useOfflineMessaging } from '@/hooks/chat/useOfflineMessaging';
import EnhancedMessageInput from './message/EnhancedMessageInput';
import ConnectionStatus from '../ConnectionStatus';
import { selectConnectionState } from '@/store/slices/chat/selectors';
import { useIsMobile } from '@/hooks/use-mobile';
import AnimatedContainer from '../../animations/AnimatedContainer';
import { Message } from './types';
import GroupedMessageList from './message/GroupedMessageList';
import EnhancedConversationHeader from './EnhancedConversationHeader';
import MessageErrorBoundary from '../../error-handling/MessageErrorBoundary';
import MessageFallback from '../../error-handling/MessageFallback';
import { ParticipantInfo } from '@/utils/ably/types';

interface ResponsiveConversationViewProps {
  conversationId: string;
  onBack: () => void;
  workspaceId?: string;
}

/**
 * Responsive conversation view component with enhanced features
 */
const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({
  conversationId,
  onBack,
  workspaceId
}) => {
  const connectionState = useSelector(selectConnectionState);
  const { isOnline, queuedMessages, queueMessage, syncMessages, retryFailedMessages } = 
    useOfflineMessaging({
      isConnected: connectionState === 'connected',
      conversationId,
      userId: 'user-id'
    });
  const isMobile = useIsMobile();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [searchResults, setSearchResults] = useState<Message[] | null>(null);
  const [activeParticipants, setActiveParticipants] = useState<ParticipantInfo[]>([]);
  
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
  
  // Monitor presence events
  useEffect(() => {
    const setupPresence = async () => {
      if (!conversationId || connectionState !== 'connected') return;
      
      try {
        // Import the enhanced presence monitoring function
        const ablyMessaging = await import('@/utils/ably');
        
        return ablyMessaging.monitorEnhancedPresence(
          conversationId,
          (participants) => {
            setActiveParticipants(participants);
          },
          (event) => {
            // We could show notifications for join/leave events here
            if (event.type === 'enter') {
              console.log(`${event.participantName} joined the conversation`);
            } else if (event.type === 'leave') {
              console.log(`${event.participantName} left the conversation`);
            }
          }
        );
      } catch (error) {
        console.error('Error setting up presence monitoring:', error);
      }
    };
    
    const cleanup = setupPresence();
    return () => {
      if (cleanup) {
        cleanup.then(unsubscribe => {
          if (unsubscribe) unsubscribe();
        });
      }
    };
  }, [conversationId, connectionState]);
  
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
    
    // Send message
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
  };
  
  // Handle search results
  const handleSearchResults = (results: Message[]) => {
    setSearchResults(results.length > 0 ? results : null);
  };
  
  // Get connection status for UI display
  const getDisplayConnectionState = () => {
    if (!isOnline) return 'offline';
    return connectionState === 'initializing' ? 'connecting' : connectionState;
  };

  // Convert queued messages to the correct format
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
      <EnhancedConversationHeader 
        onBack={onBack}
        title="Conversation"
        messages={allMessages}
        onSearchResults={handleSearchResults}
        activeParticipants={activeParticipants}
      />
      
      {/* Message list */}
      <MessageErrorBoundary fallbackComponent={MessageFallback}>
        <div className="flex-1 overflow-y-auto" role="log" aria-label="Conversation messages">
          <GroupedMessageList 
            messages={allMessages}
            loading={loading}
            searchResults={searchResults || undefined}
            hasMore={false}
            loadMore={loadMoreMessages}
            currentUserId="user-id"
            onReact={handleReaction}
          />
        </div>
      </MessageErrorBoundary>
      
      {/* Connection status indicator */}
      <ConnectionStatus 
        connectionState={getDisplayConnectionState()}
        hasQueuedMessages={queuedMessages.length > 0}
        onRetry={isOnline ? syncMessages : retryFailedMessages}
      />
      
      {/* Message input */}
      <EnhancedMessageInput
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
