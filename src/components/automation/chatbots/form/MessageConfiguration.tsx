
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { DataCollectionConfig } from '../DataCollectionConfig';

export const MessageConfiguration = () => {
  const form = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="dataCollection.enabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Enable Data Collection</FormLabel>
              <FormDescription>
                Collect information from unauthenticated users before starting a chat
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />

      {form.watch('dataCollection.enabled') && (
        <FormField
          control={form.control}
          name="dataCollection"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Data Collection Fields</FormLabel>
              <FormDescription>
                Configure the fields you want to collect from users
              </FormDescription>
              <FormControl>
                <DataCollectionConfig
                  enabled={field.value.enabled}
                  fields={field.value.fields}
                  onEnableChange={(enabled) => 
                    form.setValue('dataCollection.enabled', enabled)
                  }
                  onFieldsChange={(fields) => 
                    form.setValue('dataCollection.fields', fields)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <FormField
        control={form.control}
        name="welcomeMessage"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Welcome Message</FormLabel>
            <FormDescription>
              This message will be sent when a user starts a new conversation
            </FormDescription>
            <FormControl>
              <Textarea 
                placeholder="Enter the first message the chatbot will send" 
                className="resize-none min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="humanHandoffMessage"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">Human Handoff Message</FormLabel>
            <FormDescription>
              This message will be sent when the chatbot transfers the conversation to a human agent
            </FormDescription>
            <FormControl>
              <Textarea 
                placeholder="Enter the message to be sent when transferring to a human agent" 
                className="resize-none min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
