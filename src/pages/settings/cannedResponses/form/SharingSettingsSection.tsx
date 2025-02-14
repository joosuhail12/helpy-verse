
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { CollapsibleFormSection } from '@/components/settings/cannedResponses/form/CollapsibleFormSection';
import { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '../formSchema';

interface SharingSettingsSectionProps {
  form: UseFormReturn<FormValues>;
}

export const SharingSettingsSection = ({ form }: SharingSettingsSectionProps) => {
  return (
    <CollapsibleFormSection title="Sharing Settings">
      <FormField
        control={form.control}
        name="isShared"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Shared Response</FormLabel>
              <div className="text-sm text-muted-foreground">
                Make this response available to all team members
              </div>
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
    </CollapsibleFormSection>
  );
};
