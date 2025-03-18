import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info, Users } from 'lucide-react';
import { IconEmojiPicker } from '../IconEmojiPicker';
import { FieldLabel } from './FieldLabel';
import { useAppSelector } from '@/hooks/useAppSelector';
import { fetchTeams } from '@/store/slices/teams/teamsSlice';
import { useAppDispatch } from '@/hooks/useAppDispatch';
interface BasicInformationSectionProps {
  channelName: string;
  setChannelName: (value: string) => void;
  selectedEmoji: string | null;
  setSelectedEmoji: (emoji: string | null) => void;
  selectedTeamId: string | undefined;
  setSelectedTeamId: (teamId: string | undefined) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setFieldTouched: (field: string) => void;
}

export const BasicInformationSection = ({
  channelName,
  setChannelName,
  selectedEmoji,
  setSelectedEmoji,
  selectedTeamId,
  setSelectedTeamId,
  errors,
  touched,
  setFieldTouched,
}: BasicInformationSectionProps) => {

  const { teams, loading, error, areTeamsLoaded } = useAppSelector((state) => state.teams);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!areTeamsLoaded) {
      dispatch(fetchTeams()).unwrap();
    }
  }, [areTeamsLoaded, dispatch]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      <div className="grid gap-6">
        <div className="space-y-2">
          <FieldLabel
            label="Channel Name"
            fieldName="channelName"
            tooltip="The name used to identify this channel"
            required
            icon={<Info className="h-4 w-4" />}
            description="Choose a clear and descriptive name for your email channel"
          />
          <Input
            id="channelName"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            onBlur={() => setFieldTouched('channelName')}
            placeholder="Support Channel"
            maxLength={50}
            className={errors.channelName && touched.channelName ? 'border-destructive' : ''}
          />
          <div className="text-xs text-muted-foreground text-right">
            {channelName.length}/50 characters
          </div>
          {errors.channelName && touched.channelName && (
            <p className="text-sm text-destructive mt-1">{errors.channelName}</p>
          )}
        </div>

        <div className="space-y-2">
          <FieldLabel
            label="Channel Icon"
            fieldName="emoji"
            tooltip="Choose an emoji to represent this channel"
            icon={<Info className="h-4 w-4" />}
            description="Select an emoji that represents the purpose of this channel"
          />
          <IconEmojiPicker
            selectedEmoji={selectedEmoji}
            setSelectedEmoji={setSelectedEmoji}
          />
        </div>

        <div className="space-y-2">
          <FieldLabel
            label="Assign to Team"
            fieldName="teamId"
            tooltip="Select a team to assign this channel to"
            icon={<Users className="h-4 w-4" />}
            description="Leave empty to make the channel accessible to all teams"
          />
          <Select
            value={selectedTeamId}
            onValueChange={(value) => setSelectedTeamId(value || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a team (optional)" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
