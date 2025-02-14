
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IconEmojiPicker } from './IconEmojiPicker';
import type { icons } from './IconSelection';

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
  selectedIcon: typeof icons[0] | null;
  setSelectedIcon: (icon: typeof icons[0] | null) => void;
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
  selectedIcon,
  setSelectedIcon,
  selectedEmoji,
  setSelectedEmoji,
  errors,
  touched,
  setFieldTouched,
}: ChannelFormFieldsProps) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="channelName" className="flex items-center gap-0.5">
          Channel Name<span className="text-red-500">*</span>
        </Label>
        <Input
          id="channelName"
          value={channelName}
          onChange={(e) => setChannelName(e.target.value)}
          onBlur={() => setFieldTouched('channelName')}
          placeholder="Support Channel"
          className={errors.channelName && touched.channelName ? 'border-red-500' : ''}
        />
        {errors.channelName && touched.channelName && (
          <p className="text-sm text-red-500">{errors.channelName}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="senderName" className="flex items-center gap-0.5">
          Email Sender Name<span className="text-red-500">*</span>
        </Label>
        <Input
          id="senderName"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          onBlur={() => setFieldTouched('senderName')}
          placeholder="Support Team"
          className={errors.senderName && touched.senderName ? 'border-red-500' : ''}
        />
        {errors.senderName && touched.senderName && (
          <p className="text-sm text-red-500">{errors.senderName}</p>
        )}
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email" className="flex items-center gap-0.5">
          Email Address<span className="text-red-500">*</span>
        </Label>
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
      <div className="grid gap-2">
        <Label htmlFor="autoBccEmail">Auto BCC Email (Optional)</Label>
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
      <div className="grid gap-2">
        <Label htmlFor="noReplyEmail">No Reply Email (Optional)</Label>
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
      <div className="grid gap-2">
        <Label>Channel Icon (Optional)</Label>
        <IconEmojiPicker
          selectedIcon={selectedIcon}
          setSelectedIcon={setSelectedIcon}
          selectedEmoji={selectedEmoji}
          setSelectedEmoji={setSelectedEmoji}
        />
      </div>
    </div>
  );
}
