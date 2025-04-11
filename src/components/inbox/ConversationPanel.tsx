import React, { useEffect } from 'react';
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
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const ConversationPanel = ({ ticket, onClose }: ConversationPanelProps) => {
  const currentTicket = useSelector((state: RootState) => state.tickets.currentTicket);

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
    setIsInternalNote,
    setMessages
  } = useConversation(ticket);

  // Use the conversation from the currentTicket if available
  const conversationMessages = currentTicket?.conversation || [];
  console.log('conversationMessages', conversationMessages, currentTicket);
  useEffect(() => {
    setMessages(conversationMessages);
  }, [conversationMessages]);
  const handleKeyPress = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log("Key press in ConversationPanel:", e.key);

    if (e.key === 'Enter' && !e.shiftKey) {
      console.log("Enter key pressed without shift - attempting to send message");
      e.preventDefault();

      // Debug message content
      console.log("Message content before sending:", newMessage);

      if (!newMessage || newMessage.trim() === '' || newMessage === '<p></p>') {
        console.log("Message is empty, not sending");
        return;
      }

      // Call the send message function
      await handleSendMessageWrapper();
    } else if (e.key !== 'Enter' && typeof handleTyping === 'function') {
      try {
        await handleTyping();
      } catch (err) {
        console.error('Error handling typing indicator:', err);
      }
    }
  };

  const handleSendMessageWrapper = async () => {
    console.log("Send button clicked in ConversationPanel");
    console.log("Current message content:", newMessage);

    try {
      await handleSendMessage();
    } catch (error) {
      console.error("Error in ConversationPanel handleSendMessage:", error);
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
            messages={messages ?? []}
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
          onSendMessage={handleSendMessageWrapper}
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
