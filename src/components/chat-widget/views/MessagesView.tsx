
import React, { useState, memo, useMemo } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ChatHeader from '../components/header/ChatHeader';
import EnhancedConversationView from '../components/conversation/EnhancedConversationView';
import { useStableCallback } from '@/utils/performance/reactOptimizations';
import { useRenderTime } from '@/hooks/usePerformanceOptimization';

interface MessagesViewProps {
  workspaceId: string;
  onClose: () => void;
  setActiveView: (view: 'home' | 'messages' | 'conversation') => void;
  onStartConversation?: (message: string) => Promise<void>;
}

// Create a memoized version of EnhancedConversationView
const MemoizedEnhancedConversationView = memo(EnhancedConversationView);

const MessagesView: React.FC<MessagesViewProps> = ({ 
  workspaceId, 
  onClose, 
  setActiveView,
  onStartConversation
}) => {
  // Track render time in development
  useRenderTime('MessagesView');
  
  const { conversations, currentConversation, selectConversation } = useChat();
  const { labels, colors } = useThemeContext();
  const [messages, setMessages] = useState<any[]>([]);

  // Optimize the send message handler with useStableCallback
  const handleSendMessage = useStableCallback(async (content: string) => {
    if (!currentConversation && onStartConversation) {
      // If no active conversation, start one
      await onStartConversation(content);
      
      // Add user message to UI immediately for better UX
      const newMessage = {
        id: crypto.randomUUID(),
        sender: 'user',
        content,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Set active view to conversation (will be handled by the parent)
      setActiveView('conversation');
    } else if (currentConversation) {
      // If we have a conversation, view should change to that conversation
      setActiveView('conversation');
    }
  }, [currentConversation, onStartConversation, setActiveView]);

  // Optimize conversation selection with useStableCallback
  const handleConversationSelect = useStableCallback((conversationId: string) => {
    selectConversation(conversationId);
    setActiveView('conversation');
  }, [selectConversation, setActiveView]);

  // Memoize the empty state conditional rendering
  const isEmptyState = useMemo(() => conversations.length === 0, [conversations.length]);
  
  // Memoize conversation button style
  const conversationButtonStyle = useMemo(() => ({ 
    backgroundColor: colors.background, 
    color: colors.foreground,
    borderColor: colors.border 
  }), [colors.background, colors.foreground, colors.border]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader 
        title={labels.recentMessagesTitle} 
        onClose={onClose} 
        onBackClick={() => setActiveView('home')}
      />
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {isEmptyState ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-gray-500">{labels.noMessagesText}</p>
            <MemoizedEnhancedConversationView
              messages={[]}
              onSendMessage={handleSendMessage}
              disabled={false}
              hasActiveConversation={false}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100" style={{ borderColor: colors.border }}>
            {conversations.map(conversation => (
              <button
                key={conversation.id}
                className="w-full px-4 py-3 flex items-start hover:bg-gray-50 transition-colors text-left"
                onClick={() => handleConversationSelect(conversation.id)}
                style={conversationButtonStyle}
              >
                <div>
                  <h3 className="font-medium">{conversation.title}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {/* Conversation preview would go here */}
                    {labels.noMessagesText}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(MessagesView);
