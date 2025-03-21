
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContent } from '@/store/slices/content/contentSlice';
import { useToast } from '@/hooks/use-toast';
import type { Content } from '@/types/content';

interface ChatbotConnectionProps {
  content: Content;
  availableChatbots: { id: string; name: string }[];
}

export const ChatbotConnection = ({ content, availableChatbots }: ChatbotConnectionProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // Helper to convert string IDs to chatbot objects if needed
  const normalizeChatbots = (chatbots: any[] | undefined): { id: string; name: string }[] => {
    if (!chatbots || chatbots.length === 0) return [];
    
    return chatbots.map(chatbot => {
      if (typeof chatbot === 'string') {
        // Try to find the chatbot in available chatbots
        const found = availableChatbots.find(c => c.id === chatbot);
        return found || { id: chatbot, name: `Unknown (${chatbot})` };
      }
      return chatbot;
    });
  };

  const normalizedChatbots = normalizeChatbots(content.chatbots);

  const handleConnect = async () => {
    if (!selectedChatbot) return;
    
    setIsConnecting(true);
    try {
      const chatbotToConnect = availableChatbots.find(c => c.id === selectedChatbot);
      if (!chatbotToConnect) throw new Error('Chatbot not found');
      
      const updatedChatbots = [...normalizedChatbots, chatbotToConnect];
      
      await dispatch(updateContent({ 
        id: content.id, 
        data: { chatbots: updatedChatbots }
      })).unwrap();
      
      toast({
        title: 'Content connected',
        description: `Successfully connected to "${chatbotToConnect.name}" chatbot.`,
      });
      
      setSelectedChatbot(null);
    } catch (error) {
      toast({
        title: 'Connection failed',
        description: 'Could not connect content to chatbot. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (chatbotId: string) => {
    try {
      const chatbotToDisconnect = availableChatbots.find(c => c.id === chatbotId);
      if (!chatbotToDisconnect) throw new Error('Chatbot not found');
      
      const updatedChatbots = normalizedChatbots.filter(chatbot => chatbot.id !== chatbotId);
      
      await dispatch(updateContent({ 
        id: content.id, 
        data: { chatbots: updatedChatbots }
      })).unwrap();
      
      toast({
        title: 'Content disconnected',
        description: `Successfully disconnected from "${chatbotToDisconnect.name}" chatbot.`,
      });
    } catch (error) {
      toast({
        title: 'Disconnection failed',
        description: 'Could not disconnect content from chatbot. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const isChatbotConnected = (chatbotId: string): boolean => {
    return normalizedChatbots.some(chatbot => chatbot.id === chatbotId);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Chatbot Connections</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Connect to a Chatbot</label>
        <div className="flex gap-2">
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            value={selectedChatbot || ''}
            onChange={(e) => setSelectedChatbot(e.target.value || null)}
          >
            <option value="">Select a chatbot</option>
            {availableChatbots
              .filter(chatbot => !isChatbotConnected(chatbot.id))
              .map(chatbot => (
                <option key={chatbot.id} value={chatbot.id}>
                  {chatbot.name}
                </option>
              ))
            }
          </select>
          <Button 
            onClick={handleConnect} 
            disabled={!selectedChatbot || isConnecting}
          >
            Connect
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Connected Chatbots</label>
        {normalizedChatbots.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No chatbots connected yet
          </p>
        ) : (
          <ul className="space-y-2">
            {normalizedChatbots.map(chatbot => (
              <li 
                key={chatbot.id} 
                className="flex items-center justify-between p-2 bg-secondary/30 rounded"
              >
                <span>{chatbot.name}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDisconnect(chatbot.id)}
                >
                  Disconnect
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
