
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Check, MailX, Mail, MailQuestion } from 'lucide-react';
import type { EmailChannel } from '@/types/emailChannel';

export interface EmailChannelSelectProps {
  channels?: EmailChannel[];
  selectedChannel?: EmailChannel | null;
  onSelectChannel?: (channel: EmailChannel | null) => void;
  value?: EmailChannel | null;
  onChange?: (channel: EmailChannel | null) => void;
}

const EmailChannelSelect = ({ 
  channels = [], 
  selectedChannel, 
  onSelectChannel,
  value,
  onChange
}: EmailChannelSelectProps) => {
  // Combine both prop patterns
  const actualValue = value || selectedChannel;
  const handleChange = onChange || onSelectChannel;
  
  // If channels array is provided, use it, otherwise use a mock list
  const emailChannels = channels.length > 0 ? channels : [
    {
      id: '1',
      channelName: 'Support',
      senderName: 'Support Team',
      email: 'support@example.com',
      type: 'both' as const,
      createdAt: new Date().toISOString(),
      isActive: true,
      isVerified: true,
      name: 'Support',
      allowAgentConversations: true,
      useAgentNames: true,
      useOriginalSender: false
    },
    {
      id: '2',
      channelName: 'Sales',
      senderName: 'Sales Team',
      email: 'sales@example.com',
      type: 'both' as const,
      createdAt: new Date().toISOString(),
      isActive: true,
      isVerified: true,
      name: 'Sales',
      allowAgentConversations: true,
      useAgentNames: true,
      useOriginalSender: false
    },
    {
      id: '3',
      channelName: 'No-Reply',
      senderName: 'Notifications',
      email: 'no-reply@example.com',
      type: 'outgoing' as const,
      createdAt: new Date().toISOString(),
      isActive: true,
      isVerified: true,
      name: 'No-Reply',
      allowAgentConversations: false,
      useAgentNames: false,
      useOriginalSender: false
    }
  ];

  const getChannelIcon = (channel: EmailChannel) => {
    if (!channel.isVerified) return <MailX className="h-4 w-4 text-destructive" />;
    
    if (channel.type === 'incoming') return <Mail className="h-4 w-4 text-blue-500" />;
    if (channel.type === 'outgoing') return <Mail className="h-4 w-4 text-green-500" />;
    return <Mail className="h-4 w-4 text-purple-500" />;
  };

  return (
    <Select 
      value={actualValue?.id || ''} 
      onValueChange={(id) => {
        if (handleChange) {
          const channel = emailChannels.find(c => c.id === id) || null;
          handleChange(channel);
        }
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a channel">
          {actualValue ? (
            <div className="flex items-center">
              {getChannelIcon(actualValue)}
              <span className="ml-2">{actualValue.channelName} ({actualValue.email})</span>
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <MailQuestion className="h-4 w-4 mr-2" />
              <span>Select a channel</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {emailChannels.map(channel => (
          <SelectItem key={channel.id} value={channel.id}>
            <div className="flex items-center">
              {getChannelIcon(channel)}
              <span className="ml-2">{channel.channelName} ({channel.email})</span>
              {!channel.isActive && (
                <span className="ml-2 text-xs text-muted-foreground">(Inactive)</span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default EmailChannelSelect;
