
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CollapsibleFormSection } from '@/components/settings/cannedResponses/form/CollapsibleFormSection';
import { CategoryCombobox } from '@/components/settings/cannedResponses/CategoryCombobox';
import { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '../formSchema';

interface OrganizationSectionProps {
  form: UseFormReturn<FormValues>;
}

export const OrganizationSection = ({ form }: OrganizationSectionProps) => {
  return (
    <CollapsibleFormSection title="Organization">
      <FormField
        control={form.control}
        name="shortcut"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Shortcut</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter a shortcut (e.g. /greeting)" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <FormControl>
              <CategoryCombobox {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </CollapsibleFormSection>
  );
};

