
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Smile, Loader2, StickyNote } from 'lucide-react';
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
  isSending?: boolean;
  disabled?: boolean;
}

const MessageInput = ({ 
  newMessage, 
  onMessageChange, 
  onKeyPress, 
  onSendMessage,
  ticket,
  isSending = false,
  disabled = false
}: MessageInputProps) => {
  const [isInternalNote, setIsInternalNote] = useState(false);
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
      <div className={cn(
        "border rounded-lg mb-3",
        isInternalNote && "border-yellow-400 bg-yellow-50"
      )}>
        <MessageToolbar 
          editor={editor}
          onInsertPlaceholder={insertPlaceholder}
          ticket={ticket}
          disabled={disabled}
        />
        <div 
          className={`cursor-text ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
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
          <Button
            variant={isInternalNote ? "default" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setIsInternalNote(!isInternalNote)}
            disabled={disabled}
          >
            <StickyNote className="h-4 w-4" />
            Internal Note
          </Button>
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
          <Button 
            className="gap-2" 
            onClick={() => onSendMessage()}
            disabled={disabled || isSending}
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isSending ? 'Sending...' : isInternalNote ? 'Add Note' : 'Send Reply'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
