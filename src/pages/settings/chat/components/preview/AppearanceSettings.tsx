
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
        <Label className="text-xs font-medium">Widget Position</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant={settings.position === 'left' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onSettingChange('position', 'left')}
            className="w-full flex-1 justify-center"
          >
            Left
          </Button>
          <Button 
            variant={settings.position === 'right' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onSettingChange('position', 'right')}
            className="w-full flex-1 justify-center"
          >
            Right
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-xs font-medium">Launcher Style</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant={settings.launcherStyle === 'circle' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onSettingChange('launcherStyle', 'circle')}
            className="w-full flex-1 justify-center"
          >
            Circle
          </Button>
          <Button 
            variant={settings.launcherStyle === 'rectangle' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => onSettingChange('launcherStyle', 'rectangle')}
            className="w-full flex-1 justify-center"
          >
            Rectangle
          </Button>
        </div>
      </div>
      
      <div className="flex items-center justify-between space-x-2 bg-gray-50 p-2 rounded-md">
        <Label htmlFor="compact-mode" className="text-xs font-medium cursor-pointer">Compact Mode</Label>
        <Switch
          id="compact-mode"
          checked={settings.compact}
          onCheckedChange={(value) => onSettingChange('compact', value)}
        />
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="header-title" className="text-xs font-medium">Header Title</Label>
        <Input
          id="header-title"
          value={settings.headerTitle}
          onChange={(e) => onSettingChange('headerTitle', e.target.value)}
          placeholder="Chat with us"
          className="h-8 text-sm"
        />
      </div>
      
      <div className="space-y-1.5">
        <Label htmlFor="font-family" className="text-xs font-medium">Font Family</Label>
        <Input
          id="font-family"
          value={settings.fontFamily}
          onChange={(e) => onSettingChange('fontFamily', e.target.value)}
          placeholder="Inter, system-ui, sans-serif"
          className="h-8 text-sm"
        />
      </div>
      
      <div className="flex items-center justify-between space-x-2 bg-gray-50 p-2 rounded-md">
        <Label htmlFor="enable-animation" className="text-xs font-medium cursor-pointer">Enable Animations</Label>
        <Switch
          id="enable-animation"
          checked={settings.enableAnimation}
          onCheckedChange={(value) => onSettingChange('enableAnimation', value)}
        />
      </div>
    </div>
  );
};

// Helper Button component for this module only
const Button = ({ 
  children, 
  variant, 
  size, 
  className, 
  onClick 
}: { 
  children: React.ReactNode; 
  variant: 'default' | 'outline'; 
  size: 'sm'; 
  className?: string;
  onClick: () => void;
}) => {
  return (
    <button 
      onClick={onClick}
      className={`
        ${variant === 'default' ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'} 
        ${size === 'sm' ? 'text-xs py-1.5 px-2.5' : ''} 
        rounded-md transition-colors ${className}
      `}
    >
      {children}
    </button>
  );
};

export default AppearanceSettings;
