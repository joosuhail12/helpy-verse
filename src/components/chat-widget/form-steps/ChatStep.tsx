
import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

interface ChatStepProps {
  data: {
    name: string;
    email: string;
    topic: string;
  };
  onBack: () => void;
  onConversationCreated: (conversationId?: string) => void;
  workspaceId?: string;
}

const ChatStep: React.FC<ChatStepProps> = ({ 
  data, 
  onBack, 
  onConversationCreated,
  workspaceId 
}) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setSending(true);
    
    try {
      // Here you would actually create the conversation with your API
      console.log('Creating conversation with workspace ID:', workspaceId);
      console.log('Form data:', { ...data, message });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes we'll generate a random ID
      const conversationId = `conv-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      onConversationCreated(conversationId);
      
      toast({
        title: "Conversation started",
        description: "Your message has been sent to our team.",
      });
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "Could not start conversation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center">
        <button 
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-gray-100 mr-3"
          aria-label="Go back"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div>
          <h3 className="font-medium text-sm">{data.topic || 'New conversation'}</h3>
          <p className="text-xs text-gray-500">{data.name} • {data.email}</p>
        </div>
      </div>
      
      <div className="flex-grow p-4 bg-gray-50">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 mb-4">
          <p className="text-sm text-gray-700">
            Please let us know how we can help you with "{data.topic || 'your question'}"
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[80px] text-sm"
            disabled={sending}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="h-10 w-10 mt-auto bg-[#5DCFCF] hover:bg-[#4bb8b8]"
            disabled={!message.trim() || sending}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatStep;
