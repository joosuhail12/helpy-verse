
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

interface FeatureSettingsProps {
  settings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
}

const FeatureSettings: React.FC<FeatureSettingsProps> = ({ settings, onSettingChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="welcome-title">Welcome Title</Label>
        <Input
          id="welcome-title"
          value={settings.welcomeTitle}
          onChange={(e) => onSettingChange('welcomeTitle', e.target.value)}
          placeholder="Hello there."
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="welcome-subtitle">Welcome Subtitle</Label>
        <Input
          id="welcome-subtitle"
          value={settings.welcomeSubtitle}
          onChange={(e) => onSettingChange('welcomeSubtitle', e.target.value)}
          placeholder="How can we help?"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="typing-indicator">Show Typing Indicator</Label>
        <Switch
          id="typing-indicator"
          checked={settings.enableTypingIndicator}
          onCheckedChange={(value) => onSettingChange('enableTypingIndicator', value)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="reactions">Enable Reactions</Label>
        <Switch
          id="reactions"
          checked={settings.enableReactions}
          onCheckedChange={(value) => onSettingChange('enableReactions', value)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="file-attachments">Enable File Attachments</Label>
        <Switch
          id="file-attachments"
          checked={settings.enableFileAttachments}
          onCheckedChange={(value) => onSettingChange('enableFileAttachments', value)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <Label htmlFor="read-receipts">Show Read Receipts</Label>
        <Switch
          id="read-receipts"
          checked={settings.enableReadReceipts}
          onCheckedChange={(value) => onSettingChange('enableReadReceipts', value)}
        />
      </div>
    </div>
  );
};

export default FeatureSettings;
