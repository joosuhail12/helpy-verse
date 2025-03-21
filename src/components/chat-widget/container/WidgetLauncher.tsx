
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WidgetLauncherProps {
  toggleWidget: () => void;
}

/**
 * Launcher button for the chat widget
 */
const WidgetLauncher: React.FC<WidgetLauncherProps> = ({ toggleWidget }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button 
        onClick={toggleWidget}
        className="bg-[#5DCFCF] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all flex items-center gap-2 focus:outline-none"
        aria-label="Open chat widget"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};

export default WidgetLauncher;
