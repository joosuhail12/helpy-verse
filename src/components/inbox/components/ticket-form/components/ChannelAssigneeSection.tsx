
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import EmailChannelSelect from "../EmailChannelSelect";
import AssigneeSelect from "../AssigneeSelect";
import type { EmailChannel } from "@/types/emailChannel";
import { Dispatch, SetStateAction } from "react";

interface AssigneeOption {
  id: string | null;
  name: string;
  email?: string;
  avatar?: string;
}

interface ChannelAssigneeSectionProps {
  selectedChannel: EmailChannel | null;
  setSelectedChannel: Dispatch<SetStateAction<EmailChannel | null>>;
  selectedAssignee: AssigneeOption;
  setSelectedAssignee: Dispatch<SetStateAction<AssigneeOption>>;
  className?: string;
}

export default function ChannelAssigneeSection({
  selectedChannel,
  setSelectedChannel,
  selectedAssignee,
  setSelectedAssignee,
  className = "",
}: ChannelAssigneeSectionProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="channel">Channel</Label>
          <EmailChannelSelect
            selectedChannel={selectedChannel}
            onChannelChange={setSelectedChannel}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="assignee">Assignee</Label>
          <AssigneeSelect
            selectedAssignee={selectedAssignee}
            onSelectAssignee={setSelectedAssignee}
            onChange={setSelectedAssignee} // Add the onChange prop to match the required interface
          />
        </div>
      </CardContent>
    </Card>
  );
}
