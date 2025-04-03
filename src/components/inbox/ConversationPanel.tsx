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
import AblyConnectionTest from '@/components/AblyConnectionTest';
import { MessagesSquare } from "lucide-react";

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
      await handleSendMessage();
    } else {
      if (typeof handleTyping === 'function') {
        try {
          await handleTyping();
        } catch (err) {
          console.error('Error handling typing indicator:', err);
        }
      }
    }
  };

  return (
    <div className="h-full flex">
      <div className="flex-1 flex flex-col bg-white">
        <ConversationHeader
          ticket={ticket}
          onClose={onClose}
          activeUsers={activeUsers}
        />

        {error ? (
          <div className="m-4 space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>

            <AblyConnectionTest />
          </div>
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
          isInternalNote={isInternalNote}
          setIsInternalNote={setIsInternalNote}
          disabled={isLoading}
          handleTyping={handleTyping}
        />
      </div>

      <div className="w-80 border-l">
        <CustomerContextPanel ticket={ticket} />
      </div>
    </div>
  );
};

export default ConversationPanel;
