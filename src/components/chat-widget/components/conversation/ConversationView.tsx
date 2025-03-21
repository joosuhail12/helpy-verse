
import React, { useState, useEffect } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface ConversationViewProps {
  conversationId: string;
  onBack?: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: string;
}

/**
 * Conversation detail view component
 */
const ConversationView: React.FC<ConversationViewProps> = ({ 
  conversationId,
  onBack 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Load conversation messages
  useEffect(() => {
    const fetchConversation = async () => {
      setLoading(true);
      
      try {
        // In a real implementation, we would fetch messages from your API
        // This is a mock implementation
        setTimeout(() => {
          // Generate mock messages for the selected conversation
          const mockMessages: Message[] = [
            {
              id: `msg-${Date.now()}-1`,
              text: 'Hello! How can I help you today?',
              sender: 'agent',
              timestamp: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: `msg-${Date.now()}-2`,
              text: 'I have a question about your services.',
              sender: 'user',
              timestamp: new Date(Date.now() - 3500000).toISOString()
            },
            {
              id: `msg-${Date.now()}-3`,
              text: 'Sure, I\'d be happy to help! What would you like to know?',
              sender: 'agent',
              timestamp: new Date(Date.now() - 3400000).toISOString()
            }
          ];
          
          setMessages(mockMessages);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching conversation:', error);
        toast.error('Failed to load conversation');
        setLoading(false);
      }
    };
    
    fetchConversation();
  }, [conversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    setSending(true);
    
    // Create new message object
    const message: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    // Add to messages instantly for responsive UI
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    try {
      // In a real implementation, we would send the message to your API
      // and then receive a response from the agent
      
      // Simulate agent response after a delay
      setTimeout(() => {
        const agentResponse: Message = {
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text: 'Thanks for your message. Our team will get back to you shortly.',
          sender: 'agent',
          timestamp: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, agentResponse]);
        setSending(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      setSending(false);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Conversation header */}
      {onBack && (
        <div className="px-4 py-3 border-b flex items-center gap-3 bg-white z-10 shadow-sm">
          <button 
            onClick={onBack} 
            className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="font-semibold text-gray-800">Conversation</h2>
            <p className="text-xs text-gray-500">Ticket #{conversationId.substring(0, 8)}</p>
          </div>
        </div>
      )}
      
      {/* Messages container */}
      <div className="flex-1 p-4 bg-gray-50 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-pulse space-y-4 w-full max-w-md">
              <div className="h-10 bg-gray-200 rounded-md w-3/4"></div>
              <div className="h-20 bg-gray-200 rounded-md w-full"></div>
              <div className="h-16 bg-gray-200 rounded-md w-5/6 ml-auto"></div>
              <div className="h-14 bg-gray-200 rounded-md w-4/5"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className={`text-xs mt-1 block text-right ${
                    msg.sender === 'user' ? 'text-indigo-100' : 'text-gray-400'
                  }`}>
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <form onSubmit={handleSendMessage} className="relative">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full border border-gray-200 rounded-lg p-3 pr-12 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent resize-none"
            rows={3}
            disabled={sending}
          />
          <button
            type="submit"
            className="absolute right-3 bottom-3 text-primary hover:text-primary/80 disabled:text-gray-400"
            disabled={sending || !newMessage.trim()}
          >
            <Send className="h-6 w-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConversationView;
