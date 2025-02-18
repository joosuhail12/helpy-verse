
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Check, Plus, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { useAppSelector } from '@/hooks/useAppSelector';
import { selectChatbots } from '@/store/slices/chatbots/chatbotsSlice';
import type { FormValues } from './schema';

interface ChatbotConnectionProps {
  form: UseFormReturn<FormValues>;
}

export const ChatbotConnection = ({ form }: ChatbotConnectionProps) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const chatbots = useAppSelector(selectChatbots);

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

        <FormField
          control={form.control}
          name="connectedChatbots"
          render={({ field }) => (
            <FormItem>
              {isSelecting ? (
                <div className="grid gap-2">
                  {chatbots.map((chatbot) => {
                    const isConnected = field.value?.includes(chatbot.id);
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
                        <Button
                          variant={isConnected ? "ghost" : "outline"}
                          size="sm"
                          onClick={() => {
                            const currentValue = field.value || [];
                            const newValue = isConnected
                              ? currentValue.filter((id) => id !== chatbot.id)
                              : [...currentValue, chatbot.id];
                            field.onChange(newValue);
                          }}
                        >
                          {isConnected ? (
                            <>
                              <Check className="h-4 w-4 mr-2" />
                              Connected
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-2" />
                              Connect
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  {field.value?.length ? (
                    chatbots
                      .filter((chatbot) => field.value?.includes(chatbot.id))
                      .map((chatbot) => (
                        <div
                          key={chatbot.id}
                          className="flex items-center justify-between p-3 border rounded-md bg-white/50"
                        >
                          <span className="font-medium">{chatbot.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const newValue = field.value?.filter(
                                (id) => id !== chatbot.id
                              );
                              field.onChange(newValue);
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Disconnect
                          </Button>
                        </div>
                      ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">
                      No chatbots connected
                    </p>
                  )}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </Card>
  );
};
