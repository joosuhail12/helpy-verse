
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

/**
 * Props for the messages tab
 */
export interface MessagesTabProps {
  welcomeTitle: string;
  welcomeSubtitle: string;
  onSettingChange: (field: keyof ChatWidgetSettings['content'], value: string) => void;
}

/**
 * Component for messages tab settings
 */
const MessagesTab = ({
  welcomeTitle,
  welcomeSubtitle,
  onSettingChange
}: MessagesTabProps) => {
  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="welcome-title">Welcome Title</Label>
            <Input
              id="welcome-title"
              placeholder="Hello there."
              value={welcomeTitle}
              onChange={(e) => onSettingChange('welcomeTitle', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="welcome-subtitle">Welcome Subtitle</Label>
            <Input
              id="welcome-subtitle"
              placeholder="How can we help?"
              value={welcomeSubtitle}
              onChange={(e) => onSettingChange('welcomeSubtitle', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MessagesTab;
