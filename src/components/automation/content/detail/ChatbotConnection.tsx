
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContent } from '@/store/slices/content/contentSlice';
import { Plus, X } from 'lucide-react';
import { useAppSelector } from '@/hooks/useAppSelector';
import { mockChatbots } from '@/mock/chatbots';
import type { Content } from '@/types/content';

interface ChatbotConnectionProps {
  content: Content;
}

export const ChatbotConnection = ({ content }: ChatbotConnectionProps) => {
  const [showSelect, setShowSelect] = useState(false);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const handleAddChatbot = (chatbotId: string, chatbotName: string) => {
    // Check if already connected
    if (content.chatbots?.some(c => c.id === chatbotId)) {
      toast({
        description: "This chatbot is already connected to this content",
      });
      return;
    }

    const updatedChatbots = [...(content.chatbots || []), { id: chatbotId, name: chatbotName }];
    
    dispatch(updateContent({ 
      id: content.id, 
      updates: { chatbots: updatedChatbots }
    }));
    
    toast({
      title: "Chatbot connected",
      description: `Connected to ${chatbotName}`,
    });
    
    setShowSelect(false);
  };

  const handleRemoveChatbot = (chatbotId: string) => {
    const updatedChatbots = content.chatbots?.filter(c => c.id !== chatbotId) || [];
    
    dispatch(updateContent({ 
      id: content.id, 
      updates: { chatbots: updatedChatbots }
    }));
    
    toast({
      title: "Chatbot disconnected",
      description: "The chatbot has been disconnected from this content",
    });
  };

  // Filter out chatbots that are already connected
  const availableChatbots = mockChatbots.filter(
    chatbot => !content.chatbots?.some(c => c.id === chatbot.id)
  );

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-lg">Connected Chatbots</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          {content.chatbots && content.chatbots.length > 0 ? (
            <div className="grid gap-2">
              {content.chatbots.map((chatbot) => (
                <div 
                  key={chatbot.id} 
                  className="flex items-center justify-between p-2 bg-muted rounded-md"
                >
                  <span>{chatbot.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveChatbot(chatbot.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No chatbots are connected to this content yet.
            </p>
          )}

          {showSelect ? (
            <div className="border rounded-md p-3">
              <p className="text-sm mb-2">Select a chatbot to connect:</p>
              <div className="grid gap-2 max-h-40 overflow-y-auto">
                {availableChatbots.length > 0 ? (
                  availableChatbots.map((chatbot) => (
                    <Button
                      key={chatbot.id}
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleAddChatbot(chatbot.id, chatbot.name)}
                    >
                      {chatbot.name}
                    </Button>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">All chatbots are already connected.</p>
                )}
              </div>
              <div className="flex justify-end mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSelect(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSelect(true)}
              disabled={availableChatbots.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" />
              Connect Chatbot
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
