
import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Smile } from 'lucide-react';
import { cn } from "@/lib/utils";
import type { TeamIconPickerProps } from '@/types/team';

const TeamIconPicker = ({ selectedIcon, onIconSelect }: TeamIconPickerProps) => {
  const [open, setOpen] = useState(false);

  const handleEmojiSelect = (emojiData: any) => {
    onIconSelect(emojiData.emoji);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label>Team Icon</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !selectedIcon && "text-muted-foreground"
            )}
          >
            {selectedIcon ? (
              <span className="text-lg leading-none mr-2">{selectedIcon}</span>
            ) : (
              <Smile className="mr-2 h-4 w-4" />
            )}
            {selectedIcon ? "Selected emoji" : "Select an emoji..."}
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
    </div>
  );
};

export default TeamIconPicker;
