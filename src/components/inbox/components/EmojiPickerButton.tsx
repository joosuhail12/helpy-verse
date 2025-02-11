
import React from 'react';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPickerButtonProps {
  onEmojiSelect: (emojiData: any) => void;
  disabled?: boolean;
}

const EmojiPickerButton = ({ onEmojiSelect, disabled = false }: EmojiPickerButtonProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8"
          disabled={disabled}
        >
          <Smile className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <EmojiPicker 
          onEmojiClick={onEmojiSelect}
          width={300}
          height={400}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPickerButton;
