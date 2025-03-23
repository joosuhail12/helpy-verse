
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, MessageSquare } from 'lucide-react';
import { ChatProvider } from '@/context/ChatContext';
import { AblyProvider } from '@/context/AblyContext';
import ChatWidgetContainer from './container/ChatWidgetContainer';

interface ChatWidgetProps {
  workspaceId: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ workspaceId }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <AblyProvider workspaceId={workspaceId}>
      <ChatProvider workspaceId={workspaceId}>
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="mb-3 w-80 sm:w-96 h-[600px] bg-black rounded-xl shadow-2xl overflow-hidden border border-gray-800"
              >
                <ChatWidgetContainer onClose={() => setIsOpen(false)} workspaceId={workspaceId} />
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={toggleWidget}
            className={`${
              isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
            } w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors`}
            aria-label={isOpen ? 'Close chat' : 'Open chat'}
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <MessageSquare className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </ChatProvider>
    </AblyProvider>
  );
};
