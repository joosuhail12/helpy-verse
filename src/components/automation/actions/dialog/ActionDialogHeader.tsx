
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import * as z from 'zod';
import { actionFormSchema } from './ActionBasicInfo';

interface ActionDialogHeaderProps {
  form: UseFormReturn<z.infer<typeof actionFormSchema>>;
  enabled: boolean;
  isDirty: boolean;
  onSave: () => void;
}

export const ActionDialogHeader = ({ form, enabled, isDirty, onSave }: ActionDialogHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  className="text-2xl font-bold h-auto px-2 py-1 max-w-[300px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Badge variant={enabled ? 'default' : 'secondary'}>
          {enabled ? 'Enabled' : 'Disabled'}
        </Badge>
      </div>
      <Button onClick={onSave} disabled={!isDirty}>
        <Save className="h-4 w-4 mr-2" />
        Save Changes
      </Button>
    </div>
  );
};
