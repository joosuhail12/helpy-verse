
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Settings, Layout, PaintBucket, MessageSquare } from 'lucide-react';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import AppearanceSettings from './AppearanceSettings';
import ColorSettings from './ColorSettings';
import FeatureSettings from './FeatureSettings';

interface WidgetSettingsPopoverProps {
  settings: ChatWidgetSettings;
  originalSettings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
  onResetChanges: () => void;
}

const WidgetSettingsPopover: React.FC<WidgetSettingsPopoverProps> = ({ 
  settings, 
  originalSettings,
  onSettingChange,
  onResetChanges
}) => {
  const [activeTab, setActiveTab] = useState('appearance');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Settings size={14} />
          Widget Settings
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-3">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="appearance"><Layout className="h-4 w-4 mr-1" /> Layout</TabsTrigger>
            <TabsTrigger value="colors"><PaintBucket className="h-4 w-4 mr-1" /> Colors</TabsTrigger>
            <TabsTrigger value="features"><MessageSquare className="h-4 w-4 mr-1" /> Features</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance">
            <AppearanceSettings 
              settings={settings} 
              onSettingChange={onSettingChange} 
            />
          </TabsContent>
          
          <TabsContent value="colors">
            <ColorSettings 
              settings={settings} 
              onSettingChange={onSettingChange} 
            />
          </TabsContent>
          
          <TabsContent value="features">
            <FeatureSettings 
              settings={settings} 
              onSettingChange={onSettingChange} 
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <Button 
            variant="secondary" 
            className="w-full" 
            onClick={onResetChanges}
          >
            Reset All Changes
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WidgetSettingsPopover;
