
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

interface ColorSettingsProps {
  settings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
}

const ColorSettings: React.FC<ColorSettingsProps> = ({ settings, onSettingChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="primary-color">Primary Color</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="primary-color" 
            type="color" 
            value={settings.primaryColor} 
            onChange={(e) => onSettingChange('primaryColor', e.target.value)} 
            className="w-10 h-10 p-1 cursor-pointer" 
          />
          <Input
            value={settings.primaryColor}
            onChange={(e) => onSettingChange('primaryColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="header-color">Header Color</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="header-color" 
            type="color" 
            value={settings.headerColor} 
            onChange={(e) => onSettingChange('headerColor', e.target.value)} 
            className="w-10 h-10 p-1 cursor-pointer" 
          />
          <Input
            value={settings.headerColor}
            onChange={(e) => onSettingChange('headerColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message-box-color">Message Box Color</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="message-box-color" 
            type="color" 
            value={settings.messageBoxColor} 
            onChange={(e) => onSettingChange('messageBoxColor', e.target.value)} 
            className="w-10 h-10 p-1 cursor-pointer" 
          />
          <Input
            value={settings.messageBoxColor}
            onChange={(e) => onSettingChange('messageBoxColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="user-message-color">User Message Color</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="user-message-color" 
            type="color" 
            value={settings.userMessageColor} 
            onChange={(e) => onSettingChange('userMessageColor', e.target.value)} 
            className="w-10 h-10 p-1 cursor-pointer" 
          />
          <Input
            value={settings.userMessageColor}
            onChange={(e) => onSettingChange('userMessageColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="agent-message-color">Agent Message Color</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="agent-message-color" 
            type="color" 
            value={settings.agentMessageColor} 
            onChange={(e) => onSettingChange('agentMessageColor', e.target.value)} 
            className="w-10 h-10 p-1 cursor-pointer" 
          />
          <Input
            value={settings.agentMessageColor}
            onChange={(e) => onSettingChange('agentMessageColor', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
};

export default ColorSettings;
