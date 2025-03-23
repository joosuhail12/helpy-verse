
import React from 'react';
import { X } from 'lucide-react';

interface ChatHeaderProps {
  title: string;
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ title, onClose }) => {
  return (
    <div className="bg-primary text-white p-4 flex items-center justify-between">
      <h2 className="font-semibold">{title}</h2>
      <button 
        onClick={onClose}
        className="text-white hover:bg-primary-foreground/10 rounded-full p-1 transition-colors"
        aria-label="Close chat"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ChatHeader;
