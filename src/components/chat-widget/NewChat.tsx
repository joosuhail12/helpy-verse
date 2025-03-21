
import React, { useState } from 'react';
import { Send, ArrowLeft, User, Mail, FileText, PaperclipIcon } from 'lucide-react';
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
        <div className="p-4 border-b flex items-center gap-3 sticky top-0 bg-white z-10">
          <button 
            onClick={onConversationCreated} 
            className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="font-semibold text-gray-800">Start New Conversation</h2>
        </div>
        
        <div className="flex-1 p-6 overflow-y-auto">
          <p className="text-gray-600 mb-6">
            Please provide your information to help us serve you better
          </p>
          
          <form onSubmit={handleSubmitInfo} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Your Name
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Topic
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <FileText className="h-4 w-4" />
                </div>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-transparent appearance-none bg-white"
                >
                  <option value="Support">Support</option>
                  <option value="Billing">Billing</option>
                  <option value="Technical">Technical</option>
                  <option value="Sales">Sales</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              Continue
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center gap-3 sticky top-0 bg-white z-10">
        <button 
          onClick={() => setStep('info')} 
          className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="font-semibold text-gray-800">{topic}</h2>
          <p className="text-xs text-gray-500">{name} • {email}</p>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="p-6 mb-4">
          <div className="bg-primary/10 p-4 rounded-lg rounded-tl-none max-w-[85%] shadow-sm">
            <p className="text-gray-800">
              👋 Hi {name.split(' ')[0]}! How can we help you with your {topic.toLowerCase()} query today?
            </p>
            <span className="text-xs text-gray-500 mt-2 block">Support Team • Just now</span>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSendMessage} className="border-t p-3 flex items-center gap-2 bg-white">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
        >
          <PaperclipIcon className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2.5 bg-gray-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white"
          placeholder="Type your message..."
          disabled={submitting}
        />
        <button
          type="submit"
          className={`bg-primary text-white p-3 rounded-full transition-colors ${!message.trim() || submitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'}`}
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
