
import React, { useState } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { X, MessageSquare, Send, Paperclip, ThumbsUp, Image } from 'lucide-react';
import { ChatMessage } from './types';
import MessageInput from './MessageInput';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const { colors, labels, features } = useThemeContext();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: `${labels.welcomeTitle} ${labels.welcomeSubtitle}`,
      sender: 'agent',
      senderName: 'Support Agent',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: true,
      readBy: ['user1'],
    },
    {
      id: '2',
      content: "Hi there! I need help with my recent order #45872. It's been 3 days and I haven't received a shipping confirmation yet.",
      sender: 'user',
      senderName: 'You',
      timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      read: true,
      readBy: ['agent1'],
    },
    {
      id: '3',
      content: "I'm checking your order status right now. Can you please wait a moment?",
      sender: 'agent',
      senderName: 'Support Agent',
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      read: true,
      readBy: ['user1'],
    },
    {
      id: '4',
      content: "Thank you for your patience. I found your order and it looks like there was a slight delay in processing. I've expedited the shipping and you should receive the tracking information within the next 2 hours. I apologize for the inconvenience.",
      sender: 'agent',
      senderName: 'Support Agent',
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), 
      read: true,
      readBy: ['user1'],
    },
    {
      id: '5',
      content: "That's great, thank you so much for your help!",
      sender: 'user',
      senderName: 'You',
      timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
      read: features.readReceipts,
      readBy: features.readReceipts ? ['agent1'] : [],
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    // Add user message
    const newUserMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: message,
      sender: 'user',
      senderName: 'You',
      timestamp: new Date().toISOString(),
      read: false,
      readBy: [],
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    
    // Simulate agent typing
    setTimeout(() => setIsTyping(true), 500);
    
    // Simulate agent response after delay
    setTimeout(() => {
      setIsTyping(false);
      
      const newAgentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        content: "Thank you for your message. Our team will get back to you as soon as possible. Is there anything else I can help you with today?",
        sender: 'agent',
        senderName: 'Support Agent',
        timestamp: new Date().toISOString(),
        read: false,
        readBy: [],
      };
      
      setMessages(prev => [...prev, newAgentMessage]);
      
      // Mark as read after delay if read receipts enabled
      if (features.readReceipts) {
        setTimeout(() => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === newAgentMessage.id 
                ? { ...msg, read: true, readBy: [...(msg.readBy || []), 'user1'] }
                : msg
            )
          );
        }, 2000);
      }
    }, 3000);
  };
  
  const handleReaction = (messageId: string) => {
    if (!features.reactions) return;
    
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { 
              ...msg, 
              reactions: msg.reactions 
                ? { ...msg.reactions, '👍': [...(msg.reactions['👍'] || []), 'user1'] }
                : { '👍': ['user1'] }
            }
          : msg
      )
    );
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ backgroundColor: colors.primary, color: colors.primaryForeground }}>
        <button onClick={onClose} className="p-1 rounded-full">
          <X className="h-5 w-5" />
        </button>
        <div className="text-center">
          <h3 className="font-medium">Chat with Support</h3>
        </div>
        <div className="w-6" />
      </div>
      
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
                style={
                  message.sender === 'user' 
                    ? { backgroundColor: colors.primary, color: colors.primaryForeground } 
                    : {}
                }
              >
                <div className="mb-1 text-xs opacity-70">
                  {message.senderName} • {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                
                {/* Read receipts */}
                {features.readReceipts && message.sender === 'user' && message.read && (
                  <div className="text-right text-xs mt-1 opacity-70">Read</div>
                )}
                
                {/* Reactions */}
                {features.reactions && message.reactions && Object.keys(message.reactions).length > 0 && (
                  <div className="flex mt-1 gap-1">
                    {Object.entries(message.reactions).map(([emoji, users]) => (
                      <span 
                        key={emoji} 
                        className="bg-gray-100 rounded-full px-2 py-0.5 text-xs"
                      >
                        {emoji} {users.length}
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Reaction button */}
                {features.reactions && message.sender === 'agent' && (
                  <button 
                    onClick={() => handleReaction(message.id)}
                    className="text-xs mt-1 opacity-70 hover:opacity-100"
                  >
                    <ThumbsUp className="h-3 w-3 inline mr-1" />
                    React
                  </button>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && features.typingIndicator && (
            <div className="flex items-center space-x-2 text-gray-500 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce mx-1" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span>Support Agent is typing...</span>
            </div>
          )}
        </div>
      </ScrollArea>
      
      {/* Input */}
      <div className="border-t p-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 border rounded-full px-4 py-2 bg-background flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-transparent focus:outline-none text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
            />
            
            {features.fileAttachments && (
              <button className="p-1 text-gray-500 hover:text-gray-700">
                <Paperclip className="h-5 w-5" />
              </button>
            )}
            
            <button 
              onClick={() => handleSendMessage(inputValue)}
              className="ml-1 p-1.5 rounded-full"
              style={{ backgroundColor: colors.primary, color: colors.primaryForeground }}
              disabled={!inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SampleConversation;
