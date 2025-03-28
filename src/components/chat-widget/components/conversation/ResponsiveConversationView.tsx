
import React, { useState, useEffect } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { useMediaQuery } from '@/hooks/use-mobile';
import { ChatMessage, ResponsiveConversationViewProps, TypingUser } from './types';

const ResponsiveConversationView: React.FC<ResponsiveConversationViewProps> = ({
  conversationId,
  compact = false,
  workspaceId,
  onBack
}) => {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const { sendMessage, messages: chatMessages } = useChat();
  
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [inputHeight, setInputHeight] = useState<number>(64); // Default height
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

  // Mock methods for typing indicators
  const startTyping = () => console.log('Started typing');
  const stopTyping = () => console.log('Stopped typing');

  // Load messages for this conversation
  useEffect(() => {
    // In a real app, this would fetch messages from a service
    setMessages(chatMessages.filter(msg => msg.conversationId === conversationId));
  }, [conversationId, chatMessages]);

  // Calculate available height for message list
  const calculateMessageListHeight = () => {
    // Header (56px) + Input height + Padding
    const usedHeight = 56 + inputHeight + 16;
    return `calc(100% - ${usedHeight}px)`;
  };

  useEffect(() => {
    // Adjust layout when input height changes
    const messageList = document.querySelector('.message-list-container');
    if (messageList) {
      (messageList as HTMLElement).style.height = calculateMessageListHeight();
    }
  }, [inputHeight]);

  const handleSendMessage = (content: string) => {
    sendMessage(conversationId, content, attachments);
    setAttachments([]);
  };

  const handleFileUpload = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (file: File) => {
    setAttachments((prev) => prev.filter((f) => f !== file));
  };

  const handleInputResize = (height: number) => {
    setInputHeight(height);
  };

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center">Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <div 
        className="message-list-container flex-1 overflow-hidden"
        style={{ height: calculateMessageListHeight() }}
      >
        <MessageList 
          messages={messages} 
          conversationId={conversationId}
          showAvatars={true}
        />
      </div>
      
      {typingUsers.length > 0 && (
        <div className="px-4 py-1">
          <TypingIndicator users={typingUsers} compact={isMobile} />
        </div>
      )}
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        onTypingStart={startTyping}
        onTypingEnd={stopTyping}
        attachments={attachments}
        onFileUpload={handleFileUpload}
        onRemoveFile={handleRemoveFile}
        compact={compact || isMobile}
        onHeightChange={handleInputResize}
      />
    </div>
  );
};

export default ResponsiveConversationView;
