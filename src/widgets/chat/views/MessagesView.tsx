
import React, { useEffect } from 'react';
import { useChat } from '@/hooks/chat/useChat';
import { useThemeContext } from '@/context/ThemeContext';
import ChatHeader from '@/components/chat-widget/components/header/ChatHeader';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User, Clock, ArrowRight, SendIcon, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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

  // Format timestamp to relative time
  const formatTimestamp = (timestamp: string | Date | undefined) => {
    if (!timestamp) return '';
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } }
  };

  return (
    <div className="flex flex-col h-full bg-background" style={{ backgroundColor: colors.background }}>
      <ChatHeader 
        title={labels?.recentMessagesTitle || "Recent Conversations"} 
        onClose={onClose} 
        onBackClick={() => onClose()} 
      />
      
      <div className="flex-1 overflow-hidden flex flex-col p-4">
        {conversations.length === 0 ? (
          <motion.div 
            className="flex-1 flex flex-col items-center justify-center text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 p-4 bg-primary/10 rounded-full">
              <MessageSquare size={28} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
            <p className="text-muted-foreground mb-6 max-w-xs">
              {labels?.noMessagesText || "Start your first conversation to get help"}
            </p>
            
            <Button 
              onClick={handleStartNewConversation}
              className="px-6 py-5 font-medium flex items-center gap-2"
              size="lg"
            >
              <PlusCircle size={18} />
              Start a conversation
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="flex-1 overflow-y-auto space-y-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {conversations.map(conversation => (
              <motion.div
                key={conversation.id}
                variants={itemVariants}
                className="bg-card hover:bg-accent/20 rounded-lg transition-colors duration-200 shadow-sm"
              >
                <button
                  className="w-full px-4 py-4 flex items-start text-left"
                  onClick={() => handleConversationSelect(conversation.id)}
                >
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={18} className="text-primary" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium truncate" style={{ color: colors.foreground }}>
                        {conversation.title || "New Conversation"}
                      </h3>
                      <span className="text-xs text-gray-400 flex items-center ml-2 whitespace-nowrap">
                        <Clock size={12} className="mr-1" />
                        {formatTimestamp(conversation.lastMessageTimestamp)}
                      </span>
                    </div>
                    <p className="text-sm truncate mt-1 text-muted-foreground">
                      {conversation.lastMessage || "No messages yet"}
                    </p>
                    <div className="mt-2 flex justify-between items-center">
                      {conversation.unreadCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-0.5 font-medium">
                          {conversation.unreadCount}
                        </span>
                      )}
                      <span className="text-primary text-xs flex items-center ml-auto">
                        View <ArrowRight size={12} className="ml-1" />
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        {/* Button at the bottom to start a new conversation when there are existing ones */}
        {conversations.length > 0 && (
          <div className="pt-4 mt-auto">
            <Button
              onClick={handleStartNewConversation}
              className="w-full py-5 font-medium"
              variant="outline"
              size="lg"
            >
              <PlusCircle size={18} className="mr-2" />
              Start new conversation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesView;
