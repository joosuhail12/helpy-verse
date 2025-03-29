import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, SidebarLeft, SidebarRight, MonitorSmartphone, ArrowRightLeft, LayoutGrid } from 'lucide-react';

interface AppearanceSettingsProps {
  settings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ settings, onSettingChange }) => {
  return (
    <div className="space-y-5">
      <div>
        <Label className="text-xs font-medium">Welcome Message</Label>
        <div className="space-y-2 mt-2">
          <div>
            <Label htmlFor="welcome-title" className="text-xs text-gray-600">Title</Label>
            <Input
              id="welcome-title"
              value={settings.welcomeTitle}
              onChange={(e) => onSettingChange('welcomeTitle', e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="welcome-subtitle" className="text-xs text-gray-600">Subtitle</Label>
            <Input
              id="welcome-subtitle"
              value={settings.welcomeSubtitle}
              onChange={(e) => onSettingChange('welcomeSubtitle', e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="header-title" className="text-xs text-gray-600">Header Title</Label>
            <Input
              id="header-title"
              value={settings.headerTitle}
              onChange={(e) => onSettingChange('headerTitle', e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <Label className="text-xs font-medium mb-3 block">Position & Layout</Label>
        
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <Label className="text-sm">Widget Position</Label>
          </div>
          
          <RadioGroup 
            value={settings.position} 
            onValueChange={(value) => onSettingChange('position', value)}
            className="flex gap-3 mt-1"
          >
            <div className="flex flex-col items-center">
              <div className={`p-4 rounded-md border ${settings.position === 'left' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'} cursor-pointer relative`}
                onClick={() => onSettingChange('position', 'left')}>
                <SidebarLeft className="h-5 w-5 text-gray-600" />
                {settings.position === 'left' && (
                  <CheckCircle className="absolute -top-2 -right-2 h-4 w-4 text-purple-500 bg-white rounded-full" />
                )}
              </div>
              <Label htmlFor="position-left" className="text-xs mt-1">Left</Label>
              <RadioGroupItem value="left" id="position-left" className="sr-only" />
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`p-4 rounded-md border ${settings.position === 'right' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'} cursor-pointer relative`}
                onClick={() => onSettingChange('position', 'right')}>
                <SidebarRight className="h-5 w-5 text-gray-600" />
                {settings.position === 'right' && (
                  <CheckCircle className="absolute -top-2 -right-2 h-4 w-4 text-purple-500 bg-white rounded-full" />
                )}
              </div>
              <Label htmlFor="position-right" className="text-xs mt-1">Right</Label>
              <RadioGroupItem value="right" id="position-right" className="sr-only" />
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MonitorSmartphone className="h-4 w-4 text-gray-500" />
            <div>
              <Label htmlFor="compact-mode" className="text-sm">
                Compact Mode
              </Label>
              <p className="text-xs text-gray-500">
                Use smaller size on all devices
              </p>
            </div>
          </div>
          <Switch 
            id="compact-mode" 
            checked={settings.compact} 
            onCheckedChange={(checked) => onSettingChange('compact', checked)}
          />
        </div>
      </div>
      
      <div className="pt-4 border-t border-gray-100">
        <Label className="text-xs font-medium mb-1 block">Launcher Style</Label>
        <RadioGroup 
          value={settings.launcherStyle} 
          onValueChange={(value) => onSettingChange('launcherStyle', value)}
          className="flex gap-3 mt-2"
        >
          <div className="flex flex-col items-center">
            <div className={`p-4 rounded-md border ${settings.launcherStyle === 'circle' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'} cursor-pointer relative`}
              onClick={() => onSettingChange('launcherStyle', 'circle')}>
              <div className="w-5 h-5 rounded-full border border-gray-400"></div>
              {settings.launcherStyle === 'circle' && (
                <CheckCircle className="absolute -top-2 -right-2 h-4 w-4 text-purple-500 bg-white rounded-full" />
              )}
            </div>
            <Label htmlFor="launcher-circle" className="text-xs mt-1">Circle</Label>
            <RadioGroupItem value="circle" id="launcher-circle" className="sr-only" />
          </div>
          
          <div className="flex flex-col items-center">
            <div className={`p-4 rounded-md border ${settings.launcherStyle === 'rectangle' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'} cursor-pointer relative`}
              onClick={() => onSettingChange('launcherStyle', 'rectangle')}>
              <div className="w-6 h-4 rounded-md border border-gray-400"></div>
              {settings.launcherStyle === 'rectangle' && (
                <CheckCircle className="absolute -top-2 -right-2 h-4 w-4 text-purple-500 bg-white rounded-full" />
              )}
            </div>
            <Label htmlFor="launcher-rectangle" className="text-xs mt-1">Rectangle</Label>
            <RadioGroupItem value="rectangle" id="launcher-rectangle" className="sr-only" />
          </div>
        </RadioGroup>
      </div>
      
      <div className="pt-4 border-t border-gray-100">
        <Label className="text-xs font-medium mb-2 block">Font Family</Label>
        <Select 
          value={settings.fontFamily} 
          onValueChange={(value) => onSettingChange('fontFamily', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select font family" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Inter, system-ui, sans-serif">Inter (Modern)</SelectItem>
            <SelectItem value="'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif">SF Pro (Apple)</SelectItem>
            <SelectItem value="Roboto, 'Helvetica Neue', sans-serif">Roboto (Android)</SelectItem>
            <SelectItem value="Arial, sans-serif">Arial (Classic)</SelectItem>
            <SelectItem value="Georgia, serif">Georgia (Serif)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AppearanceSettings;
