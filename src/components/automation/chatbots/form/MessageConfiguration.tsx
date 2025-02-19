
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export const MessageConfiguration = () => {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="welcomeMessage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Welcome Message</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter the first message the chatbot will send" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              This message will be sent when a user starts a new conversation
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="humanHandoffMessage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Human Handoff Message</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter the message to be sent when transferring to a human agent" 
                {...field} 
              />
            </FormControl>
            <FormDescription>
              This message will be sent when the chatbot transfers the conversation to a human agent
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
