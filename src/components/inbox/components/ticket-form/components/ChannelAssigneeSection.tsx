
import { Label } from "@/components/ui/label";
import EmailChannelSelect from '../EmailChannelSelect';
import AssigneeSelect from '../AssigneeSelect';
import type { EmailChannel } from '@/types/emailChannel';
import type { AssigneeOption } from '../types';

interface ChannelAssigneeSectionProps {
  emailChannel: EmailChannel | null;
  assignee: AssigneeOption | null;
  onEmailChannelChange: (emailChannel: EmailChannel | null) => void;
  onAssigneeChange: (assignee: AssigneeOption | null) => void;
}

const ChannelAssigneeSection = ({
  emailChannel,
  assignee,
  onEmailChannelChange,
  onAssigneeChange
}: ChannelAssigneeSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div className="space-y-2.5">
        <Label htmlFor="emailChannel" className="text-sm font-medium text-gray-700">
          Email Channel <span className="text-red-500">*</span>
        </Label>
        <EmailChannelSelect 
          selectedChannel={emailChannel}
          onSelectChannel={onEmailChannelChange}
        />
      </div>
      
      <div className="space-y-2.5">
        <Label htmlFor="assignee" className="text-sm font-medium text-gray-700">
          Assignee
        </Label>
        <AssigneeSelect 
          value={assignee}
          onChange={onAssigneeChange}
        />
      </div>
    </div>
  );
};

export default ChannelAssigneeSection;
