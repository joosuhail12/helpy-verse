
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ColorPicker from './ColorPicker';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import { Separator } from '@/components/ui/separator';

interface ColorsTabProps {
  settings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: string) => void;
}

/**
 * Tab component for colors settings
 */
const ColorsTab = ({ 
  settings,
  onSettingChange 
}: ColorsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-medium">Color Settings</h3>
        <p className="text-sm text-gray-500">
          Customize the colors used in your chat widget to match your brand.
        </p>
        <Separator className="my-3" />
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="primary-color">Primary Color</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="primary-color" 
            type="color" 
            value={settings.primaryColor} 
            onChange={(e) => onSettingChange('primaryColor', e.target.value)} 
            className="w-12 h-12 p-1 cursor-pointer" 
          />
          <div className="flex-1 space-y-1">
            <Input
              value={settings.primaryColor}
              onChange={(e) => onSettingChange('primaryColor', e.target.value)}
            />
            <p className="text-xs text-gray-500">Used for buttons, links, and other primary UI elements</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="header-color">Header Color</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="header-color" 
            type="color" 
            value={settings.headerColor} 
            onChange={(e) => onSettingChange('headerColor', e.target.value)} 
            className="w-12 h-12 p-1 cursor-pointer" 
          />
          <div className="flex-1 space-y-1">
            <Input
              value={settings.headerColor}
              onChange={(e) => onSettingChange('headerColor', e.target.value)}
            />
            <p className="text-xs text-gray-500">Color for the chat widget header</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="user-message-color">User Message Color</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="user-message-color" 
            type="color" 
            value={settings.userMessageColor} 
            onChange={(e) => onSettingChange('userMessageColor', e.target.value)} 
            className="w-12 h-12 p-1 cursor-pointer" 
          />
          <div className="flex-1 space-y-1">
            <Input
              value={settings.userMessageColor}
              onChange={(e) => onSettingChange('userMessageColor', e.target.value)}
            />
            <p className="text-xs text-gray-500">Background color for user messages</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="agent-message-color">Agent Message Color</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="agent-message-color" 
            type="color" 
            value={settings.agentMessageColor} 
            onChange={(e) => onSettingChange('agentMessageColor', e.target.value)} 
            className="w-12 h-12 p-1 cursor-pointer" 
          />
          <div className="flex-1 space-y-1">
            <Input
              value={settings.agentMessageColor}
              onChange={(e) => onSettingChange('agentMessageColor', e.target.value)}
            />
            <p className="text-xs text-gray-500">Background color for agent messages</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="message-box-color">Message Box Color</Label>
        <div className="flex items-center gap-2">
          <Input 
            id="message-box-color" 
            type="color" 
            value={settings.messageBoxColor} 
            onChange={(e) => onSettingChange('messageBoxColor', e.target.value)} 
            className="w-12 h-12 p-1 cursor-pointer" 
          />
          <div className="flex-1 space-y-1">
            <Input
              value={settings.messageBoxColor}
              onChange={(e) => onSettingChange('messageBoxColor', e.target.value)}
            />
            <p className="text-xs text-gray-500">Background color for the message input box</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorsTab;
