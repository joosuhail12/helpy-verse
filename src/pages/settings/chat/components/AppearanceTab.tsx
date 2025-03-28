import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import ColorPicker from './ColorPicker';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Palette, Type, MessageSquare } from 'lucide-react';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

interface AppearanceTabProps {
  primaryColor: string;
  position: string;
  compact: boolean;
  backgroundColor: string;
  backgroundSecondary: string;
  foregroundColor: string;
  userMessageColor: string;
  agentMessageColor: string;
  borderColor: string;
  onColorChange: (color: string) => void;
  onPositionChange: (position: string) => void;
  onCompactChange: (compact: boolean) => void;
  onThemeChange: (field: keyof ChatWidgetSettings, value: string) => void;
}

/**
 * Tab component for appearance settings with expanded theming options
 */
const AppearanceTab = ({ 
  primaryColor, 
  position, 
  compact,
  backgroundColor,
  backgroundSecondary,
  foregroundColor,
  userMessageColor,
  agentMessageColor,
  borderColor,
  onColorChange, 
  onPositionChange, 
  onCompactChange,
  onThemeChange
}: AppearanceTabProps) => {
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
            color={primaryColor}
            onChange={onColorChange}
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
                    checked={position === 'right'}
                    onChange={() => onPositionChange('right')}
                    className="form-radio"
                  />
                  <Label htmlFor="position-right">Right</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="position-left"
                    name="position"
                    checked={position === 'left'}
                    onChange={() => onPositionChange('left')}
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
                checked={compact}
                onCheckedChange={onCompactChange}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              color={backgroundColor}
              onChange={(value) => onThemeChange('backgroundColor', value)}
              label="Background Color"
              id="background-color"
            />
            <ColorPicker
              color={backgroundSecondary}
              onChange={(value) => onThemeChange('backgroundSecondary', value)}
              label="Secondary Background"
              id="background-secondary"
            />
            <ColorPicker
              color={foregroundColor}
              onChange={(value) => onThemeChange('foregroundColor', value)}
              label="Text Color"
              id="foreground-color"
            />
            <ColorPicker
              color={borderColor}
              onChange={(value) => onThemeChange('borderColor', value)}
              label="Border Color"
              id="border-color"
            />
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ColorPicker
              color={userMessageColor}
              onChange={(value) => onThemeChange('userMessageColor', value)}
              label="User Message Color"
              id="user-message-color"
            />
            <ColorPicker
              color={agentMessageColor}
              onChange={(value) => onThemeChange('agentMessageColor', value)}
              label="Agent Message Color"
              id="agent-message-color"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppearanceTab;
