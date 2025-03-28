
import { Button } from '@/components/ui/button';
import { useChatSettings } from './hooks/useChatSettings';
import SettingsTabs from './components/SettingsTabs';
import ChatPreview from './components/ChatPreview';
import HelpDocumentation from './components/HelpDocumentation';

/**
 * Main component for chat widget settings
 */
const ChatSettings = () => {
  const { 
    settings, 
    selectedTab, 
    handleChange, 
    handleSave, 
    getEmbedCode, 
    setSelectedTab 
  } = useChatSettings();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Chat Widget Settings</h1>
        <Button onClick={handleSave}>Save Settings</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SettingsTabs
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            settings={settings}
            onSettingChange={handleChange}
            getEmbedCode={getEmbedCode}
          />
        </div>

        <div>
          <ChatPreview
            primaryColor={settings.primaryColor}
            welcomeTitle={settings.welcomeTitle}
            welcomeSubtitle={settings.welcomeSubtitle}
            position={settings.position}
          />
          <HelpDocumentation />
        </div>
      </div>
    </div>
  );
};

export default ChatSettings;
