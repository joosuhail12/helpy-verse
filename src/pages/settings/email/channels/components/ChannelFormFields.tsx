
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Mail, User, Users } from 'lucide-react';
import { IconEmojiPicker } from './IconEmojiPicker';
import { useAppSelector } from '@/hooks/useAppSelector';

interface ChannelFormFieldsProps {
  channelName: string;
  setChannelName: (value: string) => void;
  senderName: string;
  setSenderName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  autoBccEmail: string;
  setAutoBccEmail: (value: string) => void;
  noReplyEmail: string;
  setNoReplyEmail: (value: string) => void;
  selectedEmoji: string | null;
  setSelectedEmoji: (emoji: string | null) => void;
  selectedTeamId: string | undefined;
  setSelectedTeamId: (teamId: string | undefined) => void;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  setFieldTouched: (field: string) => void;
}

export function ChannelFormFields({
  channelName,
  setChannelName,
  senderName,
  setSenderName,
  email,
  setEmail,
  autoBccEmail,
  setAutoBccEmail,
  noReplyEmail,
  setNoReplyEmail,
  selectedEmoji,
  setSelectedEmoji,
  selectedTeamId,
  setSelectedTeamId,
  errors,
  touched,
  setFieldTouched,
}: ChannelFormFieldsProps) {
  const teams = useAppSelector((state) => state.teams.teams);

  const renderFieldLabel = (
    label: string,
    fieldName: string,
    tooltip: string,
    required?: boolean,
    icon?: React.ReactNode,
    description?: string
  ) => (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <Label htmlFor={fieldName} className="flex items-center gap-2 text-sm font-medium">
          {icon}
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );

  const renderCharacterCount = (value: string, limit: number) => (
    <div className="text-xs text-muted-foreground text-right">
      {value.length}/{limit} characters
    </div>
  );

  return (
    <div className="grid gap-8">
      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Basic Information</h3>
        <div className="grid gap-6">
          <div className="space-y-2">
            {renderFieldLabel(
              'Channel Name',
              'channelName',
              'The name used to identify this channel',
              true,
              <Info className="h-4 w-4" />,
              'Choose a clear and descriptive name for your email channel'
            )}
            <Input
              id="channelName"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              onBlur={() => setFieldTouched('channelName')}
              placeholder="Support Channel"
              maxLength={50}
              className={errors.channelName && touched.channelName ? 'border-destructive' : ''}
            />
            {renderCharacterCount(channelName, 50)}
            {errors.channelName && touched.channelName && (
              <p className="text-sm text-destructive mt-1">{errors.channelName}</p>
            )}
          </div>
          <div className="space-y-2">
            {renderFieldLabel(
              'Channel Icon',
              'emoji',
              'Choose an emoji to represent this channel',
              false,
              <Info className="h-4 w-4" />,
              'Select an emoji that represents the purpose of this channel'
            )}
            <IconEmojiPicker
              selectedEmoji={selectedEmoji}
              setSelectedEmoji={setSelectedEmoji}
            />
          </div>
          <div className="space-y-2">
            {renderFieldLabel(
              'Assign to Team',
              'teamId',
              'Select a team to assign this channel to',
              false,
              <Users className="h-4 w-4" />,
              'Leave empty to make the channel accessible to all teams'
            )}
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

      <Separator className="my-2" />

      <div className="space-y-6">
        <h3 className="text-lg font-semibold">Email Configuration</h3>
        <div className="grid gap-6">
          <div className="space-y-2">
            {renderFieldLabel(
              'Sender Name',
              'senderName',
              'The name that will appear in the From field',
              true,
              <User className="h-4 w-4" />,
              'This name will be displayed to recipients in their email client'
            )}
            <Input
              id="senderName"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              onBlur={() => setFieldTouched('senderName')}
              placeholder="Support Team"
              maxLength={50}
              className={errors.senderName && touched.senderName ? 'border-destructive' : ''}
            />
            {renderCharacterCount(senderName, 50)}
            {errors.senderName && touched.senderName && (
              <p className="text-sm text-destructive mt-1">{errors.senderName}</p>
            )}
          </div>
          <div className="space-y-2">
            {renderFieldLabel(
              'Email Address',
              'email',
              'The email address that will be used to send emails',
              true,
              <Mail className="h-4 w-4" />,
              'Main email address for sending and receiving messages'
            )}
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setFieldTouched('email')}
              placeholder="support@company.com"
              className={errors.email && touched.email ? 'border-destructive' : ''}
            />
            {errors.email && touched.email && (
              <p className="text-sm text-destructive mt-1">{errors.email}</p>
            )}
          </div>
          <div className="grid gap-6 rounded-lg border p-4 bg-muted/10">
            <div className="space-y-2">
              {renderFieldLabel(
                'Auto BCC Email',
                'autoBccEmail',
                'Optional email address that will be BCC\'d on all outgoing emails',
                false,
                <Mail className="h-4 w-4" />,
                'Automatically BCC this address on all outgoing emails for record-keeping'
              )}
              <Input
                id="autoBccEmail"
                type="email"
                value={autoBccEmail}
                onChange={(e) => setAutoBccEmail(e.target.value)}
                onBlur={() => setFieldTouched('autoBccEmail')}
                placeholder="archive@company.com"
                className={errors.autoBccEmail && touched.autoBccEmail ? 'border-destructive' : ''}
              />
              {errors.autoBccEmail && touched.autoBccEmail && (
                <p className="text-sm text-destructive mt-1">{errors.autoBccEmail}</p>
              )}
            </div>
            <div className="space-y-2">
              {renderFieldLabel(
                'No Reply Email',
                'noReplyEmail',
                'Optional email address for automated responses',
                false,
                <Mail className="h-4 w-4" />,
                'Used for automated messages where replies are not monitored'
              )}
              <Input
                id="noReplyEmail"
                type="email"
                value={noReplyEmail}
                onChange={(e) => setNoReplyEmail(e.target.value)}
                onBlur={() => setFieldTouched('noReplyEmail')}
                placeholder="no-reply@company.com"
                className={errors.noReplyEmail && touched.noReplyEmail ? 'border-destructive' : ''}
              />
              {errors.noReplyEmail && touched.noReplyEmail && (
                <p className="text-sm text-destructive mt-1">{errors.noReplyEmail}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
