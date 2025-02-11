
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ConversationPanelProps } from './types';
import ConversationHeader from './ConversationHeader';
import MessageInput from './MessageInput';
import MessageList from './components/MessageList';
import NoteList from './components/NoteList';
import NoteInput from './components/NoteInput';
import { useConversation } from './hooks/useConversation';
import { useConversationNotes } from './hooks/useConversationNotes';

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
    isSending
  } = useConversation(ticket);

  const {
    notes,
    isLoading: isLoadingNotes,
    isSubmitting: isSubmittingNote,
    addNote
  } = useConversationNotes(ticket.id);

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
      
      <Tabs defaultValue="conversation" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="conversation">Conversation</TabsTrigger>
          <TabsTrigger value="notes">Private Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="conversation" className="flex-1 flex flex-col">
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
        </TabsContent>

        <TabsContent value="notes" className="flex-1 flex flex-col">
          <div className="flex-1 p-4">
            <NoteList 
              notes={notes}
              isLoading={isLoadingNotes}
            />
          </div>
          <div className="p-4 border-t">
            <NoteInput
              ticketId={ticket.id}
              onSubmit={addNote}
              isSubmitting={isSubmittingNote}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConversationPanel;
