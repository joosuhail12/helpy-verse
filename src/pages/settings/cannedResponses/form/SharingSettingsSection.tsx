
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel 
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CannedResponseFormValues } from '../formSchema';
import { useAppSelector } from '@/hooks/useAppSelector';

const SharingSettingsSection = () => {
  const { control, watch, setValue, getValues } = useFormContext<CannedResponseFormValues>();
  const teams = useAppSelector((state) => state.teams.teams);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<'view' | 'edit'>('view');
  const isShared = watch('isShared');

  const handleAddShare = () => {
    if (!selectedTeam) return;

    const currentShares = getValues('sharedWith') || [];
    const team = teams.find(t => t.id === selectedTeam);

    setValue('sharedWith', [
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
    const currentShares = getValues('sharedWith') || [];
    setValue('sharedWith', currentShares.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sharing Settings</CardTitle>
        <CardDescription>
          Control who can access and use this canned response
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={control}
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

        {isShared && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
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
              {watch('sharedWith')?.map((share, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <span className="font-medium">
                      {teams.find(t => t.id === share.teamId)?.name}
                    </span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({share.permissions === 'view' ? 'View only' : 'Can edit'})
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveShare(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SharingSettingsSection;
