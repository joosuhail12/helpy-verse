
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

interface ColorSettingsProps {
  settings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
}

const ColorSettings: React.FC<ColorSettingsProps> = ({ settings, onSettingChange }) => {
  // Color presets for easy selection
  const colorPresets = {
    primary: ['#9b87f5', '#7E69AB', '#33C3F0', '#D6BCFA', '#E5DEFF'],
    messageBox: ['#f9f9f9', '#eeeeee', '#ffffff', '#f5f5f5', '#f1f0fb'],
    userMessage: ['#9b87f5', '#7E69AB', '#33C3F0', '#4a5568', '#805ad5'],
    agentMessage: ['#f1f1f1', '#eeeeee', '#e2e8f0', '#edf2f7', '#e9d8fd']
  };

  const ColorPicker = ({ 
    id, 
    label, 
    value, 
    onChange, 
    presets 
  }: { 
    id: string; 
    label: string; 
    value: string; 
    onChange: (value: string) => void;
    presets: string[];
  }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-medium flex items-center justify-between">
        {label}
        <div 
          className="w-4 h-4 rounded-full border border-gray-300" 
          style={{ backgroundColor: value }}
        />
      </Label>
      <div className="flex items-center gap-2">
        <Input 
          id={id} 
          type="color" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-10 h-8 p-1 cursor-pointer rounded-md" 
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 h-8 text-sm"
        />
      </div>
      <div className="flex gap-1.5 mt-1">
        {presets.map(color => (
          <button
            key={color}
            type="button"
            className={`w-6 h-6 rounded-full border transition-transform hover:scale-110 focus:outline-none ${value === color ? 'ring-2 ring-purple-500 ring-offset-1' : 'border-gray-200'}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            aria-label={`Set color to ${color}`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <ColorPicker
        id="primary-color"
        label="Primary Color"
        value={settings.primaryColor}
        onChange={(value) => onSettingChange('primaryColor', value)}
        presets={colorPresets.primary}
      />
      
      <ColorPicker
        id="header-color"
        label="Header Color"
        value={settings.headerColor}
        onChange={(value) => onSettingChange('headerColor', value)}
        presets={colorPresets.primary}
      />
      
      <ColorPicker
        id="message-box-color"
        label="Message Box Color"
        value={settings.messageBoxColor}
        onChange={(value) => onSettingChange('messageBoxColor', value)}
        presets={colorPresets.messageBox}
      />
      
      <ColorPicker
        id="user-message-color"
        label="User Message Color"
        value={settings.userMessageColor}
        onChange={(value) => onSettingChange('userMessageColor', value)}
        presets={colorPresets.userMessage}
      />
      
      <ColorPicker
        id="agent-message-color"
        label="Agent Message Color"
        value={settings.agentMessageColor}
        onChange={(value) => onSettingChange('agentMessageColor', value)}
        presets={colorPresets.agentMessage}
      />
    </div>
  );
};

export default ColorSettings;
