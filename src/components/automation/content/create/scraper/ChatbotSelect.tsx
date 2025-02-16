
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { ScraperFormValues } from './types';
import { mockChatbots } from '@/mock/chatbots';

interface ChatbotSelectProps {
  form: UseFormReturn<ScraperFormValues>;
}

export const ChatbotSelect = ({ form }: ChatbotSelectProps) => {
  return (
    <FormField
      control={form.control}
      name="chatbotId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Connect to Chatbot</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a chatbot" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {mockChatbots.map((chatbot) => (
                <SelectItem key={chatbot.id} value={chatbot.id}>
                  {chatbot.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormDescription>
            Choose which chatbot will use this content
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
