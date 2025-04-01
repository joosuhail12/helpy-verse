
import React, { useState, useEffect } from 'react';
import { ChatWidget } from './ChatWidget';
import { useContactIntegration } from '@/hooks/chat/useContactIntegration';
import ApiKeyConfigForm from './components/config/ApiKeyConfigForm';
import { Loader2 } from 'lucide-react';

interface ChatWidgetInitializerProps {
  workspaceId: string;
}

const ChatWidgetInitializer: React.FC<ChatWidgetInitializerProps> = ({ workspaceId }) => {
  const [showWidget, setShowWidget] = useState<boolean>(false);
  const [showConfigForm, setShowConfigForm] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  
  const {
    isLoading,
    apiKeyValid,
    error,
    validateApiKey,
    hasContactToken
  } = useContactIntegration(workspaceId);

  // Check if API key exists in localStorage on mount
  useEffect(() => {
    const apiKey = localStorage.getItem('chatWidgetApiKey');
    if (apiKey) {
      // Validate the API key
      const validateKey = async () => {
        const isValid = await validateApiKey(apiKey);
        setShowWidget(isValid);
        setInitialized(true);
      };
      
      validateKey();
    } else {
      // No API key found, show config form
      setShowConfigForm(true);
      setInitialized(true);
    }
  }, [validateApiKey]);

  // Handle API key validation completion
  const handleApiKeyValidated = (isValid: boolean) => {
    setShowWidget(isValid);
    setShowConfigForm(!isValid);
  };

  if (!initialized || isLoading) {
    return (
      <div className="fixed bottom-20 right-4 bg-white p-4 rounded-xl shadow-lg z-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Configuration form for API key
  if (showConfigForm) {
    return (
      <div className="fixed bottom-20 right-4 z-50">
        <ApiKeyConfigForm 
          onValidated={handleApiKeyValidated} 
        />
      </div>
    );
  }

  // Show widget if API key is valid
  return showWidget ? (
    <ChatWidget 
      workspaceId={workspaceId} 
      theme={{
        position: 'right',
        compact: true,
        colors: {
          primary: '#3b82f6',
          background: '#ffffff',
          foreground: '#1f2937'
        }
      }}
    />
  ) : null;
};

export default ChatWidgetInitializer;
