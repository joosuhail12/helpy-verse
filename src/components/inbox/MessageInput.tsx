
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Smile } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import EmojiPicker from 'emoji-picker-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onSendMessage: () => void;
}

const MessageInput = ({ 
  newMessage, 
  onMessageChange, 
  onKeyPress, 
  onSendMessage 
}: MessageInputProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: newMessage,
    onUpdate: ({ editor }) => {
      onMessageChange(editor.getHTML());
    },
  });

  const handleEmojiSelect = (emojiData: any) => {
    editor?.commands.insertContent(emojiData.emoji);
  };

  return (
    <div className="border-t p-4 bg-white">
      <div className="border rounded-lg mb-3 min-h-[100px]">
        <EditorContent 
          editor={editor} 
          className="p-3 prose prose-sm max-w-none min-h-[100px]"
          onKeyDown={onKeyPress}
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <EmojiPicker 
                onEmojiClick={handleEmojiSelect}
                width={300}
                height={400}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-xs text-muted-foreground">
            Press Enter to send, Shift + Enter for new line
          </div>
          <Button className="gap-2" onClick={onSendMessage}>
            <Send className="h-4 w-4" />
            Send Reply
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
