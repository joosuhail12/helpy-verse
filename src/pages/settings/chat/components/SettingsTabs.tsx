
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, SettingsIcon, MessageSquare, Code } from 'lucide-react';
import AppearanceTab from './AppearanceTab';
import BehaviorTab from './BehaviorTab';
import MessagesTab from './MessagesTab';
import InstallationTab from './InstallationTab';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

interface SettingsTabsProps {
  selectedTab: string;
  onTabChange: (value: string) => void;
  settings: ChatWidgetSettings;
  onAppearanceChange: (field: keyof ChatWidgetSettings['appearance'], value: any) => void;
  onContentChange: (field: keyof ChatWidgetSettings['content'], value: string) => void;
  onFeatureChange: (field: keyof ChatWidgetSettings['features'], value: boolean) => void;
  getEmbedCode: () => string;
}

/**
 * Component for settings tabs
 */
const SettingsTabs = ({ 
  selectedTab, 
  onTabChange, 
  settings, 
  onAppearanceChange,
  onContentChange,
  onFeatureChange,
  getEmbedCode 
}: SettingsTabsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Your Chat Widget</CardTitle>
        <CardDescription>
          Customize how your chat widget appears and behaves on your website.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appearance" value={selectedTab} onValueChange={onTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="behavior" className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              <span>Behavior</span>
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
              primaryColor={settings.appearance.primaryColor}
              position={settings.appearance.position}
              compact={settings.appearance.compact}
              onColorChange={(value) => onAppearanceChange('primaryColor', value)}
              onPositionChange={(value) => onAppearanceChange('position', value)}
              onCompactChange={(value) => onAppearanceChange('compact', value)}
            />
          </TabsContent>

          <TabsContent value="behavior">
            <BehaviorTab 
              enableTypingIndicator={settings.features.enableTypingIndicator}
              enableReactions={settings.features.enableReactions}
              enableFileAttachments={settings.features.enableFileAttachments}
              enableReadReceipts={settings.features.enableReadReceipts}
              onSettingChange={onFeatureChange}
            />
          </TabsContent>

          <TabsContent value="messages">
            <MessagesTab 
              welcomeTitle={settings.content.welcomeTitle}
              welcomeSubtitle={settings.content.welcomeSubtitle}
              onSettingChange={onContentChange}
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
