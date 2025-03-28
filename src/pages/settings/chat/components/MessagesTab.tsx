
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MessagesTabProps {
  welcomeTitle: string;
  welcomeSubtitle: string;
  onSettingChange: (field: string, value: string) => void;
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
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="welcome-title">Welcome Title</Label>
        <Input
          id="welcome-title"
          value={welcomeTitle}
          onChange={(e) => onSettingChange('welcomeTitle', e.target.value)}
          placeholder="Hello there."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="welcome-subtitle">Welcome Subtitle</Label>
        <Input
          id="welcome-subtitle"
          value={welcomeSubtitle}
          onChange={(e) => onSettingChange('welcomeSubtitle', e.target.value)}
          placeholder="How can we help?"
        />
      </div>
    </div>
  );
};

export default MessagesTab;
