
import React from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WidgetLauncherProps {
  toggleWidget: () => void;
  isOpen?: boolean;
}

/**
 * Launcher button for the chat widget
 * Styled to match Intercom's launcher button
 */
const WidgetLauncher: React.FC<WidgetLauncherProps> = ({ toggleWidget, isOpen = false }) => {
  return (
    <div className="fixed z-50" style={{ 
      bottom: '20px', 
      right: '20px',
      transition: 'bottom 0.3s ease-in-out'
    }}>
      <button 
        onClick={toggleWidget}
        className="bg-gray-900 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all flex items-center justify-center focus:outline-none"
        style={{ width: '56px', height: '56px' }}
        aria-label={isOpen ? "Close chat widget" : "Open chat widget"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default WidgetLauncher;
