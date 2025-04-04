
import React from 'react';
import { ChatMessage, TypingUser } from './types';
import { useThemeContext } from '@/context/ThemeContext';
import { Loader2 } from 'lucide-react';
import MessageItem from './MessageItem';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageListProps {
  messages: ChatMessage[];
  typingUsers?: TypingUser[];
  isLoading?: boolean;
  showAvatars?: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  typingUsers = [], 
  isLoading = false,
  showAvatars = false
}) => {
  const { colors } = useThemeContext();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-full text-gray-400 space-y-4 p-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <div className="w-8 h-8 bg-primary/40 rounded-lg"></div>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-700 mb-1">No messages yet</h3>
          <p className="text-sm">Start a conversation to get help</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <MessageItem 
              message={message} 
              showAvatar={showAvatars}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {typingUsers.length > 0 && (
        <motion.div 
          className="flex items-center text-gray-500 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex space-x-1 mr-2">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          {typingUsers.length === 1 
            ? `${typingUsers[0].name || 'Someone'} is typing...` 
            : `${typingUsers.length} people are typing...`}
        </motion.div>
      )}
    </div>
  );
};

export default MessageList;
