
import React, { useState } from 'react';
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
  onChangeView?: (view: 'home' | 'messages' | 'conversation') => void;
  currentView?: 'home' | 'messages' | 'conversation';
  userMessageColor?: string;
  agentMessageColor?: string;
  messageBoxColor?: string;
}

const SampleConversation: React.FC<SampleConversationProps> = ({ 
  onClose, 
  position = 'right',
  compact = false,
  headerTitle = 'Chat with us',
  headerColor,
  onChangeView,
  currentView = 'conversation',
  userMessageColor,
  agentMessageColor,
  messageBoxColor
}) => {
  const { colors, features } = useThemeContext();
  const [sampleMessages, setSampleMessages] = useState(createSampleMessages());
  const [newMessage, setNewMessage] = useState('');
  
  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      senderName: 'You',
      timestamp: new Date().toISOString(),
      readBy: [],
      reactions: {},
      conversationId: 'sample-conversation'
    };
    
    setSampleMessages([...sampleMessages, userMessage]);
    setNewMessage('');
    
    // Simulate agent response after a delay
    setTimeout(() => {
      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        content: `Thanks for your message. This is a sample response to: "${content}"`,
        sender: 'agent',
        senderName: 'Support Agent',
        timestamp: new Date().toISOString(),
        readBy: ['user-1'],
        reactions: {},
        conversationId: 'sample-conversation'
      };
      
      setSampleMessages(prev => [...prev, agentMessage]);
    }, 1500);
  };
  
  // Render the appropriate view based on the currentView prop
  if (currentView === 'home' && onChangeView) {
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
        
        {/* Home View Content */}
        <div className="flex-1 overflow-y-auto px-4 pt-6 pb-4">
          <div className="bg-gray-100 w-10 h-10 rounded-md flex items-center justify-center mb-4">
            <svg viewBox="0 0 24 24" width="22" height="22" fill={colors.foreground}>
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="2" />
              <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
              <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <h1 className="text-2xl text-gray-500 font-light mb-1">Hello there.</h1>
          <h2 className="text-3xl font-medium mb-6">How can we help?</h2>
          
          <div className="space-y-4">
            <button 
              onClick={() => onChangeView('conversation')}
              className="bg-white rounded-xl p-4 w-full flex items-center justify-between hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm"
            >
              <span className="font-medium">Ask a question</span>
              <div className="flex items-center">
                <div className="bg-gray-100 rounded-md p-1 mr-1">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill={colors.foreground}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="8" y1="7" x2="16" y2="7" stroke="currentColor" strokeWidth="2" />
                    <line x1="8" y1="12" x2="16" y2="12" stroke="currentColor" strokeWidth="2" />
                    <line x1="8" y1="17" x2="16" y2="17" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <svg viewBox="0 0 24 24" width="18" height="18" className="text-gray-400">
                  <path fill="currentColor" d="M9.4 18L8 16.6l4.6-4.6L8 7.4 9.4 6l6 6-6 6z" />
                </svg>
              </div>
            </button>
            
            <button 
              onClick={() => onChangeView('messages')}
              className="bg-white rounded-xl p-4 w-full flex items-center justify-between hover:bg-gray-50 transition-colors border border-gray-100 shadow-sm"
            >
              <span className="font-medium">Recent messages</span>
              <svg viewBox="0 0 24 24" width="18" height="18" className="text-gray-400">
                <path fill="currentColor" d="M9.4 18L8 16.6l4.6-4.6L8 7.4 9.4 6l6 6-6 6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (currentView === 'messages' && onChangeView) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="px-4 py-3 flex justify-between items-center" 
          style={{ backgroundColor: headerColor || colors.primary, color: '#ffffff' }}>
          <div className="flex items-center">
            <button 
              onClick={() => onChangeView('home')}
              className="mr-2 text-white p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Back to home"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div>
              <h3 className="font-medium text-sm">Recent Messages</h3>
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
        
        {/* Messages List View */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 border-b">
            <button 
              onClick={() => onChangeView('conversation')}
              className="w-full px-4 py-3 flex items-start hover:bg-gray-50 transition-colors text-left border border-gray-100 rounded-lg"
            >
              <div>
                <h3 className="font-medium">Support Conversation</h3>
                <p className="text-sm text-gray-500 truncate">
                  I'm sorry to hear that. Let me check the status...
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistance(new Date(sampleMessages[sampleMessages.length - 1].timestamp), new Date(), { addSuffix: true })}
                </p>
              </div>
            </button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-gray-500 mb-4">Start a new conversation</p>
            <button
              onClick={() => onChangeView('conversation')}
              className="px-4 py-2 bg-gray-100 rounded-lg text-gray-800 hover:bg-gray-200 transition-colors"
            >
              New Conversation
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Default conversation view
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 flex justify-between items-center" 
        style={{ backgroundColor: headerColor || colors.primary, color: '#ffffff' }}>
        <div className="flex items-center">
          {onChangeView && (
            <button 
              onClick={() => onChangeView('messages')}
              className="mr-2 text-white p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Back to messages"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
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
      <div className="border-t border-gray-200 px-4 py-2" style={{ backgroundColor: messageBoxColor || colors.inputBackground }}>
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={false} 
          placeholder="Type a message..." 
          value={newMessage}
          onChange={setNewMessage}
        />
      </div>
    </div>
  );
};

export default SampleConversation;
