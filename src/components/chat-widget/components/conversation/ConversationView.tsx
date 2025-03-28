
import React, { useState, useEffect } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { ChatMessage } from './types';

interface ConversationViewProps {
  conversationId: string;
  showAvatars?: boolean;
  onSendMessage?: (content: string, attachments?: File[]) => void;
  onTypingStart?: () => void;
  onTypingEnd?: () => void;
  encrypted?: boolean;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  conversationId,
  showAvatars = true,
  onSendMessage,
  onTypingStart,
  onTypingEnd,
  encrypted = false
}) => {
  const { 
    messages, 
    sendMessage, 
    isLoading, 
    typingUsers,
    startTyping,
    stopTyping
  } = useChat();
  
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSendMessage = (content: string) => {
    if (onSendMessage) {
      onSendMessage(content, attachments);
    } else {
      sendMessage(conversationId, content, attachments);
    }
    setAttachments([]);
  };

  const handleFileUpload = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files]);
  };

  const handleRemoveFile = (file: File) => {
    setAttachments((prev) => prev.filter((f) => f !== file));
  };

  const handleTypingStart = () => {
    if (onTypingStart) {
      onTypingStart();
    } else {
      startTyping(conversationId);
    }
  };

  const handleTypingEnd = () => {
    if (onTypingEnd) {
      onTypingEnd();
    } else {
      stopTyping(conversationId);
    }
  };

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center">Loading messages...</div>;
  }

  return (
    <div className="flex flex-col h-full">
      <MessageList 
        messages={messages} 
        conversationId={conversationId}
        showAvatars={showAvatars}
        encrypted={encrypted}
      />
      
      {typingUsers.length > 0 && (
        <div className="px-4 py-2">
          <TypingIndicator users={typingUsers} />
        </div>
      )}
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        onTypingStart={handleTypingStart}
        onTypingEnd={handleTypingEnd}
        attachments={attachments}
        onFileUpload={handleFileUpload}
        onRemoveFile={handleRemoveFile}
        encrypted={encrypted}
      />
    </div>
  );
};

export default ConversationView;
