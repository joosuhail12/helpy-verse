
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { ConversationPanelProps } from './types';
import ConversationHeader from './ConversationHeader';
import MessageInput from './MessageInput';
import MessageList from './components/MessageList';
import CustomerContextPanel from './CustomerContextPanel';
import { useConversation } from './hooks/useConversation';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from "@/lib/utils";
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';

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
  
  const isMobile = useIsMobile();

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    } else {
      handleTyping();
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-none">
        <ConversationHeader 
          ticket={ticket} 
          onClose={onClose} 
          activeUsers={activeUsers}
        />
      </div>
      
      {isMobile ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto">
            <MessageList
              messages={messages}
              typingUsers={typingUsers}
              ticket={ticket}
              onReply={setNewMessage}
              isLoading={isLoading}
            />
          </div>

          <div className="flex-none">
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
        </div>
      ) : (
        <ResizablePanelGroup 
          direction="horizontal" 
          className="flex-1 transition-all duration-300 ease-in-out"
        >
          <ResizablePanel defaultSize={70} minSize={40} className="flex flex-col overflow-hidden">
            {error ? (
              <Alert variant="destructive" className="m-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error.toString()}
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

            <div className="flex-none">
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
          </ResizablePanel>

          <ResizableHandle withHandle className="transition-opacity duration-300 hover:opacity-100 opacity-40" />
          
          <ResizablePanel defaultSize={30} minSize={20}>
            <CustomerContextPanel ticket={ticket} />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
};

export default ConversationPanel;
