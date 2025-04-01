
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
  onStartConversation?: (message: string) => void;
  workspaceId?: string;
  setActiveView?: (view: View) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({
  onSelectConversation,
  onClose,
  onStartConversation,
  workspaceId,
  setActiveView
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
  ];

  // Combine actual conversations with examples if needed
  const displayConversations = conversations.length > 0 
    ? conversations 
    : exampleConversations;

  // Handle back click differently depending on which component is using this
  const handleBackClick = () => {
    if (setActiveView) {
      setActiveView('home');
    } else {
      onClose();
    }
  };

  return (
    <div 
      className="flex flex-col h-full" 
      style={{ 
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Fixed Header */}
      <div 
        className="flex-shrink-0 border-b" 
        style={{ 
          borderColor: colors.border,
          flexShrink: 0
        }}
      >
        <ChatHeader 
          title={labels.recentMessagesTitle || "Recent Conversations"} 
          onClose={onClose} 
          onBackClick={handleBackClick}
        />
      </div>
      
      {/* Scrollable Content Area */}
      <div 
        className="flex-1 overflow-y-auto" 
        style={{
          flex: '1 1 auto',
          overflowY: 'auto',
          minHeight: 0 // This is crucial for flexbox to allow scrolling
        }}
      >
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
                style={{ 
                  backgroundColor: colors.background, 
                  color: colors.foreground
                }}
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
    </div>
  );
};

export default MessagesView;
