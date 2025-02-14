
import { Separator } from '@/components/ui/separator';
import { BasicInformationSection } from './form/BasicInformationSection';
import { EmailConfigurationSection } from './form/EmailConfigurationSection';

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
  return (
    <div className="grid gap-8">
      <BasicInformationSection
        channelName={channelName}
        setChannelName={setChannelName}
        selectedEmoji={selectedEmoji}
        setSelectedEmoji={setSelectedEmoji}
        selectedTeamId={selectedTeamId}
        setSelectedTeamId={setSelectedTeamId}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
      />

      <Separator className="my-2" />

      <EmailConfigurationSection
        senderName={senderName}
        setSenderName={setSenderName}
        email={email}
        setEmail={setEmail}
        autoBccEmail={autoBccEmail}
        setAutoBccEmail={setAutoBccEmail}
        noReplyEmail={noReplyEmail}
        setNoReplyEmail={setNoReplyEmail}
        errors={errors}
        touched={touched}
        setFieldTouched={setFieldTouched}
      />
    </div>
  );
}
