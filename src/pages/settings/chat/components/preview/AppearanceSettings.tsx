
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import { ArrowLeft, ArrowRight, Circle, Square, Compass } from 'lucide-react';

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
          <OptionButton 
            isSelected={settings.position === 'left'} 
            onClick={() => onSettingChange('position', 'left')}
            icon={<ArrowLeft className="h-4 w-4 mr-1.5" />}
            label="Left"
          />
          <OptionButton 
            isSelected={settings.position === 'right'} 
            onClick={() => onSettingChange('position', 'right')}
            icon={<ArrowRight className="h-4 w-4 mr-1.5" />}
            label="Right"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-xs font-medium">Launcher Style</Label>
        <div className="grid grid-cols-2 gap-2">
          <OptionButton 
            isSelected={settings.launcherStyle === 'circle'} 
            onClick={() => onSettingChange('launcherStyle', 'circle')}
            icon={<Circle className="h-4 w-4 mr-1.5" />}
            label="Circle"
          />
          <OptionButton 
            isSelected={settings.launcherStyle === 'rectangle'} 
            onClick={() => onSettingChange('launcherStyle', 'rectangle')}
            icon={<Square className="h-4 w-4 mr-1.5" />}
            label="Rectangle"
          />
        </div>
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
      
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-700">Display Options</h3>
        <div className="space-y-2">
          <ToggleOption
            id="compact-mode"
            label="Compact Mode"
            icon={<Compass className="h-4 w-4" />}
            checked={settings.compact}
            onChange={(value) => onSettingChange('compact', value)}
          />
          
          <ToggleOption
            id="enable-animation"
            label="Enable Animations"
            icon={<Compass className="h-4 w-4" />}
            checked={settings.enableAnimation}
            onChange={(value) => onSettingChange('enableAnimation', value)}
          />
        </div>
      </div>
    </div>
  );
};

interface OptionButtonProps {
  isSelected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const OptionButton = ({ isSelected, onClick, icon, label }: OptionButtonProps) => {
  return (
    <button 
      onClick={onClick}
      className={`
        flex items-center justify-center py-1.5 px-2.5 text-xs rounded-md transition-colors
        ${isSelected 
          ? 'bg-purple-500 text-white hover:bg-purple-600' 
          : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
        }
      `}
    >
      {icon} {label}
    </button>
  );
};

interface ToggleOptionProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  checked: boolean;
  onChange: (value: boolean) => void;
}

const ToggleOption = ({ id, label, icon, checked, onChange }: ToggleOptionProps) => {
  return (
    <div className={`flex items-center justify-between p-2 rounded-md transition-colors ${checked ? 'bg-purple-50' : 'bg-gray-50'}`}>
      <Label htmlFor={id} className="text-xs font-medium cursor-pointer flex items-center">
        <span className={`rounded-full p-1 mr-1.5 ${checked ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-600'}`}>
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

export default AppearanceSettings;
