
import React, { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react';
import { getAblyChannel } from '@/utils/ably';

interface NewChatProps {
  onConversationCreated: () => void;
}

/**
 * New chat interface for starting a conversation
 */
const NewChat = ({ onConversationCreated }: NewChatProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [topic, setTopic] = useState('Support');
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<'info' | 'chat'>('info');

  const handleSubmitInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      setStep('chat');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setSubmitting(true);
    
    try {
      // In a real implementation, we would use Ably to publish the message
      const channel = await getAblyChannel('new-support-tickets');
      
      await channel.publish('new-ticket', {
        name,
        email,
        topic,
        message,
        timestamp: new Date().toISOString()
      });
      
      console.log('Message sent:', { name, email, message, topic });
      
      // Clear form
      setMessage('');
      setSubmitting(false);
      
      // Simulate success and redirect to conversations
      setTimeout(() => {
        onConversationCreated();
      }, 1000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitting(false);
    }
  };

  if (step === 'info') {
    return (
      <div className="flex flex-col h-full">
        <div className="p-3 border-b flex items-center gap-2">
          <button 
            onClick={onConversationCreated} 
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="font-medium text-gray-800">Start New Conversation</h2>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <form onSubmit={handleSubmitInfo} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Topic
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Support">Support</option>
                <option value="Billing">Billing</option>
                <option value="Technical">Technical</option>
                <option value="Sales">Sales</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-white p-2 rounded-md font-medium hover:bg-primary/90"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b flex items-center gap-2">
        <button 
          onClick={() => setStep('info')} 
          className="text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="font-medium text-gray-800">{topic}</h2>
          <p className="text-xs text-gray-500">{name} • {email}</p>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-primary/10 p-3 rounded-lg inline-block max-w-[80%]">
          <p className="text-sm text-gray-800">
            Hi {name}! How can we help you with your {topic.toLowerCase()} query today?
          </p>
          <span className="text-xs text-gray-500 mt-1 block">Support Team • Just now</span>
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-3 flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Type your message..."
          disabled={submitting}
        />
        <button
          type="submit"
          className="bg-primary text-white p-2 rounded-full"
          disabled={!message.trim() || submitting}
        >
          {submitting ? (
            <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin"></div>
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default NewChat;
