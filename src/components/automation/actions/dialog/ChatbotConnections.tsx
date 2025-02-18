
import { Card } from '@/components/ui/card';
import { mockChatbots } from '@/mock/chatbots';
import { Check, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import type { CustomAction } from '@/types/action';

interface ChatbotConnectionsProps {
  action: CustomAction;
  onUpdate: (updatedAction: CustomAction) => void;
}

export const ChatbotConnections = ({ action, onUpdate }: ChatbotConnectionsProps) => {
  const [isSelecting, setIsSelecting] = useState(false);

  const handleConnect = (chatbotId: string, chatbotName: string) => {
    const currentChatbots = action.connectedChatbots || [];
    const newChatbots = [...currentChatbots, { id: chatbotId, name: chatbotName }];
    
    onUpdate({
      ...action,
      connectedChatbots: newChatbots,
    });
  };

  const handleDisconnect = (chatbotId: string) => {
    const currentChatbots = action.connectedChatbots || [];
    const newChatbots = currentChatbots.filter(bot => bot.id !== chatbotId);
    
    onUpdate({
      ...action,
      connectedChatbots: newChatbots,
    });
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
              const isConnected = action.connectedChatbots?.some(
                (bot) => bot.id === chatbot.id
              );
              return (
                <div
                  key={chatbot.id}
                  className="flex items-center justify-between p-3 border rounded-md bg-white/50"
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
            {action.connectedChatbots?.map((chatbot) => (
              <div
                key={chatbot.id}
                className="flex items-center justify-between p-3 border rounded-md bg-white/50"
              >
                <span className="font-medium">{chatbot.name}</span>
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
            {!action.connectedChatbots?.length && (
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
