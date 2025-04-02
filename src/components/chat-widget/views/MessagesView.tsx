
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ConversationView from '../components/conversation/ConversationView';
import { View } from '../container/ChatWidgetContainer';

interface MessagesViewProps {
  workspaceId: string;
  onClose: () => void;
  setActiveView: (view: View) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({ workspaceId, onClose, setActiveView }) => {
  const { conversations, currentConversation, selectConversation, createNewConversation } = useChat();
  const { colors } = useThemeContext();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);

  // Reset selected conversation when viewing messages page
  useEffect(() => {
    setSelectedConversation(null);
  }, []);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    selectConversation(conversationId);
    setActiveView('conversation');
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {!selectedConversation ? (
        <>
          {/* Header */}
          <div className="border-b p-4" style={{ borderColor: colors.border }}>
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>

          {/* Conversation list */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <p className="text-gray-400">No messages yet</p>
                <button 
                  className="mt-4 px-4 py-2 rounded-md"
                  style={{ backgroundColor: colors.primary, color: colors.primaryForeground }}
                  onClick={() => {
                    createNewConversation("New conversation").then(id => {
                      selectConversation(id);
                      setActiveView('conversation');
                    });
                  }}
                >
                  Start a conversation
                </button>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: colors.border }}>
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className="w-full px-4 py-3 flex items-start hover:bg-gray-50 transition-colors"
                    onClick={() => handleSelectConversation(conversation.id)}
                  >
                    <div 
                      className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0"
                      style={{ backgroundColor: colors.border }}
                    >
                      <svg viewBox="0 0 24 24" width="20" height="20" fill={colors.foreground}>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="2" />
                        <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
                        <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    <div className="text-left flex-grow">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{conversation.title || "New conversation"}</h3>
                        <span className="text-xs text-gray-500">{formatDate(conversation.lastMessageTimestamp)}</span>
                      </div>
                      <p className="text-gray-500 text-sm truncate mt-1">
                        {conversation.lastMessage || "No messages yet"}
                      </p>
                    </div>
                    {conversation.unreadCount ? (
                      <div 
                        className="ml-2 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                        style={{ 
                          backgroundColor: colors.primary, 
                          color: colors.primaryForeground 
                        }}
                      >
                        {conversation.unreadCount}
                      </div>
                    ) : null}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col h-full">
          {/* Conversation header */}
          <div className="border-b p-3 flex items-center" style={{ borderColor: colors.border }}>
            <button 
              onClick={handleBackToList}
              className="p-1 mr-2 rounded-full hover:bg-gray-100 transition-colors"
              style={{ backgroundColor: 'transparent' }}
            >
              <ChevronLeft size={20} />
            </button>
            <h2 className="font-medium truncate">
              {conversations.find(c => c.id === selectedConversation)?.title || "Conversation"}
            </h2>
          </div>
          
          {/* Conversation content */}
          <div className="flex-1 overflow-hidden">
            <ConversationView 
              conversationId={selectedConversation} 
              workspaceId={workspaceId}
              onBack={handleBackToList}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesView;
