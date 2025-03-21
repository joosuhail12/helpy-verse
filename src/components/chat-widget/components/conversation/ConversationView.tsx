
import React, { useState, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

interface ConversationViewProps {
  conversationId: string;
}

/**
 * Detailed view of a conversation with message history and reply functionality
 */
const ConversationView = ({ conversationId }: ConversationViewProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchConversation = async () => {
      setLoading(true);
      try {
        // Mock data - in real implementation fetch from backend
        setTimeout(() => {
          const mockMessages: Message[] = [
            {
              id: '1',
              text: 'Hello, I need help with my account settings',
              sender: 'user',
              timestamp: '10:30 AM'
            },
            {
              id: '2',
              text: 'Hi there! I\'d be happy to help you with your account settings. What specific issue are you experiencing?',
              sender: 'agent',
              timestamp: '10:32 AM'
            },
            {
              id: '3',
              text: 'I cannot update my payment method',
              sender: 'user',
              timestamp: '10:33 AM'
            },
            {
              id: '4',
              text: 'I understand that can be frustrating. Let me walk you through the process. First, please navigate to the Account Settings page by clicking on your profile icon in the top right corner.',
              sender: 'agent',
              timestamp: '10:35 AM'
            }
          ];

          setMessages(mockMessages);
          setLoading(false);
        }, 700);
        
      } catch (error) {
        console.error('Error fetching conversation:', error);
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || sending) return;
    
    setSending(true);
    
    try {
      // Add user message immediately to the UI
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      
      // In a real implementation, we would send to backend/Ably here
      console.log('Sending message in conversation:', conversationId, newMessage);
      
      // Simulate agent response after a delay
      setTimeout(() => {
        const agentMessage: Message = {
          id: `msg-${Date.now()}-response`,
          text: 'Thank you for your message. Our team will get back to you shortly.',
          sender: 'agent',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setMessages(prev => [...prev, agentMessage]);
        setSending(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4 bg-gray-50 space-y-4 flex flex-col justify-center items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 text-sm">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-4 bg-gray-50 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`max-w-3/4 ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
          >
            <div 
              className={`p-3 rounded-lg ${
                message.sender === 'user' 
                  ? 'bg-primary text-white rounded-tr-none'
                  : 'bg-white border border-gray-200 rounded-tl-none'
              }`}
            >
              <p className="text-sm">{message.text}</p>
            </div>
            <div className={`text-xs mt-1 text-gray-500 ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}>
              {message.timestamp}
            </div>
          </div>
        ))}
        
        {sending && (
          <div className="flex items-center gap-2 text-gray-500">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
          </div>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-100 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button 
            type="button"
            className="text-gray-400 hover:text-gray-600"
            aria-label="Attach file"
          >
            <Paperclip className="h-5 w-5" />
          </button>
          
          <input 
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-200 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/30"
            disabled={sending}
          />
          
          <button
            type="submit"
            className="text-primary hover:text-primary/80 disabled:text-gray-400"
            disabled={!newMessage.trim() || sending}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationView;
