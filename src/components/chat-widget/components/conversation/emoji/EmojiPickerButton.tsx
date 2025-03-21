
import React, { useState, useRef } from 'react';
import { Smile } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: string) => void;
}

/**
 * Button that opens an emoji picker when clicked
 */
const EmojiPickerButton: React.FC<EmojiPickerButtonProps> = ({ onEmojiSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleEmojiSelect = (emoji: any) => {
    onEmojiSelect(emoji.native);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Choose emoji"
      >
        <Smile className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute bottom-12 right-0 z-10">
          <div className="p-2 bg-white rounded-lg shadow-lg border border-gray-200">
            <Picker 
              data={data} 
              onEmojiSelect={handleEmojiSelect}
              theme="light"
              set="native"
              previewPosition="none"
              skinTonePosition="none"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;
