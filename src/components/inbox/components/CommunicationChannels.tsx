
import { Mail, Phone, MessageSquare, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface Channel {
  type: 'email' | 'phone' | 'chat' | 'video';
  value: string;
  isPreferred: boolean;
  lastUsed?: string;
}

interface CommunicationChannelsProps {
  channels: Channel[];
  isLoading?: boolean;
}

const CommunicationChannels = ({ channels, isLoading }: CommunicationChannelsProps) => {
  const getChannelIcon = (type: Channel['type']) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded bg-muted"></div>
              <div className="h-4 bg-muted rounded flex-1"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-3">
        {channels.map((channel, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="p-2 rounded-lg bg-muted">
              {getChannelIcon(channel.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{channel.value}</p>
              {channel.lastUsed && (
                <p className="text-xs text-muted-foreground">
                  Last used {new Date(channel.lastUsed).toLocaleDateString()}
                </p>
              )}
            </div>
            {channel.isPreferred && (
              <Badge variant="secondary">Preferred</Badge>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

export default CommunicationChannels;
