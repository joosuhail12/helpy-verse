
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Mail } from "lucide-react";

interface TeamChannelsProps {
  channels?: {
    chat?: string;
    email: string[];
  };
}

const TeamChannels = ({ channels }: TeamChannelsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium">Chat Channel</h3>
        </div>
        {channels?.chat ? (
          <Badge variant="outline">{channels.chat}</Badge>
        ) : (
          <p className="text-sm text-gray-500">No chat channel configured</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-gray-500" />
          <h3 className="font-medium">Email Channels</h3>
        </div>
        {channels?.email.length ? (
          <div className="flex flex-wrap gap-2">
            {channels.email.map((email) => (
              <Badge key={email} variant="outline">{email}</Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No email channels configured</p>
        )}
      </div>
    </div>
  );
};

export default TeamChannels;
