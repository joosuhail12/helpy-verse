
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

interface FeatureSettingsProps {
  settings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
}

const FeatureSettings: React.FC<FeatureSettingsProps> = ({ settings, onSettingChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="welcome-title" className="text-xs font-medium">Welcome Title</Label>
        <Input
          id="welcome-title"
          value={settings.welcomeTitle}
          onChange={(e) => onSettingChange('welcomeTitle', e.target.value)}
          placeholder="Hello there."
          className="h-8 text-sm"
        />
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="welcome-subtitle" className="text-xs font-medium">Welcome Subtitle</Label>
        <Input
          id="welcome-subtitle"
          value={settings.welcomeSubtitle}
          onChange={(e) => onSettingChange('welcomeSubtitle', e.target.value)}
          placeholder="How can we help?"
          className="h-8 text-sm"
        />
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="response-time" className="text-xs font-medium">Response Time</Label>
        <Select 
          value={settings.responseTime} 
          onValueChange={(value) => onSettingChange('responseTime', value)}
        >
          <SelectTrigger id="response-time" className="h-8 text-sm">
            <SelectValue placeholder="Select response time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="instant">Instant</SelectItem>
            <SelectItem value="quick">Quick (few seconds)</SelectItem>
            <SelectItem value="normal">Normal (&lt; 1 minute)</SelectItem>
            <SelectItem value="slow">Slow (&gt; 1 minute)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 gap-2 mt-4">
        <FeatureToggle
          id="typing-indicator"
          label="Show Typing Indicator"
          checked={settings.enableTypingIndicator}
          onChange={(value) => onSettingChange('enableTypingIndicator', value)}
        />
        
        <FeatureToggle
          id="reactions"
          label="Enable Reactions"
          checked={settings.enableReactions}
          onChange={(value) => onSettingChange('enableReactions', value)}
        />
        
        <FeatureToggle
          id="file-attachments"
          label="Enable File Attachments"
          checked={settings.enableFileAttachments}
          onChange={(value) => onSettingChange('enableFileAttachments', value)}
        />
        
        <FeatureToggle
          id="read-receipts"
          label="Show Read Receipts"
          checked={settings.enableReadReceipts}
          onChange={(value) => onSettingChange('enableReadReceipts', value)}
        />
        
        <FeatureToggle
          id="show-branding"
          label="Show Branding"
          checked={settings.showBranding}
          onChange={(value) => onSettingChange('showBranding', value)}
        />
      </div>
    </div>
  );
};

interface FeatureToggleProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const FeatureToggle = ({ id, label, checked, onChange }: FeatureToggleProps) => {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
      <Label htmlFor={id} className="text-xs font-medium cursor-pointer">{label}</Label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );
};

export default FeatureSettings;
