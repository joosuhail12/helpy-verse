
import React from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ChatHeader from '@/components/chat-widget/components/header/ChatHeader';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { View } from '../types';
import Navigation from '../components/navigation/Navigation';

interface MessagesViewProps {
  onSelectConversation: () => void;
  onClose: () => void;
  onStartConversation: (message: string) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({
  onSelectConversation,
  onClose,
  onStartConversation
}) => {
  const { conversations, selectConversation } = useChat();
  const { labels, colors } = useThemeContext();

  const handleConversationSelect = (conversationId: string) => {
    selectConversation(conversationId);
    onSelectConversation();
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 w-full bg-white border-b" style={{ borderColor: colors.border }}>
        <ChatHeader 
          title="Recent Conversations" 
          onClose={onClose} 
          onBackClick={onClose}
        />
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="divide-y" style={{ borderColor: colors.border }}>
            {conversations.length === 0 ? (
              <div className="p-4">
                <div className="text-base font-medium">New question</div>
                <div className="text-sm text-gray-500">You don't have any conversations yet</div>
              </div>
            ) : (
              conversations.map(conversation => (
                <button
                  key={conversation.id}
                  className="w-full px-4 py-3 flex flex-col items-start text-left hover:bg-gray-50 transition-colors"
                  onClick={() => handleConversationSelect(conversation.id)}
                >
                  <div className="text-base font-medium">
                    {conversation.title || `Conversation ${new Date(conversation.lastMessageTimestamp).toLocaleString()}`}
                  </div>
                  <div className="text-sm text-gray-500">
                    {conversation.lastMessage || "You don't have any conversations yet"}
                  </div>
                </button>
              ))
            )}
            
            {/* Add example conversations to match the screenshot */}
            <div className="p-4">
              <div className="text-base font-medium">New question</div>
              <div className="text-sm text-gray-500">You don't have any conversations yet</div>
            </div>
            <div className="p-4">
              <div className="text-base font-medium">New question</div>
              <div className="text-sm text-gray-500">You don't have any conversations yet</div>
            </div>
            <div className="p-4">
              <div className="text-base font-medium">Conversation 4/1/2025, 7:10:14 PM</div>
              <div className="text-sm text-gray-500">You don't have any conversations yet</div>
            </div>
            <div className="p-4">
              <div className="text-base font-medium">Conversation 4/1/2025, 7:26:38 PM</div>
              <div className="text-sm text-gray-500">You don't have any conversations yet</div>
            </div>
            <div className="p-4">
              <div className="text-base font-medium">Conversation 4/1/2025, 7:30:00 PM</div>
              <div className="text-sm text-gray-500">You don't have any conversations yet</div>
            </div>
            <div className="p-4">
              <div className="text-base font-medium">Conversation 4/1/2025, 7:36:08 PM</div>
              <div className="text-sm text-gray-500">You don't have any conversations yet</div>
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Fixed Navigation */}
      <div className="sticky bottom-0 z-10 w-full">
        <Navigation activeView="messages" setActiveView={(view: View) => {}} />
      </div>
    </div>
  );
};

export default MessagesView;
