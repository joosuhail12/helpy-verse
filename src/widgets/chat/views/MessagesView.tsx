
import React, { useEffect } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ChatHeader from '@/components/chat-widget/components/header/ChatHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { View } from '../types';
import Navigation from '../components/navigation/Navigation';
import { Conversation } from '../types/messages';

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

  // Examples for the UI to match the screenshot
  const exampleConversations: Conversation[] = [
    { 
      id: 'new-1',
      title: 'New question',
      lastMessage: "You don't have any conversations yet",
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    },
    { 
      id: 'new-2',
      title: 'New question',
      lastMessage: "You don't have any conversations yet",
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    },
    { 
      id: 'conv-1',
      title: 'Conversation 4/1/2025, 7:10:14 PM',
      lastMessage: "You don't have any conversations yet",
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    },
    { 
      id: 'conv-2',
      title: 'Conversation 4/1/2025, 7:26:38 PM',
      lastMessage: "You don't have any conversations yet",
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    },
    { 
      id: 'conv-3',
      title: 'Conversation 4/1/2025, 7:30:00 PM',
      lastMessage: "You don't have any conversations yet",
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    },
    { 
      id: 'conv-4',
      title: 'Conversation 4/1/2025, 7:36:08 PM',
      lastMessage: "You don't have any conversations yet",
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    }
  ];

  // Combine actual conversations with examples if needed
  const displayConversations = conversations.length > 0 
    ? conversations 
    : exampleConversations;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b" style={{ borderColor: colors.border }}>
        <ChatHeader 
          title="Recent Conversations" 
          onClose={onClose} 
          onBackClick={onClose}
        />
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="divide-y" style={{ borderColor: colors.border }}>
          {displayConversations.map(conversation => (
            <button
              key={conversation.id}
              className="w-full px-4 py-3 flex flex-col items-start text-left hover:bg-gray-50 transition-colors"
              onClick={() => handleConversationSelect(conversation.id)}
            >
              <div className="text-base font-medium">
                {conversation.title}
              </div>
              <div className="text-sm text-gray-500">
                {conversation.lastMessage}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Fixed Navigation */}
      <div className="flex-shrink-0 mt-auto border-t" style={{ borderColor: colors.border }}>
        <Navigation activeView="messages" setActiveView={() => {}} />
      </div>
    </div>
  );
};

export default MessagesView;
