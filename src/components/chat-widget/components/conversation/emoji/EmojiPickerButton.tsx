
import React, { useState, useRef, useEffect } from 'react';
import { Smile } from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export interface EmojiPickerButtonProps {
  onEmojiSelect: (emoji: any) => void;
  position?: 'top' | 'bottom';
  disabled?: boolean;
}

const EmojiPickerButton: React.FC<EmojiPickerButtonProps> = ({ 
  onEmojiSelect, 
  position = 'top',
  disabled = false
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleEmojiSelect = (emoji: any) => {
    onEmojiSelect(emoji);
    setShowPicker(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className={`text-gray-500 hover:text-gray-700 p-2 rounded-full focus:outline-none transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        disabled={disabled}
        aria-label="Add emoji"
      >
        <Smile className="h-5 w-5" />
      </button>
      
      {showPicker && !disabled && (
        <div 
          ref={pickerRef}
          className={`absolute z-50 ${position === 'top' ? 'bottom-12' : 'top-12'} right-0`}
        >
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            previewPosition="none"
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerButton;
