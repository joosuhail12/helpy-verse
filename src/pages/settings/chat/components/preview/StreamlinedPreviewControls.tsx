
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import PreviewBackground from './PreviewBackground';
import WidgetSettingsPopover from './WidgetSettingsPopover';
import ViewSelector from './ViewSelector';

type ChatView = 'home' | 'messages' | 'conversation';

interface StreamlinedPreviewControlsProps {
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

const StreamlinedPreviewControls: React.FC<StreamlinedPreviewControlsProps> = ({
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
  
  const handleResetChanges = () => {
    // Reset preview settings to match the actual settings
    Object.keys(settings).forEach(key => {
      onSettingChange(key as keyof ChatWidgetSettings, settings[key as keyof ChatWidgetSettings]);
    });
  };
  
  return (
    <div className="border-b border-gray-200 p-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
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

        {onToggleWidget && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onToggleWidget}
            className="flex items-center gap-1"
          >
            {isWidgetOpen ? 'Close Widget' : 'Open Widget'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default StreamlinedPreviewControls;
