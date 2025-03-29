
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';
import PreviewBackground from './PreviewBackground';
import WidgetSettingsPopover from './WidgetSettingsPopover';
import ViewSelector from './ViewSelector';
import { Paintbrush, Settings, Eye, EyeOff } from 'lucide-react';

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
  return (
    <div className="border-b border-gray-200 p-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
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
          variant="outline" 
          size="sm"
          onClick={onToggleWidget}
          className="flex items-center gap-1"
        >
          {isWidgetOpen ? (
            <>
              <EyeOff className="h-4 w-4 mr-1" />
              Hide Widget
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-1" />
              Show Widget
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default PreviewControls;
