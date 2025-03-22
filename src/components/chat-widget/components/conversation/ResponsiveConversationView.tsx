
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
import { uploadFiles } from '@/utils/ably/messaging/fileUploadService';
import { useToast } from '@/hooks/use-toast';

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
  // Fix property names to match what's returned from useOfflineMessaging
  const { queuedMessages, hasFailedMessages, queueOfflineMessage, syncQueuedMessages, retryFailedMessages } = 
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
  const { toast } = useToast();
  
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
    // Use the online status from Redux state
    const isOnline = connectionState !== 'disconnected' && connectionState !== 'failed';
    if (!isOnline) {
      queueOfflineMessage(newMessage);
      setNewMessage('');
      return;
    }
    
    // Handle file uploads if any
    let attachments: Array<{url: string, type: string, name: string, size?: number}> = [];
    
    if (selectedFiles.length > 0) {
      setUploadingFiles(true);
      try {
        // Upload files
        toast({
          title: 'Uploading files',
          description: `Uploading ${selectedFiles.length} file(s)...`
        });
        
        attachments = await uploadFiles(selectedFiles, conversationId);
        
        toast({
          title: 'Files uploaded',
          description: `Successfully uploaded ${selectedFiles.length} file(s)`
        });
        
        setSelectedFiles([]);
      } catch (error) {
        console.error('Error uploading files:', error);
        toast({
          title: 'Upload failed',
          description: 'Failed to upload one or more files',
          variant: 'destructive'
        });
      } finally {
        setUploadingFiles(false);
      }
    }
    
    // Send message
    await handleSendMessage(e, attachments);
  };
  
  // Handle file selection
  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
      toast({
        title: 'Files selected',
        description: `Added ${files.length} file(s) to your message`
      });
    }
  };
  
  // Handle message reactions
  const handleReaction = (messageId: string, emoji: string) => {
    console.log(`React to message ${messageId} with ${emoji}`);
    toast({
      title: 'Reaction added',
      description: `Added reaction ${emoji} to message`
    });
    // This would be implemented with actual reaction handling
  };
  
  // Handle search results
  const handleSearchResults = (results: Message[]) => {
    setSearchResults(results.length > 0 ? results : null);
  };
  
  // Get connection status for UI display
  const getDisplayConnectionState = () => {
    const isOnline = connectionState !== 'disconnected' && connectionState !== 'failed';
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
        onRetry={(connectionState !== 'disconnected' && connectionState !== 'failed') 
          ? () => syncQueuedMessages(async (convId, text, sender, msgId) => {
              const { sendMessage } = await import('@/utils/ably');
              return sendMessage(convId, text, sender, msgId);
            }) 
          : () => retryFailedMessages(async (convId, text, sender, msgId) => {
              const { sendMessage } = await import('@/utils/ably');
              return sendMessage(convId, text, sender, msgId);
            })
        }
      />
      
      {/* Message input */}
      <EnhancedMessageInput
        onSendMessage={handleMessageSubmit}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sending={sending || uploadingFiles}
        isConnected={connectionState === 'connected'}
        isOnline={connectionState !== 'disconnected' && connectionState !== 'failed'}
        queuedMessageCount={queuedMessages.length}
        onFileSelect={handleFileSelect}
      />
    </AnimatedContainer>
  );
};

export default ResponsiveConversationView;
