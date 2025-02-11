
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Smile, Loader2, StickyNote, Paperclip } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import EmojiPicker from 'emoji-picker-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Ticket } from '@/types/ticket';
import MessageToolbar from './components/MessageToolbar';
import FileUpload from './components/FileUpload';
import { createEditorConfig } from './utils/editorConfig';
import { cn } from "@/lib/utils";

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
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [isAttachmentSheetOpen, setIsAttachmentSheetOpen] = useState(false);

  const editor = useEditor(
    createEditorConfig(newMessage, (editor) => {
      onMessageChange(editor.getHTML());
    }, ticket)
  );

  const handleEmojiSelect = (emojiData: any) => {
    editor?.commands.insertContent(emojiData.emoji);
  };

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    
    // Simulate upload progress for each file
    newFiles.forEach(file => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: progress
        }));
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 500);
    });
  };

  const handleRemoveFile = (file: File) => {
    setFiles(prev => prev.filter(f => f !== file));
    setUploadProgress(prev => {
      const { [file.name]: _, ...rest } = prev;
      return rest;
    });
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
        {files.length > 0 && (
          <div className="border-t p-3 space-y-2">
            {files.map(file => (
              <div key={file.name} className="flex items-center gap-2 text-sm">
                <Paperclip className="h-4 w-4" />
                <span className="flex-1 truncate">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRemoveFile(file)}
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
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
          <Sheet open={isAttachmentSheetOpen} onOpenChange={setIsAttachmentSheetOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2"
                disabled={disabled}
              >
                <Paperclip className="h-4 w-4" />
                Add Files
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Add Attachments</SheetTitle>
                <SheetDescription>
                  Drag and drop files or click to select files to upload
                </SheetDescription>
              </SheetHeader>
              <div className="mt-6">
                <FileUpload
                  onFilesAdded={handleFilesAdded}
                  uploadProgress={uploadProgress}
                  onRemoveFile={handleRemoveFile}
                  files={files}
                  disabled={disabled}
                />
              </div>
            </SheetContent>
          </Sheet>
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
