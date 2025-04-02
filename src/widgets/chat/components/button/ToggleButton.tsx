
import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToggleButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ isOpen, onClick }) => {
  return (
    <motion.button
      onClick={onClick}
      className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isOpen ? "Close chat" : "Open chat"}
    >
      {isOpen ? (
        <X className="w-5 h-5" />
      ) : (
        <MessageSquare className="w-5 h-5" />
      )}
    </motion.button>
  );
};

export default ToggleButton;
