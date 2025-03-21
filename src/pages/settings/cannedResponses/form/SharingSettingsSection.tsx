
import { useState } from 'react';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl,
  FormDescription
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X } from 'lucide-react';
import { CollapsibleFormSection } from '@/components/settings/cannedResponses/form/CollapsibleFormSection';
import { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '../formSchema';
import { mockTeams } from '@/store/slices/teams/mockData';

interface SharingSettingsSectionProps {
  form: UseFormReturn<FormValues>;
}

export const SharingSettingsSection = ({ form }: SharingSettingsSectionProps) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<'view' | 'edit'>('view');

  const handleAddShare = () => {
    if (!selectedTeam) return;

    const currentShares = form.getValues('sharedWith') || [];
    const team = mockTeams.find(t => t.id === selectedTeam);

    form.setValue('sharedWith', [
      ...currentShares,
      {
        teamId: selectedTeam,
        teamName: team?.name,
        permissions: selectedPermission,
      }
    ]);

    setSelectedTeam('');
    setSelectedPermission('view');
  };

  const handleRemoveShare = (index: number) => {
    const currentShares = form.getValues('sharedWith') || [];
    form.setValue('sharedWith', currentShares.filter((_, i) => i !== index));
  };

  return (
    <CollapsibleFormSection title="Sharing Settings">
      <FormField
        control={form.control}
        name="isShared"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Shared Response</FormLabel>
              <FormDescription>
                Make this response available to other team members
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

      {form.watch('isShared') && (
        <div className="space-y-4 mt-4">
          <div className="flex gap-2">
            <Select value={selectedTeam} onValueChange={setSelectedTeam}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select team" />
              </SelectTrigger>
              <SelectContent>
                {mockTeams.map(team => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedPermission} onValueChange={(val: 'view' | 'edit') => setSelectedPermission(val)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Permissions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="view">View only</SelectItem>
                <SelectItem value="edit">Can edit</SelectItem>
              </SelectContent>
            </Select>

            <Button type="button" onClick={handleAddShare}>
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {form.watch('sharedWith')?.map((share, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-medium">
                    {mockTeams.find(t => t.id === share.teamId)?.name}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({share.permissions === 'view' ? 'View only' : 'Can edit'})
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveShare(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </CollapsibleFormSection>
  );
};

