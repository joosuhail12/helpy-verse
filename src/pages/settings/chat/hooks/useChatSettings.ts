
import { useState } from 'react';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import { useToast } from '@/components/ui/use-toast';
import { 
  updateAppearanceSetting, 
  updateContentSetting,
  updateFeatureSetting,
  saveChatWidgetSettings, 
  resetSettings
} from '@/store/slices/chatWidgetSettings';
import { 
  selectChatWidgetSettings,
  selectChatWidgetLoading
} from '@/store/slices/chatWidgetSettings/selectors';
import { ChatWidgetSettings } from '@/store/slices/chatWidgetSettings/types';

/**
 * Hook to manage chat widget settings using Redux
 */
export const useChatSettings = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState('appearance');
  const [copied, setCopied] = useState(false);
  
  const settingsState = useAppSelector(selectChatWidgetSettings);
  const loading = useAppSelector(selectChatWidgetLoading);

  const handleAppearanceChange = (field: keyof ChatWidgetSettings['appearance'], value: string | boolean) => {
    dispatch(updateAppearanceSetting({ field, value }));
  };

  const handleContentChange = (field: keyof ChatWidgetSettings['content'], value: string) => {
    dispatch(updateContentSetting({ field, value }));
  };

  const handleFeatureChange = (field: keyof ChatWidgetSettings['features'], value: boolean) => {
    dispatch(updateFeatureSetting({ field, value }));
  };

  // Generic handler for when field path is unknown
  const handleChange = (field: string, value: string | boolean) => {
    if (field in settingsState.appearance) {
      handleAppearanceChange(field as keyof ChatWidgetSettings['appearance'], value);
    } else if (field in settingsState.content) {
      handleContentChange(field as keyof ChatWidgetSettings['content'], value as string);
    } else if (field in settingsState.features) {
      handleFeatureChange(field as keyof ChatWidgetSettings['features'], value as boolean);
    }
  };

  const handleSave = async () => {
    try {
      await dispatch(saveChatWidgetSettings()).unwrap();
      
      toast({
        title: "Settings saved",
        description: "Your chat widget settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    dispatch(resetSettings());
    
    toast({
      title: "Settings reset",
      description: "Your chat widget settings have been reset to defaults.",
    });
  };

  const getEmbedCode = () => {
    return `<script>
  (function() {
    window.PULLSE_WORKSPACE_ID = '${window.location.hostname}';
    window.PULLSE_THEME_COLORS = {
      primary: '${settingsState.appearance.primaryColor}'
    };
    window.PULLSE_POSITION = '${settingsState.appearance.position}';
    window.PULLSE_COMPACT = ${settingsState.appearance.compact};
    window.PULLSE_LABELS = {
      welcomeTitle: '${settingsState.content.welcomeTitle}',
      welcomeSubtitle: '${settingsState.content.welcomeSubtitle}'
    };
    window.PULLSE_FEATURES = {
      typingIndicator: ${settingsState.features.enableTypingIndicator},
      reactions: ${settingsState.features.enableReactions},
      fileAttachments: ${settingsState.features.enableFileAttachments},
      readReceipts: ${settingsState.features.enableReadReceipts}
    };
    
    const script = document.createElement('script');
    script.src = "${window.location.origin}/chat-widget.js";
    script.async = true;
    document.body.appendChild(script);
  })();
</script>`;
  };

  return {
    settings: settingsState,
    selectedTab,
    copied,
    loading,
    handleAppearanceChange,
    handleContentChange,
    handleFeatureChange,
    handleChange,
    handleSave,
    handleReset,
    getEmbedCode,
    setSelectedTab,
    setCopied
  };
};

export default useChatSettings;
