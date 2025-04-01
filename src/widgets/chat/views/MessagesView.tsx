
import React, { useEffect } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ChatHeader from '@/components/chat-widget/components/header/ChatHeader';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User, Clock, ArrowRight, SendIcon, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MessagesViewProps {
  onClose: () => void;
  onSelectConversation: () => void;
  onStartConversation: (message: string) => void;
}

const MessagesView: React.FC<MessagesViewProps> = ({
  onClose,
  onSelectConversation,
  onStartConversation
}) => {
  const { conversations, selectConversation } = useChat();
  const { labels, colors } = useThemeContext();

  // Load conversations data when component mounts
  useEffect(() => {
    // This would typically fetch conversations from an API
    // For now we're using the mock data from the useChat hook
  }, []);

  const handleStartNewConversation = () => {
    // Navigate to the conversation view with an empty message to start a new chat
    onStartConversation('');
    onSelectConversation();
  };

  const handleConversationSelect = (conversationId: string) => {
    selectConversation(conversationId);
    onSelectConversation();
  };

  // Format timestamp to readable format
  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return '';
    try {
      // For the UI, display in a user-friendly format matching the screenshot
      const date = new Date(timestamp);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch (e) {
      return timestamp;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader 
        title="Recent Conversations" 
        onClose={onClose} 
        onBackClick={() => onClose()} 
        className="sticky top-0 z-10 bg-white"
      />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1">
          <div className="divide-y">
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
                    {conversation.title || `Conversation ${formatTimestamp(conversation.lastMessageTimestamp)}`}
                  </div>
                  <div className="text-sm text-gray-500">
                    You don't have any conversations yet
                  </div>
                </button>
              ))
            )}
            
            {/* Add empty mock conversations that match the screenshot */}
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
      
      {/* Fixed bottom navigation */}
      <div className="mt-auto">
        <Navigation />
      </div>
    </div>
  );
};

// Simple Navigation component to match the screenshot
const Navigation = () => {
  return (
    <div className="sticky bottom-0 flex justify-center items-center p-4 border-t bg-white">
      <div className="h-1.5 w-6 bg-gray-300 rounded-full"></div>
    </div>
  );
};

export default MessagesView;
