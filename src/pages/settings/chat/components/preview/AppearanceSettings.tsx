
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

interface AppearanceSettingsProps {
  settings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ settings, onSettingChange }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Widget Position</Label>
        <ToggleGroup 
          type="single" 
          value={settings.position}
          onValueChange={(value) => value && onSettingChange('position', value)}
          className="justify-start"
        >
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="space-y-2">
        <Label>Launcher Style</Label>
        <ToggleGroup 
          type="single" 
          value={settings.launcherStyle}
          onValueChange={(value) => value && onSettingChange('launcherStyle', value)}
          className="justify-start"
        >
          <ToggleGroupItem value="circle">Circle</ToggleGroupItem>
          <ToggleGroupItem value="rectangle">Rectangle</ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div className="flex items-center justify-between space-x-2">
        <Label htmlFor="compact-mode">Compact Mode</Label>
        <Switch
          id="compact-mode"
          checked={settings.compact}
          onCheckedChange={(value) => onSettingChange('compact', value)}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="header-title">Header Title</Label>
        <Input
          id="header-title"
          value={settings.headerTitle}
          onChange={(e) => onSettingChange('headerTitle', e.target.value)}
          placeholder="Chat with us"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="font-family">Font Family</Label>
        <Input
          id="font-family"
          value={settings.fontFamily}
          onChange={(e) => onSettingChange('fontFamily', e.target.value)}
          placeholder="Inter, system-ui, sans-serif"
        />
      </div>
    </div>
  );
};

export default AppearanceSettings;
