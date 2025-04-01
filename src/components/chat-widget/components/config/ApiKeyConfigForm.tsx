
import React, { useState } from 'react';
import { useThemeContext } from '@/context/ThemeContext';
import { chatWidgetService } from '@/api/services/ChatWidgetService';

interface ApiKeyConfigFormProps {
  onValidated: (isValid: boolean) => void;
  onClose?: () => void;
}

const ApiKeyConfigForm: React.FC<ApiKeyConfigFormProps> = ({ onValidated, onClose }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useThemeContext();

  const handleValidate = async () => {
    if (!apiKey.trim()) {
      setError('Please enter an API key');
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const isValid = await chatWidgetService.validateApiKey(apiKey);
      
      if (isValid) {
        // Store API key in localStorage
        localStorage.setItem('chatWidgetApiKey', apiKey);
        onValidated(true);
      } else {
        setError('Invalid API key. Please check and try again.');
        onValidated(false);
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      setError('An error occurred while validating the API key.');
      onValidated(false);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg" style={{ backgroundColor: colors.background }}>
      <h2 className="text-xl font-semibold mb-4" style={{ color: colors.foreground }}>
        Configure Chat Widget
      </h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1" style={{ color: colors.foreground }}>
          API Key
        </label>
        <input
          type="password"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key"
          style={{ 
            borderColor: colors.border, 
            backgroundColor: colors.inputBackground,
            color: colors.foreground
          }}
        />
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        {onClose && (
          <button
            className="px-4 py-2 rounded-md border"
            onClick={onClose}
            style={{ 
              borderColor: colors.border, 
              color: colors.foreground 
            }}
          >
            Cancel
          </button>
        )}
        
        <button
          className="px-4 py-2 rounded-md text-white"
          onClick={handleValidate}
          disabled={isValidating}
          style={{ backgroundColor: colors.primary }}
        >
          {isValidating ? 'Validating...' : 'Validate'}
        </button>
      </div>
    </div>
  );
};

export default ApiKeyConfigForm;
