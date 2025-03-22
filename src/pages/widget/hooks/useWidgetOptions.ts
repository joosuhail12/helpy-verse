
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ThemeConfig } from '@/components/chat-widget/theme/ThemeContext';

export interface WidgetOptions {
  primaryColor: string;
  welcomeMessage: string;
  agentName: string;
  workspaceId: string;
  companyName: string;
  logoUrl?: string;
}

/**
 * Custom hook to manage widget options and theme configuration
 */
export const useWidgetOptions = () => {
  const [searchParams] = useSearchParams();
  
  const [options, setOptions] = useState<WidgetOptions>({
    primaryColor: '#1f2937',
    welcomeMessage: 'How can we help you today?',
    agentName: 'Support Team',
    workspaceId: searchParams.get('workspace') || '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
    companyName: 'Support Chat'
  });

  // Create theme config from options with all required color properties
  const [themeConfig, setThemeConfig] = useState<Partial<ThemeConfig>>({
    colors: {
      primary: options.primaryColor,
      secondary: '#4b5563',
      accent: options.primaryColor,
      background: '#ffffff',
      text: '#374151',
      headerBackground: options.primaryColor,
      headerText: '#ffffff',
      launcherBackground: options.primaryColor,
      launcherText: '#ffffff',
      messageUserBackground: '#f3f4f6',
      messageUserText: '#1f2937',
      messageAgentBackground: '#1f2937',
      messageAgentText: '#ffffff',
      errorBackground: '#fee2e2',
      errorText: '#ef4444',
      warningBackground: '#fef3c7',
      warningText: '#f59e0b'
    },
    companyName: options.companyName
  });

  // Listen for options passed via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate message origin for security in real implementation
      if (event.data && event.data.type === 'PULLSE_CHAT_OPTIONS') {
        console.log('Received widget options:', event.data.options);
        const newOptions = {
          ...options,
          ...event.data.options
        };
        
        setOptions(newOptions);
        
        // Update theme configuration with all required color properties
        setThemeConfig({
          colors: {
            primary: newOptions.primaryColor,
            secondary: '#4b5563',
            accent: newOptions.primaryColor,
            background: '#ffffff',
            text: '#374151',
            headerBackground: newOptions.primaryColor,
            headerText: '#ffffff',
            launcherBackground: newOptions.primaryColor,
            launcherText: '#ffffff',
            messageUserBackground: '#f3f4f6',
            messageUserText: '#1f2937',
            messageAgentBackground: newOptions.primaryColor,
            messageAgentText: '#ffffff',
            errorBackground: '#fee2e2',
            errorText: '#ef4444',
            warningBackground: '#fef3c7',
            warningText: '#f59e0b'
          },
          companyName: newOptions.companyName,
          logoUrl: newOptions.logoUrl
        });
      }
    };

    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [options]);

  // Get workspace ID and theme options from URL parameters
  useEffect(() => {
    const workspaceParam = searchParams.get('workspace');
    if (workspaceParam) {
      setOptions(prev => ({
        ...prev,
        workspaceId: workspaceParam
      }));
    }
    
    // Process theme from URL parameters
    const primaryColor = searchParams.get('primaryColor');
    const companyName = searchParams.get('companyName');
    const logoUrl = searchParams.get('logoUrl');
    
    if (primaryColor || companyName || logoUrl) {
      // Get current colors or use defaults with all required properties
      const currentColors = themeConfig.colors || {
        primary: '#1f2937',
        secondary: '#4b5563',
        accent: '#9b87f5',
        background: '#ffffff',
        text: '#374151',
        headerBackground: '#1f2937',
        headerText: '#ffffff',
        launcherBackground: '#1f2937',
        launcherText: '#ffffff',
        messageUserBackground: '#f3f4f6',
        messageUserText: '#1f2937',
        messageAgentBackground: '#1f2937',
        messageAgentText: '#ffffff',
        errorBackground: '#fee2e2',
        errorText: '#ef4444',
        warningBackground: '#fef3c7',
        warningText: '#f59e0b'
      };
      
      const newTheme: Partial<ThemeConfig> = { 
        ...themeConfig,
        colors: { ...currentColors }
      };
      
      if (primaryColor) {
        newTheme.colors!.primary = primaryColor;
        newTheme.colors!.accent = primaryColor;
        newTheme.colors!.headerBackground = primaryColor;
        newTheme.colors!.launcherBackground = primaryColor;
        newTheme.colors!.messageAgentBackground = primaryColor;
      }
      
      if (companyName) {
        newTheme.companyName = companyName;
      }
      
      if (logoUrl) {
        newTheme.logoUrl = logoUrl;
      }
      
      setThemeConfig(newTheme);
    }
  }, [searchParams]);

  return { options, themeConfig };
};

export default useWidgetOptions;
