
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Plus, X } from 'lucide-react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { updateContent } from '@/store/slices/content/contentSlice';
import type { Content } from '@/types/content';
import { mockChatbots } from '@/mock/chatbots';

interface ChatbotConnectionProps {
  content: Content;
}

export const ChatbotConnection = ({ content }: ChatbotConnectionProps) => {
  const dispatch = useAppDispatch();
  const [isSelecting, setIsSelecting] = useState(false);

  const handleConnect = (chatbotId: string, chatbotName: string) => {
    const currentChatbots = content.chatbots || [];
    const newChatbots = [...currentChatbots, { id: chatbotId, name: chatbotName }];
    
    dispatch(updateContent({
      id: content.id,
      updates: { chatbots: newChatbots }
    }));
  };

  const handleDisconnect = (chatbotId: string) => {
    const currentChatbots = content.chatbots || [];
    const newChatbots = currentChatbots.filter(bot => bot.id !== chatbotId);
    
    dispatch(updateContent({
      id: content.id,
      updates: { chatbots: newChatbots }
    }));
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Connected Chatbots</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSelecting(!isSelecting)}
          >
            {isSelecting ? (
              <>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Connect
              </>
            )}
          </Button>
        </div>

        {isSelecting ? (
          <div className="grid gap-2">
            {mockChatbots.map((chatbot) => {
              const isConnected = content.chatbots?.some(
                (bot) => bot.id === chatbot.id
              );
              return (
                <div
                  key={chatbot.id}
                  className="flex items-center justify-between p-3 border rounded-md"
                >
                  <div>
                    <p className="font-medium">{chatbot.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {chatbot.description}
                    </p>
                  </div>
                  {isConnected ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDisconnect(chatbot.id)}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Connected
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConnect(chatbot.id, chatbot.name)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-2">
            {content.chatbots?.map((chatbot) => (
              <div
                key={chatbot.id}
                className="flex items-center justify-between p-3 border rounded-md"
              >
                <span>{chatbot.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDisconnect(chatbot.id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            ))}
            {!content.chatbots?.length && (
              <p className="text-center text-muted-foreground py-4">
                No chatbots connected
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
