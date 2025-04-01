
import React, { useEffect } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ChatHeader from '@/components/chat-widget/components/header/ChatHeader';
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

  // For testing - log the height to debug
  useEffect(() => {
    console.log('MessagesView rendered - scrolling should work');
  }, []);

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
    },
    { 
      id: 'conv-5',
      title: 'Conversation 4/1/2025, 7:40:10 PM',
      lastMessage: "You don't have any conversations yet",
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    },
    { 
      id: 'conv-6',
      title: 'Conversation 4/1/2025, 7:45:22 PM',
      lastMessage: "You don't have any conversations yet",
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    },
    { 
      id: 'conv-7',
      title: 'Conversation 4/1/2025, 7:50:30 PM',
      lastMessage: "You don't have any conversations yet",
      lastMessageTimestamp: new Date().toISOString(),
      unreadCount: 0
    },
  ];

  // Combine actual conversations with examples if needed
  const displayConversations = conversations.length > 0 
    ? conversations 
    : exampleConversations;

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header - using flex-shrink-0 to prevent it from shrinking */}
      <div className="flex-shrink-0 border-b" style={{ borderColor: colors.border }}>
        <ChatHeader 
          title={labels.recentMessagesTitle || "Recent Conversations"} 
          onClose={onClose} 
          onBackClick={onClose}
        />
      </div>
      
      {/* Scrollable Content Area - using flex-1 to take up all available space */}
      <div className="flex-1 overflow-y-auto">
        {displayConversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {labels.noMessagesText || "You don't have any conversations yet"}
          </div>
        ) : (
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
        )}
      </div>
      
      {/* Fixed Navigation - using flex-shrink-0 to prevent it from shrinking */}
      <div className="flex-shrink-0 border-t" style={{ borderColor: colors.border }}>
        <Navigation activeView="messages" setActiveView={() => {}} />
      </div>
    </div>
  );
};

export default MessagesView;
