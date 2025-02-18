
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import type { FormValues } from './schema';

interface ApiConfigurationProps {
  form: UseFormReturn<FormValues>;
}

export function ApiConfiguration({ form }: ApiConfigurationProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="headers"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Authentication Headers (JSON format)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={'{\n  "Authorization": "Bearer YOUR_TOKEN"\n}'}
                className="font-mono min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="parameters"
        render={({ field }) => (
          <FormItem>
            <FormLabel>API Parameters (JSON array)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={'[\n  "userId",\n  "email"\n]'}
                className="font-mono min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="parameterDescriptions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Parameter Descriptions (JSON object)</FormLabel>
            <FormControl>
              <Textarea 
                placeholder={'{\n  "userId": "The unique identifier of the user",\n  "email": "User\'s email address"\n}'}
                className="font-mono min-h-[100px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default ApiConfiguration;

