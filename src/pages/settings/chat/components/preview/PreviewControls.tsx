
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import PreviewBackground from './PreviewBackground';
import WidgetSettingsPopover from './WidgetSettingsPopover';
import ViewSelector from './ViewSelector';
import { Settings, Eye, EyeOff } from 'lucide-react';

type ChatView = 'home' | 'messages' | 'conversation';

interface PreviewControlsProps {
  background: string;
  setBackground: (color: string) => void;
  backgroundImage: string | null;
  setBackgroundImage: (url: string | null) => void;
  settings: ChatWidgetSettings;
  previewSettings: ChatWidgetSettings;
  onSettingChange: (field: keyof ChatWidgetSettings, value: any) => void;
  onViewChange?: (view: ChatView) => void;
  currentView?: ChatView;
  onToggleWidget?: () => void;
  isWidgetOpen?: boolean;
}

const PreviewControls: React.FC<PreviewControlsProps> = ({
  background,
  setBackground,
  backgroundImage,
  setBackgroundImage,
  settings,
  previewSettings,
  onSettingChange,
  onViewChange,
  currentView = 'conversation',
  onToggleWidget,
  isWidgetOpen = true
}) => {
  // Function to reset preview settings to match original settings
  const handleResetChanges = () => {
    Object.keys(settings).forEach(key => {
      onSettingChange(key as keyof ChatWidgetSettings, settings[key as keyof ChatWidgetSettings]);
    });
  };

  return (
    <div className="border-b border-gray-200 bg-white p-4 flex items-center justify-between rounded-t-lg shadow-sm">
      <div className="flex items-center gap-3">
        <PreviewBackground 
          background={background} 
          setBackground={setBackground}
          backgroundImage={backgroundImage}
          setBackgroundImage={setBackgroundImage}
        />
        
        <WidgetSettingsPopover 
          settings={previewSettings}
          originalSettings={settings}
          onSettingChange={onSettingChange}
          onResetChanges={handleResetChanges}
        />

        {onViewChange && currentView && (
          <ViewSelector 
            currentView={currentView} 
            onViewChange={onViewChange} 
          />
        )}
      </div>
      
      {onToggleWidget && (
        <Button 
          variant={isWidgetOpen ? "outline" : "default"}
          size="sm"
          onClick={onToggleWidget}
          className="flex items-center gap-1.5 transition-all duration-200 hover:shadow-sm"
        >
          {isWidgetOpen ? (
            <>
              <EyeOff className="h-4 w-4" />
              <span>Hide Widget</span>
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              <span>Show Widget</span>
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default PreviewControls;
