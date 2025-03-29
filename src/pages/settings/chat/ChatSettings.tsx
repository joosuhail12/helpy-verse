
import { Button } from '@/components/ui/button';
import { useChatSettings } from './hooks/useChatSettings';
import SettingsTabs from './components/SettingsTabs';
import LiveWidgetPreview from './components/LiveWidgetPreview';
import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks/redux';
import { loadChatWidgetSettings } from '@/store/slices/chatWidgetSettings';
import { Loader2 } from 'lucide-react';
import { ChatView } from '@/types/preview';

/**
 * Main component for chat widget settings
 */
const ChatSettings = () => {
  const dispatch = useAppDispatch();
  const { 
    settings, 
    selectedTab, 
    handleChange, 
    handleSave, 
    handleReset,
    getEmbedCode, 
    setSelectedTab,
    loading
  } = useChatSettings();
  
  const [currentView, setCurrentView] = useState<ChatView>('conversation');

  // Load saved settings on component mount
  useEffect(() => {
    dispatch(loadChatWidgetSettings());
  }, [dispatch]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold">Chat Widget Settings</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} disabled={loading}>
            Reset Defaults
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SettingsTabs
            selectedTab={selectedTab}
            onTabChange={setSelectedTab}
            settings={settings}
            onSettingChange={handleChange}
            getEmbedCode={getEmbedCode}
            currentView={currentView}
            onViewChange={setCurrentView}
          />
        </div>

        <div className="lg:col-span-1">
          <LiveWidgetPreview 
            settings={settings} 
            currentView={currentView}
            onViewChange={setCurrentView}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatSettings;
