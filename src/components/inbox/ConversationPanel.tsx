
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { ConversationPanelProps } from './types';
import ConversationHeader from './ConversationHeader';
import MessageInput from './MessageInput';
import MessageList from './components/MessageList';
import CustomerContextPanel from './CustomerContextPanel';
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
    <div className="h-full flex flex-col overflow-hidden">
      <ConversationHeader 
        ticket={ticket} 
        onClose={onClose} 
        activeUsers={activeUsers}
      />
      
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {error ? (
            <Alert variant="destructive" className="m-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex-1 overflow-auto">
              <MessageList
                messages={messages}
                typingUsers={typingUsers}
                ticket={ticket}
                onReply={setNewMessage}
                isLoading={isLoading}
              />
            </div>
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
        
        <div className="w-80 border-l hidden lg:block">
          <CustomerContextPanel ticket={ticket} />
        </div>
      </div>
    </div>
  );
};

export default ConversationPanel;
