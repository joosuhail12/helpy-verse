
import React from 'react';
import { X } from 'lucide-react';
import { useThemeContext } from '@/context/ThemeContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { ChatMessage } from './types';

interface SampleConversationProps {
  onClose: () => void;
  position?: 'left' | 'right';
  compact?: boolean;
}

const SampleConversation: React.FC<SampleConversationProps> = ({ 
  onClose, 
  position = 'right',
  compact = false 
}) => {
  const { colors, labels } = useThemeContext();
  
  // Sample messages for preview - explicitly typed as ChatMessage[]
  const sampleMessages: ChatMessage[] = [
    {
      id: '1',
      content: 'Hi there! How can I help you today?',
      sender: 'agent', // Now explicitly using the literal type
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: 'delivered',
      attachments: [],
    },
    {
      id: '2',
      content: 'I have a question about my subscription.',
      sender: 'user', // Now explicitly using the literal type
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      status: 'delivered',
      attachments: [],
    },
    {
      id: '3',
      content: 'Sure, I\'d be happy to help with that. Could you please provide your account number?',
      sender: 'agent', // Now explicitly using the literal type
      timestamp: new Date(Date.now() - 3400000).toISOString(),
      status: 'delivered',
      attachments: [],
    }
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div 
        className="p-4 flex items-center justify-between" 
        style={{ backgroundColor: colors.primary, color: colors.primaryForeground }}
      >
        <div>
          <h3 className="font-semibold text-lg">{labels?.welcomeTitle || 'Hello there.'}</h3>
          <p className="text-sm opacity-90">{labels?.welcomeSubtitle || 'How can we help?'}</p>
        </div>
        <button
          onClick={onClose}
          className="text-current p-1 rounded-full hover:bg-black/10"
          aria-label="Close chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <MessageList 
          messages={sampleMessages} 
          isLoading={false} 
          conversationId="sample"
          showReadReceipts={true}
        />
      </div>
      
      {/* Message Input */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <MessageInput
          onSendMessage={() => {}}
          onTyping={() => {}}
          disabled={false}
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
};

export default SampleConversation;
