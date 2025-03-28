
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

/**
 * Hook to manage chat widget settings
 */
export const useChatSettings = () => {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('appearance');
  const [copied, setCopied] = useState(false);
  
  const [settings, setSettings] = useState({
    primaryColor: '#9b87f5',
    welcomeTitle: 'Hello there.',
    welcomeSubtitle: 'How can we help?',
    position: 'right',
    compact: false,
    enableTypingIndicator: true,
    enableReactions: true,
    enableFileAttachments: true,
    enableReadReceipts: true
  });

  const handleChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      [field]: value
    });
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your chat widget settings have been saved successfully.",
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
    handleChange,
    handleSave,
    getEmbedCode,
    setSelectedTab,
    setCopied
  };
};
