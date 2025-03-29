
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Paintbrush, CheckCircle2 } from 'lucide-react';

interface ColorSettingsProps {
  settings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
}

const ColorSettings: React.FC<ColorSettingsProps> = ({ settings, onSettingChange }) => {
  // Enhanced Color presets for easy selection
  const colorPresets = {
    primary: [
      { value: '#9b87f5', name: 'Purple' },
      { value: '#7E69AB', name: 'Lavender' },
      { value: '#33C3F0', name: 'Sky Blue' },
      { value: '#D6BCFA', name: 'Lilac' },
      { value: '#E5DEFF', name: 'Soft Purple' },
      { value: '#8B5CF6', name: 'Indigo' },
      { value: '#10B981', name: 'Emerald' },
      { value: '#F43F5E', name: 'Rose' },
      { value: '#F97316', name: 'Orange' },
      { value: '#0EA5E9', name: 'Blue' }
    ],
    messageBox: [
      { value: '#f9f9f9', name: 'Light Gray' },
      { value: '#eeeeee', name: 'Gray' },
      { value: '#ffffff', name: 'White' },
      { value: '#f5f5f5', name: 'Silver' },
      { value: '#f1f0fb', name: 'Lavender' }
    ],
    userMessage: [
      { value: '#9b87f5', name: 'Purple' },
      { value: '#7E69AB', name: 'Lavender' },
      { value: '#33C3F0', name: 'Sky Blue' },
      { value: '#4a5568', name: 'Slate' },
      { value: '#805ad5', name: 'Violet' }
    ],
    agentMessage: [
      { value: '#f1f1f1', name: 'Light Gray' },
      { value: '#eeeeee', name: 'Gray' },
      { value: '#e2e8f0', name: 'Cool Gray' },
      { value: '#edf2f7', name: 'Blue Gray' },
      { value: '#e9d8fd', name: 'Lavender' }
    ]
  };

  const [activeTab, setActiveTab] = React.useState('main');

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
    presets: { value: string, name: string }[];
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
      <div className="flex flex-wrap gap-1.5 mt-1">
        {presets.map(preset => (
          <button
            key={preset.value}
            type="button"
            className="relative w-6 h-6 rounded-full border transition-transform hover:scale-110 focus:outline-none group"
            style={{ backgroundColor: preset.value }}
            onClick={() => onChange(preset.value)}
            aria-label={`Set color to ${preset.name}`}
            title={preset.name}
          >
            {value === preset.value && (
              <CheckCircle2 className="absolute -top-1 -right-1 w-3 h-3 text-white bg-purple-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full mb-3">
          <TabsTrigger value="main" className="text-xs">Main Colors</TabsTrigger>
          <TabsTrigger value="messages" className="text-xs">Message Colors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="main" className="focus-visible:outline-none focus-visible:ring-0 space-y-4">
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
        </TabsContent>
        
        <TabsContent value="messages" className="focus-visible:outline-none focus-visible:ring-0 space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ColorSettings;
