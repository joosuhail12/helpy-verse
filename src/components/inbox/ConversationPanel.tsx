
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { ConversationPanelProps } from './types';
import ConversationHeader from './ConversationHeader';
import MessageInput from './MessageInput';
import MessageList from './components/MessageList';
import { useConversation } from './hooks/useConversation';
import { cn } from "@/lib/utils";

const ConversationPanel = ({ ticket, onClose }: ConversationPanelProps) => {
  const {
    messages,
    newMessage,
    setNewMessage,
    typingUsers,
    activeUsers,
    handleSendMessage,
    handleTyping,
    isLoading,
    error,
    isSending,
    isInternalNote,
    setIsInternalNote
  } = useConversation(ticket);

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      handleTyping();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <ConversationHeader 
        ticket={ticket} 
        onClose={onClose} 
        activeUsers={activeUsers}
      />
      
      {error ? (
        <Alert variant="destructive" className="m-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      ) : (
        <MessageList
          messages={messages}
          typingUsers={typingUsers}
          ticket={ticket}
          onReply={setNewMessage}
          isLoading={isLoading}
        />
      )}

      <MessageInput
        newMessage={newMessage}
        onMessageChange={setNewMessage}
        onKeyPress={handleKeyPress}
        onSendMessage={handleSendMessage}
        ticket={ticket}
        isSending={isSending}
        disabled={!!error}
      />
    </div>
  );
};

export default ConversationPanel;
