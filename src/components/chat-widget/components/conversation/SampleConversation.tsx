
import React from 'react';
import { X } from 'lucide-react';
import { formatDistance } from 'date-fns';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserAvatar from '../user/UserAvatar';
import { useThemeContext } from '@/context/ThemeContext';
import { ChatMessage } from './types';

// Define a sample conversation for the preview
const createSampleMessages = () => {
  const now = new Date();
  const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60000);
  
  return [
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      sender: 'agent',
      senderName: 'Support Agent',
      timestamp: tenMinutesAgo.toISOString(),
      readBy: ['user-1'],
      reactions: {},
      conversationId: 'sample-conversation'
    },
    {
      id: '2',
      content: 'I have a question about my recent order. It shows as shipped but I haven\'t received a tracking number yet.',
      sender: 'user',
      senderName: 'You',
      timestamp: fiveMinutesAgo.toISOString(),
      readBy: [],
      reactions: {},
      conversationId: 'sample-conversation'
    },
    {
      id: '3',
      content: 'I\'m sorry to hear that. Let me check the status of your order right away. Could you please provide your order number?',
      sender: 'agent',
      senderName: 'Support Agent',
      timestamp: fiveMinutesAgo.toISOString(),
      readBy: ['user-1'],
      reactions: {},
      conversationId: 'sample-conversation'
    }
  ] as ChatMessage[];
};

interface SampleConversationProps {
  onClose: () => void;
  position?: 'left' | 'right';
  compact?: boolean;
  headerTitle?: string;
  headerColor?: string;
}

const SampleConversation: React.FC<SampleConversationProps> = ({ 
  onClose, 
  position = 'right',
  compact = false,
  headerTitle = 'Chat with us',
  headerColor
}) => {
  const { colors, features } = useThemeContext();
  const sampleMessages = createSampleMessages();
  
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 flex justify-between items-center" 
        style={{ backgroundColor: headerColor || colors.primary, color: '#ffffff' }}>
        <div className="flex items-center">
          <UserAvatar
            name="Support Team"
            avatarUrl="https://i.pravatar.cc/150?img=32"
            size="sm"
          />
          <div className="ml-2">
            <h3 className="font-medium text-sm">{headerTitle}</h3>
            <p className="text-xs opacity-90">Online now</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="text-white p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Close conversation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4">
        <MessageList
          messages={sampleMessages}
          conversationId="sample-conversation"
        />
      </div>
      
      {/* Input */}
      <div className="border-t border-gray-200 px-4 py-2">
        <MessageInput 
          onSendMessage={() => {}} 
          disabled={false} 
          placeholder="Type a message..." 
        />
      </div>
    </div>
  );
};

export default SampleConversation;
