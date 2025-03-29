
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, SettingsIcon, MessageSquare, Code } from 'lucide-react';
import AppearanceTab from './AppearanceTab';
import BehaviorTab from './BehaviorTab';
import MessagesTab from './MessagesTab';
import InstallationTab from './InstallationTab';
import ColorsTab from './ColorsTab';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import ViewSelector from './preview/ViewSelector';
import { ChatView } from '@/types/preview';

interface SettingsTabsProps {
  selectedTab: string;
  onTabChange: (value: string) => void;
  settings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
  getEmbedCode: () => string;
  currentView?: ChatView;
  onViewChange?: (view: ChatView) => void;
}

/**
 * Component for settings tabs
 */
const SettingsTabs = ({ 
  selectedTab, 
  onTabChange, 
  settings, 
  onSettingChange, 
  getEmbedCode,
  currentView,
  onViewChange
}: SettingsTabsProps) => {
  return (
    <Card>
      <CardHeader className="pb-0 flex flex-row items-center justify-between">
        <div>
          <CardTitle>Configure Your Chat Widget</CardTitle>
          <CardDescription>
            Customize how your chat widget appears and behaves on your website.
          </CardDescription>
        </div>
        {currentView && onViewChange && (
          <div className="ml-auto">
            <ViewSelector 
              currentView={currentView} 
              onViewChange={onViewChange} 
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="appearance" value={selectedTab} onValueChange={onTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Layout</span>
            </TabsTrigger>
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Colors</span>
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span>Features</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </TabsTrigger>
            <TabsTrigger value="installation" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span>Installation</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance">
            <AppearanceTab 
              primaryColor={settings.primaryColor}
              position={settings.position}
              compact={settings.compact}
              onColorChange={(value) => onSettingChange('primaryColor', value)}
              onPositionChange={(value) => onSettingChange('position', value)}
              onCompactChange={(value) => onSettingChange('compact', value)}
            />
          </TabsContent>
          
          <TabsContent value="colors">
            <ColorsTab 
              settings={settings}
              onSettingChange={onSettingChange}
            />
          </TabsContent>

          <TabsContent value="behavior">
            <BehaviorTab 
              enableTypingIndicator={settings.enableTypingIndicator}
              enableReactions={settings.enableReactions}
              enableFileAttachments={settings.enableFileAttachments}
              enableReadReceipts={settings.enableReadReceipts}
              onSettingChange={onSettingChange}
            />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesTab 
              welcomeTitle={settings.welcomeTitle}
              welcomeSubtitle={settings.welcomeSubtitle}
              onSettingChange={onSettingChange}
            />
          </TabsContent>

          <TabsContent value="installation">
            <InstallationTab getEmbedCode={getEmbedCode} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SettingsTabs;
