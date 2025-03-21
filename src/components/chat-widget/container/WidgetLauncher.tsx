
import React from 'react';
import { MessageCircle, X } from 'lucide-react';

interface WidgetLauncherProps {
  toggleWidget: () => void;
  isOpen?: boolean;
}

/**
 * Launcher button for the chat widget
 */
const WidgetLauncher: React.FC<WidgetLauncherProps> = ({ toggleWidget, isOpen = false }) => {
  return (
    <div className="fixed z-50" style={{ 
      bottom: isOpen ? 'calc(550px + 10px)' : '20px', 
      right: '20px',
      transition: 'bottom 0.3s ease-in-out'
    }}>
      <button 
        onClick={toggleWidget}
        className="bg-[#5DCFCF] text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 focus:outline-none"
        aria-label={isOpen ? "Close chat widget" : "Open chat widget"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default WidgetLauncher;
