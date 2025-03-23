
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import EmailChannelSelect from "../EmailChannelSelect";
import AssigneeSelect from "../AssigneeSelect";
import type { EmailChannel } from "@/types/emailChannel";
import { Dispatch, SetStateAction } from "react";
import type { AssigneeOption } from "../types";

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
            value={selectedChannel}
            onChange={setSelectedChannel}
            selectedChannel={selectedChannel}
            onSelectChannel={setSelectedChannel}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="assignee">Assignee</Label>
          <AssigneeSelect
            value={selectedAssignee}
            onChange={setSelectedAssignee}
            selectedAssignee={selectedAssignee}
            onSelectAssignee={setSelectedAssignee}
          />
        </div>
      </CardContent>
    </Card>
  );
}
