
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import { MessageCircle, Zap, FileText, ThumbsUp, Check } from 'lucide-react';

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
      
      <div className="mt-4">
        <h3 className="text-xs font-semibold text-gray-700 mb-2">Features</h3>
        <div className="grid grid-cols-1 gap-2">
          <FeatureToggle
            id="typing-indicator"
            label="Typing Indicator"
            icon={<MessageCircle className="h-3.5 w-3.5" />}
            checked={settings.enableTypingIndicator}
            onChange={(value) => onSettingChange('enableTypingIndicator', value)}
          />
          
          <FeatureToggle
            id="reactions"
            label="Reactions"
            icon={<ThumbsUp className="h-3.5 w-3.5" />}
            checked={settings.enableReactions}
            onChange={(value) => onSettingChange('enableReactions', value)}
          />
          
          <FeatureToggle
            id="file-attachments"
            label="File Attachments"
            icon={<FileText className="h-3.5 w-3.5" />}
            checked={settings.enableFileAttachments}
            onChange={(value) => onSettingChange('enableFileAttachments', value)}
          />
          
          <FeatureToggle
            id="read-receipts"
            label="Read Receipts"
            icon={<Check className="h-3.5 w-3.5" />}
            checked={settings.enableReadReceipts}
            onChange={(value) => onSettingChange('enableReadReceipts', value)}
          />
          
          <FeatureToggle
            id="show-branding"
            label="Show Branding"
            icon={<Zap className="h-3.5 w-3.5" />}
            checked={settings.showBranding}
            onChange={(value) => onSettingChange('showBranding', value)}
          />
        </div>
      </div>
    </div>
  );
};

interface FeatureToggleProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const FeatureToggle = ({ id, label, icon, checked, onChange }: FeatureToggleProps) => {
  return (
    <div className={`flex items-center justify-between p-2 rounded-md transition-colors ${checked ? 'bg-purple-50' : 'bg-gray-50'}`}>
      <Label htmlFor={id} className="text-xs font-medium cursor-pointer flex items-center gap-1.5">
        <span className={`rounded-full p-1 ${checked ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-600'}`}>
          {icon}
        </span>
        {label}
      </Label>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );
};

export default FeatureSettings;
