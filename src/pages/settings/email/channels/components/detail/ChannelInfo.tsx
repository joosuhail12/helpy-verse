
import React from 'react';
import { User, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface ChannelInfoProps {
  senderName: string;
  email: string;
  autoBccEmail?: string;
  noReplyEmail?: string;
}

export const ChannelInfo: React.FC<ChannelInfoProps> = ({
  senderName,
  email,
  autoBccEmail,
  noReplyEmail,
}) => {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Sender Name</label>
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          {senderName}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email Address</label>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="h-4 w-4" />
          {email}
        </div>
      </div>

      {autoBccEmail && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Auto BCC</label>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            {autoBccEmail}
          </div>
        </div>
      )}

      {noReplyEmail && (
        <div className="space-y-2">
          <label className="text-sm font-medium">No Reply Address</label>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            {noReplyEmail}
          </div>
        </div>
      )}
    </div>
  );
};
