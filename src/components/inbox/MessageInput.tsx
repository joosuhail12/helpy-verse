
import React from 'react';
import { Button } from '@/components/ui/button';
import { Send, Smile } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import EmojiPicker from 'emoji-picker-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Ticket } from '@/types/ticket';
import MessageToolbar from './components/MessageToolbar';
import { createEditorConfig } from './utils/editorConfig';

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (value: string) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onSendMessage: () => void;
  ticket: Ticket;
}

const MessageInput = ({ 
  newMessage, 
  onMessageChange, 
  onKeyPress, 
  onSendMessage,
  ticket 
}: MessageInputProps) => {
  const editor = useEditor(
    createEditorConfig(newMessage, (editor) => {
      onMessageChange(editor.getHTML());
    }, ticket)
  );

  const handleEmojiSelect = (emojiData: any) => {
    editor?.commands.insertContent(emojiData.emoji);
  };

  const insertPlaceholder = (type: 'customer' | 'company' | 'ticket') => {
    let content = '';
    switch (type) {
      case 'customer':
        content = `@${ticket.customer}`;
        break;
      case 'company':
        content = `@${ticket.company}`;
        break;
      case 'ticket':
        content = `#${ticket.id}`;
        break;
    }
    editor?.commands.insertContent(content);
  };

  return (
    <div className="border-t p-4 bg-white">
      <div className="border rounded-lg mb-3">
        <MessageToolbar 
          editor={editor}
          onInsertPlaceholder={insertPlaceholder}
          ticket={ticket}
        />
        <div 
          className="cursor-text"
          onClick={() => editor?.commands.focus()}
        >
          <EditorContent 
            editor={editor} 
            className="p-3"
            onKeyDown={onKeyPress}
          />
        </div>
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
