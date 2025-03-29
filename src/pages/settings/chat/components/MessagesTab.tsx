
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import { Separator } from '@/components/ui/separator';

interface MessagesTabProps {
  welcomeTitle: string;
  welcomeSubtitle: string;
  onSettingChange: (field: keyof ChatWidgetSettings, value: string) => void;
}

/**
 * Tab component for messages settings
 */
const MessagesTab = ({ 
  welcomeTitle, 
  welcomeSubtitle, 
  onSettingChange 
}: MessagesTabProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium">Welcome Messages</h3>
        <p className="text-sm text-gray-500">
          Customize the messages shown to users when they first open the chat widget.
        </p>
        <Separator className="my-3" />
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="header-title">Header Title</Label>
        <Input
          id="header-title"
          value={onSettingChange.length > 0 ? welcomeTitle : ''}
          onChange={(e) => onSettingChange('headerTitle', e.target.value)}
          placeholder="Chat with us"
        />
        <p className="text-xs text-gray-500">Title shown in the chat header</p>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="welcome-title">Welcome Title</Label>
        <Input
          id="welcome-title"
          value={welcomeTitle}
          onChange={(e) => onSettingChange('welcomeTitle', e.target.value)}
          placeholder="Hello there."
        />
        <p className="text-xs text-gray-500">First line of the welcome message</p>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="welcome-subtitle">Welcome Subtitle</Label>
        <Textarea
          id="welcome-subtitle"
          value={welcomeSubtitle}
          onChange={(e) => onSettingChange('welcomeSubtitle', e.target.value)}
          placeholder="How can we help?"
          rows={3}
        />
        <p className="text-xs text-gray-500">Additional welcome message text</p>
      </div>
    </div>
  );
};

export default MessagesTab;
