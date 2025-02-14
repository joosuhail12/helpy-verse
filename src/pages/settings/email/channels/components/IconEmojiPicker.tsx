
import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconEmojiPickerProps {
  selectedEmoji: string | null;
  setSelectedEmoji: (emoji: string | null) => void;
}

export function IconEmojiPicker({
  selectedEmoji,
  setSelectedEmoji,
}: IconEmojiPickerProps) {
  const [open, setOpen] = useState(false);

  const handleEmojiSelect = (emojiData: any) => {
    setSelectedEmoji(emojiData.emoji);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start gap-2 h-10",
            !selectedEmoji && "text-muted-foreground"
          )}
        >
          {selectedEmoji ? (
            <span className="text-lg leading-none">{selectedEmoji}</span>
          ) : (
            <Smile className="h-4 w-4" />
          )}
          {selectedEmoji ? "Selected emoji" : "Select an emoji..."}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="h-[300px]">
          <EmojiPicker
            onEmojiClick={handleEmojiSelect}
            width="100%"
            height="100%"
            searchPlaceholder="Search emoji..."
            previewConfig={{ showPreview: false }}
            skinTonesDisabled
            lazyLoadEmojis
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

