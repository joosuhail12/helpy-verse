
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CannedResponseEditor } from '@/components/settings/cannedResponses/CannedResponseEditor';
import { CollapsibleFormSection } from '@/components/settings/cannedResponses/form/CollapsibleFormSection';
import { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '../formSchema';

interface BasicInformationSectionProps {
  form: UseFormReturn<FormValues>;
}

export const BasicInformationSection = ({ form }: BasicInformationSectionProps) => {
  return (
    <CollapsibleFormSection title="Basic Information">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter a name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Message</FormLabel>
            <FormControl>
              <CannedResponseEditor
                content={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CollapsibleFormSection>
  );
};
