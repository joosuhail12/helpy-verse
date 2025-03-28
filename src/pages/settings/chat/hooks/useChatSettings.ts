
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { useToast } from '@/components/ui/use-toast';
import { 
  updateSetting, 
  saveChatWidgetSettings, 
  resetSettings,
  selectChatWidgetSettings,
  selectChatWidgetLoading
} from '@/store/slices/chatWidgetSettings';

/**
 * Hook to manage chat widget settings using Redux
 */
export const useChatSettings = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [selectedTab, setSelectedTab] = useState('appearance');
  const [copied, setCopied] = useState(false);
  
  const settings = useAppSelector(selectChatWidgetSettings);
  const loading = useAppSelector(selectChatWidgetLoading);

  const handleChange = (field: string, value: any) => {
    dispatch(updateSetting({ field, value }));
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
      primary: '${settings.primaryColor}'
    };
    window.PULLSE_POSITION = '${settings.position}';
    window.PULLSE_COMPACT = ${settings.compact};
    window.PULLSE_LABELS = {
      welcomeTitle: '${settings.welcomeTitle}',
      welcomeSubtitle: '${settings.welcomeSubtitle}'
    };
    window.PULLSE_FEATURES = {
      typingIndicator: ${settings.enableTypingIndicator},
      reactions: ${settings.enableReactions},
      fileAttachments: ${settings.enableFileAttachments},
      readReceipts: ${settings.enableReadReceipts}
    };
    
    const script = document.createElement('script');
    script.src = "${window.location.origin}/chat-widget.js";
    script.async = true;
    document.body.appendChild(script);
  })();
</script>`;
  };

  return {
    settings,
    selectedTab,
    copied,
    loading,
    handleChange,
    handleSave,
    handleReset,
    getEmbedCode,
    setSelectedTab,
    setCopied
  };
};
