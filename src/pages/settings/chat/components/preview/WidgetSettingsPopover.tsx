
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Settings, Layout, PaintBucket, MessageSquare, RotateCcw } from 'lucide-react';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import AppearanceSettings from './AppearanceSettings';
import ColorSettings from './ColorSettings';
import FeatureSettings from './FeatureSettings';
import { Badge } from '@/components/ui/badge';

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
  
  // Check if current settings are different from original settings
  const hasChanges = React.useMemo(() => {
    return Object.keys(settings).some(key => {
      const settingKey = key as keyof ChatWidgetSettings;
      return settings[settingKey] !== originalSettings[settingKey];
    });
  }, [settings, originalSettings]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1.5 shadow-sm hover:shadow">
          <Settings size={14} className="text-purple-500" />
          <span>Widget Settings</span>
          {hasChanges && (
            <Badge variant="outline" className="ml-1 h-4 px-1 text-[10px] font-normal bg-purple-50 text-purple-700 border-purple-200">
              Modified
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="start">
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="appearance" className="text-xs">
              <Layout className="h-3.5 w-3.5 mr-1" /> Layout
            </TabsTrigger>
            <TabsTrigger value="colors" className="text-xs">
              <PaintBucket className="h-3.5 w-3.5 mr-1" /> Colors
            </TabsTrigger>
            <TabsTrigger value="features" className="text-xs">
              <MessageSquare className="h-3.5 w-3.5 mr-1" /> Features
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="pt-2 focus-visible:outline-none focus-visible:ring-0">
            <AppearanceSettings 
              settings={settings} 
              onSettingChange={onSettingChange} 
            />
          </TabsContent>
          
          <TabsContent value="colors" className="pt-2 focus-visible:outline-none focus-visible:ring-0">
            <ColorSettings 
              settings={settings} 
              onSettingChange={onSettingChange} 
            />
          </TabsContent>
          
          <TabsContent value="features" className="pt-2 focus-visible:outline-none focus-visible:ring-0">
            <FeatureSettings 
              settings={settings} 
              onSettingChange={onSettingChange} 
            />
          </TabsContent>
        </Tabs>
        
        <div className="mt-5 pt-4 border-t border-gray-200">
          <Button 
            variant="outline" 
            className={`w-full text-gray-600 hover:text-gray-900 ${hasChanges ? 'border-purple-200 bg-purple-50 hover:bg-purple-100' : ''}`}
            onClick={onResetChanges}
            size="sm"
            disabled={!hasChanges}
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Reset All Changes
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default WidgetSettingsPopover;
