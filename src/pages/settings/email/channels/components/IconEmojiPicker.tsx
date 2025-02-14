
import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { IconSelection, icons } from './IconSelection';
import { Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconEmojiPickerProps {
  selectedIcon: typeof icons[0] | null;
  setSelectedIcon: (icon: typeof icons[0] | null) => void;
  selectedEmoji: string | null;
  setSelectedEmoji: (emoji: string | null) => void;
}

export function IconEmojiPicker({
  selectedIcon,
  setSelectedIcon,
  selectedEmoji,
  setSelectedEmoji,
}: IconEmojiPickerProps) {
  const [open, setOpen] = useState(false);

  const handleIconSelect = (icon: typeof icons[0]) => {
    setSelectedIcon(icon);
    setSelectedEmoji(null);
    setOpen(false);
  };

  const handleEmojiSelect = (emojiData: any) => {
    setSelectedEmoji(emojiData.emoji);
    setSelectedIcon(null);
    setOpen(false);
  };

  const displayIcon = selectedIcon ? (
    <selectedIcon.icon className="h-4 w-4" />
  ) : selectedEmoji ? (
    <span className="text-lg">{selectedEmoji}</span>
  ) : (
    <Smile className="h-4 w-4" />
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start gap-2",
            !selectedIcon && !selectedEmoji && "text-muted-foreground"
          )}
        >
          {displayIcon}
          {selectedIcon ? selectedIcon.label : selectedEmoji ? 'Emoji' : 'Select an icon or emoji...'}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Tabs defaultValue="icon">
          <TabsList className="w-full">
            <TabsTrigger value="icon" className="w-full">Icons</TabsTrigger>
            <TabsTrigger value="emoji" className="w-full">Emoji</TabsTrigger>
          </TabsList>
          <TabsContent value="icon" className="border-t">
            <IconSelection selectedIcon={selectedIcon} onSelectIcon={handleIconSelect} />
          </TabsContent>
          <TabsContent value="emoji" className="border-t">
            <div className="h-[300px]">
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                width="100%"
                height="100%"
              />
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
