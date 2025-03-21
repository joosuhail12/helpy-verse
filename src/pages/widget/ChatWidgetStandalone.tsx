
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatHome from '@/components/chat-widget/ChatHome';
import ConversationList from '@/components/chat-widget/ConversationList';
import NewChat from '@/components/chat-widget/NewChat';
import ResponseTime from '@/components/chat-widget/components/ResponseTime';
import ConversationView from '@/components/chat-widget/components/conversation/ConversationView';
import { X, ArrowLeft, Search, Home, MessageSquare } from 'lucide-react';
import { ThemeProvider, ThemeConfig } from '@/components/chat-widget/theme/ThemeContext';

type WidgetPage = 'home' | 'conversations' | 'new-chat' | 'conversation-detail';

/**
 * Standalone page for the chat widget, used for direct embedding in iframe
 */
const ChatWidgetStandalone = () => {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState<WidgetPage>('home');
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  
  const [options, setOptions] = useState({
    primaryColor: '#1f2937',
    welcomeMessage: 'How can we help you today?',
    agentName: 'Support Team',
    workspaceId: searchParams.get('workspace') || '6c22b22f-7bdf-43db-b7c1-9c5884125c63',
    companyName: 'Support Chat'
  });

  // Create theme config from options
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
      launcherText: '#ffffff'
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
        
        // Update theme configuration
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
            launcherText: '#ffffff'
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

  // Get workspace ID from URL parameters
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
      const newTheme: Partial<ThemeConfig> = { 
        ...themeConfig,
        colors: {
          ...(themeConfig.colors || {
            primary: '#1f2937',
            secondary: '#4b5563',
            accent: '#9b87f5',
            background: '#ffffff',
            text: '#374151',
            headerBackground: '#1f2937',
            headerText: '#ffffff',
            launcherBackground: '#1f2937',
            launcherText: '#ffffff',
          })
        }
      };
      
      if (primaryColor) {
        if (!newTheme.colors) newTheme.colors = { ...themeConfig.colors } as any;
        newTheme.colors.primary = primaryColor;
        newTheme.colors.accent = primaryColor;
        newTheme.colors.headerBackground = primaryColor;
        newTheme.colors.launcherBackground = primaryColor;
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

  const closeWidget = () => {
    // Send message to parent window to close the widget
    if (window.parent) {
      window.parent.postMessage({
        type: 'PULLSE_CLOSE_WIDGET'
      }, '*');
    }
  };

  const navigateTo = (page: WidgetPage) => {
    setCurrentPage(page);
    
    // Clear current conversation when navigating away from detail
    if (page !== 'conversation-detail') {
      setCurrentConversationId(null);
    }
  };

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setCurrentPage('conversation-detail');
  };

  const handleConversationCreated = (conversationId?: string) => {
    if (conversationId) {
      handleSelectConversation(conversationId);
    } else {
      navigateTo('conversations');
    }
  };

  // Render header based on current page
  const renderHeader = () => {
    if (currentPage === 'home') {
      return (
        <div className="absolute top-4 left-4">
          <div className="w-8 h-8 bg-black/20 rounded-full"></div>
        </div>
      );
    }
    
    if (currentPage === 'conversations') {
      return (
        <div className="p-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('home')} 
              className="text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="font-semibold text-sm">Messages</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-gray-700">
              <Search className="h-4 w-4" />
            </button>
            <button onClick={closeWidget} className="text-gray-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      );
    }
    
    if (currentPage === 'conversation-detail') {
      return null; // ConversationView has its own header
    }
    
    return null;
  };

  // Check if we should show the navigation bar
  const shouldShowNavBar = () => {
    return currentPage !== 'conversation-detail';
  };

  // Check if we should show the brand footer
  const shouldShowFooter = () => {
    return currentPage !== 'conversation-detail';
  };

  return (
    <ThemeProvider initialTheme={themeConfig}>
      <div className="flex flex-col h-screen bg-white rounded-lg overflow-hidden">
        {/* Header */}
        {renderHeader()}

        {/* Widget content */}
        <div className="flex-1 overflow-y-auto">
          {currentPage === 'home' && (
            <ChatHome 
              onNewChat={() => navigateTo('new-chat')}
              workspaceId={options.workspaceId}
            />
          )}
          {currentPage === 'conversations' && (
            <ConversationList 
              onNewChat={() => navigateTo('new-chat')} 
              onSelectConversation={handleSelectConversation}
              workspaceId={options.workspaceId}
            />
          )}
          {currentPage === 'new-chat' && (
            <NewChat 
              onConversationCreated={handleConversationCreated}
              workspaceId={options.workspaceId}
            />
          )}
          {currentPage === 'conversation-detail' && currentConversationId && (
            <ConversationView 
              conversationId={currentConversationId} 
              onBack={() => navigateTo('conversations')}
              workspaceId={options.workspaceId}
            />
          )}
        </div>

        {/* Only show navigation when not in conversation detail */}
        {shouldShowNavBar() && (
          <div className="border-t border-gray-100 py-2 px-6 bg-white flex justify-around items-center">
            <button 
              onClick={() => navigateTo('home')}
              className={`flex flex-col items-center gap-1`}
              aria-label="Home"
            >
              <Home className="h-4 w-4" />
              <span className="text-xs">Home</span>
            </button>
            <button 
              onClick={() => navigateTo('conversations')}
              className={`flex flex-col items-center gap-1`}
              aria-label="Messages"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="text-xs">Messages</span>
            </button>
          </div>
        )}

        {/* Brand footer - only show when not in conversation detail */}
        {shouldShowFooter() && <ResponseTime />}
      </div>
    </ThemeProvider>
  );
};

export default ChatWidgetStandalone;
