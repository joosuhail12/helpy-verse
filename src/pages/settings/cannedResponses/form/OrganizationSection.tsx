
import { useState, useEffect } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { CategoryCombobox } from '@/components/settings/cannedResponses/CategoryCombobox';
import { ShortcutTester } from '@/components/settings/cannedResponses/ShortcutTester';
import { getSimilarShortcuts } from '@/utils/shortcutUtils';
import { CollapsibleFormSection } from '@/components/settings/cannedResponses/form/CollapsibleFormSection';
import { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '../formSchema';

interface OrganizationSectionProps {
  form: UseFormReturn<FormValues>;
}

export const OrganizationSection = ({ form }: OrganizationSectionProps) => {
  const watchShortcut = form.watch('shortcut');
  const [similarShortcuts, setSimilarShortcuts] = useState<string[]>([]);

  useEffect(() => {
    setSimilarShortcuts(getSimilarShortcuts(watchShortcut));
  }, [watchShortcut]);

  return (
    <CollapsibleFormSection title="Organization">
      <FormField
        control={form.control}
        name="shortcut"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Shortcut</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <Input {...field} placeholder="/shortcut" />
                {similarShortcuts.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Similar shortcuts:
                    <div className="flex flex-wrap gap-2 mt-1">
                      {similarShortcuts.map((shortcut, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted rounded-md text-xs"
                        >
                          {shortcut}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
            {watchShortcut && <ShortcutTester shortcut={watchShortcut} />}
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
