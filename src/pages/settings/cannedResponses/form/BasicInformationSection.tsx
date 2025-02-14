
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
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter a title" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Content</FormLabel>
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
