
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ColorPicker from './ColorPicker';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Palette, Type, MessageSquare } from 'lucide-react';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

interface AppearanceTabProps {
  settings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
}

/**
 * Tab component for appearance settings with expanded theming options
 */
const AppearanceTab = ({ settings, onSettingChange }: AppearanceTabProps) => {
  const handleColorChange = (color: string) => {
    onSettingChange('primaryColor', color);
  };

  const handlePositionChange = (position: string) => {
    onSettingChange('position', position as 'left' | 'right');
  };

  const handleCompactChange = (compact: boolean) => {
    onSettingChange('compact', compact);
  };

  const updateNestedSetting = (path: string[], value: string) => {
    const settingsCopy = { ...settings };
    let current: any = settingsCopy;
    
    // Navigate to the second-to-last level
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) current[path[i]] = {};
      current = current[path[i]];
    }
    
    // Set the value at the last level
    current[path[path.length - 1]] = value;
    
    // Update the entire settings object
    onSettingChange('colors', settingsCopy.colors);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="mb-4 w-full">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Basic Settings</span>
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>Colors</span>
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <ColorPicker
            color={settings.primaryColor}
            onChange={handleColorChange}
            label="Primary Color"
            id="primary-color"
          />
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Widget Position</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="position-right"
                    name="position"
                    checked={settings.position === 'right'}
                    onChange={() => handlePositionChange('right')}
                    className="form-radio"
                  />
                  <Label htmlFor="position-right">Right</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="position-left"
                    name="position"
                    checked={settings.position === 'left'}
                    onChange={() => handlePositionChange('left')}
                    className="form-radio"
                  />
                  <Label htmlFor="position-left">Left</Label>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="compact-mode">Compact Mode</Label>
              <Switch
                id="compact-mode"
                checked={settings.compact}
                onCheckedChange={handleCompactChange}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              color={settings.colors.background}
              onChange={(value) => updateNestedSetting(['colors', 'background'], value)}
              label="Background Color"
              id="background-color"
            />
            <ColorPicker
              color={settings.colors.backgroundSecondary}
              onChange={(value) => updateNestedSetting(['colors', 'backgroundSecondary'], value)}
              label="Secondary Background"
              id="background-secondary"
            />
            <ColorPicker
              color={settings.colors.foreground}
              onChange={(value) => updateNestedSetting(['colors', 'foreground'], value)}
              label="Text Color"
              id="foreground-color"
            />
            <ColorPicker
              color={settings.colors.border}
              onChange={(value) => updateNestedSetting(['colors', 'border'], value)}
              label="Border Color"
              id="border-color"
            />
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              color={settings.colors.userMessage.background}
              onChange={(value) => updateNestedSetting(['colors', 'userMessage', 'background'], value)}
              label="User Message Color"
              id="user-message-color"
            />
            <ColorPicker
              color={settings.colors.userMessage.text}
              onChange={(value) => updateNestedSetting(['colors', 'userMessage', 'text'], value)}
              label="User Message Text"
              id="user-message-text"
            />
            <ColorPicker
              color={settings.colors.agentMessage.background}
              onChange={(value) => updateNestedSetting(['colors', 'agentMessage', 'background'], value)}
              label="Agent Message Color"
              id="agent-message-color"
            />
            <ColorPicker
              color={settings.colors.agentMessage.text}
              onChange={(value) => updateNestedSetting(['colors', 'agentMessage', 'text'], value)}
              label="Agent Message Text"
              id="agent-message-text"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppearanceTab;
