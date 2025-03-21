import { useEffect, useState } from 'react';
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
import { toast } from '@/components/ui/use-toast';
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
import { teamsService } from '@/api/services/teamService.service';
import { TeamNew } from '@/types/team';

interface SharingSettingsSectionProps {
  form: UseFormReturn<FormValues>;
}

export const SharingSettingsSection = ({ form }: SharingSettingsSectionProps) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const [selectedPermission, setSelectedPermission] = useState<'view' | 'edit'>('view');
  const [teams, setTeams] = useState<TeamNew[]>([]);

  const handleAddShare = () => {
    if (!selectedTeam) return;

    const currentShares = form.getValues('sharedTeams') || [];
    const teamExists = currentShares.some((share) => share.teamId === selectedTeam);

    if (teamExists) {
      toast({
        title: "Error",
        description: "Team already shared",
        variant: "destructive",
      });

      return;
    }

    form.setValue('sharedTeams', [
      ...currentShares,
      {
        teamId: selectedTeam,
        typeOfSharing: selectedPermission,
      }
    ]);

    setSelectedTeam('');
    setSelectedPermission('view');
  };

  const handleRemoveShare = (index: number) => {
    const currentShares = form.getValues('sharedTeams') || [];
    form.setValue('sharedTeams', currentShares.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const getAllTeams = async () => {
      try {
        const teams = await teamsService.getAllTeams();
        console.log(teams);

        setTeams(teams.data);
      } catch (error) {
        console.error('Error fetching teams:', error);
        toast({
          title: "Error",
          description: "Failed to fetch teams",
          variant: "destructive",
        });
      }
    }

    getAllTeams();
  }, []);

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
            {form.watch('sharedTeams')?.map((share, index) => (
              <div key={index} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <span className="font-medium">
                    {teams.find(t => t.id === share.teamId)?.name}
                  </span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({share.typeOfSharing === 'view' ? 'View only' : 'Can edit'})
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

