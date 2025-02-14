
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon, Smile } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import EmojiPicker from 'emoji-picker-react';

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
  errors,
  touched,
  setFieldTouched,
}: ChannelFormFieldsProps) {
  const renderFieldLabel = (label: string, fieldName: string, tooltip: string, required?: boolean) => (
    <div className="flex items-center gap-2">
      <Label htmlFor={fieldName} className="flex items-center gap-0.5">
        {label}{required && <span className="text-red-500">*</span>}
      </Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <InfoIcon className="h-4 w-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  const renderCharacterCount = (value: string, limit: number) => (
    <div className="text-xs text-muted-foreground text-right">
      {value.length}/{limit} characters
    </div>
  );

  return (
    <div className="grid gap-6">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Basic Information</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            {renderFieldLabel('Channel Name', 'channelName', 'The name used to identify this channel', true)}
            <Input
              id="channelName"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              onBlur={() => setFieldTouched('channelName')}
              placeholder="Support Channel"
              maxLength={50}
              className={errors.channelName && touched.channelName ? 'border-red-500' : ''}
            />
            {renderCharacterCount(channelName, 50)}
            {errors.channelName && touched.channelName && (
              <p className="text-sm text-red-500">{errors.channelName}</p>
            )}
          </div>
          <div className="space-y-2">
            {renderFieldLabel('Channel Icon', 'emoji', 'Choose an emoji to represent this channel')}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start gap-2",
                    !selectedEmoji && "text-muted-foreground"
                  )}
                >
                  {selectedEmoji ? (
                    <span className="text-lg">{selectedEmoji}</span>
                  ) : (
                    <Smile className="h-4 w-4" />
                  )}
                  {selectedEmoji ? 'Selected Emoji' : 'Select an emoji...'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <div className="h-[300px]">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => setSelectedEmoji(emojiData.emoji)}
                    width="100%"
                    height="100%"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Email Configuration</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            {renderFieldLabel('Email Sender Name', 'senderName', 'The name that will appear in the From field', true)}
            <Input
              id="senderName"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              onBlur={() => setFieldTouched('senderName')}
              placeholder="Support Team"
              maxLength={50}
              className={errors.senderName && touched.senderName ? 'border-red-500' : ''}
            />
            {renderCharacterCount(senderName, 50)}
            {errors.senderName && touched.senderName && (
              <p className="text-sm text-red-500">{errors.senderName}</p>
            )}
          </div>
          <div className="space-y-2">
            {renderFieldLabel('Email Address', 'email', 'The email address that will be used to send emails', true)}
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setFieldTouched('email')}
              placeholder="support@company.com"
              className={errors.email && touched.email ? 'border-red-500' : ''}
            />
            {errors.email && touched.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="text-sm font-medium">Advanced Settings</h3>
        <div className="grid gap-4">
          <div className="space-y-2">
            {renderFieldLabel('Auto BCC Email', 'autoBccEmail', 'Optional email address that will be BCC\'d on all outgoing emails')}
            <Input
              id="autoBccEmail"
              type="email"
              value={autoBccEmail}
              onChange={(e) => setAutoBccEmail(e.target.value)}
              onBlur={() => setFieldTouched('autoBccEmail')}
              placeholder="archive@company.com"
              className={errors.autoBccEmail && touched.autoBccEmail ? 'border-red-500' : ''}
            />
            {errors.autoBccEmail && touched.autoBccEmail && (
              <p className="text-sm text-red-500">{errors.autoBccEmail}</p>
            )}
          </div>
          <div className="space-y-2">
            {renderFieldLabel('No Reply Email', 'noReplyEmail', 'Optional email address for automated responses')}
            <Input
              id="noReplyEmail"
              type="email"
              value={noReplyEmail}
              onChange={(e) => setNoReplyEmail(e.target.value)}
              onBlur={() => setFieldTouched('noReplyEmail')}
              placeholder="no-reply@company.com"
              className={errors.noReplyEmail && touched.noReplyEmail ? 'border-red-500' : ''}
            />
            {errors.noReplyEmail && touched.noReplyEmail && (
              <p className="text-sm text-red-500">{errors.noReplyEmail}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
